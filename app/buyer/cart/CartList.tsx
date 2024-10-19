"use client";
import ButtonConfirm from "@/components/button/ButtonConfirm";
import Loading from "@/components/Loading";
import SetQuantity from "@/components/SetQuantity";
import CurrencyText from "@/components/text/CurrencyText";
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
import { formatRupiah } from "@/lib/utils";
import { usePersistedUser } from "@/zustand/users";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaRegSave } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "sonner";

interface CartItem {
  cart_id: string;
  product_id: string;
  product_price: number;
}

interface Store {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  description?: string;
}

interface Cart {
  id: string;
  qty: number;
  product_id: string;
  product: {
    price: number;
    id: string;
    name_product: string;
    stock: number;
    desc_product: string;
    type_id: string;
    store: Store;
  };
  name_product: string;
  price: number;
  stock: number;
  desc_product: string;
  is_checkout: boolean;
  type_id: string;
}

interface SelectedStore {
  store: Store;
  carts: Cart[];
  is_all_checked?: boolean;
}
const initialData: SelectedStore[] = [];

const CartList = () => {
  const [newQty, setNewQty] = useState<{ [key: string]: number }>({});
  const [grandTotal, setGrandTotal] = useState(0);

  const [selectedItem, setSelectedItem] =
    useState<SelectedStore[]>(initialData);

  const router = useRouter();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const tokenFromStore = usePersistedUser.getState().token;
    if (!tokenFromStore) {
      // router.push("/");
    }
    setToken(tokenFromStore);
  }, [router, token]);

  const {
    isFetching,
    data: values,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data.data; // Ensure this returns the correct structure expected by selectedItem
    },
    queryKey: ["get-carts"],
    enabled: !token, // Ensure this is enabled only when the token is available
  });

  useEffect(() => {
    if (values) {
      setSelectedItem(values);
    }
  }, [values]);

  const handleQtyChange = (cartId: string, qty: number) => {
    setNewQty((prevQty) => ({ ...prevQty, [cartId]: qty }));
  };

  const handleUpdateCart = useCallback(
    async (product_id: string, qty: number) => {
      try {
        if (!token) {
          // router.push("/buyer/login");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cart`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ product_id, qty }),
          }
        );

        const responseJson = await response.json();
        if (responseJson.success === true) {
          window.location.reload();
        } else {
          toast.error(responseJson.message);
        }
      } catch (error: any) {
        console.error(error.message);
      }
    },
    [refetch, router, token]
  );

  const handleDeleteCart = useCallback(
    async (cart_id: string) => {
      try {
        if (!token) {
          // router.push("/buyer/login");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cart`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ cart_id }),
          }
        );

        const responseJson = await response.json();
        if (responseJson.success === true) {
          window.location.reload();
          toast.success(responseJson.message);
        } else {
          toast.error(responseJson.message);
        }
      } catch (error: any) {
        console.error(error.message);
      }
    },
    [refetch, router, token]
  );

  const handleDeleteAllCart = async () => {
    try {
      if (!token) {
        // router.push("/buyer/login");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/all`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseJson = await response.json();
      if (responseJson.success === true) {
        refetch();
        toast.success(responseJson.message);
      } else {
        toast.error(responseJson.message);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const toggleCheckbox = (
    storeId: string,
    cartId: string,
    checked: boolean
  ) => {
    setSelectedItem((prevState) =>
      prevState.map((store) => {
        if (store.store.id === storeId) {
          const updatedCarts = store.carts.map((cart) =>
            cart.id === cartId ? { ...cart, is_checkout: checked } : cart
          );

          const allChecked = updatedCarts.every((cart) => cart.is_checkout);

          return {
            ...store,
            carts: updatedCarts,
            is_all_checked: allChecked,
          };
        }
        return store;
      })
    );
  };

  const handleCheckboxAllStoreChange = (checked: boolean) => {
    setSelectedItem((prevState) =>
      prevState.map((store) => ({
        ...store,
        carts: store.carts.map((cart) => ({
          ...cart,
          is_checkout: checked,
        })),
        is_all_checked: checked,
      }))
    );
  };

  const handleCheckboxAllChange = (storeId: string, checked: boolean) => {
    setSelectedItem((prevState) =>
      prevState.map((store) =>
        store.store.id === storeId
          ? {
            ...store,
            carts: store.carts.map((cart) => ({
              ...cart,
              is_checkout: checked,
            })),
            is_all_checked: checked,
          }
          : store
      )
    );
  };

  const calculateTotal = (price: number, qty: number) => price * qty;

  useEffect(() => {
    const total = selectedItem?.reduce((acc: number, store: any) => {
      return (
        acc +
        store.carts
          .filter((cart: any) => cart.is_checkout)
          .reduce((storeTotal: number, cart: any) => {
            return storeTotal + calculateTotal(cart.product.price, cart.qty);
          }, 0)
      );
    }, 0);

    setGrandTotal(total);
  }, [selectedItem]);

  const totalProducts = selectedItem?.reduce((count: number, store: any) => {
    return count + store.carts.filter((cart: any) => cart.is_checkout).length;
  }, 0);

  const handleCheckout = async () => {
    const cartIds = selectedItem.flatMap((store) =>
      store.carts
        .filter((cart) => cart.is_checkout)
        .map((cart) => ({ cart_id: cart.id }))
    );

    try {
      if (!token) {
        // router.push("/buyer/login");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/checkout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cartIds),
        }
      );

      const responseJson = await response.json();
      if (responseJson.success === true) {
        toast.success(responseJson.message);
        router.push("/buyer/history");
      } else {
        toast.error(responseJson.message);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-7xl pt-10 lg:max-w-7xl md:max-w-5xl md:px-6 sm:max-w-xl sm:px-2">
      <div className="max-w-7xl mb-6 sm:px-2">
        <div className="max-w-2xl lg:max-w-4xl">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Shopping Cart
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Check the status of recent orders, manage returns, and discover
            similar products.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md mt-4">
        <div className="p-5 text-center text-base font-semibold grid grid-cols-6 md:ml-32">
          <div className="flex items-center col-span-2 text-start">
            <p className="px-4">Product</p>
          </div>
          <p>Unit Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Actions</p>
        </div>
      </div>

      <div className="mt-4">
        {selectedItem?.length > 0 ? (
          selectedItem?.map((item: any) => (
            <div key={item.store.id} className="mt-6 bg-white shadow-md">
              {item.carts.some((cart: any) => cart.stock !== 0) && (
                <div
                  key={item.id}
                  className="px-5 py-2 flex items-center border-b bg-white"
                >
                  {/* checkbox all and uncheckbox all and only check if all is checked */}
                  <input
                    id="comments"
                    aria-describedby="comments-description"
                    name="comments"
                    type="checkbox"
                    checked={item.is_all_checked || false}
                    onChange={(e) =>
                      handleCheckboxAllChange(
                        item.store.id,
                        e.currentTarget.checked
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300 text-lime-700 accent-green-700 focus:ring-lime-700"
                  />
                  <h4 className="text-lime-800 text-xl font-semibold px-4">
                    {item.store.name}
                  </h4>
                </div>
              )}

              {item.carts.map((cart: any) => {
                if (cart.stock >= 1) {
                  return (
                    <div
                      key={cart.id}
                      className="p-5 flex border-b border-gray-200 lg:grid lg:grid-cols-7 lg:place-content-center"
                    >
                      <div className="flex flex-grow mr-4 items-center bg-white aspect-video col-span-2 p-4 ">
                        <input
                          id="comments"
                          aria-describedby="comments-description"
                          name="comments"
                          type="checkbox"
                          checked={cart.is_checkout}
                          onChange={(e) =>
                            toggleCheckbox(
                              item.store.id,
                              cart.id,
                              e.currentTarget.checked
                            )
                          }
                          className="h-4 w-4 rounded border-gray-300 text-lime-700 accent-green-700 focus:ring-lime-700 mr-4"
                        />
                        {cart?.product?.images?.length > 0 ? (
                          <Image
                            src={cart?.product?.images[0]}
                            alt={cart.name_product}
                            className="flex-grow h-full w-full object-cover place-items-center md:h-full md:w-full sm:h-full sm:w-full"
                            width={100}
                            height={100}
                          />
                        ) : (
                          <Image
                            src="https://flowbite.com/docs/images/examples/image-1@2x.jpg"
                            alt="Product Image"
                            className="flex-grow h-full w-full object-cover place-items-center md:h-full md:w-full sm:h-full sm:w-full"
                            width={100}
                            height={100}
                          />
                        )}
                      </div>
                      <div className="p-4 flex flex-col justify-center">
                        <h3 className="text-base font-medium text-slate-700">
                          <span>{cart.name_product}</span>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {cart.desc_product}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Stock: {cart.stock}
                        </p>
                      </div>

                      <CurrencyText
                        amount={cart.price}
                        className="text-center py-20 text-sm font-medium text-slate-700"
                      />
                      <div className="grid place-content-center">
                        <SetQuantity
                          cartId={cart.id}
                          cartQty={newQty[cart.id] || cart.qty}
                          onQtyChange={handleQtyChange}
                          stock={cart.stock}
                        />
                      </div>
                      <span className="text-center py-20 text-sm font-medium text-slate-700">
                        {formatRupiah(
                          (newQty[cart.id] || cart.qty) * cart.price
                        )}
                      </span>
                      <div className="flex items-center justify-center gap-2">
                        <Dialog>
                          <DialogTrigger>
                            <MdDeleteOutline className="h-6 w-6 text-red-600 hover:text-red-300" />
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="font-bold text-2xl text-red-600">
                                Attention !
                              </DialogTitle>
                              <DialogDescription className="py-4 font-medium text-lg mb-8">
                                Are you serious to delete your product?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-start">
                              <DialogClose asChild>
                                <button className="w-full px-4 py-4  text-green-600 outline-green-600 outline rounded-sm">
                                  Cancel
                                </button>
                              </DialogClose>
                              <button
                                className="w-full px-4 py-4  text-red-600 outline-red-600 outline rounded-sm"
                                onClick={() => {
                                  handleDeleteCart(cart.id);
                                }}
                              >
                                Delete
                              </button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <FaRegSave
                          className="h-6 w-6 cursor-pointer text-green-800 hover:text-green-500"
                          onClick={() =>
                            handleUpdateCart(
                              cart.product_id,
                              newQty[cart.id] || cart.qty
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          ))
        ) : (
          <div className="bg-white py-4 px-4 flex justify-center items-center h-52 shadow-lg">
            <h3>No data in your cart</h3>
          </div>
        )}
      </div>
      <div className="sticky bottom-0 mt-10">
        <h2 className="sr-only">Checkout partition</h2>
        <div className="shadow-md px-4 py-2 grid grid-cols-2 gap-2 bg-slate-50 sm:rounded-lg sm:px-6 sm:gap-3">
          <div className="flex items-center text-start">
            <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-lime-700 focus:ring-lime-700"
              checked={selectedItem?.every((store) =>
                store.carts.every((cart) => cart.is_checkout)
              )}
              onChange={(e) =>
                handleCheckboxAllStoreChange(e.currentTarget.checked)
              }
            />
            <p className="px-4">Select All</p>
            <div
              className="flex items-center justify-center text-red-600 hover:text-red-300 gap-2 cursor-pointer"
              onClick={handleDeleteAllCart}
            >
              <MdDeleteOutline className="h-6 w-6 " />
              Delete All Carts
            </div>
          </div>

          <div className="p-2 flex items-center justify-center flex-wrap w-full text-lg">
            <p className="pb-2 text-slate-500">
              Total ({totalProducts} Product) :
            </p>
            <p className="pb-2 pl-2 text-lime-700 font-bold text-xl">
              <CurrencyText amount={grandTotal} />
            </p>
            <ButtonConfirm label="Checkout" onClick={handleCheckout} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartList;
