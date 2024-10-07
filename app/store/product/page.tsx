'use client'

import SideBar from "@/components/sidebar/SideBar";
import ProductListStore from "./ProductList";

const productStore = () => {

  return (
    <>
      <SideBar main={<ProductListStore />} />
    </>
  )
}

export default productStore;