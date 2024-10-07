import Loading from "@/components/Loading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePersistedUser } from "@/zustand/users";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const NewPayoutListStore = () => {
  const { register, handleSubmit } = useForm<FieldValues>();
  const router = useRouter();

  const [token] = usePersistedUser((state) => [state.token]);

  const getToken = useCallback(() => {
    if (!token) {
      console.error("Please Login First");
      return null;
    }
    return token;
  }, [token]);

  const {
    isFetching: isFetchingType,
    data: bank,
    isFetched: isFetchedType,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/bank`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data.data;
    },
    queryKey: ["get-bank"],
    enabled: true,
  });

  const handleCreateNewPayout: SubmitHandler<any> = useCallback(
    async (data: any) => {
      if (!data.bankAccount || !data.amount) {
        toast.error("Fill all required data");
        return;
      }

      try {
        if (!token) {
          return;
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payout`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              store_bank_id: data.bankAccount,
              amount: data.amount,
            }),
          }
        );

        const responseJson = await response.json();

        if (responseJson.status === 200) {
          toast.success(responseJson.message);
          router.push("/store/payout");
        } else {
          toast.error(responseJson.message);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    },
    [token, router]
  );

  if (isFetchingType && !isFetchedType) {
    return <Loading />;
  }

  return (
    <div className="lg:px-8 sm:px-6">
      <div className="lg:-mx-8 lg:mb-4 text-sm text-gray-400 breadcrumbs">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={"/store"}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={"/store/payout"}>My Payout</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">
                Request Payout
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="lg:-mx-8 lg:mb-2 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">
            Create New Payout
          </h1>
          <p className="text-sm text-gray-500">Create a new request payout</p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <form onSubmit={handleSubmit(handleCreateNewPayout)}>
            <div className="md:p-6 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
              <h3 className="text-base font-semibold">Information Payout</h3>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="bankAccount"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Bank Account
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <select
                    {...register("bankAccount")}
                    className="bg-white block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="">Select payout</option>
                    {bank?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.bank_name} - {item.account_number} -{" "}
                        {item.account_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-12 sm:space-y-16">
                <div className="mt-5 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Amount
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <input
                        type="number"
                        {...register("amount", { valueAsNumber: true })}
                        className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lime-800 sm:text-sm sm:leading-6"
                        aria-describedby="weight"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-x-6">
                  <button
                    type="button"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md bg-lime-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-800"
                  >
                    Confirm Payout
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPayoutListStore;
