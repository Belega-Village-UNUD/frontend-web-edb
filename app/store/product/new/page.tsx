'use client'

import SideBar from "@/components/sidebar/SideBar";
import NewProductListStore from "./NewDetails";

const newProductStore = () => {

  return (
    <>
      <SideBar main={<NewProductListStore />} />
    </>
  )
}

export default newProductStore;