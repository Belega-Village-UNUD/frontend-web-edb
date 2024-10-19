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
  FormMessage
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

  useEffect(() => {
    setToken(tokenFromStore);
  }, [tokenFromStore]);

  const { mutate: payAction, isPending } = useMutation({
    mutationFn: async ({ code, service }: any) => {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/buyer/final?transaction_id=${dataCheckout?.id}&shipping_name=["${service}"]&shipping_cost_index=[${code}]`,
        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success("Shipping successful selected");
      window.location.reload();
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
    const payload: any = {
      service: data.shipping.service,
      code: data.shipping.code,
    };

    payAction(payload);
  }

  return (
    <div className=" w-full">
      <div className="w-full mx-auto rounded-lg bg-white bordertext-gray-800 font-light mb-2 ">
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
                  {shipping
                    .filter(
                      (ship: any) =>
                        ship?.shipping[0]?.costs &&
                        ship.shipping[0].costs.length > 0
                    ) // Filter out items with null or empty costs
                    .map((ship: any, index: number) => (
                      <Accordion key={index} type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger>
                            {ship?.shipping[0]?.code}
                          </AccordionTrigger>
                          <AccordionContent>
                            <FormControl>
                              <RadioGroup
                                value={
                                  field.value ? JSON.stringify(field.value) : ""
                                } // Set the selected value
                                onValueChange={(value) =>
                                  field.onChange(JSON.parse(value))
                                }
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

            {dataCheckout?.redirect_url ? null : (
              <Button
                isLoading={isPending}
                rel="noopener noreferrer"
                className="text-center  w-full mx-auto border border-transparent bg-green hover:bg-blue-950 bg-blue-900 focus:bg-lime-950 text-white rounded-md px-3 py-4 justify-center items-center flex font-semibold cursor-pointer"
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
