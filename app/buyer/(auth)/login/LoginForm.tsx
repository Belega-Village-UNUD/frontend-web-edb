"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import ButtonConfirm from "@/components/button/ButtonConfirm";
import InputAuth from "@/components/inputs/InputAuth";
import Heading from "@/components/products/Heading";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      localStorage.clear();

      // const responseJson = await postLogin(data);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      const responseJson = await response.json();

      if (responseJson.success === true) {
        localStorage.setItem('token', responseJson.data.token)
        localStorage.setItem('is_login', 'true')
        toast.success(responseJson.message);
        setIsLoading(false);

        if (responseJson.data.payload.is_verified === false) {
          toast("Akun anda belum diverifikasi, silahkan cek email anda", { icon: '❗' });
          const token = localStorage.getItem('token');

          // const responseJson = await postResendOTP(token)
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          const responseJson = await response.json();

          if (responseJson.success === true) {
            toast.success(responseJson.message);
          }
          router.push('/buyer/verif');
          setIsLoading(false);
          return
        }

        router.push('/');
        return
      }

      toast.error(responseJson.message);
      setIsLoading(false);

    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    const isLoged = localStorage.getItem('is_login');
    if (isLoged === 'true') {
      router.push('/');
    }

  }, [router]);

  return (
    <>
      <Heading title="Log in with Email" />
      {/* <Button outline label="Log In with Google" icon={AiOutlineGoogle} onClick={() => { }} /> */}
      <hr className="bg-slate-300 w-full h-px" />
      <p className="text-base">
        Don`t have an account? <Link href='/buyer/register' className="text-lime-500 hover:text-lime-700 hover:underline">Register</Link>
      </p>
      <InputAuth name="email" label="Email" type="email" disable={isLoading} register={register} errors={errors} required />
      <InputAuth name="password" label="Password" disable={isLoading} register={register} errors={errors} type="password" required />
      <ButtonConfirm outline label={isLoading ? '' : 'Log in'} loading={isLoading} onClick={handleSubmit(onSubmit)} />
      <Link href='/buyer/reset' className="text-lime-500 hover:text-lime-700 hover:underline">Forgot your password?</Link>
    </>
  );
}

export default LoginForm;