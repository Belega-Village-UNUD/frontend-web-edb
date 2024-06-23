"use client"

import ButtonConfirm from "@/components/button/ButtonConfirm"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useStoreState } from "@/zustand/stores"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const FormSchema = z.object({
  ktp: z.any()
})

interface FileFormStoreProps {
  onFileFormSubmit: () => void;
}

const FileFormStore = ({ onFileFormSubmit }: FileFormStoreProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [nameStore, phone, description, address, province, city] = useStoreState((state) => [
    state.nameStore,
    state.phone,
    state.description,
    state.address,
    state.province,
    state.city,
  ])
  const router = useRouter();

  const handleFileChange = (e: any) => {
    setSelectedFile(e.target.files[0]);
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ktp: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append('ktp', selectedFile);
    formData.append('name', nameStore);
    formData.append('phone', phone);
    formData.append('description', description);
    formData.append('address', address);

    const provinceJson = JSON.stringify({
      province: province.province,
      province_id: province.province_id,
    })
    const cityJson = JSON.stringify({
      type: city.type,
      city_id: city.city_id,
      province: city.province,
      city_name: city.city_name,
      postal_code: city.postal_code,
      province_id: city.province_id,
    })
    formData.append('province', provinceJson);
    formData.append('city', cityJson);
    console.log(formData.get('province'))
    try {
      setIsLoading(true);
      const token = await localStorage.getItem('token');
      if (!token) {
        toast.error("Please login first");
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/store`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const responseJson = await response.json();
      console.log(responseJson)
      if (responseJson.success === true) {
        setIsLoading(false);
        toast.success(responseJson.message);
        router.push('/');
      } else {
        toast.error(responseJson.message);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }

  return (
    <Form {...form}>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="ktp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">KTP </FormLabel>
              <FormControl>
                <Input type="file" placeholder="file" {...field} onChange={handleFileChange} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonConfirm type="submit" label="Submit" loading={isLoading} outline />
      </form>
    </Form>
  )
};

export default FileFormStore;