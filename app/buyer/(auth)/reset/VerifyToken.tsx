import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { verifyForm } from "@/utils/api";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import Heading from "@/app/components/products/Heading";

interface ResetFormProps {
  onTokenVerified: () => void;
}

const VerifyToken = ({ onTokenVerified }: ResetFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Token tidak tersedia');
        setIsLoading(false);
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // const response = await axios.post(`${verifyForm}`, data);
      const endpoint = 'https://belega-commerce-api-staging-tku2lejm6q-et.a.run.app/api/auth/otp/verify'
      const response = await axios.post(endpoint, data)
      const responseJson = response.data;

      if (responseJson.success === true) {
        localStorage.setItem('token', responseJson.data.token);

        toast.success(responseJson.message);
        setIsLoading(false);
        onTokenVerified();
      }

    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  }

  return (
    <>
      <Heading title="Masukkan OTP Code" />
      <hr className="bg-slate-300 w-full h-px" />
      <h4>Cek email anda untuk melihat OTP Code</h4>
      <Input id="otp" label="OTP Code" disable={isLoading} register={register} errors={errors} required />
      <Button outline label={isLoading ? 'Loading' : 'Masukkan OTP'} onClick={handleSubmit(onSubmit)} />
    </>
  )
}

export default VerifyToken;