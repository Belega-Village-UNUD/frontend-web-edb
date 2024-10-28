"use client";

import Container from "@/components/Container";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { formatePrice } from "@/utils/formatPrice";
import { usePersistedUser } from "@/zustand/users";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CheckoutLIst from "./checkoutLIst";
import Payment from "./payment";
import Shipping from "./shipping";

interface checkoutProps {
  params: { transactionId: string };
}

export default function Page({ params }: checkoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qty = parseInt(searchParams.get("qty") ?? "0", 10);
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const tokenFromStore = usePersistedUser.getState().token;
    if (!tokenFromStore) {
      // router.push("/");
    }
    setToken(tokenFromStore);
  }, [router, token]);

  const {
    isFetching,
    data: dataCheckout,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/buyer/${params.transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data.data;
    },
    queryKey: ["get-payable-products"],
    enabled: true,
  });

  const {
    isFetching: isFetchingStatusShipping,
    data: dataStatusShipping,
    isFetched: isFetchedStatusShipping,
    refetch: refetchStatusShipping,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/buyer/status/${params.transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data.data;
    },
    queryKey: ["get-status-transaction"],
    enabled: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const { mutate: payAction, isPending } = useMutation({
    mutationFn: async () => {
      let attempt = 0;
      let response;

      while (attempt < 2) {
        // Allow up to 2 attempts
        try {
          response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/transaction/buyer/${params.transactionId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          // If request is successful, break out of loop
          if (response.data.success) break;
        } catch (error) {
          // @ts-ignore
          if (attempt === 1 || error.response?.status !== 500) {
            // After 2 attempts or if it's not a 500 error, throw the error
            throw error;
          }
        }

        attempt++;
      }
      // @ts-ignore
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success("Payment is successful");
      window.location.reload();
    },
    onError: (error) => {
      toast.error("Payment not verified");
    },
  });

  const { mutate: sendAction, isPending: isPendingArrived } = useMutation({
    mutationFn: async () => {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/arrived`,
        {
          transaction_id: params.transactionId,
          store_id: dataStatusShipping?.carts_details[0]?.store_id,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success("Status transaction is changed to arrived");
      window.location.reload();
    },
    onError: (error) => {
      toast.error("Failed to update status");
    },
  });

  const {
    isFetching: isFetchingShipping,
    data: dataShipping,
    isFetched: isFetchedShipping,
    refetch: refetchShipping,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/costs/${params.transactionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data.data;
    },
    queryKey: ["get-shipping"],
    enabled: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const {
    isFetching: isUserFetching,
    data: dataUser,
    isFetched: isUserFetched,
    refetch: refetchUser,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data.data;
    },
    queryKey: ["get-user"],
    enabled: true,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (isFetched && !dataCheckout) {
    router.push("/");
  }

  if (
    isFetching ||
    isUserFetching ||
    isFetchingShipping ||
    isFetchingStatusShipping ||
    !isFetched ||
    !isUserFetched ||
    !isFetchedShipping ||
    !isFetchedStatusShipping
  ) {
    return <Loading />;
  }

  // Menghitung ongkir
  const totalFinalPrice = dataStatusShipping?.sub_total_transaction_price_before_shipping + dataStatusShipping.sub_total_shipping;

  return (
    <Container>
      <div className="mt-10">
        <div className="px-5">
          <div className="mb-2">
            <div
              onClick={() => router.push('/buyer/history')}
              className="focus:outline-none hover:underline text-gray-500 text-sm cursor-pointer"
            >
              <i className="mdi mdi-arrow-left text-gray-400"></i> Back
            </div>
          </div>
          <div className="mb-2">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-600">
              Checkout.
            </h1>
          </div>
        </div>

        <div className="w-full  border-t border-b border-gray-200 px-5 py-6 text-gray-800">
          <div className="w-full">
            <p className="mb-6 py-2 text-3xl font-bold text-green-700 border-4 border-green-700 border-dotted w-auto text-center">
              {
                ["UNCONFIRMED", null, undefined].includes(dataStatusShipping?.carts_details[0]?.arrival_shipping_status) ?
                  dataCheckout?.status :
                  dataStatusShipping?.carts_details[0]?.arrival_shipping_status
              }
            </p>
            <div className="items-start gap-8 xl:flex lg:flex md:flex">
              <div className="p-6 mb-10 bg-white border border-gray-200 rounded-md shadow-md md:w-7/12">
                <div className="w-full mx-auto text-gray-800 font-light mb-6 border-b border-gray-200 pb-6 space-y-4 ">
                  {dataCheckout?.cart_details.map((cart: any) => (
                    <CheckoutLIst
                      key={cart.id}
                      cart={cart}
                      order={dataCheckout}
                      cart_detail={dataStatusShipping?.carts_details[0]}
                    />
                  ))}
                </div>

                {/* total price */}
                <div className="mb-6 border-b border-gray-200 md:border-none text-gray-800 text-base">
                  {dataCheckout?.redirect_url == null ? (
                    null
                  ) :
                    (
                      <>
                        {dataStatusShipping?.carts_details.map((cartDetail: any, index: number) => (
                          <div key={index} className="mb-4">
                            <div className="w-full flex items-center">
                              <div className="flex-grow">
                                <span className="text-gray-600">Store {index + 1} Shipping</span>
                              </div>
                              <div className="pl-3">
                                <span className="font-semibold">
                                  {`${cartDetail?.shipping?.code
                                    ?.charAt(0)
                                    .toUpperCase() +
                                    cartDetail?.shipping?.code
                                      ?.slice(1)
                                      .toLowerCase()
                                    } (${cartDetail?.shipping?.service
                                    })`}
                                </span>
                              </div>
                            </div>
                            <div className="w-full flex items-center">
                              <div className="flex-grow">
                                <span className="text-gray-600">Estimation</span>
                              </div>
                              <div className="pl-3">
                                <span className="font-semibold">
                                  {`${cartDetail?.shipping?.estimation} days`}
                                </span>
                              </div>
                            </div>
                            <div className="w-full flex items-center">
                              <div className="flex-grow">
                                <span className="text-gray-600">Shipping cost</span>
                              </div>
                              <div className="pl-3">
                                <span className="font-semibold">
                                  {formatePrice(cartDetail?.shipping?.costs)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="w-full flex items-center">
                          <div className="flex-grow">
                            <span className="text-gray-600">Total Shipping</span>
                          </div>
                          <div className="pl-3">
                            <span className="font-semibold">
                              {formatePrice(dataStatusShipping?.sub_total_shipping)}
                            </span>
                          </div>
                        </div>

                        <div className="w-full flex items-center">
                          <div className="flex-grow">
                            <span className="text-gray-600">Total Before Shipping</span>
                          </div>
                          <div className="pl-3">
                            <span className="font-semibold">
                              {formatePrice(dataStatusShipping?.sub_total_transaction_price_before_shipping)}
                            </span>
                          </div>
                        </div>
                      </>
                    )
                  }

                  <div className="w-full flex items-center">
                    <div className="flex-grow">
                      <span className="text-gray-600">Total Order</span>
                    </div>
                    <div className="pl-3">
                      <span className="font-semibold">
                        {formatePrice(totalFinalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {dataCheckout?.redirect_url === null && dataCheckout.status === "PAYABLE" ? (
                  <Shipping
                    profile={dataUser.profile}
                    dataCheckout={dataCheckout}
                    shipping={dataShipping}
                  />
                ) : null}

                {dataCheckout?.redirect_url &&
                  dataCheckout.status != "SUCCESS" ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href={dataCheckout?.redirect_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center w-full mx-auto border border-transparent bg-green hover:bg-lime-950 bg-lime-900 focus:bg-lime-950 text-white rounded-md px-3 py-3 justify-center items-center flex font-semibold cursor-pointer"
                    >
                      Pay Now
                    </Link>
                    <Button
                      onClick={() => payAction()}
                      className="text-center w-full mx-auto border border-transparent bg-blue hover:bg-blue-600 bg-blue-500 focus:bg-blue-500 text-white rounded-md px-3 justify-center items-center flex font-semibold cursor-pointer py-6"
                      isLoading={isPending}
                    >
                      Check Status
                    </Button>
                  </div>
                ) : null}

                {dataCheckout.status == "SUCCESS" &&
                  dataStatusShipping?.carts_details[0]?.arrival_shipping_status ==
                  "SHIPPED" ? (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => sendAction()}
                      className="text-center w-full mx-auto border border-transparent bg-green hover:bg-green-600 bg-green-500 focus:bg-green-500 text-white rounded-md px-3 justify-center items-center flex font-semibold cursor-pointer py-6"
                      isLoading={isPendingArrived}
                    >
                      Update status to Arrived
                    </Button>
                  </div>
                ) : null}

                {dataCheckout.status == "SUCCESS" &&
                  dataStatusShipping?.carts_details[0]?.arrival_shipping_status !=
                  "SHIPPED" ? (
                  <p className="text-center w-full mx-auto border border-transparent bg-green hover:bg-gray-600 bg-gray-500 focus:bg-gray-600 text-white rounded-md px-3 py-3 justify-center items-center flex font-semibold ">
                    {dataStatusShipping?.carts_details[0]
                      ?.arrival_shipping_status == "PACKING"
                      ? "Waiting product sending by seller"
                      : "Product has arrived"}
                  </p>
                ) : null}
              </div>
              <Payment
                profile={dataUser.profile}
                dataCheckout={dataCheckout}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
