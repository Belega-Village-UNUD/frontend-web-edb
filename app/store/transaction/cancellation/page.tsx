'use client'

import SideBar from "@/components/sidebar/SideBar";
import CancellationList from "./CancellationList";

const productStore = () => {

  return (
    <>
      <SideBar main={<CancellationList />} />
    </>
  )
}

export default productStore;