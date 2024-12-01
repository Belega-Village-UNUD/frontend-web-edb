import { formatRupiah } from "@/lib/utils";
import { formatReadableDate } from "@/utils/utils";
import { forwardRef } from "react";
import CurrencyText from "./text/CurrencyText";

interface Item {
  qty: number;
  product: {
    name_product: string;
    price: number;
  };
}

interface InvoiceProps {
  invoiceId: string;
  transactionId: string;
  orderDate: string;
  status: string;
  from: {
    companyName: string;
    email: string;
    address: string;
  };
  to: {
    personName: string;
    email: string;
    address: string;
  };
  items: Item[];
  vat: number;
  tax: number;
  total: number;
  paymentHistory: {
    date: string;
    amount: number;
    method: string;
    cardDetails: string;
  };
  buyerName: string;
  imageUrl?: string;
  shippingCost?: number;
  shippingMethod: string;
}

const Invoice = forwardRef<HTMLDivElement, InvoiceProps>(
  (
    {
      invoiceId,
      transactionId,
      orderDate,
      from,
      to,
      items,
      vat,
      tax,
      status,
      total,
      paymentHistory,
      buyerName,
      imageUrl,
      shippingCost,
      shippingMethod,
    },
    ref
  ) => {
    return (
      <div
        className="w-full bg-white lg:w-full xl:w-2/3 lg:mt-20 lg:mb-20 lg:shadow-xl xl:mt-2 xl:mb-20 xl:shadow-xl "
        id="invoice-content"
        ref={ref}
      >
        <header className="flex flex-col items-center px-8 pt-14 text-lg text-center bg-white border-t-8 border-green-700 md:block lg:block xl:block print:block md:items-start lg:items-start xl:items-start print:items-start md:text-left lg:text-left xl:text-left print:text-left print:pt-8 print:px-2 md:relative lg:relative xl:relative print:relative">

          <div className="logo-container flex justify-center items-center text-4xl font-black">
            Belega Commerce
          </div>
          <div className="flex flex-row justify-between mb-2 ml-0 font-bold lg:ml-12 xl:ml-12 mt-14">
            <div className="text-2xl">
              INVOICE
              <span className="text-green-700 mr-4 text-sm">■ </span>
            </div>
            <span id="invoice_id" className="text-gray-500 text-2xl">
              <span className="text-green-700"># </span>{invoiceId}
            </span>
          </div>
          <div className="flex flex-row justify-between mb-2 ml-0 mt-4 font-bold lg:ml-12 xl:ml-12">
            <div className="text-2xl">
              TRANSACTION
              <span className="mr-4 text-sm text-green-700">■ </span>
            </div>
            <span id="transaction_id" className="text-gray-500 text-2xl">
              <span className="text-green-700"># </span>{transactionId}
            </span>
          </div>
          <div className="flex flex-col lg:ml-12 xl:ml-12 print:text-sm text-sm text-gray-400">
            <span>Order date: {formatReadableDate(orderDate)}</span>
          </div>
          <div className="m-12 text-center lg:m-12 md:flex-none md:text-left md:relative md:m-0 md:mt-2 lg:flex-none lg:text-left lg:relative xl:flex-none xl:text-left xl:relative print:flex-none print:text-left print:relative print:m-0 text-sm text-gray-500">
            <span className="font-extrabold text-green-700">FROM</span>
            <div className="flex flex-col pb-4">
              <span id="company-name" className="font-medium">
                {from.companyName}
              </span>
              <span id="company-mail">{from.email}</span>
              <span id="company-address">{from.address}</span>
            </div>
            <span className="font-extrabold text-green-700">TO</span>
            <div className="flex flex-col">
              <span id="person-name" className="font-medium">
                {to.personName}
              </span>
              <span id="person-mail">{to.email}</span>
              <span id="person-address">{to.address}</span>
            </div>
          </div>
        </header>
        <hr className="border-gray-300 md:mt-8 print:hidden" />
        <div
          id="content"
          className="flex justify-center p-8"
        >
          <table
            className="w-full text-left table-auto print:text-sm"
            id="table-items"
          >
            <thead>
              <tr className="text-white bg-gray-700 print:bg-gray-300 print:text-black">
                <th className="px-4 py-2">Item</th>
                <th className="px-4 py-2 text-right">Qty</th>
                <th className="px-4 py-2 text-right">Unit Price</th>
                <th className="px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0 ? "" : "bg-gray-100 print:bg-gray-100"
                  }
                >
                  <td className="px-4 py-2 border">
                    {item?.product?.name_product}
                  </td>
                  <td className="px-4 py-2 text-right border tabular-nums slashed-zero">
                    {item?.qty}
                  </td>
                  <td className="px-4 py-2 text-right border tabular-nums slashed-zero">
                    <CurrencyText
                      amount={item?.product?.price}
                      className="text-center py-20 text-sm font-medium text-slate-700"
                    />
                  </td>
                  <td className="px-4 py-2 text-right border tabular-nums slashed-zero">
                    <CurrencyText
                      amount={item?.product?.price * item?.qty}
                      className="text-center py-20 text-sm font-medium text-slate-700"
                    />
                  </td>
                </tr>
              ))}
              <tr className="">
                <td className="invisible"></td>
                <td className="invisible"></td>
                <td className="px-4 py-2 text-right border">{shippingMethod}</td>
                <td className="px-4 py-2 text-right border tabular-nums slashed-zero">
                  {formatRupiah(shippingCost)}
                </td>
              </tr>
              <tr className="text-white bg-gray-700 print:bg-gray-300 print:text-black">
                <td className="invisible"></td>
                <td className="invisible"></td>
                <td className="px-4 py-2 font-extrabold text-right border">
                  Total
                </td>
                <td className="px-4 py-2 text-right border tabular-nums slashed-zero">
                  {formatRupiah(total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <footer className="flex flex-col justify-center px-8 py-4 text-center bg-white border-t-2 border-black-700 lg:flex-row lg:px-20 xl:px-20 md:flex-row md:px-20 md:py-8 md:mt-4 print:px-2 print:text-sm">
          <div className="flex flex-col mt-4 lg:mt-0 xl:mt-0 md:mt-0 justify-center">
            <span className="text-lg font-extrabold lg:text-xl xl:text-2xl">
              Thank you for your purchase!
            </span>
          </div>
        </footer>
      </div>
    );
  }
);

Invoice.displayName = "Invoice";

export default Invoice;
