"use client";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { usePersistedUser } from "@/zustand/users";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

interface PaymentProps {
  dataCheckout: any;
  profile: any;
  shipping: any;
}

function Payment({ dataCheckout, profile, shipping }: PaymentProps) {
  // const tokenFromStore = usePersistedUser.getState().token;
  // const [token, setToken] = useState<string>();
  // const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   setToken(tokenFromStore);
  // }, [tokenFromStore]);

  // // async function handlePay() {
  // //   try {
  // //     setSubmitLoading(true);
  // //     const response = await axios.put(
  // //       `${process.env.NEXT_PUBLIC_API_URL}/transaction/buyer/?transaction_id=${dataCheckout?.id}&shipping_name=["tiki"]&shipping_cost_index=[0]`,
  // //       // {
  // //       //   transaction_id: dataCheckout.id,
  // //       //   shipping_name: ["tiki"],
  // //       //   shipping_cost_index: [0],
  // //       // },
  // //       {
  // //         headers: {
  // //           Authorization: `Bearer ${token}`,
  // //           "Content-Type": "application/json",
  // //         },
  // //       }
  // //     );
  // //     setSubmitLoading(false);

  // //     if (response.status === 200) {
  // //       toast.success("Payment successful");
  // //     } else {
  // //       toast.success("Payment Failed");
  // //     }
  // //   } catch (error) {
  // //     console.error("Error during payment:", error);
  // //   }
  // // }

  // const { mutate: payAction, isPending } = useMutation({
  //   mutationFn: async ({ code, service }: any) => {
  //     console.log(token);
  //     const response = await axios.put(
  //       `${process.env.NEXT_PUBLIC_API_URL}/transaction/buyer/?transaction_id=${dataCheckout?.id}&shipping_name=["${service}"]&shipping_cost_index=[${code}]`,
  //       {},
  //       // `${process.env.NEXT_PUBLIC_API_URL}/transaction/buyer/?transaction_id=${dataCheckout?.id}&shipping_name=["tiki"]&shipping_cost_index=[0]`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     return response.data;
  //   },
  //   onSuccess: () => {
  //     toast.success("Payment successful");
  //   },
  //   onError: (error) => {
  //     console.error("Error during payment:", error);
  //     toast.error("Payment Failed");
  //   },
  // });

  // const FormSchema = z.object({
  //   shipping: z.object({
  //     service: z.string().nonempty("Service is required"),
  //     code: z.number(),
  //   }),
  // });

  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  // });

  // function onSubmit(data: z.infer<typeof FormSchema>) {
  //   const payload: any = {
  //     service: data.shipping.service,
  //     code: data.shipping.code,
  //   };

  //   console.log(payload.service);
  //   payAction(payload);
  // }

  return (
    <div className="px-3 md:w-5/12">
      {/* <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 p-6 text-gray-800 font-light mb-2">
        <div className="w-full flex mb-3 items-center justify-between">
          <div className="w-32 text-left">
            <span className="text-gray-600 font-semibold">Order Number</span>
          </div>
          <div className="flex-grow pl-3 text-right">
            <span>{dataCheckout?.id}</span>
          </div>
        </div>
        <div className="w-full flex mb-3 items-center justify-between">
          <div className="w-32 text-left">
            <span className="text-gray-600 font-semibold">Name</span>
          </div>
          <div className="flex-grow pl-3 text-right">
            <span>{profile?.name}</span>
          </div>
        </div>
        <div className="w-full flex mb-3 items-center justify-between">
          <div className="w-32 text-left">
            <span className="text-gray-600 font-semibold">Email</span>
          </div>
          <div className="flex-grow pl-3 text-right">
            <span>{dataCheckout?.cart_details[0]?.user?.email}</span>
          </div>
        </div>
        <div className="w-full flex mb-3 items-center justify-between">
          <div className="w-32 text-left">
            <span className="text-gray-600 font-semibold">Address</span>
          </div>
          <div className="flex-grow pl-3 text-right">
            <span>{profile?.address}</span>
          </div>
        </div>
        <div className="w-full flex mb-3 items-center justify-between">
          <div className="w-32 text-left">
            <span className="text-gray-600 font-semibold">Province</span>
          </div>
          <div className="flex-grow pl-3 text-right">
            <span>{shipping[0]?.destination?.province}</span>
          </div>
        </div>
        <div className="w-full flex mb-3 items-center justify-between">
          <div className="w-32 text-left">
            <span className="text-gray-600 font-semibold">City</span>
          </div>
          <div className="flex-grow pl-3 text-right">
            <span>{shipping[0]?.destination?.city_name}</span>
          </div>
        </div>
        <div className="w-full flex mb-3 items-center justify-between">
          <div className="w-32 text-left">
            <span className="text-gray-600 font-semibold">Postal Code</span>
          </div>
          <div className="flex-grow pl-3 text-right">
            <span>{shipping[0]?.destination?.postal_code}</span>
          </div>
        </div>
        <div className="w-full flex mb-3 items-center justify-between">
          <div className="w-32 text-left">
            <span className="text-gray-600 font-semibold">Phone</span>
          </div>
          <div className="flex-grow pl-3 text-right">
            <span>{profile?.phone}</span>
          </div>
        </div>
      </div> */}

      <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 p-6 text-gray-800 font-light mb-2 shadow-md">
        {[
          { label: "Order Number", value: dataCheckout?.id },
          { label: "Name", value: profile?.name },
          { label: "Email", value: dataCheckout?.cart_details[0]?.user?.email },
          { label: "Address", value: profile?.address },
          { label: "Province", value: shipping[0]?.destination?.province },
          { label: "City", value: shipping[0]?.destination?.city_name },
          { label: "Postal Code", value: shipping[0]?.destination?.postal_code },
          { label: "Phone", value: profile?.phone },
        ].map((item, index) => (
          <div key={index} className="w-full flex mb-3 items-center justify-between">
            <div className="w-32 text-left">
              <span className="text-gray-600 font-semibold">{item.label}</span>
            </div>
            <div className="flex-grow pl-3 text-right">
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 p-3 text-gray-800 font-light mb-2 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="shipping"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Shipping</FormLabel>
                  {shipping.map((ship: any, index: number) => (
                    <Accordion key={index} type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          {ship?.shipping[0]?.code}
                        </AccordionTrigger>
                        <AccordionContent>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) =>
                                field.onChange(JSON.parse(value))
                              }
                              defaultValue={JSON.stringify(field.value)}
                              className="flex flex-col space-y-1"
                            >
                              {ship?.shipping[0]?.costs?.map(
                                (cost: any, index: number) => (
                                  <FormItem
                                    key={index}
                                    className="flex items-center space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <RadioGroupItem
                                        value={JSON.stringify({
                                          service: ship?.shipping[0]?.code,
                                          code: index,
                                        })}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {`${cost?.description} (${cost.service})`}
                                    </FormLabel>
                                  </FormItem>
                                )
                              )}
                            </RadioGroup>
                          </FormControl>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              isLoading={isPending}
              rel="noopener noreferrer"
              className="text-center  w-full mx-auto border border-transparent bg-green hover:bg-lime-950 bg-lime-900 focus:bg-lime-950 text-white rounded-md px-3 py-4 justify-center items-center flex font-semibold cursor-pointer"
            >
              PAY NOW
            </Button>
          </form>
        </Form>
      </div> */}
    </div>
  );
}

export default Payment;
