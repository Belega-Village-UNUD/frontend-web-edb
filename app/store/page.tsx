"use client";

import SideBar from "@/components/sidebar/SideBar";
import DashboardStore from "./DashboardStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePersistedUser } from "@/zustand/users";
import Loading from "@/components/Loading";

const StoreProductPage = () => {
  const router = useRouter();
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
    data: values,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data.data;
    },
    queryKey: ["get-report"],
    enabled: !!token,
  });

  const {
    isFetching: isFetchingReport,
    data: valuesReport,
    isFetched: isFetchedReport,
    refetch: refetchReport,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/seller/reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data.data;
    },
    queryKey: ["get-transactions"],
    enabled: !!token,
  });

  if (isFetching || isFetchingReport) {
    return <Loading />;
  }

  return (
    <>
      <SideBar main={<DashboardStore data={values} report={valuesReport} />} />
    </>
  );
};

export default StoreProductPage;
