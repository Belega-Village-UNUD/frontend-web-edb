'use client'

import SideBar from "@/components/sidebar/SideBar";
import DetailsProduct from "./DetailsProduct";

const newProductStore = () => {

  return (
    <>
      <SideBar main={<DetailsProduct />} />
    </>
  )
}

export default newProductStore;