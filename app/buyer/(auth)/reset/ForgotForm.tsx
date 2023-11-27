"use client";

import { useState } from "react";
import { FieldValues, SubmitHandler, set, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

import Input from "../../../components/inputs/Input";
import Heading from "../../../components/products/Heading";
import Button from "../../../components/Button";
import { forgetForm } from "@/utils/api";

interface ForgetFormProps {
  onForgetFormSubmit: () => void;
}

const ForgotForm = ({ onForgetFormSubmit }: ForgetFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      email: "",
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      localStorage.clear();
      setIsLoading(true);

      // const response = await axios.post(`${forgetForm}`, data);
      const endpoint = 'https://belega-commerce-api-staging-tku2lejm6q-et.a.run.app/api/auth/password/forgot'
      const response = await axios.post(endpoint, data)
      const responseJson = response.data.data;

      if (responseJson.token !== null) {
        localStorage.setItem('token', responseJson.token);
        localStorage.setItem('email', data.email)
        toast.success(response.data.message);
        setIsLoading(false);
        onForgetFormSubmit();
      }
    }
    catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  }

  return (
    <>
      <Heading title="Lupa Password" />
      <hr className="bg-slate-300 w-full h-px" />
      <Input id="email" label="Email" type="email" disable={isLoading} register={register} errors={errors} required />
      <Button outline label={isLoading ? 'Loading' : 'Konfirmasi Email'} onClick={handleSubmit(onSubmit)} />
    </>
  );
}

export default ForgotForm;