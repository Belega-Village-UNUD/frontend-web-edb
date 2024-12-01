"use client";
import Loading from "@/components/Loading";
import BackDrop from "@/components/nav/BackDrop";
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
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LucideInfo } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FaClock, FaMoneyBillWave, FaMoneyCheck, FaShippingFast, FaTimesCircle } from "react-icons/fa";
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
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>();

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

    // Filter based on statusFilter or "ALL"
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

    // Count status for each order
    statusCounts = orders?.reduce((acc: any, order: any) => {
      const shippingStatus = order?.cart_details[0]?.arrival_shipping_status;

      // Check if status is SUCCESS and there is a shipping status
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

  const handleCancel: SubmitHandler<FieldValues> = async (
    data: any
  ) => {
    try {
      setOpen(false);

      const payload = {
        reason: data.cancellation,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/buyer/cancel/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload)
        }
      );

      const responseJson = await response.json();
      if (responseJson.success) {
        toast.success(responseJson.message);
        router.push(`/checkout/${orderId}`)
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
    PENDING: { bg: "bg-gray-200", text: "text-gray-800" },
    PAYABLE: { bg: "bg-yellow-200", text: "text-yellow-800" },
    SUCCESS: { bg: "bg-green-200", text: "text-green-800" },
    CANCEL: { bg: "bg-red-200", text: "text-red-800" },
    PACKING: { bg: "bg-orange-200", text: "text-orange-800" },
    ARRIVED: { bg: "bg-blue-200", text: "text-blue-800" },
    SHIPPED: { bg: "bg-amber-200", text: "text-amber-800" },
  }

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
            <div className="flex flex-wrap justify-center gap-6">
              {statusCounts &&
                typeof statusCounts === "object" &&
                !Array.isArray(statusCounts) ? (
                Object.entries(statusCounts).map(([status, count]: any) => (
                  <div
                    key={status}
                    className={`flex flex-col items-center p-5 rounded-lg shadow-md ${
                      // @ts-ignore
                      statusColors[status] ? `${statusColors[status].bg} ${statusColors[status].text}` : "bg-gray-200 text-gray-800"
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
                          <dd className="mt-1 ">
                            <CurrencyText
                              amount={order.total_amount}
                              className="text-green-600"
                            />
                          </dd>
                        </div>
                      </div>
                      <div className="flex items-center px-2">
                        {order.status === "SUCCESS" &&
                          order?.cart_details[0]?.arrival_shipping_status ==
                          "SHIPPED" && (
                            <div className="flex flex-1 justify-center">
                              <button
                                className="whitespace-nowrap text-white bg-blue-600 px-4 py-2 rounded-md text-sm shadow-md hover:bg-blue-400"
                                type="submit"
                              >
                                Product Has Arrived
                              </button>
                            </div>
                          )}
                      </div>
                      <div className="flex items-center gap-2">
                        {order.cart_details.map((cart_detail: any, index: any) => {
                          let status = ["UNCONFIRMED", null, undefined].includes(cart_detail?.arrival_shipping_status)
                            ? order?.status
                            : cart_detail?.arrival_shipping_status;

                          let statusColor = statusColors[status as keyof typeof statusColors];

                          return (
                            <div key={index} className="justify-center items-center">
                              <div className={`text-sm font-medium px-2 py-1 rounded-full inline-block ${statusColor.bg} ${statusColor.text}`}>
                                {status}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <button className="cursor-pointer mx-4" title="Detail Order">
                        <Link href={`/checkout/${order?.id}`} >
                          <LucideInfo
                            className="h-6 w-6 hover:text-green-700"
                            aria-hidden="true"
                          />
                        </Link>
                      </button>
                    </dl>
                  </div>

                  {/* Products */}
                  <h4 className="sr-only">Items</h4>
                  <ul role="list" className="divide-y divide-gray-300">
                    {order.cart_details.map((cart_detail: any, index: any) => {
                      const statusStoreOrder = order.status_store.find((status: any) => status.store_id === cart_detail?.product?.store_id)?.status_store;

                      const getStatusColor = (status: string) => {
                        switch (status) {
                          case "confirm":
                            return { bg: "bg-green-200", text: "text-green-800" };
                          case "cancel":
                            return { bg: "bg-red-200", text: "text-red-800" };
                          case "pending":
                            return { bg: "bg-gray-200", text: "text-gray-800" };
                          default:
                            return { bg: "bg-gray-200", text: "text-gray-800" };
                        }
                      };

                      const statusColor = getStatusColor(statusStoreOrder);

                      return (
                        <li key={index} className="p-5 sm:p-7 border-b border-gray-300">
                          <div className="flex flex-row justify-between items-center w-full mb-6">
                            <div className="text-lg font-semibold">
                              {cart_detail?.product?.store?.name}
                            </div>
                            <div className={`text-sm font-medium px-2 py-1 rounded-full ${statusColor.bg} ${statusColor.text}`}>
                              {statusStoreOrder}
                            </div>
                          </div>
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
                              {order.status === "SUCCESS" && (
                                <>
                                  {order?.cart_details[0]?.arrival_shipping_status === "PACKING" && (
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
                                  {order?.cart_details[0]?.arrival_shipping_status === "SHIPPED" && (
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
                                  {order?.cart_details[0]?.arrival_shipping_status === "ARRIVED" && (
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
                                </>
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
                            <div className="mt-8 flex items-center space-x-5 divide-x divide-gray-300 border-t border-gray pt-5 text-sm font-medium sm:ml-5 sm:mt-0 sm:border-none sm:pt-0">
                              {order.status === "SUCCESS" && order?.cart_details[0]?.arrival_shipping_status == "ARRIVED" && (
                                <div className="flex flex-1 justify-center">
                                  <Link
                                    href={`/transaction/${order.id}/product/${order?.cart_details[0]?.product?.id}/rate`}
                                    className="whitespace-nowrap text-white bg-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
                                  >
                                    Rate Product
                                  </Link>
                                </div>
                              )}
                              <div className="flex justify-center">
                                <Link
                                  href={`/product/${order?.cart_details[0]?.product?.id}`}
                                  className="whitespace-nowrap text-white bg-lime-700 px-4 py-2 rounded-md shadow-md hover:bg-lime-800"
                                >
                                  View Product
                                </Link>
                              </div>

                              {order.status === "SUCCESS" &&
                                order?.cart_details[0]?.arrival_shipping_status ==
                                "ARRIVED" && (
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
                                )}
                            </div>
                          </div>
                        </li>
                      )
                    })}

                    <div>
                      <div className="flex items-center justify-center space-x-4">
                        {order.status === "PAYABLE" && (
                          <div className="flex items-center justify-center space-x-2 bg-indigo-600 px-4 py-2 rounded-md shadow-md hover:bg-indigo-700 cursor-pointer m-4" title="Pay Transaction">
                            <FaMoneyBillWave className="text-white" />
                            <Link
                              href={`/checkout/${order?.id}`}
                              className="text-white text-sm"
                            >
                              Pay Transaction
                            </Link>
                          </div>
                        )}
                        {order.status === "PENDING" && (
                          <div className="flex items-center justify-center space-x-2 bg-red-600 px-4 py-2 rounded-md shadow-md hover:bg-red-400 cursor-pointer m-4" onClick={() => setOpen(true)} title="Cancel Transaction">
                            <FaTimesCircle className="text-white" />
                            <span className="text-white text-sm">Cancel Transaction</span>
                          </div>
                        )}
                      </div>
                      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                          <DialogPanel className="max-w-lg space-y-4 bg-white p-12 rounded-lg shadow-sm">
                            <DialogTitle className="font-bold text-lg">Cancel Transaction</DialogTitle>
                            <Description>This will permanently cancel your transaction.</Description>
                            <form onSubmit={handleSubmit(handleCancel)}>
                              <p>Are you sure you want to cancel your transaction? Please provide a reason for cancellation.</p>
                              <textarea
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Reason for cancellation..."
                                rows={3}
                                {...register("cancellation")}
                              />
                              <div className="flex gap-4 mt-4">
                                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                                <button type="submit" onClick={() => { setOrderId(order?.id) }} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Confirm Cancellation</button>
                              </div>
                            </form>
                          </DialogPanel>
                        </div>
                      </Dialog>
                    </div>
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
      </section >
      {open && <BackDrop onClick={toggleOpen} />}
    </div >
  );
};

export default HistoryList;
