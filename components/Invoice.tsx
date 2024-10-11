import { formatRupiah } from "@/lib/utils";
import { formatReadableDate } from "@/utils/utils";
import { forwardRef } from "react";
import CurrencyText from "./text/CurrencyText";

// Define the interfaces for the props
interface Item {
  qty: number;
  unit_price: number;
  product: {
    name_product: string;
  };
}

interface InvoiceProps {
  totalPrice: number;
  invoiceId: string;
  orderDate: string;
  paidDate: string;
  status: string;
  from: {
    companyName: string;
    country: string;
    city: string;
    postal: string;
    address: string;
    phone: string;
    email: string;
  };
  to: {
    personName: string;
    country: string;
    city: string;
    postal: string;
    address: string;
    phone: string;
    email: string;
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
}

const Invoice = forwardRef<HTMLDivElement, InvoiceProps>(
  (
    {
      invoiceId,
      orderDate,
      paidDate,
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
    },
    ref
  ) => {
    return (
      <div
        className="w-full bg-white lg:w-full xl:w-2/3 lg:mt-20 lg:mb-20 lg:shadow-xl xl:mt-2 xl:mb-20 xl:shadow-xl "
        id="invoice-content"
        ref={ref}
      >
        <header className="flex flex-col items-center px-8 pt-20 text-lg text-center bg-white border-t-8 border-green-700 md:block lg:block xl:block print:block md:items-start lg:items-start xl:items-start print:items-start md:text-left lg:text-left xl:text-left print:text-left print:pt-8 print:px-2 md:relative lg:relative xl:relative print:relative">
          <div className="flex flex-row mb-2 ml-0 text-2xl font-bold md:text-3xl lg:text-4xl xl:text-4xl print:text-2xl lg:ml-12 xl:ml-12 mt-10">
            INVOICE
            <div className="text-green-700">
              <span className="mr-4 text-sm">■ </span> #
            </div>
            <span id="invoice_id" className="text-gray-500">
              {invoiceId}
            </span>
          </div>
          <div className="flex flex-col lg:ml-12 xl:ml-12 print:text-sm">
            <span>Order date: {formatReadableDate(orderDate)}</span>
            <span>Paid date: {formatReadableDate(paidDate)}</span>
          </div>
          <div className="px-8 py-2 mt-16 text-3xl font-bold text-green-700 border-4 border-green-700 border-dotted md:absolute md:right-0 md:top-0 md:mr-12 lg:absolute lg:right-0 lg:top-0 xl:absolute xl:right-0 xl:top-0 print:absolute print:right-0 print:top-0 lg:mr-20 xl:mr-12 print:mr-2 print:mt-8 whitespace-nowrap">
            PAID
          </div>
          <div className="flex flex-col m-12 text-center lg:m-12 md:flex-none md:text-left md:relative md:m-0 md:mt-16 lg:flex-none lg:text-left lg:relative xl:flex-none xl:text-left xl:relative print:flex-none print:text-left print:relative print:m-0 print:mt-6 print:text-sm">
            <span className="font-extrabold">FROM</span>
            <div className="flex flex-col">
              <span id="company-name" className="font-medium">
                {from.companyName}
              </span>
              <span id="company-mail">{from.email}</span>
            </div>
            <div className="flex flex-col md:absolute md:right-0 md:text-right lg:absolute lg:right-0 lg:text-right print:absolute print:right-0 print:text-right">
              <span className="font-extrabold">TO</span>
              <span id="person-name" className="font-medium">
                {to.personName}
              </span>
              <div className="flex-row">
                <span id="p-city">{to.city}</span>,
                <span id="p-postal"> Bali</span>
              </div>
              <span id="person-mail">{to.email}</span>
            </div>
          </div>
        </header>
        <hr className="border-gray-300 md:mt-8 print:hidden" />
        <div
          id="content"
          className="flex justify-center md:p-8 lg:p-20 xl:p-20 print:p-2"
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
                      amount={item?.unit_price}
                      className="text-center py-20 text-sm font-medium text-slate-700"
                    />
                  </td>
                  <td className="px-4 py-2 text-right border tabular-nums slashed-zero">
                    <CurrencyText
                      amount={item?.unit_price * item?.qty}
                      className="text-center py-20 text-sm font-medium text-slate-700"
                    />
                  </td>
                </tr>
              ))}
              <tr className="">
                <td className="invisible"></td>
                <td className="invisible"></td>
                <td className="px-4 py-2 text-right border">Shipping</td>
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
        <footer className="flex flex-col justify-between px-8 py-4 mt-4 text-center bg-white border-t-2 border-black-700 lg:flex-row lg:px-20 xl:px-20 md:flex-row md:px-20 md:py-8 md:mt-4 print:px-2 print:text-sm">
          <div className="flex flex-col">
            <span className="text-lg font-extrabold lg:text-xl xl:text-2xl">
              B-Commerce
            </span>
          </div>
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
