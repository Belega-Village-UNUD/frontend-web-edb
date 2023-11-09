"use client";

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Input from "../components/inputs/Input";
import Heading from "../components/products/Heading";
import Button from "../components/Button";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Link from "next/link";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    console.log(data);
  }

  return (
    <>
      <Heading title="Reset your password" />
      <hr className="bg-slate-300 w-full h-px" />
      <Input id="email" label="Email" disable={isLoading} register={register} errors={errors} required />
      <Button label={isLoading ? 'Loading' : 'Reset Password'} onClick={handleSubmit(onSubmit)} />
    </>
  );
}

export default LoginForm;