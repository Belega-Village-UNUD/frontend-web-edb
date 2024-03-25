"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import CurrencyText from "../text/CurrencyText";

interface ProductCardProps {
  data: any
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const router = useRouter()

  // const productRating = data.reviews.reduce((acc: number, item: any) => acc + item.rating, 0) / data.reviews.length

  return (
    // <div onClick={() => router.push(`/product/${data.id}`)} className="col-span-1 cursor-pointer border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 text-center text-sm">
    //   <div className="flex flex-col items-center w-full gap-1 ">
    //     <div className="aspect-square overflow-hidden relative w-full">
    //       <Image fill src={data.imageSrc[0].image} alt={data.name} className="w-full h-full object-contain" />
    //     </div>
    //     <div className="mt-4">{truncateText(data.name)}</div>
    //     <div>
    //       {/* <Rating value={productRating} readOnly/> */}
    //     </div>
    //     <div>{data.reviewCount} reviews</div>
    //     <div className="font-semibold mt-2">{formatePrice(data.price)}</div>
    //   </div>
    // </div>

    <div onClick={() => router.push(`/product/${data.id}`)} className="col-span-1 cursor-pointer border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 text-center text-sm">
      <div className="relative">
        <div className="relative h-72 w-full overflow-hidden rounded-lg">
          <Image
            priority
            src={data.image_product || 'https://flowbite.com/docs/images/examples/image-1@2x.jpg'}
            alt={data.name_product}
            width={300}
            height={300}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="relative mt-4">
          <h3 className="text-sm font-medium text-gray-900">{data.name_product}</h3>
          {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
        </div>
        <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
          />
          <CurrencyText amount={data.price} className="relative text-lg font-semibold text-white" />
        </div>
      </div>
      <div className="mt-6">
        <a
          // href={product.href}
          className="relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
        >
          Add to Cart<span className="sr-only">, {data.name_product}</span>
        </a>
      </div>
    </div>
  );
}

export default ProductCard;