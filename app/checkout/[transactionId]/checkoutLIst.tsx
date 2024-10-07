import React from "react";
import Image from "next/image";
import { formatePrice } from "@/utils/formatPrice";
import { formatRupiah } from "@/lib/utils";

interface checkoutListProps {
  cart: any;
  shipping: any;
}

function CheckoutLIst({ cart, shipping }: checkoutListProps) {
  return (
    <div className="w-full flex items-center">
      <div className="overflow-hidden rounded-lg w-28 h-28 bg-gray-50 border border-gray-200">
        <Image
          src={
            cart?.product?.images[0] ||
            "https://flowbite.com/docs/images/examples/image-1@2x.jpg"
          }
          alt={cart?.product?.name_product}
          width={1000}
          height={1000}
          className="object-cover object-center h-full w-32 h-32"
        />
      </div>
      <div className="flex-grow pl-3 text-sm">
        <h6 className="font-semibold uppercase text-gray-600 text-base">
          {cart?.product?.name_product}
          {cart?.product?.name_product && (
            <span className="font-thin text-sm capitalize"> (Preorder)</span>
          )}
        </h6>
        <p className="text-gray-400">{`qty: x${cart?.qty}`}</p>
        <p className="text-gray-400">{`price: ${formatRupiah(
          cart?.unit_price
        )} `}</p>
        <p className="text-gray-400">{`Weight: ${cart?.product?.weight_gr} Gram`}</p>
        {/* <p className="text-gray-400">{`Stock: ${cart?.product?.stock} Pcs`}</p> */}
      </div>
      <div>
        <span className="font-semibold text-gray-600 text-base">
          {formatePrice(cart?.unit_price * cart?.qty)}
        </span>
      </div>
    </div>
  );
}

export default CheckoutLIst;
