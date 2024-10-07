"use client";

import SideBar from "@/components/sidebar/SideBar";
import ProfileStore from "./ProfileStore";

const storeProductPage = () => {
  return (
    <>
      <SideBar main={<ProfileStore />} />
    </>
  );
};

export default storeProductPage;
