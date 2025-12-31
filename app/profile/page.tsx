// app/profile/page.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, Edit, Save, X } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { useAuthMutations } from "@/hooks/useAuthMutations";
import {
  updateProfileSchema,
  UpdateProfileFormData,
} from "@/lib/validations/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { updateProfile } = useAuthMutations();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.profile?.firstName || "",
      lastName: user?.profile?.lastName || "",
      phone: user?.profile?.phone || "",
      bio: user?.profile?.bio || "",
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      await updateProfile.mutateAsync({
        profile: {
          ...user?.profile,
          ...data,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <AuthGuard>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Profile Settings
              </h1>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={!isDirty || updateProfile.isPending}
                    size="sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Profile Picture */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-4xl font-bold text-white">
                    {user?.displayName
                      ? user.displayName[0].toUpperCase()
                      : user?.email?.[0].toUpperCase()}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user?.displayName || user?.email}
                  </h2>
                  <p className="text-sm text-gray-500 capitalize dark:text-gray-400">
                    {user?.role}
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="mt-2">
                        {isEditing ? (
                          <Input
                            id="firstName"
                            {...register("firstName")}
                            className={errors.firstName ? "border-red-500" : ""}
                          />
                        ) : (
                          <p className="py-2 text-gray-900 dark:text-white">
                            {user?.profile?.firstName || "Not provided"}
                          </p>
                        )}
                      </div>
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="mt-2">
                        {isEditing ? (
                          <Input
                            id="lastName"
                            {...register("lastName")}
                            className={errors.lastName ? "border-red-500" : ""}
                          />
                        ) : (
                          <p className="py-2 text-gray-900 dark:text-white">
                            {user?.profile?.lastName || "Not provided"}
                          </p>
                        )}
                      </div>
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="mt-2 flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <p className="text-gray-900 dark:text-white">
                        {user?.email}
                      </p>
                      {user?.emailVerified ? (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          Verified
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          Unverified
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="mt-2">
                      {isEditing ? (
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          {...register("phone")}
                          className={errors.phone ? "border-red-500" : ""}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <p className="text-gray-900 dark:text-white">
                            {user?.profile?.phone || "Not provided"}
                          </p>
                        </div>
                      )}
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <div className="mt-2">
                      {isEditing ? (
                        <textarea
                          id="bio"
                          rows={4}
                          placeholder="Tell us about yourself..."
                          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:ring-offset-gray-900 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
                          {...register("bio")}
                        />
                      ) : (
                        <p className="py-2 text-gray-900 dark:text-white">
                          {user?.profile?.bio || "No bio provided"}
                        </p>
                      )}
                    </div>
                    {errors.bio && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.bio.message}
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Account Information
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label>Account Created</Label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
              <div>
                <Label>Last Updated</Label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
              <div>
                <Label>Account ID</Label>
                <p className="mt-1 font-mono text-sm text-gray-900 dark:text-white">
                  {user?.uid}
                </p>
              </div>
              <div>
                <Label>Role</Label>
                <p className="mt-1 text-gray-900 capitalize dark:text-white">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
