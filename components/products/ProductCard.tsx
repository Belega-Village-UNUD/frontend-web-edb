"use client";

import CurrencyText from "@/components/text/CurrencyText";
import { useCart } from "@/zustand/carts";
import { usePersistedUser } from "@/zustand/users";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ProductCardProps {
  data: any;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setOpen(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setOpen(false);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }
    };
  }, []);

  const [token] = usePersistedUser((state) => [state.token]);
  const getToken = useCallback(() => {
    if (!token) {
      console.error("Please login first.");
      // router.push("/buyer/login");
      return null;
    }
    return token;
  }, [router, token]);
  const incrementCartProducts = useCart((state) => state.increase);

  const handleAddToCart = async (event: any, idProduct: string) => {
    event.preventDefault();
    incrementCartProducts();
    try {
      const token = getToken();

      const payload = {
        product_id: idProduct,
        qty: quantity,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([payload]),
      });

      const responseJson = await response.json();
      if (responseJson.success) {
        toast.success(responseJson.message);
      } else {
        if (responseJson.status == 401) {
          toast.error("Please login first");
          router.push("/buyer/login");
        } else {
          toast.error(responseJson.message);
        }
        useCart.setState((state) => ({
          counter: state.counter - 1,
        }));
      }
    } catch (error) {
      useCart.setState((state) => ({
        counter: state.counter - 1,
      }));
    }
  };

  return (
    <div
      className="col-span-1 cursor-pointer border-[1.2px] border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 text-center text-sm flex flex-col justify-between shadow-md"
      onMouseLeave={handleMouseLeave}
    >
      {/* MODAL SHOW AFTER HOVER */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="hidden md:inline-block md:h-screen md:align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                enterTo="opacity-100 translate-y-0 md:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              >
                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                  <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                    <button
                      type="button"
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:items-center lg:gap-x-8">
                      <div className="w-full h-full overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5 border border-gray-500">
                        <Image
                          priority
                          src={
                            data?.images[0]
                              ? data?.images[0]
                              : "https://flowbite.com/docs/images/examples/image-1@2x.jpg"
                          }
                          alt={data.name_product}
                          width={300}
                          height={300}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="sm:col-span-8 lg:col-span-7">
                        <h2 className="text-xl font-medium text-gray-900 sm:pr-12">
                          {data.name_product}
                        </h2>

                        <section
                          aria-labelledby="information-heading"
                          className="mt-1"
                        >
                          <h3 id="information-heading" className="sr-only">
                            Product information
                          </h3>

                          <CurrencyText
                            amount={data.price}
                            className="font-medium text-gray-900"
                          />
                          <p id="information-description" className="mt-3">
                            {data.desc_product}
                          </p>
                          {/* Reviews */}
                          {/* <div className="mt-4">
                            <h4 className="sr-only">Reviews</h4>
                            <div className="flex items-center">
                              <p className="text-sm text-gray-700">
                                {dataRating.average_rate_per_product.toFixed(1)}
                                <span className="sr-only"> out of 5 stars</span>
                              </p>
                              <div className="ml-1 flex items-center">
                                {[0, 1, 2, 3, 4].map((rating) => (
                                  <StarIcon
                                    key={rating}
                                    className={classNames(
                                      dataRating.average_rate_per_product >
                                        rating
                                        ? "text-yellow-400"
                                        : "text-gray-200",
                                      "h-5 w-5 flex-shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                              <div className="ml-4 hidden lg:flex lg:items-center">
                                <span
                                  className="text-gray-300"
                                  aria-hidden="true"
                                >
                                  &middot;
                                </span>
                                <Link
                                  href={`/product/${data.id}#rating`}
                                  className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                  See all {dataRating.total_reviewer} reviews
                                </Link>
                              </div>
                            </div>
                          </div> */}
                        </section>

                        <section
                          aria-labelledby="options-heading"
                          className="mt-8"
                        >
                          <h3 id="options-heading" className="sr-only">
                            Product options
                          </h3>

                          <form>
                            <button
                              type="submit"
                              className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-green-900 px-8 py-3 text-base font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                              onClick={(e) => handleAddToCart(e, data.id)}
                            >
                              Add to cart
                            </button>

                            <p className="absolute left-4 top-4 text-center sm:static sm:mt-4">
                              <Link
                                href={`product/${data.id}`}
                                className="font-medium focus:ring-green-500 focus:ring-offset-2 text-black hover:text-gray-500"
                              >
                                View full details
                              </Link>
                            </p>
                          </form>
                        </section>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* CARD SHOW */}
      <div className="relative" onMouseEnter={handleMouseEnter}>
        <div className="relative h-32 sm:h-52 w-full overflow-hidden rounded-lg">
          <Image
            priority
            src={
              data?.images[0]
                ? data?.images[0]
                : "https://flowbite.com/docs/images/examples/image-1@2x.jpg"
            }
            alt={data.name_product}
            width={300}
            height={300}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="relative mt-1">
          <h3 className="text-sm font-medium text-gray-90 mb-2">
            {data?.store?.name || " "}
          </h3>
          <h3 className="text-base font-bold text-gray-900">
            {data.name_product}
          </h3>
        </div>
        <div className="absolute inset-x-0 top-0 flex h-32 sm:h-52 items-end justify-end overflow-hidden rounded-lg p-4">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
          />
          <CurrencyText
            amount={data.price}
            className="relative text-sm sm:text-lg font-semibold text-white"
          />
        </div>
      </div>
      <div className="sm:mt-4 mt-2">
        <Link
          href={`/product/${data.id}`}
          className="relative flex items-center justify-center rounded-md border border-transparent text-gray-100 px-8 py-2 sm:text-sm font-medium  hover:bg-green-800 bg-green-900 text-xs"
        >
          See Product
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
