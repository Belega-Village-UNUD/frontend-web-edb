import { FileUploader } from "@/components/form/FileUploader";
import Loading from "@/components/Loading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { urlToBlobFile } from "@/lib/utils";
import { usePersistedUser } from "@/zustand/users";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const DetailsBank = () => {
  const { register, handleSubmit, setValue } = useForm<FieldValues>();

  const router = useRouter();
  const pathname = usePathname();
  const idBank = pathname.split("/").pop();

  const [token] = usePersistedUser((state) => [state.token]);

  const handleGetOneBank = useCallback(async () => {
    try {
      if (!token) {
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bank?store_bank_id=${idBank}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const responseJson = await response.json();
      if (responseJson.status === 200) {
        setValue("bankCode", responseJson.data.bank_code);
        setValue("accountName", responseJson.data.account_name);
        setValue("accountNumber", responseJson.data.account_number);
      } else {
        console.error(responseJson.message);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }, [idBank, setValue]);

  useEffect(() => {
    handleGetOneBank();
  }, [handleGetOneBank]);

  const {
    isFetching: isFetchingType,
    data: bank,
    isFetched: isFetchedType,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/bank/listbank`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data.data;
    },
    queryKey: ["get-type-bank"],
    enabled: true,
  });

  const handleUpdateBank: SubmitHandler<FieldValues> = useCallback(
    async (data: any) => {
      const selectedBank: any = bank.find(
        (item: any) => item.code === data.bankCode
      );
      const bankName = selectedBank ? selectedBank.name : null;

      if (!bankName || !data.accountName || !data.accountNumber) {
        toast.error("Fill all required data");
        return;
      }

      try {
        if (!token) {
          return;
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bank`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              store_bank_id: idBank,
              bank_name: bankName,
              bank_code: data.bankCode,
              account_name: data.accountName,
              account_number: data.accountNumber,
            }),
          }
        );

        const responseJson = await response.json();

        if (responseJson.status === 200) {
          toast.success(responseJson.message);
          router.push("/store/bank-account");
        } else {
          toast.error(responseJson.message);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    },
    [bank, token, router]
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
              <BreadcrumbLink href={"/store/bank"}>My Bank</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">
                Edit Bank
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="lg:-mx-8 lg:mb-2 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">
            Update Bank
          </h1>
          <p className="text-sm text-gray-500">
            Update a bank to be sold in your store
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <form onSubmit={handleSubmit(handleUpdateBank)}>
            <div className="md:p-6 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
              <h3 className="text-base font-semibold">Information Bank</h3>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="bank-name"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  Bank Name
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <select
                    {...register("bankCode")}
                    className="bg-white block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="">Select bank</option>
                    {bank?.map((item: any, index: number) => (
                      <option key={index} value={item.code}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-12 sm:space-y-16">
                <div className="mt-5 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="accountName"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Account Name
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        id="accountName"
                        autoComplete="accountName"
                        {...register("accountName")}
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xl sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="accountNumber"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Account Number
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <input
                        type="number"
                        {...register("accountNumber", { valueAsNumber: true })}
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
                    Confirm Bank
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

export default DetailsBank;
