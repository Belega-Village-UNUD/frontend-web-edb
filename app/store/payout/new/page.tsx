"use client";

import SideBar from "@/components/sidebar/SideBar";
import NewPayoutListStore from "./NewDetails";

const newPayoutStore = () => {
  return (
    <>
      <SideBar main={<NewPayoutListStore />} />
    </>
  );
};

export default newPayoutStore;
