'use client'

import SideBar from "@/components/sidebar/SideBar";
import TransactionListStore from "./TransactionList";

const productStore = () => {

  return (
    <>
      <SideBar main={<TransactionListStore />} />
    </>
  )
}

export default productStore;