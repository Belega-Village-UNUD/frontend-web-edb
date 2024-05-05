'use client'
import SetQuantity from '@/components/products/SetQuantity';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'Nomad Tumbler',
    description:
      'This durable and portable insulated tumbler will keep your beverage at the perfect temperature during your next adventure.',
    href: '#',
    price: '35.00',
    status: 'Preparing to ship',
    step: 3,
    date: 'March 24, 2021',
    datetime: '2021-03-24',
    address: ['Floyd Miles', '7363 Cynthia Pass', 'Toronto, ON N3Y 4H8'],
    email: 'f•••@example.com',
    phone: '1•••••••••40',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/confirmation-page-03-product-01.jpg',
    imageAlt: 'Insulated bottle with white base and black snap lid.',
  },
  {
    id: 2,
    name: 'Minimalist Wristwatch',
    description: 'This contemporary wristwatch has a clean, minimalist look and high quality components.',
    href: '#',
    price: '149.00',
    status: 'Shipped',
    step: 0,
    date: 'March 23, 2021',
    datetime: '2021-03-23',
    address: ['Floyd Miles', '7363 Cynthia Pass', 'Toronto, ON N3Y 4H8'],
    email: 'f•••@example.com',
    phone: '1•••••••••40',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/confirmation-page-03-product-02.jpg',
    imageAlt:
      'Arm modeling wristwatch with black leather band, white watch face, thin watch hands, and fine time markings.',
  },
]

const CartList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="mx-auto max-w-7xl pt-10 lg:max-w-7xl md:max-w-5xl md:px-6 sm:max-w-xl sm:px-2">

      <div className="max-w-7xl mb-6 sm:px-2">
        <div className="max-w-2xl lg:max-w-4xl">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Shopping Chart</h1>
          <p className="mt-2 text-sm text-gray-500">
            Check the status of recent orders, manage returns, and discover similar products.
          </p>
        </div>
      </div>

      <div className='bg-white shadow-md mt-4'>
        <div className='p-5 text-center text-base font-medium grid grid-cols-6'>
          <div className='flex items-center col-span-2 text-start'>
            <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-lime-700 focus:ring-lime-700"
            />
            <p className='px-4'>Product</p>
          </div>
          <p>Unit Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Actions</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="border-b border-t border-gray-200 bg-white shadow-md sm:rounded-lg sm:border">

          <div className="px-5 py-2 flex items-center border-b">
            <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-lime-700 focus:ring-lime-700"
            />
            <h4 className="text-lime-800 text-xl font-semibold px-4">Terawan Store</h4>
          </div>

          {products.map((product) => (

            <div key={product.id} className="p-4 flex border-b border-gray-200 lg:grid lg:grid-cols-6 lg:place-content-center">
              <div className="pr-4 aspect-auto w-14 h-14 flex-shrink-0 overflow-hidden rounded-lg sm:aspect-none sm:h-40 sm:w-40">
                <Image
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  width={50}
                  height={50}
                  className="h-full w-full object-cover object-center md:h-full md:w-full sm:h-full sm:w-full"
                />
              </div>

              <div className='py-2'>
                <h3 className="text-base font-medium text-slate-700">
                  <a href={product.href}>{product.name}</a>
                </h3>
                <p className="mt-3 text-sm text-gray-500">{product.description}</p>
              </div>

              <p className="text-center py-20 text-sm font-medium text-slate-700">${product.price}</p>
              <div className='grid place-content-center'>
                <SetQuantity cartProduct={quantity} handleQtyIncrease={increaseQuantity} handleQtyDecrease={decreaseQuantity} />
              </div>
              <p className="text-center py-20 text-sm font-medium text-slate-700">${product.price}</p>

              <button type="button" className="font-medium text-red-500 hover:text-red-500">
                delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-10 sticky bottom-0">
        <h2 className="sr-only">Billing Summary</h2>

        <div className="bg-slate-50 shadow-md px-4 py-4 grid grid-cols-3 gap-2 lg sm:rounded-lg sm:px-6 sm:gap-3">

          <div className='flex items-center text-start'>
            <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-lime-700 focus:ring-lime-700"
            />
            <p className='px-4'>Select All</p>
          </div>
          <div className='flex items-center justify-center w-full'>
            <p className="text-red-500">Delete</p>
          </div>
          <div className="p-2 flex items-center justify-center flex-wrap w-full text-lg">
            <p className="text-slate-500">Total (0 Product):</p>
            <p className='p-2 text-lime-700 font-bold text-xl'>Rp.3030003</p>
            {/* <ButtonConfirm label={isLoading ? '' : 'Checkout'} /> */}
            <Link href="/buyer/checkout">
              <button
                type="submit"
                className="flex-shrink-0 px-4 py-2 rounded-md border border-transparent bg-lime-900 text-sm font-medium text-white shadow-sm hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                View Cart Bag
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div >
  )
}

export default CartList;