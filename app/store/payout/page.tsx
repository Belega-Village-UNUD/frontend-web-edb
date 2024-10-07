"use client";

import SideBar from "@/components/sidebar/SideBar";
import PayoutListStore from "./PayoutList";

const PayoutStore = () => {
  return (
    <>
      <SideBar main={<PayoutListStore />} />
    </>
  );
};

export default PayoutStore;
