"use client"

import Container from "@/components/Container";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ListRating from "./ListRating";
import ProductList from "./ProductList";

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState([])

  const handleGetProduct = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/guest/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const responseJson = await response.json();
      if (responseJson.success === true) {
        setProduct(responseJson.data)
        return
      }
      console.log(responseJson)
      // console.log(responseJson)
    } catch (error: any) {
      console.log(error.message)
    }
  }, [productId])

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js"
    const clientKey: any = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    const script = document.createElement('script')

    script.src = snapScript
    script.async = true
    script.setAttribute('data-client-key', clientKey)

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    handleGetProduct()
  }, [handleGetProduct])

  return (
    <div className="p-8 bg-green-50">
      <Container>
        <ProductList data={product} />
        <div className="flex flex-col mt-20 gap-4">
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
}

export default Product;