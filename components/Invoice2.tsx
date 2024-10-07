import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";

const Invoice: React.FC<any> = ({
  invoiceId,
  issueDate,
  paidDate,
  dueDate,
  from,
  to,
  items,
  vat,
  tax,
  total,
  paymentHistory,
  buyerName,
}) => {
  const downloadPDF = async () => {
    const input = document.getElementById("invoice-content");
    if (input) {
      const canvas = await html2canvas(input);
      const data = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
    }
  };

  return (
    <div className="bg-gray-200 print:bg-white md:flex lg:flex xl:flex print:flex md:justify-center lg:justify-center xl:justify-center print:justify-center sf">
      <div className="lg:w-1/12 xl:w-1/4"></div>
      <div
        className="w-full bg-white lg:w-full xl:w-2/3 lg:mt-20 lg:mb-20 lg:shadow-xl xl:mt-2 xl:mb-20 xl:shadow-xl print:transform print:scale-90"
        id="invoice-content"
      >
        <header className="flex flex-col items-center px-8 pt-20 text-lg text-center bg-white border-t-8 border-green-700 md:block lg:block xl:block print:block md:items-start lg:items-start xl:items-start print:items-start md:text-left lg:text-left xl:text-left print:text-left print:pt-8 print:px-2 md:relative lg:relative xl:relative print:relative">
          <Image
            className="w-3/6 h-auto md:w-1/4 lg:ml-12 xl:ml-12 print:px-0 print:py-0"
            src="https://via.placeholder.com/200x100.png"
            alt="Company Logo"
            width={200}
            height={100}
          />
          <div className="flex flex-row mt-12 mb-2 ml-0 text-2xl font-bold md:text-3xl lg:text-4xl xl:text-4xl print:text-2xl lg:ml-12 xl:ml-12">
            INVOICE
            <div className="text-green-700">
              <span className="mr-4 text-sm">■ </span> #
            </div>
            <span id="invoice_id" className="text-gray-500">
              {invoiceId}
            </span>
          </div>
          <div className="flex flex-col lg:ml-12 xl:ml-12 print:text-sm">
            <span>Issue date: {issueDate}</span>
            <span>Paid date: {paidDate}</span>
            <span>Due date: {dueDate}</span>
          </div>
          <div className="px-8 py-2 mt-16 text-3xl font-bold text-green-700 border-4 border-green-700 border-dotted md:absolute md:right-0 md:top-0 md:mr-12 lg:absolute lg:right-0 lg:top-0 xl:absolute xl:right-0 xl:top-0 print:absolute print:right-0 print:top-0 lg:mr-20 xl:mr-20 print:mr-2 print:mt-8">
            PAID
          </div>
          <div className="flex flex-col m-12 text-center lg:m-12 md:flex-none md:text-left md:relative md:m-0 md:mt-16 lg:flex-none lg:text-left lg:relative xl:flex-none xl:text-left xl:relative print:flex-none print:text-left print:relative print:m-0 print:mt-6 print:text-sm">
            <span className="font-extrabold md:hidden lg:hidden xl:hidden print:hidden">
              FROM
            </span>
            <div className="flex flex-col">
              <span id="company-name" className="font-medium">
                {from.companyName}
              </span>

              <div className="flex-row">
                <span id="c-city">{from.city}</span>,
                <span id="c-postal">{from.postal}</span>
              </div>
              <span id="company-address">{from.address}</span>
              <span id="company-phone">{from.phone}</span>
              <span id="company-mail">{from.email}</span>
            </div>
            <span className="mt-12 font-extrabold md:hidden lg:hidden xl:hidden print:hidden">
              TO
            </span>
            <div className="flex flex-col md:absolute md:right-0 md:text-right lg:absolute lg:right-0 lg:text-right print:absolute print:right-0 print:text-right">
              <span id="person-name" className="font-medium">
                {to.personName}
              </span>

              <div className="flex-row">
                <span id="p-postal">{to.postal}</span>
                <span id="p-city">{to.city}</span>,
              </div>
              <span id="person-address">{to.address}</span>
              <span id="person-phone">{to.phone}</span>
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
              {items.map((item: any, index: any) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0 ? "" : "bg-gray-100 print:bg-gray-100"
                  }
                >
                  <td className="px-4 py-2 border">{item.description}</td>
                  <td className="px-4 py-2 text-right border tabular-nums slashed-zero">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-2 text-right border tabular-nums slashed-zero">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right border tabular-nums slashed-zero">
                    ${item.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="text-white bg-gray-700 print:bg-gray-300 print:text-black">
                <td className="invisible"></td>
                <td className="invisible"></td>
                <td className="px-4 py-2 text-right border">VAT</td>
                <td className="px-4 py-2 text-right border tabular-nums slashed-zero">
                  {vat}%
                </td>
              </tr>
              <tr className="text-white bg-gray-700 print:bg-gray-300 print:text-black">
                <td className="invisible"></td>
                <td className="invisible"></td>
                <td className="px-4 py-2 text-right border">TAX</td>
                <td className="px-4 py-2 text-right border tabular-nums slashed-zero">
                  ${tax.toFixed(2)}
                </td>
              </tr>
              <tr className="text-white bg-gray-700 print:bg-gray-300 print:text-black">
                <td className="invisible"></td>
                <td className="invisible"></td>
                <td className="px-4 py-2 font-extrabold text-right border">
                  Total
                </td>
                <td className="px-4 py-2 text-right border tabular-nums slashed-zero">
                  ${total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-20 mb-20 print:mb-2 print:mt-2">
          <h2 className="text-xl font-semibold text-center print:text-sm">
            Payment History
          </h2>
          <div className="flex flex-col items-center text-center print:text-sm">
            <p className="font-medium">
              {paymentHistory.date}{" "}
              <span className="font-light">
                {/* <CardIcon /> Credit Card Payment: $ */}
                {paymentHistory.amount.toFixed(2)} ({paymentHistory.cardDetails}
                )
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center mb-24 leading-relaxed print:mt-0 print:mb-0">
          <span className="w-64 text-4xl text-center text-black border-b-2 border-black border-dotted opacity-75 sign print:text-lg">
            {buyerName}
          </span>
          <span className="text-center">Buyer</span>
        </div>
        <footer className="flex flex-col items-center justify-center pb-20 leading-loose text-white bg-gray-700 print:bg-white print:pb-0">
          <span className="mt-4 text-xs print:mt-0">
            Invoice generated on {issueDate}
          </span>
          <span className="mt-4 text-base print:text-xs">
            © 2020 BroHosting. All rights reserved.
          </span>
          <span className="print:text-xs">
            US - New York, NY 10023 98-2 W 67th St
          </span>
        </footer>
      </div>
      <div className="lg:w-1/12 xl:w-1/4"></div>
      <button
        onClick={downloadPDF}
        className="mt-8 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Download PDF
      </button>
    </div>
  );
};

export default Invoice;
