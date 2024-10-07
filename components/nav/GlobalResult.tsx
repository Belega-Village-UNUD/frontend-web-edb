"use client";

import React, { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatRupiah } from "@/lib/utils";

const GlobalResult = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showMore, setShowMore] = useState(false); // State untuk menampilkan lebih banyak

  const products = searchParams.get("products");

  const {
    isFetching,
    data: result,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/guest/all`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data.data;
    },
    queryKey: ["get-all-products"],
  });

  const maxItemsToShow = 5;

  const handleShowMore = () => {
    router.push(`/products?products=${products}`);
  };

  // Filter results based on the searchParams "products"
  const filteredResults = products
    ? result?.filter((item: any) =>
        item.name_product.toLowerCase().includes(products.toLowerCase())
      )
    : result;

  return (
    <div className="absolute top-full z-10 mt-3 min-w-[450px] w-full rounded-md bg-background shadow-sm ">
      <div className="h-[1px] bg-light-700/50 dark:bg-dark-500/50" />

      <div className="space-y-5 py-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>

        {isFetching ? (
          <div className="flex-center flex-col px-5">
            <ReloadIcon className="my-2 h-6 w-6 animate-spin text-gray-600" />
            <p className="text-dark200_light800 body-regular">Please wait...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredResults && filteredResults.length > 0 ? (
              <>
                {filteredResults
                  ?.slice(0, showMore ? filteredResults.length : maxItemsToShow)
                  ?.map((item: any, index: number) => (
                    <Link
                      href={`/product/${item.id}`}
                      key={item.id + index}
                      passHref
                      className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:bg-dark-500/50"
                    >
                      <Image
                        src={
                          item?.images[0] ||
                          "https://flowbite.com/docs/images/examples/image-1@2x.jpg"
                        }
                        alt="tags"
                        width={90}
                        height={90}
                        className="invert-colors mt-1 object-cover w-18 max-h-18 aspect-video"
                      />

                      <div className="flex flex-col">
                        <p className="body-medium text-dark200_light800 line-clamp-1 font-semibold">
                          {item?.name_product}
                        </p>
                        <p className="text-light400_light500 small-medium font-light text-sm capitalize">
                          {item?.store?.name}
                        </p>
                        <p className="text-light400_light500 small-medium  font-light text-sm capitalize w-full text-gray-500">
                          {formatRupiah(item?.price)}
                        </p>
                      </div>
                    </Link>
                  ))}

                {filteredResults.length > maxItemsToShow && !showMore && (
                  <div
                    className="flex cursor-pointer items-center gap-3 px-5 py-2.5 hover:bg-light-700/50 border-t-2 border-gray-200"
                    // onClick={handleShowMore}
                  >
                    <p className="body-medium text-dark200_light800 line-clamp-1 ">
                      Show more...
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="text-dark200_light800 body-regular px-5 py-2.5">
                  Oops, no results found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;
