// import { product } from '@/utils/product'
import ButtonConfirm from "@/components/button/ButtonConfirm";
import SetQuantity from "@/components/products/SetQuantity";
import CurrencyText from "@/components/text/CurrencyText";
import { useCart } from "@/zustand/carts";
import { usePersistedUser } from "@/zustand/users";
import { Tab } from "@headlessui/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

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

  let link = null

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

  const handleMessage = async (event: any) => {
    event.preventDefault();
    try {
      const token = getToken();
      const payload = {
        product_id: lastSegment,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/message/product`,
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
      console.log('line 136', responseJson);

      if (responseJson.success) {
        link = responseJson.data;
        console.log('line 140', link);
        toast.success(responseJson.message);
        window.open(link, '_blank');
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
                  <button
                    type="button"
                    className="ml-2 flex items-center justify-center rounded-md px-3 py-3 text-green-500 hover:bg-green-100 hover:text-green-600"
                    onClick={handleMessage}
                  >
                    <span className="sr-only">Chat with seller</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.115 1.518 5.857L0 24l6.143-1.518A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22.5c-1.95 0-3.77-.5-5.357-1.357l-.393-.214-3.643.893.893-3.643-.214-.393A10.5 10.5 0 1112 22.5zm5.25-7.5c-.268-.134-1.607-.786-1.857-.893-.25-.089-.429-.134-.607.134-.179.268-.696.893-.857 1.071-.161.179-.321.196-.589.062-.268-.134-1.125-.411-2.143-1.304-.793-.707-1.321-1.589-1.482-1.857-.161-.268-.018-.411.125-.545.125-.125.268-.321.393-.482.125-.161.179-.268.268-.446.089-.179.045-.321-.022-.446-.067-.134-.607-1.464-.839-2.036-.223-.536-.446-.464-.607-.464-.161 0-.321-.018-.482-.018s-.446.067-.679.321c-.232.25-.893.875-.893 2.143s.911 2.482 1.036 2.679c.125.179 1.786 2.679 4.339 3.75.607.268 1.089.429 1.464.554.616.196 1.179.168 1.625.102.5-.075 1.607-.661 1.839-1.304.232-.643.232-1.196.161-1.304-.071-.107-.232-.161-.5-.286z" />
                    </svg>
                  </button>
                </div>
              </form>

              <section aria-labelledby="details-heading" className="mt-12">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-700">Description:</h3>
                    <p className="text-sm text-gray-600">{data?.desc_product}</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-700">Category:</h3>
                    <p className="text-sm text-gray-600">
                      {data && data?.product_type ? data?.product_type.name : "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-700">Material:</h3>
                    <p className="text-sm text-gray-600">
                      {data && data?.product_type ? data?.product_type.material : "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-700">Weight:</h3>
                    <p className="text-sm text-gray-600">
                      {data && data?.weight_gr ? `${data?.weight_gr} gram` : "N/A"}
                    </p>
                  </div>
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
