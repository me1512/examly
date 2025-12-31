// lib/firebase/auth.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./config";
import {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  UserRole,
} from "@/types/auth";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export class AuthService {
  // Sign in with email and password
  static async signInWithCredentials({
    email,
    password,
  }: LoginCredentials): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = await this.getUserData(userCredential.user);
      return user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Sign in with Google
  static async signInWithGoogle(): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await signInWithPopup(
        auth,
        googleProvider,
      );
      const user = await this.getUserData(userCredential.user);

      // Check if this is a new user and create profile if needed
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await this.createUserProfile(userCredential.user, { role: "student" });
      }

      return user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Register with email and password
  static async registerWithCredentials(
    credentials: RegisterCredentials,
  ): Promise<AuthUser> {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        role = "student",
      } = credentials;

      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Create user document in Firestore
      await this.createUserProfile(userCredential.user, {
        role,
        firstName,
        lastName,
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      const user = await this.getUserData(userCredential.user);
      return user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Create user profile in Firestore
  static async createUserProfile(
    firebaseUser: User,
    additionalData: {
      role: UserRole;
      firstName?: string;
      lastName?: string;
      organizationId?: string;
    },
  ): Promise<void> {
    const userRef = doc(db, "users", firebaseUser.uid);

    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
      role: additionalData.role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      profile: {
        firstName: additionalData.firstName || "",
        lastName: additionalData.lastName || "",
      },
      organizationId: additionalData.organizationId || null,
    };

    await setDoc(userRef, userData);
  }

  // Get user data from Firestore
  static async getUserData(firebaseUser: User): Promise<AuthUser> {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
        role: userData.role || "student",
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date(),
        organizationId: userData.organizationId,
        profile: userData.profile,
      };
    } else {
      // Create a basic user profile if it doesn't exist
      await this.createUserProfile(firebaseUser, { role: "student" });
      return this.getUserData(firebaseUser);
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Update password
  static async updateUserPassword(newPassword: string): Promise<void> {
    try {
      if (!auth.currentUser) throw new Error("No authenticated user");
      await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Update user profile
  static async updateUserProfile(updates: Partial<AuthUser>): Promise<void> {
    try {
      if (!auth.currentUser) throw new Error("No authenticated user");

      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Send email verification
  static async sendVerificationEmail(): Promise<void> {
    try {
      if (!auth.currentUser) throw new Error("No authenticated user");
      await sendEmailVerification(auth.currentUser);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Role checking utilities
  static hasRole(user: AuthUser | null, requiredRole: UserRole): boolean {
    if (!user) return false;

    const roleHierarchy: Record<UserRole, number> = {
      student: 1,
      teacher: 2,
      admin: 3,
      "super-admin": 4,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }

  static isSuperAdmin(user: AuthUser | null): boolean {
    return user?.role === "super-admin";
  }

  static isAdmin(user: AuthUser | null): boolean {
    return this.hasRole(user, "admin");
  }

  static isTeacher(user: AuthUser | null): boolean {
    return this.hasRole(user, "teacher");
  }

  static isStudent(user: AuthUser | null): boolean {
    return this.hasRole(user, "student");
  }

  // Error handling
  private static handleAuthError(error: unknown) {
    console.error("Auth Error:", error);

    if (typeof error === "object" && error !== null && "code" in error) {
      const code = (error as { code: string }).code;
      switch (code) {
        case "auth/user-not-found":
          return new Error("No account found with this email address");
        case "auth/wrong-password":
          return new Error("Incorrect password");
        case "auth/email-already-in-use":
          return new Error("An account with this email already exists");
        case "auth/weak-password":
          return new Error("Password is too weak");
        case "auth/invalid-email":
          return new Error("Invalid email address");
        case "auth/user-disabled":
          return new Error("This account has been disabled");
        case "auth/too-many-requests":
          return new Error("Too many failed attempts. Please try again later");
        case "auth/popup-closed-by-user":
          return new Error("Sign-in cancelled");
        case "auth/popup-blocked":
          return new Error("Popup blocked by browser");
        default:
          return new Error(
            (error as { message?: string }).message ||
              "An unexpected error occurred",
          );
      }
    }
    return new Error("An unexpected error occurred");
  }
}
