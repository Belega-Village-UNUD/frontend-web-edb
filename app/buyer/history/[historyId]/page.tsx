"use client";
import Loading from "@/components/Loading";
import { usePersistedUser } from "@/zustand/users";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Invoice from "@/components/Invoice";
import Container from "@/components/Container";
import { FaDownload } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface historyProps {
  params: {
    historyId: string;
  };
}

function Page({ params }: historyProps) {
  const [token, setToken] = useState<string>();
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
    data: order,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      // const token = getToken();
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/buyer/${params.historyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data.data;
    },
    queryKey: ["get-history-id-checkout"],
    enabled: !token,
  });

  const {
    isFetching: isFetchingStatusShipping,
    data: dataStatusShipping,
    isFetched: isFetchedStatusShipping,
    refetch: refetchStatusShipping,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/buyer/status/${params.historyId}`,
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
  });

  const invoiceRef = useRef<HTMLDivElement | null>(null);

  const downloadPDF = async () => {
    const input = invoiceRef.current;
    if (input) {
      try {
        const canvas = await html2canvas(input);
        const data = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("invoice.pdf");
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    } else {
      console.error("Invoice reference is null.");
    }
  };

  if (
    isFetching ||
    (isFetchingStatusShipping && !isFetched) ||
    !isFetchedStatusShipping
  ) {
    return <Loading />;
  }
  return (
    <Container>
      <div className="flex justify-center items-center my-4">
        <button
          onClick={() => {
            downloadPDF();
          }}
          className={`flex items-center justify-center rounded-md border px-2.5 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 space-x-3 ${
            order?.status === "SUCCESS"
              ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <FaDownload />
          <span>Download Invoice</span>
        </button>
      </div>
      <div className="flex flex-col items-center">
        {/* to do blm perbaiki payment history section pembayarna pake apa dll */}
        <Invoice
          totalPrice={order?.total_amount}
          ref={invoiceRef}
          invoiceId={order?.id}
          orderDate={order?.createdAt}
          paidDate={order?.updatedAt}
          from={{
            companyName: order?.cart_details[0]?.user?.userProfile?.name,
            country: "Bali",
            city: "Gianyar",
            postal: "10023",
            address: "123 Example St",
            phone: "123-456-7890",
            email: order?.cart_details[0]?.user?.email,
          }}
          to={{
            personName: order?.cart_details[0]?.product?.store?.name,
            country: "Bali",
            city: "Gianyar",
            postal: "90001 ",
            address: "456 Another St",
            phone: "987-654-3210",
            email: order?.cart_details[0]?.product?.store?.user?.email,
          }}
          items={order?.cart_details}
          vat={10}
          tax={5}
          total={order?.total_amount}
          paymentHistory={{
            date: "2024-07-26",
            amount: order?.total_amount,
            method: "Credit Card",
            cardDetails: "XXXX-XXXX-XXXX-1234",
          }}
          status={order?.status}
          buyerName={order?.cart_details[0]?.user?.userProfile?.name}
          imageUrl={order?.cart_details[0]?.product?.images[0]}
          shippingCost={dataStatusShipping?.carts_details[0]?.shipping?.costs}
        />
      </div>
    </Container>
  );
}

export default Page;
