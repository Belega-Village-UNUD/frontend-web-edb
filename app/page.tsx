"use client"

import { useEffect, useState } from 'react'

import Container from '@/components/Container'
import HomeBanner from '@/components/HomeBanner'
import ProductCard from '@/components/products/ProductCard'
import ProductSkeleton from '@/components/skeleton/ProductSkeleton'

export default function Home() {
  const [products, setProducts] = useState([])

  const handleGetAllProduct = async () => {
    try {
      // const responseJson = getAllProducts()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/guest/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const responseJson = await response.json();
      setProducts(responseJson.data)
      // console.log(responseJson)
    } catch (error: any) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    handleGetAllProduct()
  }, [])

  useEffect(() => {
    const clearIsLogin = () => {
      localStorage.clear()
    }
    const intercalId = setInterval(clearIsLogin, 3600000);

    return () => { clearInterval(intercalId) }
  }, [])

  return (
    <div className='p-0'>
      <Container>
        <div>
          <HomeBanner />
        </div>
        <div className='bg-white'>
          <h2 className="text-xl font-bold text-gray-900 p-5">Customers also bought</h2>
          <div className='grid grid-cols-2 p-4 gap:8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
            {products.length > 0 ? (
              <>
                {products.map((product: any) => {
                  return <ProductCard key={product.id} data={product} />
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
  )
}
