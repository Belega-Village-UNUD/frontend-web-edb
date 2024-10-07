"use client";

import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import ProductCard from "@/components/products/ProductCard";
import ProductSkeleton from "@/components/skeleton/ProductSkeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "@/components/Loading";

export default function Home() {
  const {
    isFetching,
    data: products,
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
    queryKey: ["get-products"],
    enabled: true,
  });

  if (isFetching && !isFetched) {
    return <Loading />;
  }

  return (
    <div className="p-0">
      <Container>
        <div>
          <HomeBanner />
        </div>
        <div className="bg-green-50">
          <h2 className="text-xl font-bold text-gray-900 p-5">
            Customers also bought
          </h2>
          <div className="grid grid-cols-2 p-4 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
            {products?.length > 0 ? (
              <>
                {products?.map((product: any) => {
                  return product.stock > 0 ? (
                    <ProductCard key={product.id} data={product} />
                  ) : null;
                })}
              </>
            ) : (
              <>
                <ProductSkeleton />
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
