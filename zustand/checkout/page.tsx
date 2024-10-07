"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SlashIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Loading from "@/components/Loading";
import { formatePrice } from "@/utils/formatPrice";
import CheckoutLIst from "./checkoutLIst";
import Discount from "./discount";
import Payment from "./payment";
import Container from "@/components/Container";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id");
  const qty = parseInt(searchParams.get("qty") ?? "0", 10);

  const {
    isFetching,
    data: dataProduct,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/guest/${productId}`
      );
      return data.data;
    },
    queryKey: ["get-products"],
    enabled: true,
  });

  if (isFetched && (!dataProduct || dataProduct.stock < qty)) {
    // router.push("/");
  }

  if (isFetching && !isFetched) {
    return <Loading />;
  }

  return (
    // <Container>
    //   <div className="mt-10">
    //     <div className="px-5">
    //       <div className="mb-2">
    //         <div
    //           onClick={() => router.back()}
    //           className="focus:outline-none hover:underline text-gray-500 text-sm cursor-pointer"
    //         >
    //           <i className="mdi mdi-arrow-left text-gray-400"></i> Back
    //         </div>
    //       </div>
    //       <div className="mb-2">
    //         <h1 className="text-3xl md:text-5xl font-bold text-gray-600">
    //           Checkout.
    //         </h1>
    //       </div>
    //       <div className="mb-5 text-gray-400">
    //         <Breadcrumb>
    //           <BreadcrumbList>
    //             <BreadcrumbItem>
    //               <BreadcrumbLink href="/">Home</BreadcrumbLink>
    //             </BreadcrumbItem>
    //             <BreadcrumbSeparator>
    //               <SlashIcon />
    //             </BreadcrumbSeparator>
    //             <BreadcrumbItem>
    //               <BreadcrumbLink href="/buyer/cart">Products</BreadcrumbLink>
    //             </BreadcrumbItem>
    //             <BreadcrumbSeparator>
    //               <SlashIcon />
    //             </BreadcrumbSeparator>
    //             <BreadcrumbItem>
    //               <BreadcrumbPage>Checkout</BreadcrumbPage>
    //             </BreadcrumbItem>
    //           </BreadcrumbList>
    //         </Breadcrumb>
    //       </div>
    //     </div>

    //     <div className="w-full  border-t border-b border-gray-200 px-5 py-6 text-gray-800">
    //       <div className="w-full ">
    //         <div className="-mx-3 md:flex items-start gap-4">
    //           <div className="px-3 md:w-7/12 lg:pr-10 bg-white py-6 border border-gray-200 rounded-md">
    //             <div className="w-full mx-auto text-gray-800 font-light mb-6 border-b border-gray-200 pb-6 space-y-4 ">
    //               <CheckoutLIst dataProduct={dataProduct} qty={qty} />
    //             </div>
    //             <Discount />
    //             <div className="mb-6 pb-6 border-b border-gray-200 text-gray-800">
    //               <div className="w-full flex mb-3 items-center">
    //                 <div className="flex-grow">
    //                   <span className="text-gray-600">Subtotal</span>
    //                 </div>
    //                 <div className="pl-3">
    //                   <span className="font-semibold">
    //                     {formatePrice(dataProduct?.price)}
    //                   </span>
    //                 </div>
    //               </div>
    //               <div className="w-full flex items-center">
    //                 <div className="flex-grow">
    //                   <span className="text-gray-600">Taxes (GST)</span>
    //                 </div>
    //                 <div className="pl-3">
    //                   <span className="font-semibold">$19.09</span>
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="mb-6 pb-6 border-b border-gray-200 md:border-none text-gray-800 text-xl">
    //               <div className="w-full flex items-center">
    //                 <div className="flex-grow">
    //                   <span className="text-gray-600">Total</span>
    //                 </div>
    //                 <div className="pl-3">
    //                   <span className="font-semibold">
    //                     {formatePrice(dataProduct?.price)}
    //                   </span>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //           <Payment />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </Container>
    <h1>jsd</h1>
  );
}
