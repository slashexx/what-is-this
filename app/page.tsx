"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth-context";
import Loading from "@/components/loading";

export default function Home() {
  const router = useRouter();
  const { currentUser, isLoading: authLoading } = useAuth();

  useEffect(() => {
    console.log("Auth state:", { currentUser, authLoading });
    
    if (!authLoading) {
      const target = currentUser ? "/dashboard" : "/signin";
      console.log("Redirecting to:", target);
      router.replace(target);
    }
  }, [currentUser, authLoading, router]);

  return <Loading className="h-[calc(100vh-4rem)]" />;
}
