import { FileUploader } from "@/components/form/FileUploader";
import Loading from "@/components/Loading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePersistedUser } from "@/zustand/users";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const NewProductListStore = () => {
  const [loadingSubmit, setIsLoadingSubmit] = useState(false);
  const [image, setImage] = useState<File[]>();
  const { register, handleSubmit } = useForm<FieldValues>();
  const router = useRouter();

  const handleFileChange = (newFiles: File[]) => {
    setImage(newFiles);
  };

  const [token] = usePersistedUser((state) => [state.token]);

  const {
    isFetching,
    data: type,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/type/seller/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data.data;
    },
    queryKey: ["get-type-product"],
    enabled: true,
  });

  const handleCreateNewProduct: SubmitHandler<FieldValues> = useCallback(
    async (data) => {
      if (!image || image.length === 0 || !data) {
        toast.error("Please fill all data");
        return;
      }

      try {
        if (!token) {
          return;
        }
        setIsLoadingSubmit(true);

        // POST request for creating new product
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/product/seller`,
          {
            name_product: data.name,
            productTypeId: data.productType,
            description: data.description,
            price: parseInt(data.price, 10),
            stock: parseInt(data.stock, 10),
            weight_gr: parseInt(data.weight_gr, 10),
            is_preorder: data.is_preorder === "true",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const responseJson = response.data;

        if (responseJson.status === 200) {
          const formData = new FormData();

          // Append product_id and images to formData
          formData.append("product_id", responseJson.data.id);
          image.forEach((file) => {
            formData.append("product_images", file);
          });

          // POST request for uploading product images
          const responseImage = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/product/seller/images`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const responseImageJson = responseImage.data;
          setIsLoadingSubmit(false);

          toast.success(responseJson.message);
          router.push("/store/product");
        } else {
          toast.error(responseJson.message);
        }
      } catch (error: any) {
        toast.error("An error occurred while creating the product.");
        setIsLoadingSubmit(false);
      }
    },
    [image, token, router]
  );

  if (isFetching && !isFetched) {
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
              <BreadcrumbLink href={"/store/product"}>
                My Product
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">
                Create New Product
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="lg:-mx-8 lg:mb-2 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">
            Create New Product
          </h1>
          <p className="text-sm text-gray-500">
            Create a new product to be sold in your store
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <form onSubmit={handleSubmit(handleCreateNewProduct)}>
            <div className="md:p-6 bg-white shadow-sm ring-1 ring-gray-900/5 md:rounded-lg">
              <h3 className="text-base font-semibold">Information Product</h3>

              <div className="space-y-12 sm:space-y-16">
                <div className="mt-5 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="product-name"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Product Name
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        id="product-name"
                        autoComplete="product-name"
                        placeholder="Product name"
                        {...register("name")}
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xl sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="product-type"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Product Type
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <select
                        {...register("productType")}
                        className="bg-white block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="" disabled selected>Select Type</option>
                        {type.map((item: any) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="description-product"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Description
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <textarea
                        placeholder="Input Description"
                        {...register("description")}
                        rows={3}
                        className="block w-full max-w-2xl rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={""}
                      />
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        Write a few sentences about product.
                      </p>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Price
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3">
                        <span className="text-gray-300 sm:text-sm">Rp |</span>
                      </div>
                      <input
                        type="number"
                        {...register("price", { valueAsNumber: true })}
                        className="block w-full rounded-md border-0 py-1.5 pl-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lime-800 sm:text-sm sm:leading-6"
                        placeholder="250000"
                        aria-describedby="weight"
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      stock
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <input
                        type="number"
                        {...register("stock", { valueAsNumber: true })}
                        className="block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lime-800 sm:text-sm sm:leading-6"
                        placeholder="100"
                        aria-describedby="weight"
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Weight
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <input
                        type="number"
                        {...register("weight_gr", { valueAsNumber: true })}
                        id="weight"
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lime-800 sm:text-sm sm:leading-6"
                        placeholder="177"
                        aria-describedby="weight"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-400 sm:text-sm" id="weight">
                          | gr
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4 sm:py-6">
                    <div
                      className="text-sm font-medium leading-6 text-gray-900"
                      aria-hidden="true"
                    >
                      Pre Order
                    </div>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <div className="max-w-lg">
                        <div className="mt-6 space-y-6">
                          <div className="flex items-center gap-x-3">
                            <input
                              id="push-no"
                              {...register("is_preorder")}
                              value="false"
                              type="radio"
                              defaultChecked
                              className="h-4 w-4 border-gray-300 text-lime-700 focus:text-lime-700"
                            />
                            <label
                              htmlFor="push-no"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              No
                            </label>
                          </div>
                          <div className="flex items-center gap-x-3">
                            <input
                              id="push-yes"
                              {...register("is_preorder")}
                              value="true"
                              type="radio"
                              className="h-4 w-4 border-gray-300 text-lime-700 focus:text-lime-700"
                            />
                            <label
                              htmlFor="push-yes"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Yes
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      Product Image
                    </label>
                    <FileUploader
                      value={image}
                      onValueChange={handleFileChange}
                      maxFiles={5}
                      maxSize={4 * 1024 * 1024}
                      disabled={false}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-x-6">
                  <button
                    type="button"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loadingSubmit}
                    type="submit"
                    className={`inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${loadingSubmit
                      ? "bg-gray-400 cursor-not-allowed" // Warna dan gaya ketika disabled
                      : "bg-lime-800 hover:bg-lime-700 focus-visible:outline-lime-800" // Warna dan gaya ketika aktif
                      }`}
                  >
                    Confirm Product
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProductListStore;
