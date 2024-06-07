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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { formatePrice } from "@/utils/formatPrice";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { PencilIcon, SquareCheckBig, SquareX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const TransactionListStore = () => {
  const [transactions, setTransactions] = useState([]);
  const router = useRouter();

  const getToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Please Login First');
      return null;
    }
    return token;
  }, []);

  const handleGetAllTransaction = useCallback(async () => {
    try {
      const token = getToken()
      if (!token) { return; }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const responseJson = await response.json();
      setTransactions(responseJson.data)
    } catch (error: any) {
      console.log(error.message)
    }
  }, [getToken])

  useEffect(() => {
    handleGetAllTransaction()
    const interval = setInterval(() => {
      handleGetAllTransaction()
    }, 10000)
    return () => clearInterval(interval)
  }, [handleGetAllTransaction])

  const handleConfirmTransaction = useCallback(async (id: string) => {
    //   console.log('confirm', id)
    // }, [])
    try {
      const token = getToken();
      if (!token) { return; }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction/confirm/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const responseJson = await response.json();
      console.log(responseJson)
      if (responseJson.status === 200) {
        toast.success(responseJson.message);
        setActiveDialog('')
      } else {
        toast.error(responseJson.message)
        setActiveDialog('')
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }, [getToken])

  const handleDeclineTransaction = useCallback(async (id: string) => {
    //   console.log('decline', id)
    // }, [])
    try {
      const token = getToken();
      if (!token) { return; }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction/decline/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const responseJson = await response.json();
      console.log(responseJson)
      if (responseJson.status === 200) {
        toast.success(responseJson.message);
        setActiveDialog('')
      } else {
        toast.error(responseJson.message)
        setActiveDialog('')
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }, [getToken])

  const [activeDialog, setActiveDialog] = useState('');

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
              <BreadcrumbPage className="font-semibold">My Transaction</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="lg:mb-2 sm:flex sm:items-center">
        <div className="lg:-mx-8 sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">My Transaction</h1>
          <p className="text-sm text-gray-500">
            List your Transaction Store
          </p>
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
                    className="sticky top-16 z-20 w-[10%] border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                  >
                    Transaction Id
                  </th>
                  <th
                    scope="col"
                    className="w-[10%] sticky top-16 z-20 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-sm font-semibold text-gray-900 text-center backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Order Date
                  </th>
                  <th
                    scope="col"
                    className="w-[10%] sticky top-16 z-20 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-sm font-semibold text-gray-900 text-center backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="w-[15%] sticky top-16 z-20 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="w-[13%] sticky top-16 z-20 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Total Amount
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
                {transactions.map((transaction: any, key: number) => (
                  <tr key={transaction.id} className="even:bg-gray-50">
                    <td className="whitespace-nowrap text-center items-center px-3 py-4 text-sm font-semibold text-gray-900 sm:pl-3">{key + 1}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.id}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">{format(new Date(transaction.createdAt), 'MMMM dd, yyyy')}</td>
                    <td className={`whitespace-nowrap text-center text-sm ${transaction.status === 'PAYABLE' ? 'text-blue-700' : transaction.status === 'SUCCESS' ? 'text-lime-700' : transaction.status === 'CANCEL' ? 'text-red-500' : 'text-lime-700'}`}>
                      {transaction.status}
                    </td>
                    <td key={key} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.cart_details[0]?.user.email}</td>
                    < td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500" > {formatePrice(transaction.total_amount)}</td>
                    <td className="relative whitespace-nowrap px-3 text-sm font-medium sm:pr-3">
                      <Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                              <PencilSquareIcon className="w-5 h-5 text-lime-800" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-24">
                            <DropdownMenuLabel>Action</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => router.push(`/store/transaction/${transaction.id}`)}
                              className="cursor-pointer items-center"
                            >
                              <PencilIcon className="w-4 h-4 mr-2" />
                              <span>Detail</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-lime-600 cursor-pointer" onClick={() => setActiveDialog('confirm')}>
                              <DialogTrigger>
                                <div className="flex items-center" >
                                  <SquareCheckBig className="w-4 h-4 mr-2" />
                                  <span>Confirm</span>
                                </div>
                              </DialogTrigger>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => setActiveDialog('decline')}>
                              <DialogTrigger>
                                <div className="flex items-center">
                                  <SquareX className="w-4 h-4 mr-2" />
                                  <span>Decline</span>
                                </div>
                              </DialogTrigger>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        {activeDialog === 'confirm' && (
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="font-bold text-2xl text-red-600">Attention !</DialogTitle>
                              <DialogDescription className="py-4 font-medium text-lg mb-8">
                                Are you serious to confirm transaction?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-start">
                              <DialogClose asChild>
                                <ButtonConfirm label='Cancel' outline />
                              </DialogClose>
                              <ButtonConfirm label='Confirm' onClick={() => { handleConfirmTransaction(transaction.id) }} />
                            </DialogFooter>
                          </DialogContent>
                        )}
                        {activeDialog === 'decline' && (
                          <DialogContent className="sm:max-w-md" accessKey="decline">
                            <DialogHeader>
                              <DialogTitle className="font-bold text-2xl text-red-600">Attention !</DialogTitle>
                              <DialogDescription className="py-4 font-medium text-lg mb-8">
                                Are you serious to decline transaction?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-start">
                              <DialogClose asChild>
                                <ButtonConfirm label='Cancel' outline />
                              </DialogClose>
                              <ButtonConfirm label='Decline' onClick={() => handleDeclineTransaction(transaction.id)} />
                            </DialogFooter>
                          </DialogContent>
                        )}
                      </Dialog>

                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>

      </div >

    </div >
  )
}

export default TransactionListStore;