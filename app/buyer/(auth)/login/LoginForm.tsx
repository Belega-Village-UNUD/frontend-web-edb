"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import ButtonConfirm from "@/components/button/ButtonConfirm";
import InputAuth from "@/components/inputs/InputAuth";
import Heading from "@/components/products/Heading";
import { create } from "@/utils/cookies";
import { usePersistedUser } from "@/zustand/users";
import { useShallow } from "zustand/react/shallow";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [token, is_login] = usePersistedUser((state) => [state.token, state.is_login]);
  const [setToken, setIsLogin, setIsStore, setExistStore] = usePersistedUser(
    useShallow((state) => {
      return [
        state.setToken,
        state.setIsLogin,
        state.setIsStore,
        state.setExistStore,
      ]
    })
  )

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      const responseJson = await response.json();

      if (responseJson.success === true) {
        setToken(responseJson.data.token);
        create()
        setIsLogin(true);
        setIsStore(responseJson.data.payload.is_store);
        setExistStore(responseJson.data.payload.exist_store);
        toast.success(responseJson.message);
        setIsLoading(false);

        if (responseJson.data.payload.is_verified === false) {
          toast.warning("Akun anda belum diverifikasi, silahkan cek email anda");

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
    if (is_login === true) {
      router.push('/');
    }

  }, [is_login, router]);

  return (
    <>
      <Heading title="Log in with Email" />
      <hr className="bg-slate-300 w-full h-px" />
      <p className="text-base">
        Don`t have an account?
        <Link href='/buyer/register' className="text-lime-500 hover:text-lime-700 hover:underline"> Register</Link>
      </p>
      <InputAuth name="email" label="Email" type="email" disable={isLoading} register={register} errors={errors} required />
      <InputAuth name="password" label="Password" disable={isLoading} register={register} errors={errors} type="password" required />
      <ButtonConfirm outline label={isLoading ? '' : 'Log in'} loading={isLoading} onClick={handleSubmit(onSubmit)} />
      <Link href='/buyer/reset' className="text-lime-500 hover:text-lime-700 hover:underline">Forgot your password?</Link>
    </>
  );
}

export default LoginForm;