import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import Link from "next/link";

import CurrencyText from "@/components/text/CurrencyText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <CurrencyText amount={totalAmount} />
              </div>
              {/* <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p> */}
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Product Sold
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{soldProductCount}</div>
              {/* <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p> */}
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cancelled Transaction
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cancelProductCount}</div>
              {/* <p className="text-xs text-muted-foreground">
                +19% from last month
              </p> */}
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingProductCount}</div>
              {/* <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p> */}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 grid-cols-2 xl:grid-cols-4">
          <Card
            className="xl:col-span-2 col-span-1 h-fit"
            x-chunk="dashboard-01-chunk-4"
          >
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  Recent transactions from your store.
                </CardDescription>
              </div>
              <div className="ml-auto gap-1 flex flex-row justify-center items-center">
                <Link href="#" className="flex flex-row items-center gap-1">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] ">
                <Table>
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
                                <div className="font-medium bg-black w-fit text-[11px] text-white rounded-2xl mb-1 py-1 px-2">
                                  {sale.status}
                                </div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
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
            className="xl:col-span-2 col-span-1 h-fit"
          >
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[650px] ">
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
                        <p className="text-sm font-medium leading-none">
                          {detail.product?.name_product}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {detail.product?.store?.name}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
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
