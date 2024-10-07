"use client";

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import ButtonConfirm from "@/components/button/ButtonConfirm";
import InputAuth from "@/components/inputs/InputAuth";
import Heading from "@/components/products/Heading";
import { usePersistedUser } from "@/zustand/users";
import { toast } from "sonner";

interface ForgetFormProps {
  onForgetFormSubmit: () => void;
}

const ForgotForm = ({ onForgetFormSubmit }: ForgetFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const [setToken] = usePersistedUser((state) => [
    state.setToken,
  ])

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      email: "",
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      localStorage.clear();
      setIsLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const responseJson = await response.json();

      if (responseJson.success === true) {
        setToken(responseJson.data.token);

        toast.success(responseJson.message);
        setIsLoading(false);
        onForgetFormSubmit();
        return
      }

      toast.error(responseJson.message);
      setIsLoading(false);
    }
    catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  }

  return (
    <>
      <Heading title="Forgot Password" />
      <hr className="bg-slate-300 w-full h-px" />
      <InputAuth name="email" label="Email" type="email" disable={isLoading} register={register} errors={errors} required />
      <ButtonConfirm outline label={isLoading ? '' : 'Confirm your email'} loading={isLoading} onClick={handleSubmit(onSubmit)} />
    </>
  );
}

export default ForgotForm;