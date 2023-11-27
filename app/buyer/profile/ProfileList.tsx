"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import NavProfile from "./NavProfile";

const ProfileList = () => {
  const router = useRouter();

  return (
    <NavProfile />

  );
}

export default ProfileList;