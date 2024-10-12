"use client";
import Loading from "@/components/Loading";
import CurrencyText from "@/components/text/CurrencyText";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatReadableDate } from "@/utils/utils";
import { usePersistedUser } from "@/zustand/users";
import { Menu, Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { FaClock, FaMoneyCheck, FaShippingFast } from "react-icons/fa";
import { LuPackage } from "react-icons/lu";
import { MdCancel } from "react-icons/md";
import { toast } from "sonner";
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const HistoryList = () => {
  const [token, setToken] = useState<string>();
  const [statusFilter, setStatusFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    const tokenFromStore = usePersistedUser.getState().token;
    if (!tokenFromStore) {
      // router.push("/");
    }
    setToken(tokenFromStore);
  }, [router, token]);

  const {
    isFetching,
    data: orders,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/buyer/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data.data;
    },
    queryKey: ["get-history-checkout"],
    enabled: !!token,
  });

  let filteredOrders = [];
  let statusCounts;
  if (isFetched) {
    const sortedOrders = orders?.sort(
      // @ts-ignore
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Filter berdasarkan statusFilter atau "ALL"
    filteredOrders =
      !statusFilter || statusFilter === "ALL"
        ? sortedOrders
        : sortedOrders?.filter((order: any) => {
          if (order.status === "SUCCESS") {
            const shippingStatus =
              order?.cart_details[0]?.arrival_shipping_status;

            if (statusFilter == "PACKING") {
              return shippingStatus == "PACKING";
            } else if (statusFilter == "SHIPPED") {
              return shippingStatus == "SHIPPED";
            } else if (statusFilter == "ARRIVED") {
              return shippingStatus == "ARRIVED";
            }
          }
          return order.status === statusFilter;
        });

    // Hitung jumlah status untuk setiap order
    statusCounts = orders?.reduce((acc: any, order: any) => {
      const shippingStatus = order?.cart_details[0]?.arrival_shipping_status;

      // Cek jika status adalah SUCCESS dan ada status pengiriman
      if (order.status === "SUCCESS") {
        if (
          shippingStatus === "PACKING" ||
          shippingStatus === "SHIPPED" ||
          shippingStatus === "ARRIVED"
        ) {
          acc[shippingStatus] = (acc[shippingStatus] || 0) + 1;
        }
      } else {
        acc[order.status] = (acc[order.status] || 0) + 1;
      }
      return acc;
    }, {});
  }

  const handleCheckout = async (
    event: React.MouseEvent<HTMLButtonElement>,
    orderId: string
  ) => {
    event.preventDefault();

    try {
      const payload = {
        product_id: orderId,
        qty: 1,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/product/checkout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseJson = await response.json();
      if (responseJson.success) {
        toast.success(responseJson.message);
      } else {
        toast.error(responseJson.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isFetching && !isFetched) {
    return <Loading />;
  }

  const statusColors = {
    PAYABLE: "bg-yellow-300",
    PENDING: "bg-gray-300",
    SUCCESS: "bg-green-300",
    PACKING: "bg-gray-300",
    ARRIVED: "bg-blue-300",
    SHIPPED: "bg-amber-300",
    CANCEL: "bg-red-300",
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl sm:px-4 lg:px-10">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-4xl lg:px-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-green-900 sm:text-4xl">
            Order History
          </h1>
          <p className="mt-3 text-base text-green-600">
            Check the status of recent orders, manage returns, and discover similar products.
          </p>
        </div>
      </div>

      <section aria-labelledby="recent-heading" className="mt-6">
        <h2 id="recent-heading" className="sr-only">
          Recent orders
        </h2>

        <div className="mx-auto max-w-7xl sm:px-4 lg:px-10">
          <div className="mx-auto max-w-2xl space-y-10 sm:px-6 lg:max-w-4xl lg:px-0">
            <div className="flex space-x-6">
              {statusCounts &&
                typeof statusCounts === "object" &&
                !Array.isArray(statusCounts) ? (
                Object.entries(statusCounts).map(([status, count]: any) => (
                  <div
                    key={status}
                    className={`flex flex-col items-center p-5 rounded-lg shadow-md ${
                      // @ts-ignore
                      statusColors[status] || "bg-gray-200"
                      }`}
                  >
                    <span className="font-bold text-lg">{count}</span>
                    <span className="text-gray-800 capitalize">
                      {status.toLowerCase()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-600">No status counts available.</div>
              )}
            </div>

            <Select onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[300px] border border-indigo-300 rounded-md shadow-sm">
                <SelectValue placeholder="Select status order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAYABLE">Payable</SelectItem>
                <SelectItem value="CANCEL">Canceled</SelectItem>
                <SelectItem value="ARRIVED">Arrived</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="PACKING">Packing</SelectItem>
              </SelectContent>
            </Select>
            {filteredOrders?.length > 0 ? (
              filteredOrders?.map((order: any) => (
                <div
                  key={order.id}
                  className="border-b border-t border-gray-300 bg-white shadow-lg sm:rounded-lg sm:border"
                >
                  <h3 className="sr-only">
                    Order placed on{" "}
                    <time dateTime={order.createdAt}>{order.createdAt}</time>
                  </h3>

                  <div className="flex items-center border-b border-gray-300 p-5">
                    <dl className="flex flex-row justify-between w-full ">
                      <div className="flex-row flex gap-6 w-full">
                        <div>
                          <dt className="font-semibold text-green-900">
                            Order number
                          </dt>
                          <dd className="mt-1 text-green-600">{order.id}</dd>
                        </div>
                        <div className="hidden sm:block">
                          <dt className="font-semibold text-green-900">
                            Date placed
                          </dt>
                          <dd className="mt-1 text-green-600">
                            <time dateTime={order.createdAt}>
                              {formatReadableDate(order.createdAt)}
                            </time>
                          </dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-green-900">
                            Total amount
                          </dt>
                          <dd className="mt-1 font-semibold text-green-900">
                            <CurrencyText
                              amount={order.total_amount}
                              className="text-center py-20 text-sm font-medium text-slate-700"
                            />
                          </dd>
                        </div>
                      </div>
                      <div className="">
                        {order.status === "PAYABLE" && (
                          <div className="flex flex-1 justify-center">
                            <Link
                              href={`/checkout/${order?.id}`}
                              className="whitespace-nowrap text-white bg-indigo-600 px-4 py-2 rounded-md text-sm shadow-md hover:bg-indigo-700"
                            >
                              Pay
                            </Link>
                          </div>
                        )}
                      </div>
                    </dl>
                    {order.status == "SUCCESS" && (
                      <Menu as="div" className="relative flex justify-end">
                        <div className="flex items-center">
                          <Menu.Button className="-m-2 flex items-center p-2 text-gray-400 hover:text-gray-500">
                            <span className="sr-only">
                              Options for order {order.id}
                            </span>
                            <EllipsisVerticalIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-44 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href={`/checkout/${order?.id}`}
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    Detail transaction
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href={`/buyer/history/${order?.id}`}
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    Invoice
                                  </Link>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    )}
                  </div>

                  {/* Products */}
                  <h4 className="sr-only">Items</h4>
                  <ul role="list" className="divide-y divide-gray-300">
                    {order.cart_details.map((cart_detail: any, index: any) => (
                      <li key={index} className="p-5 sm:p-7">
                        {cart_detail?.product ? (
                          <div className="flex items-center sm:items-start">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-44 sm:w-44">
                              <Image
                                src={
                                  cart_detail?.product?.images[0] ||
                                  "https://flowbite.com/docs/images/examples/image-1@2x.jpg"
                                }
                                alt={cart_detail?.product?.name_product}
                                width={180}
                                height={180}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-8 flex-1 text-sm">
                              <div className="font-medium text-green-900 sm:flex sm:justify-between">
                                <h5>{cart_detail?.product?.name_product}</h5>
                                <div>
                                  <span className="text-gray-600">{`(x${cart_detail.qty}) `}</span>
                                  <CurrencyText
                                    amount={cart_detail?.product?.price}
                                    className="text-center text-sm font-medium text-slate-700"
                                  />
                                </div>
                              </div>
                              <p className="hidden text-gray-500 sm:mt-2 sm:block">
                                {cart_detail?.product?.desc_product}
                              </p>
                            </div>
                          </div>
                        ) : null}

                        <div className="mt-8 sm:flex sm:justify-between">
                          <div className="flex items-center">
                            {order.status === "SUCCESS" &&
                              order?.cart_details[0]?.arrival_shipping_status ==
                              "PACKING" && (
                                <div className="flex flex-row justify-center items-center">
                                  <LuPackage
                                    className="h-5 w-5 text-amber-700"
                                    aria-hidden="true"
                                  />
                                  <p className="ml-2 text-sm font-medium text-gray-500">
                                    Packing
                                  </p>
                                </div>
                              )}
                            {order.status === "SUCCESS" &&
                              order?.cart_details[0]?.arrival_shipping_status ==
                              "SHIPPED" && (
                                <div className="flex flex-row justify-center items-center">
                                  <FaShippingFast
                                    className="h-5 w-5 text-gray-500"
                                    aria-hidden="true"
                                  />
                                  <p className="ml-2 text-sm font-medium text-gray-500">
                                    Shipped
                                  </p>
                                </div>
                              )}
                            {order.status === "SUCCESS" &&
                              order?.cart_details[0]?.arrival_shipping_status ==
                              "ARRIVED" && (
                                <div className="flex flex-row justify-center items-center">
                                  <CheckCircleIcon
                                    className="h-5 w-5 text-blue-500"
                                    aria-hidden="true"
                                  />
                                  <p className="ml-2 text-sm font-medium text-gray-500">
                                    Arrived
                                  </p>
                                </div>
                              )}
                            {order.status === "CANCEL" && (
                              <>
                                <MdCancel
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                                <p className="ml-2 text-sm font-medium text-gray-500">
                                  Order Canceled
                                </p>
                              </>
                            )}
                            {order.status === "PENDING" && (
                              <>
                                <FaClock
                                  className="h-5 w-5 text-yellow-500"
                                  aria-hidden="true"
                                />
                                <p className="ml-2 text-sm font-medium text-gray-500">
                                  Order Pending
                                </p>
                              </>
                            )}
                            {order.status === "PAYABLE" && (
                              <>
                                <FaMoneyCheck
                                  className="h-5 w-5 text-blue-500"
                                  aria-hidden="true"
                                />
                                <p className="ml-2 text-sm font-medium text-gray-500">
                                  Order Payable
                                </p>
                              </>
                            )}
                            <time
                              dateTime={order.createdAt}
                              className="ml-2 text-sm font-medium text-gray-500"
                            >
                              {formatReadableDate(order.updatedAt)}
                            </time>
                          </div>

                          <div className="mt-8 flex items-center space-x-5 divide-x divide-gray-300 border-t border-gray-300 pt-5 text-sm font-medium sm:ml-5 sm:mt-0 sm:border-none sm:pt-0">
                            {order.status === "SUCCESS" && (
                              <div className="flex flex-1 justify-center">
                                <Link
                                  href={`/transaction/${order.id}/product/${order?.cart_details[0]?.product?.id}/rate`}
                                  className="whitespace-nowrap text-white bg-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
                                >
                                  Rate Product
                                </Link>
                              </div>
                            )}
                            <div className="flex flex-1 justify-center">
                              <Link
                                href={`/product/${order?.cart_details[0]?.product?.id}`}
                                className="whitespace-nowrap text-white bg-lime-700 px-4 py-2 rounded-md shadow-md hover:bg-lime-800"
                              >
                                View Product
                              </Link>
                            </div>

                            <div className="flex flex-1 justify-center pl-5">
                              <button
                                className="text-white bg-green-600 px-4 py-2 rounded-md shadow-md hover:bg-green-700"
                                type="submit"
                                onClick={(event: any) =>
                                  handleCheckout(
                                    event,
                                    order?.cart_details[0]?.product?.id
                                  )
                                }
                              >
                                Buy Again
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="bg-white py-6 px-6 flex justify-center items-center h-56 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">No data found</h3>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HistoryList;
