// lib/firebase/auth.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect, // Switch to Redirect
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

  // Sign in with Google (Redirect Flow)
  static async signInWithGoogle(): Promise<void> {
    try {
      // Use Redirect to bypass COOP/Popup blocking issues
      await signInWithRedirect(auth, googleProvider);
      // Logic continues when user returns to the page (handled in useAuth)
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // ... (Rest of file: register, createUserProfile, getUserData, signOut, etc. - KEEP AS IS) ...
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

      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      await this.createUserProfile(userCredential.user, {
        role,
        firstName,
        lastName,
      });

      await sendEmailVerification(userCredential.user);

      const user = await this.getUserData(userCredential.user);
      return user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

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
      await this.createUserProfile(firebaseUser, { role: "student" });
      return this.getUserData(firebaseUser);
    }
  }

  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  static async updateUserPassword(newPassword: string): Promise<void> {
    try {
      if (!auth.currentUser) throw new Error("No authenticated user");
      await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

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

  static async sendVerificationEmail(): Promise<void> {
    try {
      if (!auth.currentUser) throw new Error("No authenticated user");
      await sendEmailVerification(auth.currentUser);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

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

  private static handleAuthError(error: unknown) {
    // console.error("Auth Error:", error); 
    if (typeof error === "object" && error !== null && "code" in error) {
      const code = (error as { code: string }).code;
      switch (code) {
        case "auth/invalid-credential": 
        case "auth/user-not-found":
        case "auth/wrong-password":
          return new Error("Invalid email or password.");
        case "auth/email-already-in-use":
          return new Error("An account with this email already exists.");
        case "auth/weak-password":
          return new Error("Password is too weak. Please use at least 6 characters.");
        case "auth/invalid-email":
          return new Error("Please enter a valid email address.");
        case "auth/user-disabled":
          return new Error("This account has been disabled. Please contact support.");
        case "auth/too-many-requests":
          return new Error("Too many failed attempts. Please try again later.");
        case "auth/popup-closed-by-user":
          return new Error("Sign-in was cancelled.");
        case "auth/popup-blocked":
          return new Error("Pop-up was blocked by your browser. Please allow pop-ups for this site.");
        case "auth/network-request-failed":
          return new Error("Network error. Check your connection.");
        case "auth/operation-not-allowed":
          return new Error("Google Sign-In is not enabled in Firebase Console.");
        case "auth/unauthorized-domain":
          return new Error("This domain is not authorized in Firebase Console.");
        default:
          return new Error(
            (error as { message?: string }).message ||
              "An unexpected error occurred. Please try again.",
          );
      }
    }
    return new Error("An unexpected error occurred.");
  }
}