"use client";

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Input from "../../components/inputs/Input";
import Heading from "../../components/products/Heading";
import Button from "../../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    try {
      const loading = setIsLoading(true);
    console.log(loading);
    } catch (error) {
      console.log(error);
    }
    
  }

  return (
    <>
      <Heading title="Log In your account" />
      <Button outline label="Log In with Google" icon={AiOutlineGoogle} onClick={() => { }} />
      <hr className="bg-slate-300 w-full h-px" />
      <Input id="email" label="Email" disable={isLoading} register={register} errors={errors} required />
      <Input id="password" label="Password" disable={isLoading} register={register} errors={errors} type="password" required />
      <Button label={isLoading ? 'Loading' : 'Log In'} onClick={handleSubmit(onSubmit)} />
      <Link href='/reset' className="text-lime-600">Forget password?</Link>
      <p className="text-sm">
        Don`t have an account? <Link href='/register' className="underline">Sign Up</Link>
      </p>
    </>
  );
}

export default LoginForm;