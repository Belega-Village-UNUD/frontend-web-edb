import { formatRupiah } from "@/lib/utils";
import { formatePrice } from "@/utils/formatPrice";
import Image from "next/image";

interface checkoutListProps {
  cart: any;
  shipping: any;
}

function CheckoutLIst({ cart, shipping }: checkoutListProps) {
  return (
    <div className="w-full flex items-center p-4 bg-white shadow-md rounded-lg mb-4">
      <div className="overflow-hidden rounded-lg w-28 h-28 bg-gray-100 border border-gray-300">
        <Image
          src={
            cart?.product?.images[0] ||
            "https://flowbite.com/docs/images/examples/image-1@2x.jpg"
          }
          alt={cart?.product?.name_product}
          width={1000}
          height={1000}
          className="object-cover object-center w-full h-full"
        />
      </div>
      <div className="flex-grow pl-4 text-sm">
        <h6 className="font-semibold text-gray-700 text-lg">
          {cart?.product?.name_product}
          {cart?.product?.name_product && (
            <span className="font-light text-sm text-gray-500"> (Preorder)</span>
          )}
        </h6>
        <p className="pt-2 font-semibold">{cart?.product?.store?.name}</p>
        <p className="text-gray-500">{`${cart?.qty} Pcs`}</p>
        <p className="text-gray-500">{`Price: ${formatRupiah(
          cart?.unit_price
        )}`}</p>
        <p className="text-gray-500">{`Weight: ${cart?.product?.weight_gr} Gram`}</p>
      </div>
      <div className="text-right">
        <span className="font-semibold text-gray-700 text-lg">
          {formatePrice(cart?.unit_price * cart?.qty)}
        </span>
      </div>
    </div>
  );
}

export default CheckoutLIst;
