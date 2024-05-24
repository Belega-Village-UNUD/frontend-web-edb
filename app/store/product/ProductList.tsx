import { formatePrice } from "@/utils/formatPrice";
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";

// type ProductListStoreType = {
//   id: string,
//   name_product: string,
//   stock: number,
//   price: string,
//   type_id: string,
//   image_product: string,
// }

const ProductListStore = () => {
  const [products, setProducts] = useState([])

  const handleGetAllStoreProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Anda belum login')
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/seller/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const responseJson = await response.json();
      setProducts(responseJson.data)
    } catch (error: any) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    handleGetAllStoreProduct()
  }, [])

  return (
    <div className="px-8 pt-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">Product</h1>
          <p className="mt-2 text-sm text-gray-700">
            List of products that you have in your store
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="flex items-center rounded-md bg-green-700 px-3 py-2 text-center text-base font-medium text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-greenbg-green-700"
          >
            <div><PlusIcon className="w-5 h-5" /></div>
            <div className="pl-1">Add New Product</div>
          </button>
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
                    className="w-[20%] sticky top-16 z-20 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="w-[25%] sticky top-16 z-20 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
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
                      <div className="pl-4">
                        {product.name_product.length > 20 ? product.name_product.substring(0, 20) + '...' : product.name_product}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500">{product.stock}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"> {formatePrice(product.price)}</td>
                    {/* {product.product_type.map((type: any, key: number) => ( */}
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.product_type?.name ?? ''}</td>
                    {/* ))} */}
                    <td className="relative whitespace-nowrap px-3 text-sm font-medium sm:pr-3">
                      <div className="dropdown dropdown-hover dropdown-left">
                        <div tabIndex={0} role="button" className="btn m-1">
                          <PencilSquareIcon className="w-5 h-5" />
                        </div>

                        <ul tabIndex={0} className="dropdown-content z-[1] menu shadow bg-base-100 rounded-box w-32">
                          <li><a>Edit</a></li>
                          <li><a>Archive</a></li>
                          <li><a>Details</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListStore;