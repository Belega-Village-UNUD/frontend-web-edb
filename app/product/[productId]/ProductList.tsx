// import { product } from '@/utils/product'
import ButtonConfirm from '@/components/button/ButtonConfirm'
import SetQuantity from '@/components/products/SetQuantity'
import CurrencyText from '@/components/text/CurrencyText'
import { Disclosure, Tab } from '@headlessui/react'
import {
  HeartIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface ProductDetailsProps {
  data: any
}

const ProductList: React.FC<ProductDetailsProps> = ({ data }) => {
  const [quantity, setQuantity] = useState(1);
  const pathname = usePathname()
  const lastSegment = pathname.split('/').pop()

  // const checkout = async () => {
  //   const token = localStorage.getItem('token')

  //   const idOrder = Math.floor(Math.random() * 1000000000)

  //   const payload = {
  //     id: idOrder,
  //     productName: data.name_product,
  //     price: data.price,
  //     quantity: quantity,
  //   }

  //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction`, {
  //     method: 'POST',
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(payload),
  //   })

  //   const responseJson = await response.json();

  //   window.snap.pay(responseJson.data.midtrans_token)
  // }

  const getToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Anda belum login');
      return null;
    }
    return token;
  }, []);

  const handleAddToCart = async (event: any) => {
    event.preventDefault()
    try {
      const token = getToken()
      if (!token) { return }

      const payload = {
        product_id: lastSegment,
        qty: quantity,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([payload]),
      })

      const responseJson = await response.json()
      if (responseJson.success) {
        toast.success(responseJson.message)
      } else {
        toast.error(responseJson.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // const handleCheckoutCart = async () => {
  //   try {
  //     const token = getToken()
  //     if (!token) { return }

  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/checkout`, {
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  // }

  return (
    <div className="bg-white">

      <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:p-8"  >
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Tab.Group as="div" className="flex flex-col-reverse">
              <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                  {/* {data.map((image: any) => ( */}
                  <Tab
                    key={data.id}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  >
                    {({ selected }) => (
                      <>
                        <span className="sr-only">{data.image_product}</span>
                        <span className="absolute inset-0 overflow-hidden rounded-md">
                          <Image src={data.image_product || 'https://flowbite.com/docs/images/examples/image-1@2x.jpg'} alt="" width={300} height={300} className="h-full w-full object-cover object-center" />
                        </span>
                        <span
                          className={classNames(
                            selected ? 'ring-indigo-500' : 'ring-transparent',
                            'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2'
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Tab>
                </Tab.List>
              </div>

              <Tab.Panels className="aspect-h-1 aspect-w-1 w-full flex justify-center items-center">
                <Image
                  src={data.image_product || 'https://flowbite.com/docs/images/examples/image-1@2x.jpg'}
                  alt={data.image_product}
                  className="object-cover object-center sm:rounded-lg"
                  width={1000}
                  height={1000}
                />
              </Tab.Panels>
            </Tab.Group>

            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">

              <h1 className="text-2xl font-medium tracking-tight text-gray-900">{data.name_product}</h1>
              <div className="my-3">
                <CurrencyText amount={data.price} className="text-3xl tracking-tight text-green-800 font-semibold" />
              </div>
              <div className='mt-2'>
                <SetQuantity cartQty={quantity} onQtyChange={setQuantity} />
              </div>

              <form className="mt-6">

                <div className="mt-10 flex gap-2">
                  <ButtonConfirm label='Add to cart' type="submit" onClick={handleAddToCart} outline />
                  <ButtonConfirm label='Buy now' type="submit" />
                  <button
                    type="button"
                    className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <span className="sr-only">Add to favorites</span>
                    <HeartIcon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                  </button>
                </div>

              </form>

              <section aria-labelledby="details-heading" className="mt-12">
                <h2 id="details-heading" className="sr-only">
                  Additional details
                </h2>

                <div className="divide-y divide-gray-200 border-t">
                  <Disclosure as="div" key={data.id}>
                    {({ open }) => (
                      <>
                        <h3>
                          <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                            <span
                              className={classNames(
                                open ? 'text-green-700' : 'text-gray-900',
                                'text-sm font-medium'
                              )}
                            >
                              Spesification
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="block h-6 w-6 text-green-700 group-hover:text-green-800"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                          <ul role="list">
                            <li>Category : {data && data.product_type ? data.product_type.name : ''}</li>
                            <li>Description : {data.desc_product}</li>
                            <li>Stock : {data.stock}</li>
                            <li>Material : {data && data.product_type ? data.product_type.material : ''}</li>
                          </ul>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main >
    </div >
  )
}

export default ProductList;