import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import Link from "next/link";

import CurrencyText from "@/components/text/CurrencyText";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/utils";

const DashboardStore = ({ data, report }: any) => {
  const getTotalAmount = (data: any) => {
    return data.reduce((total: any, item: any) => {
      if (item.status === "SUCCESS") {
        return total + item.total_amount;
      }
      return total;
    }, 0);
  };

  const getSoldProductCount = (data: any) => {
    return data.reduce((count: any, item: any) => {
      if (item.status === "SUCCESS") {
        return (
          count +
          item.cart_details.reduce(
            (sum: any, detail: any) => sum + detail.qty,
            0
          )
        );
      }
      return count;
    }, 0);
  };

  const getCancelProductCount = (data: any) => {
    return data.reduce((count: any, item: any) => {
      if (item.status === "CANCEL") {
        return (
          count +
          item.cart_details.reduce(
            (sum: any, detail: any) => sum + detail.qty,
            0
          )
        );
      }
      return count;
    }, 0);
  };

  const getPendingProductCount = (data: any) => {
    return data.reduce((count: any, item: any) => {
      if (item.status === "PENDING") {
        return (
          count +
          item.cart_details.reduce(
            (sum: any, detail: any) => sum + detail.qty,
            0
          )
        );
      }
      return count;
    }, 0);
  };

  const totalAmount = report?.total_income || 0;
  const soldProductCount = getSoldProductCount(data || []);
  const cancelProductCount = getCancelProductCount(data || []);
  const pendingProductCount = getPendingProductCount(data || []);

  const cardData = [
    {
      title: "Total Income",
      amount: <CurrencyText amount={totalAmount} />,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Product Sold",
      amount: soldProductCount,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Cancelled Transaction",
      amount: cancelProductCount,
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Pending",
      amount: pendingProductCount,
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
          {cardData.map((card, index) => (
            <Card key={`dashboard-01-chunk-${index}`} className="shadow-lg rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-800">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{card.amount}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-8 grid-cols-2 xl:grid-cols-4 md:grid-cols-1 sm:grid-cols-1">
          <Card
            className="xl:col-span-2 col-span-1 h-fit shadow-lg rounded-lg"
            x-chunk="dashboard-01-chunk-4"
          >
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle className="text-lg font-semibold text-gray-800">Transactions</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Recent transactions from your store.
                </CardDescription>
              </div>
              <div className="ml-auto gap-1 flex flex-row justify-center items-center">
                <Link href="/store/transaction" className="flex flex-row items-center gap-1 text-green-700 hover:text-green-500">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] overflow-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden xl:table-column">
                        Type
                      </TableHead>
                      <TableHead className="hidden xl:table-column">
                        Status
                      </TableHead>
                      <TableHead className="hidden xl:table-column">
                        Date
                      </TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data
                      ?.filter((sale: any) => sale.status !== null) // Filter hanya penjualan yang sukses
                      .sort(
                        (a: any, b: any) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      ) // Urutkan dari terbaru
                      .flatMap((sale: any, saleIndex: number) =>
                        sale.cart_details.map(
                          (detail: any, detailIndex: number) => (
                            <TableRow key={`${saleIndex}-${detailIndex}`}>
                              <TableCell>
                                <div className={`font-medium w-fit text-xs text-white rounded-2xl mb-1 py-1 px-2 ${sale.status === "PAYABLE" ? "bg-blue-500" : sale.status === "PENDING" ? "bg-yellow-500" : sale.status === "SUCCESS" ? "bg-green-500" : "bg-red-500"}`}>
                                  {sale.status}
                                </div>
                                <div className="hidden text-sm text-gray-600 md:inline">
                                  {sale?.user?.email}
                                </div>
                              </TableCell>
                              <TableCell className="hidden xl:table-column">
                                {detail.product.is_preorder
                                  ? "Preorder"
                                  : "Sale"}
                              </TableCell>
                              <TableCell className="hidden xl:table-column">
                                <Badge className="text-xs" variant="outline">
                                  {sale.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                                {new Date(sale.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatRupiah(detail.unit_price * detail.qty)}
                              </TableCell>
                            </TableRow>
                          )
                        )
                      )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card
            x-chunk="dashboard-01-chunk-5"
            className="xl:col-span-2 col-span-1 h-fit shadow-lg rounded-lg"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Recent Sales</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[650px] overflow-auto">
              <CardContent className="grid gap-8">
                {data
                  ?.filter((sale: any) => sale.status === "SUCCESS") // Filter hanya penjualan yang sukses
                  .sort(
                    (a: any, b: any) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  ) // Urutkan dari terbaru
                  .flatMap((sale: any) => sale.cart_details) // Ambil detail produk dari setiap penjualan
                  .map((detail: any, index: number) => (
                    <div key={index} className="flex items-center gap-4">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage
                          src={
                            detail?.product?.images[0] || "/avatars/default.png"
                          }
                          alt="Avatar"
                        />
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none text-gray-800">
                          {detail.product?.name_product}
                        </p>
                        <p className="text-xs text-gray-600">
                          {detail.product?.store?.name}
                        </p>
                      </div>
                      <div className="ml-auto font-medium text-gray-900">
                        +{formatRupiah(detail.unit_price * detail.qty)}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardStore;
