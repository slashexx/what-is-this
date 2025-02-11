'use client';

import React, { Suspense } from "react";
import { ProfileContent } from "./profile-content";

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
