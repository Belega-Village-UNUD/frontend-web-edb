'use client'

import SideBar from "@/components/sidebar/SideBar";
import ProductListStore from "../product/ProductList";

const productStore = () => {

  return (
    <>
      <SideBar main={<ProductListStore />} />
    </>
  )
}

export default productStore;