import React from "react";
import Image from "next/image";
import { formatePrice } from "@/utils/formatPrice";

interface checkoutListProps {
  dataProduct: any;
  qty: number | null;
}

function CheckoutLIst({ dataProduct, qty }: checkoutListProps) {
  return (
    <div className="w-full flex items-center">
      <div className="overflow-hidden rounded-lg w-16 h-16 bg-gray-50 border border-gray-200">
        <Image
          src={dataProduct?.image_product}
          alt={dataProduct?.name_product}
          width={64}
          height={64}
          className="object-cover object-center"
        />
      </div>
      <div className="flex-grow pl-3">
        <h6 className="font-semibold uppercase text-gray-600">
          {dataProduct?.name_product}
        </h6>
        <p className="text-gray-400">{`x ${qty}`}</p>
      </div>
      <div>
        <span className="font-semibold text-gray-600 text-xl">
          {formatePrice(dataProduct?.price)}
        </span>
      </div>
    </div>
  );
}

export default CheckoutLIst;
