import { format } from "date-fns";

export function formatNumberWithDot(number: number): string {
  let numStr = number.toString();
  let [integerPart, decimalPart] = numStr.split(".");
  let formattedIntPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decimalPart ? formattedIntPart + "," + decimalPart : formattedIntPart;
}

export function formatReadableDate(date: string | Date): string {
  const parsedDate = new Date(date);
  return format(parsedDate, "dd MMMM yyyy");
}

export function formatRupiah(number: number | null | undefined) {
  if (number === null || number === undefined) {
    return "-";
  }

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  return formatter.format(number);
}
