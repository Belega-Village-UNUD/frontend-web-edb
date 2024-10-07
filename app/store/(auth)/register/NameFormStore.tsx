"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import ButtonConfirm from "@/components/button/ButtonConfirm"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useStoreState } from "@/zustand/stores"
import { toast } from "sonner"

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }).max(13, {
    message: "Phone number must be at most 13 characters."
  }),
  description: z.string()
})

interface NameFormStoreProps {
  onNameFormSubmit: () => void;
}

const NameFormStore = ({ onNameFormSubmit }: NameFormStoreProps) => {
  const [nameStore, phone, description, setNameStore, setPhone, setDescription] = useStoreState((state) => [
    state.nameStore,
    state.phone,
    state.description,
    state.setNameStore,
    state.setPhone,
    state.setDescription,
  ])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: nameStore,
      phone: phone,
      description: description,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success("You submitted the following values:")
    setNameStore(data.name)
    setPhone(data.phone)
    setDescription(data.description)
    onNameFormSubmit();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Name Store</FormLabel>
              <FormControl>
                <Input placeholder="John Doe Store" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Phone Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3">
                    <span className="text-gray-300 sm:text-sm">
                      +62
                    </span>
                  </div>
                  <Input type="number" className="pl-14" placeholder="821234138912" {...field} />
                </div>
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Description of Store</FormLabel>
              <FormControl>
                <Textarea placeholder="Input description store" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonConfirm type="submit" label="Submit" />
      </form>
    </Form >
  )
};

export default NameFormStore;