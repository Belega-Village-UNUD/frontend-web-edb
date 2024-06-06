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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/guest/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const responseJson = await response.json();
      setProducts(responseJson.data)
    } catch (error: any) {
      console.log(error.message)
      localStorage.clear()
    }
  }

  useEffect(() => {
    handleGetAllProduct()
  }, [])

  return (
    <div className='p-0'>
      <Container>
        <div>
          <HomeBanner />
        </div>
        <div className='bg-green-50'>
          <h2 className="text-xl font-bold text-gray-900 p-5">Customers also bought</h2>
          <div className='grid grid-cols-2 p-4 gap:8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
            {products.length > 0 ? (
              <>
                {products.map((product: any) => {
                  return product.stock > 0 ? <ProductCard key={product.id} data={product} /> : null
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
