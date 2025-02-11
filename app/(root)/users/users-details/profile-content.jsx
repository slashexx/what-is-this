'use client';

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProfileHeader } from "@/components/UserDetails/profile-header";
import { ProfileForm } from "@/components/UserDetails/profile-form";
import { ViewStatistic } from "@/components/UserDetails/view-statistic";
import { UserActivity } from "@/components/UserDetails/user-activity";

export function ProfileContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/users/${userId}`);
          const data = await response.json();

          if (data.user) {
            setUser(data.user);
          } else {
            console.error("User not found");
          }
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      }
    };

    fetchUser();
  }, [userId]);

  const handleUpdateProfile = async (updatedUser) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading user details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ProfileHeader user={user} />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ProfileForm user={user} onUpdateProfile={handleUpdateProfile} />
        </div>
        <div>
          <UserActivity user={user} />
        </div>
      </div>
      <div className="mt-8">
        <ViewStatistic user={user} />
      </div>
    </div>
  );
}
