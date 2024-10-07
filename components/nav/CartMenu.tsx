import { usePersistedUser } from "@/zustand/users";
import { Popover, Transition } from "@headlessui/react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";
import CurrencyText from "../text/CurrencyText";
import { useCart } from "@/zustand/carts";

const CartMenu = () => {
  const [values, setValues] = useState<{ carts: any[] }[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [token] = usePersistedUser((state) => [state.token]);
  const { totalCounter, setTotalCounter } = useCart((state) => ({
    totalCounter: state.counter,
    setTotalCounter: state.setTotalCounter,
  }));

  const handleGetAllCartBuyer = useCallback(async () => {
    try {
      if (!token) {
        console.error("Anda belum login");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const responseJson = await response.json();
      setValues(responseJson.data);
      // @ts-ignore
      const total = responseJson.data.reduce((acc, item) => {
        const inStockCarts = item.carts.filter((cart: any) => cart.stock > 0);
        return acc + inStockCarts.length;
      }, 0);
      setTotalCounter(total);
    } catch (error: any) {
      // console.log(error.message);
    }
  }, [token]);

  const totalProducts = values?.reduce((total, item) => {
    const inStockCarts = item.carts.filter((cart: any) => cart.stock > 0);
    return total + inStockCarts.length;
  }, 0);

  useEffect(() => {
    handleGetAllCartBuyer();
    const intervalId = setInterval(() => {
      handleGetAllCartBuyer();
    }, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, [handleGetAllCartBuyer]);

  return (
    <div className="flex flex-1 items-center justify-end">
      <Popover className="ml-4 flow-root text-sm lg:relative lg:ml-0">
        <Popover.Button
          data-hover
          className="group -m-2 flex items-center p-2"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <span className="sr-only">items in cart, view bag</span>
          <Link href="/buyer/cart">
            <ShoppingBagIcon
              className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            />
          </Link>
          <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
            {totalProducts}
          </span>
        </Popover.Button>

        <Transition
          show={isOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Panel
            className="absolute inset-x-0 top-16 mt-px bg-white pb-6 shadow-lg sm:px-2 lg:left-auto lg:right-0 lg:top-full lg:-mr-1.5 lg:mt-8 lg:w-80 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <h2 className="sr-only">Shopping Cart</h2>

            <form className="mx-auto max-w-3xl px-2">
              <ul role="list" className="divide-y divide-gray-200">
                {values?.map((item: any) => (
                  <div key={item.store.id}>
                    {item.carts
                      .filter((cart: any) => cart.stock >= 1)
                      .map((cart: any) => (
                        <li key={cart.id} className="flex items-center py-3">
                          {cart?.images?.length > 0 ? (
                            <Image
                              src={cart.images[0]}
                              alt={"image"}
                              className="h-12 w-12 flex-none rounded-md border object-center object-cover border-gray-200"
                              width={45}
                              height={45}
                            />
                          ) : (
                            <Image
                              src="https://flowbite.com/docs/images/examples/image-1@2x.jpg"
                              alt="Product Image"
                              className="h-12 w-12 flex-none rounded-md border border-gray-200"
                              width={55}
                              height={45}
                            />
                          )}
                          <div className="ml-2 flex-auto flex justify-between">
                            <h3 className="mx-1 font-medium text-gray-900 flex flex-col">
                              <span>
                                {cart.name_product.length > 15
                                  ? cart.name_product.substring(0, 15) + "..."
                                  : cart.name_product}
                              </span>
                              <span className="font-thin text-gray-400 text-xs">
                                quantity: {cart.qty}
                              </span>
                            </h3>
                            <CurrencyText
                              amount={cart.price}
                              className="text-red-600 text-right"
                            />
                          </div>
                        </li>
                      ))}
                  </div>
                ))}
              </ul>
              <div className="mt-4 flex justify-between items-center">
                {totalProducts > 5 ? (
                  <span className="text-sm text-green-900">
                    {totalProducts} other products
                  </span>
                ) : (
                  <span className="text-sm text-green-900">
                    {totalProducts} products
                  </span>
                )}

                <Link href="/buyer/cart">
                  <p className="flex-shrink-0 px-4 py-2 rounded-md border border-transparent bg-lime-900 text-sm font-medium text-white shadow-sm hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                    View Cart Bag
                  </p>
                </Link>
              </div>
            </form>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
};

export default CartMenu;
