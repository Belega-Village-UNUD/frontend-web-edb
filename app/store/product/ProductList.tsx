import ButtonConfirm from "@/components/button/ButtonConfirm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { formatePrice } from "@/utils/formatPrice";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

// type ProductListStoreType = {
//   id: string,
//   name_product: string,
//   stock: number,
//   price: string,
//   type_id: string,
//   image_product: string,
// }

const ProductListStore = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const router = useRouter();

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

      const responseJson = await response.json();
      console.log(responseJson.data)
      setProducts(responseJson.data)
    } catch (error: any) {
      console.log(error.message)
    }
  }, [getToken])

  useEffect(() => {
    handleGetAllStoreProduct()
    const interval = setInterval(() => {
      handleGetAllStoreProduct()
    }, 3000)
    return () => clearInterval(interval)
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
      } else {
        toast.error(responseJson.message)
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }, [getToken])

  type Checked = DropdownMenuCheckboxItemProps["checked"]

  const [showStatusBar, setShowStatusBar] = useState<Checked>(true)
  const [showActivityBar, setShowActivityBar] = useState<Checked>(false)
  const [showPanel, setShowPanel] = useState<Checked>(false)

  return (
    <div className="px-8 sm:px-6 lg:px-8">
      <div className="lg:-mx-8 lg:mb-4 text-sm text-gray-400 breadcrumbs">
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
      <div className="lg:mb-2 sm:flex sm:items-center">
        <div className="lg:-mx-8 sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">My Product</h1>
          <p className="text-sm text-gray-500">
            List of products that you have in your store
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link href={`/store/product/new`} className="flex items-center rounded-md bg-green-700 px-3 py-2 text-center text-base font-medium text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-greenbg-green-700">
            <div><PlusIcon className="w-5 h-5" /></div>
            <div className="pl-1">Add New Product</div>
          </Link>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block w-full py-2 align-middle">
            <table className="w-full border-separate border-spacing-0">
              <thead className="w-full">
                <tr>
                  <th scope="col"
                    className="sticky top-16 z-20 w-[5%] border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">No</th>
                  <th
                    scope="col"
                    className="sticky top-16 z-20 w-[30%] border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="w-[10%] sticky top-16 z-20 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-sm font-semibold text-gray-900 text-center backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Stock
                  </th>
                  <th
                    scope="col"
                    className="w-[10%] sticky top-16 z-20 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="w-[15%] sticky top-16 text-center z-20 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Product Type
                  </th>
                  <th
                    scope="col"
                    className="w-[10%] sticky top-16 z-20 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {products.map((product: any, key: number) => (
                  <tr key={product.id} className="even:bg-gray-50">
                    <td className="whitespace-nowrap text-center items-center px-3 py-4 text-sm font-semibold text-gray-900 sm:pl-3">{key + 1}</td>
                    <td className="whitespace-nowrap flex items-center px-3 py-4 text-sm font-medium text-gray-900 sm:pl-3">
                      <div>
                        {product.image_product ? <Image src={product.image_product} alt={product.image_product} className="h-16 w-20 flex-none rounded-md border border-gray-200" width={55} height={45} /> : <Image src='https://flowbite.com/docs/images/examples/image-1@2x.jpg' alt='Product Image' className="h-16 w-20 flex-none rounded-md border border-gray-200" width={55} height={45} />}
                      </div>
                      <div className="pl-4 font-semibold">
                        {product.name_product.length > 20 ? product.name_product.substring(0, 20) + '...' : product.name_product}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500">{product.stock}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> {formatePrice(product.price)}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">{product.product_type?.name ?? ''}</td>
                    <td className="relative whitespace-nowrap px-3 text-sm font-medium sm:pr-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            <PencilSquareIcon className="w-5 h-5 text-lime-800" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40">
                          <DropdownMenuLabel>Action</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => router.push(`/store/product/${product.id}`)}
                            className="cursor-pointer"
                          >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            <span>Edit Product</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem className="text-red-500 cursor-pointer" >
                            <Dialog>
                              <DialogTrigger asChild >
                                <div className="flex" onClick={(e) => {
                                  e.stopPropagation();
                                  setProductId(product.id);
                                }}>
                                  <TrashIcon className="w-4 h-4 mr-2" />
                                  <span>Delete</span>
                                </div>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="font-bold text-2xl text-red-600">Attention !</DialogTitle>
                                  <DialogDescription className="py-4 font-medium text-lg mb-8">
                                    Are you serious to delete your product?
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="sm:justify-start">
                                  <DialogClose asChild>
                                    <ButtonConfirm label='Cancel' outline />
                                  </DialogClose>
                                  <ButtonConfirm label='Delete' onClick={() => handleDeleteProduct(product.id)} />
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div >
  )
}

export default ProductListStore;