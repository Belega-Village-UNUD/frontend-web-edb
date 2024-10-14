"use client";
import ButtonConfirm from "@/components/button/ButtonConfirm";
import Loading from "@/components/Loading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePersistedUser } from "@/zustand/users";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { format } from "date-fns";
import {
  ArrowUpDown,
  Copy,
  Filter,
  MoreHorizontal,
  PencilIcon,
  Search,
  SquareX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type Bank = {
  id: string;
  store_id: string;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  display: boolean;
  createdAt: any;
};

const columns: ColumnDef<Bank>[] = [
  {
    id: "index",
    header: "No",
    cell: ({ row }) => (
      <div className="text-center font-semibold">{row.index + 1}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Name",
    enableHiding: false,
    accessorKey: "bank_name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex gap-[2px]">
        {row.original.bank_name}
        <Copy
          className="w-2 h-2 opacity-50 cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(row.original.bank_name);
            toast.success("Copied to clipboard!");
          }}
        />
      </div>
    ),
  },
  {
    id: "Bank Code",
    accessorKey: "bank_code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bank Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.original.bank_code}</div>
    ),
  },
  {
    id: "Account Number",
    accessorKey: "account_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        {row.original.account_number ? row.original.account_number : ""}
      </div>
    ),
  },
  {
    id: "Account Name",
    accessorKey: "account_name",
    header: () => <div className="text-center">Account Name</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.original.account_name}</div>;
    },
  },
  {
    id: "Order Date",
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Create Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {format(new Date(row.original.createdAt), "MMMM dd, yyyy")}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
  },
];

const BankListStore = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [activeDialog, setActiveDialog] = useState("");
  const router = useRouter();

  const [token, setToken] = useState<string>();

  const tokenFromStore = usePersistedUser.getState().token;
  useEffect(() => {
    if (!tokenFromStore) {
      // router.push("/");
    }
    setToken(tokenFromStore);
  }, [router, token, tokenFromStore]);

  const {
    isFetching,
    data: banks,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/bank`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data.data;
    },
    queryKey: ["get-seller-bank"],
    enabled: !!token,
  });

  const handleDeleteBank = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bank`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              store_bank_id: id,
            }),
          }
        );
        const responseJson = await response.json();
        // console.log(responseJson)
        if (responseJson.status === 200) {
          toast.success(responseJson.message);
          refetch();
          setActiveDialog("");
        } else {
          toast.error(responseJson.message);
          setActiveDialog("");
        }
      } catch (error: any) {
        // console.log(error.message)
      }
    },
    [refetch, token]
  );

  const table = useReactTable({
    data: banks || [],
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

  if (token === undefined) {
    return <Loading />;
  }

  if (isFetching && !isFetched) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      <div className="lg:-mx-8 lg:mb-4 lg:px-8 text-sm text-gray-400 breadcrumbs">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/store">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">My Bank</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mb-2 sm:flex sm:items-center justify-between">
        <div className="sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">My Bank</h1>
          <p className="text-sm text-gray-500">
            List of banks that you have in your store
          </p>
        </div>
        <div className="sm:flex-none">
          <ButtonConfirm
            label="Add Bank"
            onClick={() => router.push("/store/bank-account/new")}
          />
        </div>
      </div>

      <div className="flex items-center py-4">
        <div className="relative">
          <Search className="absolute top-3 left-0 ml-2 h-4 w-4 opacity-60" />
          <Input
            placeholder="Filter name..."
            value={(table.getColumn("Name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("Name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm pl-8"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Filter <Filter className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-white">
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === "actions" ? (
                        <Dialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-24">
                              <DropdownMenuItem
                                onClick={() => {
                                  router.push(
                                    `/store/bank-account/${row.original.id}`
                                  );
                                }}
                                className="cursor-pointer items-center"
                              >
                                <PencilIcon className="w-4 h-4 mr-2" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-500 cursor-pointer"
                                onClick={() => setActiveDialog("delete")}
                              >
                                <DialogTrigger className="w-full">
                                  <div className="flex items-center">
                                    <SquareX className="w-4 h-4 mr-2" />
                                    <span>Delete</span>
                                  </div>
                                </DialogTrigger>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          {activeDialog === "delete" && (
                            <DialogContent
                              className="sm:max-w-md"
                              accessKey="decline"
                            >
                              <DialogHeader>
                                <DialogTitle className="font-bold text-2xl text-red-600">
                                  Attention !
                                </DialogTitle>
                                <DialogDescription className="py-4 font-medium text-lg mb-8">
                                  Are you serious to delete bank?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <ButtonConfirm label="Cancel" outline />
                                </DialogClose>
                                <ButtonConfirm
                                  label="Delete"
                                  onClick={() =>
                                    handleDeleteBank(row.original.id)
                                  }
                                />
                              </DialogFooter>
                            </DialogContent>
                          )}
                        </Dialog>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing 1 to {table.getPaginationRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BankListStore;
