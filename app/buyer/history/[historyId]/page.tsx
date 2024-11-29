"use client";
import Loading from "@/components/Loading";
import { usePersistedUser } from "@/zustand/users";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

import Container from "@/components/Container";
import Invoice from "@/components/Invoice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";
import { FaDownload } from "react-icons/fa";

function Page({ params, searchParams }: any) {
  console.log('line 48: ', JSON.stringify(params));
  console.log('line 49: ', JSON.stringify(searchParams));
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
    data: dataInvoice,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/buyer/invoice?transaction_id=${params.historyId}&store_id=${searchParams.store_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data.data;
    },
    queryKey: ["get-invoice"],
    enabled: !token,
  });
  console.log('line 48: ', JSON.stringify(dataInvoice));

  const {
    isFetching: isFetchingOne,
    data: order,
    isFetched: isFetchedOne,
  } = useQuery({
    queryFn: async () => {
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
    isFetchingOne ||
    (isFetchingStatusShipping && !isFetched) ||
    !isFetchedOne ||
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
          className={`flex items-center justify-center rounded-md border px-2.5 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 space-x-3 border-green-700 bg-white text-green-700 hover:bg-gray-50 hover:text-green-800`}
        >
          <FaDownload />
          <span>Download Invoice</span>
        </button>
      </div>
      <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Invoice Details</h2>
        <Invoice
          ref={invoiceRef}
          invoiceId={dataInvoice.id}
          transactionId={dataInvoice.transaction_id}
          orderDate={order?.createdAt}
          from={{
            companyName: dataInvoice.store_name,
            email: dataInvoice.store_email,
            address: dataInvoice.store_address,
          }}
          to={{
            personName: dataInvoice.buyer_name,
            email: dataInvoice.buyer_email,
            address: dataInvoice.buyer_address
          }}
          items={dataInvoice.cart_detail}
          vat={10}
          tax={5}
          total={dataInvoice.total_price}
          paymentHistory={{
            date: "2024-07-26",
            amount: order?.total_amount,
            method: "Credit Card",
            cardDetails: "XXXX-XXXX-XXXX-1234",
          }}
          status={order?.status}
          buyerName={order?.cart_details[0]?.user?.userProfile?.name}
          imageUrl={order?.cart_details[0]?.product?.images[0]}
          shippingCost={dataInvoice.shipping_price}
          shippingMethod={dataInvoice.shipping_method}
        />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Thank you for your purchase!</p>
          <p className="text-sm text-gray-600">If you have any questions, please contact us.</p>
        </div>
      </div>
    </Container>
  );
}

export default Page;
