import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

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

      const token = await localStorage.getItem('token');

      if (!token) {
        toast.error('Token tidak tersedia');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const responseJson = await response.json();

      if (responseJson.data.success === true) {
        localStorage.setItem('token', responseJson.data.token);
        toast.success(responseJson.data.message);
        setIsLoading(false);
        onTokenVerified();
      }
      // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp/verify`, data)
      // const responseJson = response.data;

      // if (response.data.success === true) {
      //   localStorage.setItem('token', response.data.token);
      //   toast.success(response.data.message);
      //   setIsLoading(false);
      //   onTokenVerified();
      // }

    } catch (error: any) {
      // toast.error(error.response.message);
      console.log(error);
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