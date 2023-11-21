import { products } from '@/utils/products'
import Container from './components/Container'
import HomeBanner from './components/HomeBanner'
import ProductCard from './components/products/ProductCard'
import MainCategory from './components/MainCategory'
import ProductSkeleton from './components/skeleton/ProductSkeleton'

export default function Home() {
  return (
    <div className='p-4'>
      <Container>
        <div>
          <MainCategory />
        </div>
        <div>
          <HomeBanner />
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap:8'>
          <ProductSkeleton />
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
      </Container>
    </div>
  )
}
