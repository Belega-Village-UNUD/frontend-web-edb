import Loading from "@/components/Loading";
import CurrencyText from "@/components/text/CurrencyText";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePersistedUser } from "@/zustand/users";
import { Button } from "@headlessui/react";
import { useMutation } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import axios from "axios";
import {
  Banknote,
  CodeXml,
  FileBarChart,
  MapPin,
  Truck,
  Wallet
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type Transaction = {
  id: string;
  product: {
    name_product: string;
    price: number;
  };
  qty: number;
  cart_details?: any;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: Transaction;
};

const columns: ColumnDef<Transaction>[] = [
  {
    id: "index",
    header: () => <div className="text-center">No.</div>,
    cell: ({ row }) => (
      <div className="text-center font-semibold">{row.index + 1}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Product",
    enableHiding: false,
    accessorKey: "id",
    header: () => <div className="text-left">Product</div>,
    cell: ({ row }) => <div>{row.original.product.name_product}</div>,
  },
  {
    id: "Unit Price",
    accessorKey: "product.price",
    header: () => <div className="text-right">Unit Price</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <CurrencyText amount={row.original.product.price} />
      </div>
    ),
  },
  {
    id: "Quantity",
    accessorKey: "qty",
    header: () => <div className="text-right">Quantity</div>,
    cell: ({ row }) => <div className="text-right">{row.original.qty}</div>,
  },
  {
    id: "Subtotal",
    accessorKey: "weight_gr",
    header: () => <div className="text-right">Subtotal</div>,
    cell: ({ row }) => {
      const subTotal = row.original.product.price * row.original.qty;
      return (
        <div className="text-right">
          <CurrencyText amount={subTotal} />
        </div>
      );
    },
  },
];

const DetailsTransaction = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [detail, setDetail] = useState<any>({});
  const [loading, setLoading] = useState<any>({});
  const [cartDetails, setCartDetails] = useState<any>([]);

  const pathname = usePathname();
  const idTransaction = pathname.split("/").pop();

  const [token] = usePersistedUser((state) => [state.token]);

  const getToken = useCallback(() => {
    if (!token) {
      console.error("Please Login First");
      return null;
    }
    return token;
  }, [token]);

  // const {
  //   isFetching: isFetchingStatusShipping,
  //   data: dataStatusShipping,
  //   isFetched: isFetchedStatusShipping,
  //   refetch: refetchStatusShipping,
  // } = useQuery({
  //   queryFn: async () => {
  //     const { data } = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_URL}/transaction/buyer/status/${idTransaction}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     return data.data;
  //   },
  //   queryKey: ["get-status-transaction"],
  //   enabled: true,
  // });

  const { mutate: sendAction, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/shipping/seller/send`,
        { transaction_id: idTransaction },

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success("Status successfuly updated");
      window.location.reload();
    },
    onError: (error) => {
      toast.error("Failed to update status");
    },
  });

  const handleGetOneTransaction = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/${idTransaction}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const responseJson: ApiResponse = await response.json();
      // console.log(responseJson)
      if (responseJson.success === true) {
        setDetail(responseJson.data);
        setCartDetails(responseJson.data.cart_details);
        setLoading(false);
      } else {
        console.error(responseJson.message);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }, [getToken, idTransaction]);

  useEffect(() => {
    handleGetOneTransaction();
  }, [handleGetOneTransaction]);

  console.log(detail);

  const table = useReactTable({
    data: cartDetails || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (loading) {
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
              <BreadcrumbLink href={"/store/transaction"}>
                My Transaction
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">
                Detail Transaction
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="lg:-mx-8 lg:mb-2 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">
            Detail Transaction
          </h1>
          <p className="text-sm text-gray-500">
            Detail of transaction with ID{" "}
            <span className="text-lime-600">{idTransaction}</span>
          </p>
        </div>
      </div>
      <div className="mt-8 lg:-mx-8 sm:-mx-6">
        <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
          <div className="pb-4">
            <div className="flex items-center gap-4 pb-1">
              <FileBarChart className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Order Status</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              {detail?.status !== "SUCCESS" && (
                <p className="opacity-70">{detail.status}</p>
              )}
              {detail?.status === "SUCCESS" && (
                <>
                  <p>{cartDetails[0]?.arrival_shipping_status}</p>
                  {cartDetails[0]?.arrival_shipping_status === "PACKING" && (
                    <Button
                      onClick={() => sendAction()}
                      className="text-center text-white py-1 px-2 bg-lime-700 hover:bg-lime-800 rounded-lg text-xs"
                    >
                      Update status to sending
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="pb-4">
            <div className="flex items-center gap-4 pb-1">
              <MapPin className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Destionation Address</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">
                {detail?.cart_details[0]?.user?.userProfile?.address},{" "}
                {detail?.cart_details[0]?.user?.userProfile?.city?.city_name},{" "}
                {detail?.cart_details[0]?.user?.userProfile?.province?.province}
                ,{" "}
                {`(${detail?.cart_details[0]?.user?.userProfile?.city?.postal_code})`}
              </p>
            </div>
          </div>
          <div className="pb-4">
            <div className="flex items-center gap-4 pb-1">
              <CodeXml className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Order ID</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p className="opacity-70">{detail.id}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-4 pb-1">
              <Truck className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Shipping Information</span>
            </div>
            <div className="flex gap-4">
              <p className="w-4 h-4"></p>
              <p>{detail?.cart_details[0]?.shipping_method}</p>
            </div>
          </div>
        </div>
        <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
          <div className="flex items-center gap-4">
            {/* <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
            </Avatar> */}
            {cartDetails.length > 0 && (
              <div>
                <p className="font-semibold">
                  {cartDetails[0].user.userProfile.name}
                </p>
                <p className="text-sm opacity-60">
                  {cartDetails[0].user.email}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
          <div className="pb-4">
            <div className="flex items-center gap-4 pb-1">
              <Banknote className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Payment Information</span>
            </div>
            <div>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} className="font-semibold">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table?.getRowModel()?.rows?.length ? (
                    table?.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        {/* shipping */}
        {/* <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
          <div className="flex items-center gap-4">
            {cartDetails.length > 0 && (
              <div>
                <p className="font-semibold">
                  S
                </p>
                <p className="text-sm opacity-60">
                  {cartDetails[0].user.email}
                </p>
              </div>
            )}
          </div>
        </div> */}
        <div className="p-5 mb-4 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
          <div className="flex items-center gap-4 pb-1 justify-between">
            <div className="flex items-center gap-4">
              <Wallet className="w-4 h-4 text-lime-600" />
              <span className="font-semibold">Final Amount</span>
            </div>
            <p className="font-semibold text-xl text-lime-700">
              <CurrencyText
                amount={cartDetails.reduce(
                  (acc: number, item: any) =>
                    acc + item.product.price * item.qty,
                  0
                )}
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsTransaction;
