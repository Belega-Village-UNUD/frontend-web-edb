"use client";

import { checkMiddlewareProfile, middlewareProfile } from "@/app/middleware";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProfileList = () => {
  const router = useRouter();

  useEffect(() => {
    const onAuthSuccess = () => {
      router.push('/');
    }

    checkMiddlewareProfile(onAuthSuccess, router)();
    middlewareProfile(() => { }, router)();
  }, [router]);

  return (
    <div>Profile</div>
  );
}

export default ProfileList;