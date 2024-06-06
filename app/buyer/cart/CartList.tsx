'use client'
import ButtonConfirm from '@/components/button/ButtonConfirm';
import SetQuantity from '@/components/products/SetQuantity';
import CurrencyText from '@/components/text/CurrencyText';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface CartItem {
  cart_id: string;
  product_id: string;
  product_price: number;
}

type Store = {
  id: string;
  name: string;
};


const CartList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [newQty, setNewQty] = useState(0);
  const [values, setValues] = useState([])
  const [selectedProducts, setSelectedProducts] = useState<CartItem[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [stores, setStores] = useState<Store[]>([]); // your stores
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  const getToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Please Login First');
      return null;
    }
    return token;
  }, []);

  useEffect(() => {
    const isLoged = localStorage.getItem('is_login');
    if (isLoged === 'false' || isLoged === null) {
      toast.error('Please Login First');
      router.push('/buyer/login');
    }
  });

  const handleGetAllCartBuyer = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) { return; }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const responseJson = await response.json();
      if (responseJson.success === true) {
        // console.log(responseJson)
        setValues(responseJson.data);
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }, [getToken]);

  useEffect(() => {
    handleGetAllCartBuyer();
  })

  const handleUpdateCart = useCallback(async (product_id: string, qty: number) => {
    try {
      const token = getToken();
      if (!token) { return }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id, qty })
      })

      const responseJson = await response.json();
      if (responseJson.success === true) {
        toast.success(responseJson.message);
      } else {
        toast.error(responseJson.message);
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }, [getToken])

  const handleDeleteCart = useCallback(async (cart_id: string) => {
    try {
      const token = getToken();
      if (!token) { return; }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart_id })
      })

      const responseJson = await response.json();
      if (responseJson.success === true) {
        toast.success(responseJson.message);
      } else {
        toast.error(responseJson.message);
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }, [getToken])

  const handleDeleteAllCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Anda belum login')
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/all`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const responseJson = await response.json();
      if (responseJson.success === true) {
        toast.success(responseJson.message);
      } else {
        toast.error(responseJson.message);
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const productSelection = (cart_id: string, product_id: string, product_qty: number, product_price: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedProducts(preCarts => [...preCarts, { cart_id, product_id, product_qty, product_price }]);
      console.log(selectedProducts);
    } else {
      setSelectedProducts(preCarts => preCarts.filter(preCart => preCart.cart_id !== cart_id));
    }
  };

  useEffect(() => {
    const total = selectedProducts.reduce((total: any, product: any) => {
      return total + calculateTotal(product.product_price, product.product_qty);
    }, 0);
    setGrandTotal(total);
  }, [selectedProducts]);

  const totalProducts = selectedProducts.length;
  const calculateTotal = (price: number, qty: number) => {
    let total = price * qty;
    return total;
  }

  // const handleCheckboxChange = (storeId: string) => {
  //   setCheckedItems(prevState => ({ ...prevState, [storeId]: !prevState[storeId] }));
  //   console.log(checkedItems);

  //   setStores(prevStores =>
  //     prevStores.map(store =>
  //       store.store.id === storeId
  //         ? {
  //           ...store,
  //           carts: store.carts.map(cart => ({
  //             ...cart,
  //             isChecked: !checkedItems[storeId],
  //           })),
  //         }
  //         : store
  //     )
  //   );
  // };

  const handleCheckout = async () => {

    const selectCHeck = selectedProducts.map(cart => ({ cart_id: cart.cart_id }));
    console.log(selectCHeck);
    try {
      const token = getToken();
      if (!token) { return; }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedProducts.map(cart => ({ cart_id: cart.cart_id })))
      })

      const responseJson = await response.json();
      console.log(responseJson);
      if (responseJson.success === true) {
        toast.success(responseJson.message);
        router.push('/buyer/checkout');
      } else {
        toast.error(responseJson.message);
      }
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl pt-10 lg:max-w-7xl md:max-w-5xl md:px-6 sm:max-w-xl sm:px-2">

      <div className="max-w-7xl mb-6 sm:px-2">
        <div className="max-w-2xl lg:max-w-4xl">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Shopping Chart</h1>
          <p className="mt-2 text-sm text-gray-500">
            Check the status of recent orders, manage returns, and discover similar products.
          </p>
        </div>
      </div>

      <div className='bg-white shadow-md mt-4'>
        <div className='p-5 text-center text-base font-semibold grid grid-cols-6'>
          <div className='flex items-center col-span-2 text-start'>
            <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-lime-700 accent-green-700 focus:ring-lime-700"
            />
            <p className='px-4'>Product</p>
          </div>
          <p>Unit Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Actions</p>
        </div>
      </div>

      <div className="mt-4">

        {values.map((item: any) => (
          <div key={item.store.id} className="mt-6 bg-white shadow-md">

            {item.carts.some((cart: any) => cart.stock !== 0) && (
              <div key={item.id} className="px-5 py-2 flex items-center border-b bg-white">
                <input
                  id="comments"
                  aria-describedby="comments-description"
                  name="comments"
                  type="checkbox"
                  // onClick={() => handleCheckboxChange(item.store.id)}
                  className="h-4 w-4 rounded border-gray-300 text-lime-700 accent-green-700 focus:ring-lime-700"
                />
                <h4 className="text-lime-800 text-xl font-semibold px-4">{item.store.name}</h4>
              </div>
            )}

            {item.carts.map((cart: any) => {
              if (cart.stock >= 1) {
                return (
                  <div key={cart.id} className="p-5 flex border-b border-gray-200 lg:grid lg:grid-cols-7 lg:place-content-center">

                    <div className="flex flex-grow mr-4 items-center bg-white aspect-video col-span-2 p-4">
                      <input
                        id="comments"
                        aria-describedby="comments-description"
                        name="comments"
                        type="checkbox"
                        onChange={(e) => productSelection(cart.id, cart.product_id, cart.qty, cart.price, e.target.checked)}
                        className="h-4 w-4 pr-4 rounded border-gray-300 text-lime-700 accent-green-700 focus:ring-lime-700 mr-4"
                      />
                      {cart.image_product ?
                        <Image
                          src={cart.image_product}
                          alt={cart.name_product}
                          className="flex-grow h-full w-full object-cover place-items-center md:h-full md:w-full sm:h-full sm:w-full"
                          width={100}
                          height={100}
                        /> : <Image src='https://flowbite.com/docs/images/examples/image-1@2x.jpg' alt='Product Image' className="flex-grow h-full w-full object-cover place-items-center md:h-full md:w-full sm:h-full sm:w-full" width={100} height={100} />}
                    </div>
                    <div className='p-4 '>
                      <h3 className="text-base font-medium text-slate-700">
                        <span>{cart.name_product}</span>
                      </h3>
                      <p className="mt-3 text-sm text-gray-500">{cart.desc_product}</p>
                    </div>

                    <CurrencyText amount={cart.price} className="text-center py-20 text-sm font-medium text-slate-700" />
                    <div className='grid place-content-center'>
                      <SetQuantity cartQty={cart.qty} onQtyChange={setNewQty} />
                    </div>
                    <CurrencyText amount={calculateTotal(cart.price, cart.qty)} className="text-center py-20 text-sm font-medium text-slate-700" />
                    <div className='flex items-center justify-center gap-2'>
                      <TrashIcon className="h-6 w-6 text-red-600 hover:text-red-300" onClick={() => { handleDeleteCart(cart.id) }} />
                      <PencilSquareIcon className="h-6 w-6 cursor-pointer text-green-800 hover:text-green-500" onClick={() => handleUpdateCart(cart.product_id, newQty)} />
                    </div>
                  </div>
                )
              }
            })}
          </div>
        )
        )}
      </div>

      <div className="sticky bottom-0 mt-10">
        <h2 className="sr-only">Checkout partition</h2>
        <div className="shadow-md px-4 py-2 grid grid-cols-2 gap-2 bg-slate-50 sm:rounded-lg sm:px-6 sm:gap-3">
          <div className='flex items-center text-start'>
            <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-lime-700 focus:ring-lime-700"
            />
            <p className='px-4'>Select All</p>
            <div className='flex items-center justify-center text-red-600 hover:text-red-300 gap-2'>
              <TrashIcon className="h-6 w-6 " />
              Delete All Carts
            </div>
          </div>

          <div className="p-2 flex items-center justify-center flex-wrap w-full text-lg">
            <p className="pb-2 text-slate-500">Total ({totalProducts} Product) :</p>
            <p className='pb-2 pl-2 text-lime-700 font-bold text-xl'>
              <CurrencyText amount={grandTotal} />
            </p>
            <Dialog>
              <DialogTrigger asChild >
                <ButtonConfirm label='Checkout' />
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
                  <ButtonConfirm label='Let`s Go..' onClick={handleCheckout} />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

        </div>
      </div>
    </div >
  )
}

export default CartList;