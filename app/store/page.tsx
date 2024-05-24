'use client'

import SideBar from "@/components/sidebar/SideBar";
import DashboardStore from "./DashboardStore";

const storeProductPage = () => {

  return (
    <>
      <SideBar main={<DashboardStore />} />
    </>
  )
}

export default storeProductPage;