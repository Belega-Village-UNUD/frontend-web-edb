"use client";

import { usePersistedUser } from "@/zustand/users";
import { Tab } from "@headlessui/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import Rating from "./Rating";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ProductDetailsProps {
  data: any;
  transaction_id: string;
}

const rateSchema = z.object({
  transaction_id: z.string(),
  product_id: z.string(),
  rate: z.number().min(1).max(5),
  review: z.string().min(1, "Review is required"),
});

type RateFormData = z.infer<typeof rateSchema>;

const DetailRating: React.FC<ProductDetailsProps> = ({
  data,
  transaction_id,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const lastSegment = pathname.split("/").pop();

  const [token] = usePersistedUser((state) => [state.token]);

  const form = useForm<RateFormData>({
    resolver: zodResolver(rateSchema),
    defaultValues: {
      transaction_id: transaction_id || "",
      product_id: data?.id || "",
      rate: 0,
      review: "",
    },
  });

  const { mutate: saveRating, isPending } = useMutation({
    mutationKey: ["save-rating"],
    mutationFn: async (formData: RateFormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/rating`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onError: (e) => {
      toast("Error submitting rating ⚠️");
    },
    onSuccess: () => {
      toast("Rating submitted successfully 🎉");
      window.location.reload();
      router.refresh();
    },
  });

  const onSubmit: SubmitHandler<RateFormData> = (data) => {
    saveRating(data);
  };

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:p-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Tab.Group as="div" className="flex flex-col-reverse">
              <Tab.Panels className="aspect-h-1 aspect-w-1 w-full flex justify-center items-center">
                <Image
                  src={
                    data?.image_product ||
                    "https://flowbite.com/docs/images/examples/image-1@2x.jpg"
                  }
                  alt={"more image"}
                  className="object-cover object-center sm:rounded-lg"
                  width={1000}
                  height={1000}
                />
              </Tab.Panels>
            </Tab.Group>

            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-2xl font-medium tracking-tight text-gray-900">
                {data.name_product} {""}
                {data.is_preorder && (
                  <span className="text- text-red-600">(Preorder)</span>
                )}
              </h1>
              <h2>How About the quality of the product?</h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 mt-4"
                >
                  <FormField
                    control={form.control}
                    name="rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Rating</FormLabel>
                        <FormDescription>
                          Please rate the product from 1 to 5.
                        </FormDescription>
                        <FormControl>
                          <Rating
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="review"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Review</FormLabel>
                        <FormDescription>
                          Share your thoughts about the product.
                        </FormDescription>
                        <FormControl className="mt-3.5">
                          <Textarea
                            className="min-h-32"
                            {...field}
                            value={field.value ?? ""}
                            placeholder="Write your review here"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <Button
                    loadingText="Saving"
                    isLoading={isPending}
                    type="submit"
                    size="sm"
                    className="bg-lime-900 text-white"
                  >
                    Save Product
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailRating;
