"use client";

import SideBar from "@/components/sidebar/SideBar";
import NewBankListStore from "./NewDetails";

const newBankStore = () => {
  return (
    <>
      <SideBar main={<NewBankListStore />} />
    </>
  );
};

export default newBankStore;
