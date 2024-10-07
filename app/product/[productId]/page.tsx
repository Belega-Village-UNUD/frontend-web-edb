"use client";

import Container from "@/components/Container";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ListRating from "./ListRating";
import DetailProduct from "./DetailProduct";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "@/components/Loading";
import InfoSeller from "./InfoSeller";

const Product = () => {
  const { productId } = useParams();

  const {
    isFetching,
    data: product,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/guest/${productId}`
      );
      return data.data;
    },
    queryKey: ["get-product"],
    enabled: true,
  });

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey: any = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    const script = document.createElement("script");

    script.src = snapScript;
    script.async = true;
    script.setAttribute("data-client-key", clientKey);

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  console.log(product);

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div className="p-8 bg-green-50">
      <Container>
        <DetailProduct data={product} />
        <div className="flex flex-col mt-5 gap-4">
          <InfoSeller product={product} />
        </div>
        <div className="flex flex-col mt-5 gap-4">
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
};

export default Product;
