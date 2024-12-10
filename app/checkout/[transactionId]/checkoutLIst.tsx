"use client";

import { formatRupiah } from "@/lib/utils";
import { formatePrice } from "@/utils/formatPrice";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Box } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GrDocumentDownload } from "react-icons/gr";
import { toast } from "sonner";

interface checkoutListProps {
  order: any;
  token: any;
}

function CheckoutLIst({ order, token }: checkoutListProps) {
  const [transactionId, setTransactionId] = useState(null);
  const [storeId, setStoreId] = useState(null);

  const products = Object.values(order).flat();

  const { mutate: sendAction, isPending: isPendingArrived } = useMutation({
    mutationFn: async () => {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/arrived`,
        {
          transaction_id: transactionId,
          store_id: storeId,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      window.location.reload();
      toast.success("Status transaction is changed to arrived");
    },
    onError: (error) => {
      toast.error("Failed to update status");
    },
  });
  return (
    <div className="bg-white shadow-lg rounded-lg mb-4 transition-transform transform px-2 py-3 border" >
      {products.map((store: any) => {
        let statusStoreOrder = store?.status_store || "Unknown Status";
        const statusStoreMap: { [key: string]: string } = {
          cancel: "Cancelled",
          pending: "Pending",
          confirm: "Confirmed",
        };
        statusStoreOrder = statusStoreMap[statusStoreOrder] || statusStoreOrder;
        return (
          <>
            <div className="flex justify-between px-5 py-3">
              <h6 key={store} className="text-  lg font-semibold text-gray-800">
                {store.store_name || "Unknown Store"}
              </h6>
              <div className="flex gap-4">
                <div className={`text-sm font-medium px-2 py-1 rounded-full ${statusStoreOrder === "Cancelled" ? "bg-red-200 text-red-800" : statusStoreOrder === "Pending" ? "bg-gray-200 text-gray-800" : "bg-green-200 text-green-800"}`}>
                  {statusStoreOrder || "Unknown Status"}
                </div>
                {store.status_arrival === "SHIPPED" && (
                  <button className="flex gap-1 items-center text-green-700 hover:text-gray-300  rounded-md" title="Product Has Arrived" onClick={() => {
                    setTransactionId(store.transaction_id);
                    setStoreId(store.store_id);
                    sendAction();
                  }}>
                    <Box />
                  </button>
                )}
                {store.status_arrival === "ARRIVED" && (
                  <button>
                    <Link
                      href={`/buyer/history/${store.transaction_id}?store_id=${store.store_id}`}
                      className="flex gap-1 px-2 py-1 items-center border-2 text-green-700 border-green-700 border-solid hover:bg-green-700 hover:text-white  rounded-md" title="Invoice"
                    >
                      <GrDocumentDownload />
                    </Link>
                  </button>
                )}
              </div>
            </div>

            {store.products.map((product: any) => (
              <>
                <div className="w-full grid grid-cols-4 p-4">
                  <div className="overflow-hidden rounded-lg w-28 h-28 bg-gray-100 border border-gray-300">
                    <Image
                      src={
                        product?.product?.images?.[0] ||
                        "https://flowbite.com/docs/images/examples/image-1@2x.jpg"
                      }
                      alt={order?.product?.name_product || "Product Image"}
                      width={1000}
                      height={1000}
                      className="object-cover object-center w-full h-full"
                    />
                  </div>

                  <div className="pl-4 text-sm col-span-2">

                    <p className="pt-2 font-semibold text-gray-700">{product?.product?.name_product || "Unnamed Product"}</p>
                    <p className="text-gray-500">{`${product?.qty || 0} Pcs`}</p>
                    <p className="text-gray-500">{`Price: ${formatRupiah(product?.unit_price || 0)}`}</p>
                    <p className="text-gray-500">{`Weight: ${product?.product?.weight_gr || 0} Gram`}</p>
                  </div>
                  <div className="grid grid-cols-1 justify-items-end gap-2">
                    <div className="w-full text-center">

                    </div>
                    <span className="font-semibold text-gray-700 text-lg">
                      {formatePrice((product?.unit_price || 0) * (product?.qty || 0))}
                    </span>
                  </div>
                </div>
              </>
            ))}
          </>
        );
      })
      }
    </div >
  );
}

export default CheckoutLIst;
