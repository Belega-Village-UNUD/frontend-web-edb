// import { product } from '@/utils/product'
import ButtonConfirm from "@/components/button/ButtonConfirm";
import SetQuantity from "@/components/products/SetQuantity";
import CurrencyText from "@/components/text/CurrencyText";
import { usePersistedUser } from "@/zustand/users";
import { Disclosure, Tab } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/zustand/carts";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface ProductDetailsProps {
  data: any;
}

const DetailProduct: React.FC<ProductDetailsProps> = ({ data }) => {
  const [quantity, setQuantity] = useState(1);
  const pathname = usePathname();
  const router = useRouter();
  const lastSegment = pathname.split("/").pop();

  const [token] = usePersistedUser((state) => [state.token]);

  const getToken = useCallback(() => {
    if (!token) {
      console.error("Anda belum login");
      // router.push("/buyer/login");
      return null;
    }
    return token;
  }, [token]);

  const incrementCartProducts = useCart((state) => state.increase);

  const handleAddToCart = async (event: any) => {
    event.preventDefault();
    incrementCartProducts();

    try {
      const token = getToken();
      const payload = {
        product_id: lastSegment,
        qty: quantity,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([payload]),
      });

      const responseJson = await response.json();
      if (responseJson.success) {
        toast.success(responseJson.message);
      } else {
        if (responseJson.status == 401) {
          toast.error("Please login first");
          router.push("/buyer/login");
        } else {
          toast.error(responseJson.message);
        }
        useCart.setState((state) => ({
          counter: state.counter - 1,
        }));
      }
    } catch (error) {
      useCart.setState((state) => ({
        counter: state.counter - 1,
      }));
      console.log(error);
    }
  };

  const handleCheckout = async (event: any) => {
    event.preventDefault();
    try {
      const token = getToken();
      const payload = {
        product_id: lastSegment,
        qty: quantity,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/product/checkout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseJson = await response.json();
      if (responseJson.success) {
        toast.success(responseJson.message);
      } else {
        toast.error("Please login first");
        router.push("/buyer/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:p-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Tab.Group as="div" className="flex flex-col-reverse">
              <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                  {data.images.map((image: string, index: number) => (
                    <Tab
                      key={index}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    >
                      {({ selected }) => (
                        <div>
                          <span className="sr-only">{image}</span>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <Image
                              src={
                                image ||
                                "https://flowbite.com/docs/images/examples/image-1@2x.jpg"
                              }
                              alt={"product image"}
                              width={300}
                              height={300}
                              className="h-full w-full object-cover object-center"
                            />
                          </span>
                          <span
                            className={classNames(
                              selected ? "ring-indigo-500" : "ring-transparent",
                              "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                            )}
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div>

              <Tab.Panels className=" w-full flex justify-center items-center">
                {data.images.length > 0 ? (
                  data.images.map((image: string, index: number) => (
                    <Tab.Panel key={index}>
                      <Image
                        src={image}
                        alt={"product image"}
                        className="object-cover object-center sm:rounded-lg aspect-video"
                        width={1000}
                        height={1000}
                      />
                    </Tab.Panel>
                  ))
                ) : (
                  <Tab.Panel>
                    <Image
                      src="https://flowbite.com/docs/images/examples/image-1@2x.jpg"
                      alt={"fallback image"}
                      className="object-cover object-center sm:rounded-lg aspect-video"
                      width={1000}
                      height={1000}
                    />
                  </Tab.Panel>
                )}
              </Tab.Panels>
            </Tab.Group>

            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-2xl font-medium tracking-tight text-gray-900">
                {data?.name_product} {""}
                {data?.is_preorder && (
                  <span className="text- text-red-600">(Preorder)</span>
                )}
              </h1>
              <div className="my-3">
                <CurrencyText
                  amount={data?.price}
                  className="text-3xl tracking-tight text-green-800 font-semibold"
                />
              </div>
              <div className="mt-2 space-y-3">
                <span>Stock: {data?.stock}</span>
                <SetQuantity
                  cartQty={quantity}
                  onQtyChange={setQuantity}
                  stock={data?.stock}
                />
              </div>

              <form className="mt-6">
                <div className="mt-10 flex gap-2">
                  <ButtonConfirm
                    label="Add to cart"
                    type="submit"
                    onClick={handleAddToCart}
                    outline
                  />
                  <ButtonConfirm
                    label="Buy now"
                    type="submit"
                    onClick={handleCheckout}
                  />
                  {/* <button
                    type="button"
                    className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <span className="sr-only">Add to favorites</span>
                    <HeartIcon
                      className="h-6 w-6 flex-shrink-0"
                      aria-hidden="true"
                    />
                  </button> */}
                </div>
              </form>

              <section aria-labelledby="details-heading" className="mt-12">
                <h2 id="details-heading" className="sr-only">
                  Additional details
                </h2>

                <div className="divide-y divide-gray-200 border-t">
                  <Disclosure as="div" key={data?.id + "description"}>
                    {({ open }) => (
                      <div>
                        <h3>
                          <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                            <span
                              className={classNames(
                                open ? "text-green-700" : "text-gray-900",
                                "text-sm font-medium"
                              )}
                            >
                              Description
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="block h-6 w-6 text-green-700 group-hover:text-green-800"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel
                          as="div"
                          className="prose prose-sm pb-6"
                        >
                          <ul role="list">
                            <li>{data?.desc_product}</li>
                          </ul>
                        </Disclosure.Panel>
                      </div>
                    )}
                  </Disclosure>
                  <Disclosure as="div" key={data?.id + "spesification"}>
                    {({ open }) => (
                      <div>
                        <h3>
                          <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                            <span
                              className={classNames(
                                open ? "text-green-700" : "text-gray-900",
                                "text-sm font-medium"
                              )}
                            >
                              Spesification
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="block h-6 w-6 text-green-700 group-hover:text-green-800"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel
                          as="div"
                          className="prose prose-sm pb-6"
                        >
                          <ul role="list">
                            <li>
                              <span className="font-semibold">Category : </span>
                              {data && data?.product_type
                                ? data?.product_type.name
                                : ""}
                            </li>
                            <li>
                              <span className="font-semibold">Material : </span>

                              {data && data?.product_type
                                ? data?.product_type.material
                                : ""}
                            </li>
                            <li>
                              <span className="font-semibold">Weight : </span>

                              {data && data?.weight_gr
                                ? data?.weight_gr + " gram"
                                : ""}
                            </li>
                          </ul>
                        </Disclosure.Panel>
                      </div>
                    )}
                  </Disclosure>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailProduct;
