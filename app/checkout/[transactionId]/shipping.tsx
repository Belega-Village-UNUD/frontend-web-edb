"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePersistedUser } from "@/zustand/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface PaymentProps {
  dataCheckout: any;
  profile: any;
  shipping: any;
}

function Shipping({ dataCheckout, profile, shipping }: PaymentProps) {
  const tokenFromStore = usePersistedUser.getState().token;
  const [token, setToken] = useState<string>();

  const [selectedShipping, setSelectedShipping] = useState<{
    [key: string]: any;
  }>({});

  useEffect(() => {
    setToken(tokenFromStore);
  }, [tokenFromStore]);

  function mergeShippingByStore(data: any) {
    const storeMap: any = {};

    data.forEach((ship: any) => {
      const { store_id, shipping } = ship;

      if (!storeMap[store_id]) {
        storeMap[store_id] = { ...ship, shipping: [] };
      }

      storeMap[store_id].shipping.push(...shipping);
    });

    return Object.values(storeMap);
  }

  const mergedData = mergeShippingByStore(shipping);

  const { mutate: payAction, isPending } = useMutation({
    mutationFn: async ({ code, service }: any) => {
      try {

        const serviceString = JSON.stringify(service);
        const codeString = JSON.stringify(code);

        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/transaction/buyer/final?transaction_id=${dataCheckout?.id}&shipping_name=${serviceString}&shipping_cost_index=${codeString}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data.data;
      } catch (error) {
        console.error("Error in mutationFn:", error);
      }
    },
    onSuccess: (data) => {
      toast.success("Shipping successful selected");
      // window.location.reload();
    },
    onError: (error) => {
      console.error("Error during select shipping:", error);
      toast.error("Shipping failed selected");
    },
  });

  const FormSchema = z.object({
    shipping: z.object({
      service: z.string().nonempty("Service is required"),
      code: z.number(),
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const payload = Object.entries(selectedShipping).map(
      ([storeId, shipping]) => ({
        service: shipping.service,
        code: shipping.code,
      })
    );

    const codeArray = payload.map(item => item.code);
    const serviceArray = payload.map(item => `${item.service}`);

    const payloadForPay = {
      code: codeArray,
      service: serviceArray,
    };

    payAction(payloadForPay);
  }

  return (
    <div className="w-full">
      <div className="w-full mx-auto rounded-lg bg-white border text-gray-800 font-light mb-2">
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
                  <FormLabel className="text-base font-semibold text-gray-600">
                    Shipping
                  </FormLabel>
                  {mergedData
                    .filter((store: any) => {
                      const costs = store?.shipping?.[0]?.costs;
                      return Array.isArray(costs) && costs.length > 0;
                    })
                    .map((store: any, index: number) => {
                      const storeId = store.store_id;

                      return (
                        <Accordion key={index} type="single" collapsible>
                          <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger>{storeId}</AccordionTrigger>
                            <AccordionContent>
                              <FormControl>
                                <RadioGroup
                                  value={
                                    selectedShipping[storeId]
                                      ? JSON.stringify(
                                        selectedShipping[storeId]
                                      )
                                      : ""
                                  }
                                  onValueChange={(value) => {
                                    const parsedValue = JSON.parse(value);
                                    setSelectedShipping((prev) => ({
                                      ...prev,
                                      [storeId]: parsedValue, // Update specific store's shipping
                                    }));
                                    field.onChange(parsedValue); // Update the form field value if needed
                                  }}
                                >
                                  {store.shipping.map((shippingOption: any) =>
                                    shippingOption.costs.map(
                                      (cost: any, costIndex: number) => (
                                        <FormItem
                                          key={costIndex}
                                          className="flex items-center space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <RadioGroupItem
                                              value={JSON.stringify({
                                                service: shippingOption.code,
                                                code: costIndex,
                                              })}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {`${cost.description} (${cost.service}) `}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    )
                                  )}
                                </RadioGroup>
                              </FormControl>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      );
                    })}
                  <FormMessage />
                </FormItem>
              )}
            />

            {dataCheckout?.redirect_url ? null : (
              <Button
                type="submit"
                isLoading={isPending}
                rel="noopener noreferrer"
                className="text-center w-full mx-auto border border-transparent bg-green hover:bg-blue-950 bg-blue-900 focus:bg-lime-950 text-white rounded-md px-3 py-4 justify-center items-center flex font-semibold cursor-pointer"
              >
                Check Shipping
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Shipping;
