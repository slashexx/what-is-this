"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth-context";
import Loading from "@/components/loading";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isLoading: authLoading } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (authLoading || isNavigating || pathname !== "/") return;

    const handleNavigation = async () => {
      setIsNavigating(true);
      try {
        if (currentUser) {
          await router.replace("/dashboard");
        } else {
          await router.replace("/signin");
        }
      } catch (error) {
        console.error("Navigation error:", error);
      }
      setIsNavigating(false);
    };

    handleNavigation();
  }, [currentUser, authLoading, router, pathname, isNavigating]);

  if (authLoading || isNavigating) {
    return <Loading />;
  }

  // This ensures we show loading while redirecting
  return <Loading />;
}