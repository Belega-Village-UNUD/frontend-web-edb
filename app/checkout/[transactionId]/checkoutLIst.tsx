import { formatRupiah } from "@/lib/utils";
import { formatePrice } from "@/utils/formatPrice";
import Image from "next/image";

interface checkoutListProps {
  cart: any;
  order: any;
  cart_detail: any;
}

function CheckoutLIst({ cart, order, cart_detail }: checkoutListProps) {
  console.log('line 12: ', JSON.stringify(cart, null, 2))
  console.log('line 13: ', JSON.stringify(order, null, 2))
  console.log('line 14: ', JSON.stringify(cart_detail, null, 2))
  return (
    <div className="w-full grid grid-cols-4 p-4 bg-white shadow-lg rounded-lg mb-4 transition-transform transform hover:scale-105">
      <div className="overflow-hidden rounded-lg w-28 h-28 bg-gray-100 border border-gray-300">
        <Image
          src={
            cart?.product?.images?.[0] ||
            "https://flowbite.com/docs/images/examples/image-1@2x.jpg"
          }
          alt={cart?.product?.name_product || "Product Image"}
          width={1000}
          height={1000}
          className="object-cover object-center w-full h-full"
        />
      </div>
      <div className="pl-4 text-sm col-span-2">
        <h6 className="text-lg font-semibold text-gray-800">
          {cart?.product?.store?.name || "Unknown Store"}
        </h6>
        <p className="pt-2 font-semibold text-gray-700">{cart?.product?.name_product || "Unnamed Product"}</p>
        <p className="text-gray-500">{`${cart?.qty || 0} Pcs`}</p>
        <p className="text-gray-500">{`Price: ${formatRupiah(cart?.unit_price || 0)}`}</p>
        <p className="text-gray-500">{`Weight: ${cart?.product?.weight_gr || 0} Gram`}</p>
      </div>
      <div className="col-end-5 text-center gap-y-5">
        <div className={`text-sm font-medium px-2 py-1 rounded-full w-16 ${["UNCONFIRMED", null, undefined].includes(cart_detail?.arrival_shipping_status)
          ? "bg-yellow-200 text-yellow-800"
          : "bg-green-200 text-green-800"
          }`}>
          {
            ["UNCONFIRMED", null, undefined].includes(cart_detail?.arrival_shipping_status)
              ? order?.status || "Unknown Status"
              : cart_detail?.arrival_shipping_status
          }
        </div>
        <span className="font-semibold text-gray-700 text-lg">
          {formatePrice((cart?.unit_price || 0) * (cart?.qty || 0))}
        </span>
      </div>
    </div>
  );
}

export default CheckoutLIst;
