"use client";

import ButtonConfirm from "@/components/button/ButtonConfirm";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useStoreState } from "@/zustand/stores";
import { usePersistedUser } from "@/zustand/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  ktp: z.any(),
});

interface FileFormStoreProps {
  onFileFormSubmit: () => void;
}

const FileFormStore = ({ onFileFormSubmit }: FileFormStoreProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null); // State untuk menyimpan nama file
  const router = useRouter();

  const [token, setExistStore] = usePersistedUser((state) => [
    state.token,
    state.setExistStore,
  ]);
  const [nameStore, phone, description, address, city_id] = useStoreState(
    (state) => [
      state.nameStore,
      state.phone,
      state.description,
      state.address,
      state.city_id,
    ]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setFileName(file ? file.name : null); // Simpan nama file
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ktp: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("ktp", selectedFile);
    formData.append("name", nameStore);
    formData.append("phone", phone);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("city_id", city_id);
    try {
      setIsLoading(true);
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register/store`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const responseJson = await response.json();

      if (responseJson.success === true) {
        setIsLoading(false);
        setExistStore(true);
        toast.success(responseJson.message);
        router.push("/");
      } else {
        toast.error(responseJson.message);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

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
                <Input
                  type="file"
                  placeholder="file"
                  {...field}
                  onChange={handleFileChange}
                />
              </FormControl>
              {fileName && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {fileName}
                </p>
              )}
              <FormDescription>This is your valid ktp.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonConfirm
          type="submit"
          label="Submit"
          loading={isLoading}
          outline
        />
      </form>
    </Form>
  );
};

export default FileFormStore;
