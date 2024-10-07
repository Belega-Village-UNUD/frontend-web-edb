"use client";

import SideBar from "@/components/sidebar/SideBar";
import BankListStore from "./BankList";

const productStore = () => {
  return (
    <>
      <SideBar main={<BankListStore />} />
    </>
  );
};

export default productStore;
