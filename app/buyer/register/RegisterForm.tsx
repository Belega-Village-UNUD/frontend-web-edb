"use client";

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Input from "../../components/inputs/Input";
import Heading from "../../components/products/Heading";
import Button from "../../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {register, handleSubmit, formState: {errors}} = useForm<FieldValues>({
    defaultValues: {
      name: "",
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
      <Heading title="Sign Up your account" />
      <Button outline label="Sign Up with Google" icon={AiOutlineGoogle} onClick={() => {}}/>
      <hr className="bg-slate-300 w-full h-px"/>
      <Input id="name" label="Name" disable={isLoading} register={register} errors={errors} required />
      <Input id="email" label="Email" disable={isLoading} register={register} errors={errors} required />
      <Input id="password" label="Password" disable={isLoading} register={register} errors={errors} type="password" required />
      {/* <Button label={isLoading? 'Loading' : 'Sign Up' } onClick={handleSubmit(onSubmit)} /> */}
      <Button label={isLoading? 'Loading':'Sign Up'} onClick={handleSubmit(onSubmit)}/>
      <p className="text-sm">
        Already have an account? <Link href='/login' className="underline">Log in</Link>
      </p>
    </>
  );
}

export default RegisterForm;