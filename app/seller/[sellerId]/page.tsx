"use client";

import Container from "@/components/Container";
import ProductCard from "@/components/products/ProductCard";
import ProductSkeleton from "@/components/skeleton/ProductSkeleton";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SellerRating from "./SellerRating";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "@/components/Loading";
import ProfileSeller from "./ProfileSeller";

interface SellerProps {
  params: {
    sellerId: string;
  };
}

export default function Seller({ params }: SellerProps) {
  const {
    isFetching,
    data: data,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/store/guest/info?store_id=${params.sellerId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data.data;
    },
    queryKey: ["getone-seller"],
    enabled: true,
  });

  if (isFetching && !isFetched) {
    return <Loading />;
  }

  return (
    <div className="p-0">
      <Container>
        <div className="bg-green-50">
          <ProfileSeller data={data} />
          <Tabs defaultValue="products" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="products">
              <div>
                <h2 className="text-xl font-bold text-gray-900 p-5">
                  Seller Products
                </h2>
                <div className="grid grid-cols-2 p-4 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
                  {data?.product?.length > 0 ? (
                    <>
                      {data?.product?.map((product: any) => {
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
            </TabsContent>
            <TabsContent value="reviews">
              <SellerRating sellerId={params.sellerId} />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </div>
  );
}
