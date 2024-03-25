import { products } from "@/utils/products";
import { Popover, Transition } from "@headlessui/react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import CurrencyText from "../text/CurrencyText";

const CartMenu = () => {
  const otherProducts = products.length

  return (
    <div className="flex flex-1 items-center justify-end">
      <Popover className="ml-4 flow-root text-sm lg:relative lg:ml-0">
        <Popover.Button className="group -m-2 flex items-center p-2">
          <ShoppingBagIcon
            className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
          <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{otherProducts}</span>
          <span className="sr-only">items in cart, view bag</span>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Panel className="absolute inset-x-0 top-16 mt-px bg-white pb-6 shadow-lg sm:px-2 lg:left-auto lg:right-0 lg:top-full lg:-mr-1.5 lg:mt-8 lg:w-80 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5">
            <h2 className="sr-only">Shopping Cart</h2>

            <form className="mx-auto max-w-3xl px-2">
              <ul role="list" className="divide-y divide-gray-200">
                {products.slice(0, 5).map((product) => (
                  <li key={product.id} className="flex items-center py-3">
                    <Image
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      className="h-12 w-12 flex-none rounded-md border border-gray-200"
                      width={45}
                      height={45}
                    />
                    <div className="ml-4 flex-auto flex justify-between">
                      <h3 className="mx-1 font-medium text-gray-900">
                        <a href={product.href}>{product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name}</a>
                      </h3>
                      <CurrencyText amount={product.price} className="text-red-600 text-right" />
                    </div>
                  </li>
                ))}
              </ul>



              <p className="mt-4 flex justify-between items-center">
                <span className="text-sm text-green-900">{otherProducts} other products</span>
                <Link href="/cart">
                  <button
                    type="submit"
                    className="flex-shrink-0 px-4 py-2 rounded-md border border-transparent bg-lime-900 text-sm font-medium text-white shadow-sm hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    View Cart Bag
                  </button>
                </Link>
              </p>
            </form>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartMenu;