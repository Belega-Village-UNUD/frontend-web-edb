import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import Heading from "@/app/components/products/Heading";
import { resetForm } from "@/utils/api";

interface ResetFormProps {
  onSubmit: () => void;
}

const ResetForm = ({ onSubmit }: ResetFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FieldValues>({
    defaultValues: {
      newPassword: "",
      "confirmNewPassword": "",
    },
  });

  const handleFormSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);

      const email = localStorage.getItem('email');
      const token = localStorage.getItem('token');

      if (!email && !token) {
        toast.error('Email atau token tidak tersedia');
        setIsLoading(false);
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // const response = await axios.put(`${resetForm}`, data);
      const endpoint = 'https://belega-commerce-api-staging-tku2lejm6q-et.a.run.app/api/auth/password/reset'
      const response = await axios.put(endpoint, data)
      const responseJson = response.data;

      if (responseJson.success === true) {
        toast.success(responseJson.message);
        onSubmit();
        setIsLoading(false);
        localStorage.clear();
        router.push('/buyer/login');
      }

    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setNewPassword(getValues('newPassword'));

  }, [getValues]);

  return (
    <>
      <Heading title="Buat password baru" />
      <hr className="bg-slate-300 w-full h-px" />
      <Input id="newPassword" type="password" label="Password Baru" disable={isLoading} register={register} errors={errors} required />
      <Input id="confirmNewPassword" type="password" label="Konfirmasi Password Baru" disable={isLoading} register={register} errors={errors} validate={(value) => value === getValues('newPassword') || "Password tidak sama"} required />
      <Button outline label={isLoading ? 'Loading' : 'Konfirmasi Password'} onClick={handleSubmit(handleFormSubmit)} />
    </>
  );
}

export default ResetForm;