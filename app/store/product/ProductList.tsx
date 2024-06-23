"use client"
import ButtonConfirm from "@/components/button/ButtonConfirm"
import CurrencyText from "@/components/text/CurrencyText"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  useReactTable
} from "@tanstack/react-table"
import { ArrowUpDown, Copy, Filter, MoreHorizontal, PencilIcon, Search, SquareX } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

type Product = {
  id: string
  name_product: string
  stock: number
  product_type: {
    name: string
  }
  price: number
  weight_gr: number
  is_preorder: boolean
}

type ApiResponse = {
  success: boolean
  message: string
  data: Product[]
}

const columns: ColumnDef<Product>[] = [
  {
    id: "index",
    header: "No",
    cell: ({ row }) => <div className="text-center font-semibold">{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Name",
    enableHiding: false,
    accessorKey: "name_product",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex gap-[2px]">{row.original.name_product}
        <Copy className="w-2 h-2 opacity-50 cursor-pointer" onClick={() => {
          navigator.clipboard.writeText(row.original.name_product)
          toast.success('Copied to clipboard!')
        }} />
      </div>
    ),
  },
  {
    id: "Stock",
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.original.stock}</div>
    ,
  },
  {
    id: "Product Type",
    accessorKey: "product_type.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="-px-2 font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.original.product_type ? row.original.product_type.name : ''}</div>,
  },
  {
    id: "Weight",
    accessorKey: "weight_gr",
    header: () => <div className="text-center">Weight (gr)</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.original.weight_gr}</div>
    },
  },
  {
    id: "Preorder",
    accessorKey: "is_preorder",
    header: "Preorder",
    cell: ({ row }) => <div className="text-center">{row.original.is_preorder ? 'Yes' : 'No'}</div>,
  },
  {
    id: "Price",
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.original.price.toString())

      return <div className="text-right font-medium"><CurrencyText amount={amount} /></div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
  },
]

const ProductListStore = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [products, setProducts] = useState<Product[]>([]);
  const [newEmail, setNewEmail] = useState("")
  const [activeDialog, setActiveDialog] = useState('');
  const router = useRouter()

  const getToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Please Login First');
      return null;
    }
    return token;
  }, []);

  const handleGetAllStoreProduct = useCallback(async () => {
    try {
      const token = getToken()
      if (!token) { return; }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/seller/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const responseJson: ApiResponse = await response.json();
      setProducts(responseJson.data)
    } catch (error: any) {
      console.log(error.message)
    }
  }, [getToken])

  useEffect(() => {
    handleGetAllStoreProduct()
  }, [handleGetAllStoreProduct])

  const handleDeleteProduct = useCallback(async (id: string) => {
    try {
      const token = getToken();
      if (!token) { return; }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/seller/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const responseJson = await response.json();
      console.log(responseJson)
      if (responseJson.status === 200) {
        toast.success(responseJson.message);
        handleGetAllStoreProduct();
        setActiveDialog('')
      } else {
        toast.error(responseJson.message)
        setActiveDialog('')
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }, [getToken, handleGetAllStoreProduct])

  const table = useReactTable({
    data: products,
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
  })

  return (
    <div className="w-full">
      <div className="lg:-mx-8 lg:mb-4 lg:px-8 text-sm text-gray-400 breadcrumbs">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link href={'/store'}>Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">My Product</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="lg:px-8 lg:mb-2 sm:flex sm:items-center">
        <div className="lg:-mx-8 sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">My Product</h1>
          <p className="text-sm text-gray-500">
            List of products that you have in your store
          </p>
        </div>
        <div className="sm:flex-none">
          <ButtonConfirm label="Add Product" onClick={() => router.push('/store/product/new')} />
          {/* <Link href={`/store/product/new`} className="flex items-center rounded-md bg-green-700 px-3 py-2 text-center text-base font-medium text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-greenbg-green-700">
            <div><PlusIcon className="w-5 h-5" /></div>
            <div className="pl-1">Add New Product</div>
          </Link> */}
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
                )
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
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === 'actions' ? (
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
                                  router.push(`/store/product/${row.original.id}`)
                                }}
                                className="cursor-pointer items-center"
                              >
                                <PencilIcon className="w-4 h-4 mr-2" />
                                <span>Detail</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => setActiveDialog('delete')}>
                                <DialogTrigger className="w-full">
                                  <div className="flex items-center">
                                    <SquareX className="w-4 h-4 mr-2" />
                                    <span>Delete</span>
                                  </div>
                                </DialogTrigger>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          {activeDialog === 'delete' && (
                            <DialogContent className="sm:max-w-md" accessKey="decline">
                              <DialogHeader>
                                <DialogTitle className="font-bold text-2xl text-red-600">Attention !</DialogTitle>
                                <DialogDescription className="py-4 font-medium text-lg mb-8">
                                  Are you serious to delete product?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <ButtonConfirm label='Cancel' outline />
                                </DialogClose>
                                <ButtonConfirm label='Delete' onClick={() => handleDeleteProduct(row.original.id)} />
                              </DialogFooter>
                            </DialogContent>
                          )}
                        </Dialog>
                      ) : (flexRender(cell.column.columnDef.cell, cell.getContext()
                      ))}
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
  )
}

export default ProductListStore;