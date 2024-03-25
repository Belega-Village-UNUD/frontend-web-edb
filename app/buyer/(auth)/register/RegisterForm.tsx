"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import ButtonConfirm from "@/components/button/ButtonConfirm";
import InputAuth from "@/components/inputs/InputAuth";
import Heading from "@/components/products/Heading";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  const router = useRouter()

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
      "confirmPassword": "",
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      localStorage.clear();
      setIsLoading(true);

      // const responseJson = await postRegister(data);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const responseJson = await response.json();

      if (responseJson.success === true) {
        await localStorage.setItem('token', responseJson.data.token);

        toast.success(responseJson.message);
        router.push('/buyer/verif');
        setIsLoading(false);
      } else if (responseJson.success === false) {
        toast.error(responseJson.message);
        setIsLoading(false);
      }

    } catch (error: any) {
      setIsLoading(false);
      toast.error("Terjadi kesalahan");
    }
  }

  useEffect(() => {
    setPassword(getValues('password'));

    const onAuthSuccess = () => {
      router.push('/');
    };
  }, [getValues, router])

  return (
    <>
      <Heading title="Register with Email" />
      {/* <Button outline label="Sign Up with Google" icon={AiOutlineGoogle} onClick={() => { }} /> */}
      <hr className="bg-slate-300 w-full h-px" />
      <p className="text-base">
        Do you have account? <Link href='/buyer/login' className="text-lime-500 hover:text-lime-700 hover:underline">Log in</Link>
      </p>
      <InputAuth name="email" type="email" label="Email" disable={isLoading} register={register} errors={errors} required />
      <InputAuth name="password" type="password" label="Password" disable={isLoading} register={register} errors={errors} required />
      <InputAuth name="confirmPassword" label="Confirm Password" disable={isLoading} register={register} errors={errors} type="password" validate={(value) => value === getValues('password') || "Password tidak sama"} required />
      <ButtonConfirm outline label={isLoading ? '' : 'Create an Account'} loading={isLoading} onClick={handleSubmit(onSubmit)} />
    </>
  );
}

export default RegisterForm;