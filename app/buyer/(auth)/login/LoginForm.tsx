"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import axios from "axios";
import toast from "react-hot-toast";
import Button from "../../../components/Button";
import Input from "../../../components/inputs/Input";
import Heading from "../../../components/products/Heading";

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

      // const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, data)
      // const response = await postLogin(data)
      const responseData = response.data.data;
      const responsePayload = responseData.payload;

      if (responseData.token !== null) {
        // localStorage.setItem('email', responsePayload.email);
        localStorage.setItem('token', responseData.token);
        // localStorage.setItem('is_verified', responsePayload.is_verified);
        localStorage.setItem('is_login', 'true')

        if (responsePayload.is_verified === false) {
          toast("Akun anda belum diverifikasi, silahkan cek email anda", {
            icon: '❗',
          });
          const token = localStorage.getItem('token');
          const email = localStorage.getItem('email');

          let params = null

          if (!token) { params = { email: email }; }

          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/otp`;
          const response = await axios.post(url, params)
          const responseJson = response.data;

          if (responseJson.success === true) {
            toast.success(responseJson.message);
            setIsLoading(false);
          }

          router.push('/buyer/verif');
          return
        }

        toast.success("Login berhasil");
        router.push('/');
        setIsLoading(false);
      }
    }
    catch (error: any) {
      toast.error(error.response.data.message)
      setIsLoading(false);
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
      <Heading title="Masuk dengan email" />
      {/* <Button outline label="Log In with Google" icon={AiOutlineGoogle} onClick={() => { }} /> */}
      <hr className="bg-slate-300 w-full h-px" />
      <p className="text-base">
        Belum punya akun? <Link href='/buyer/register' className="text-lime-500 hover:text-lime-700 hover:underline">Daftar</Link>
      </p>
      <Input id="email" label="Email" type="email" disable={isLoading} register={register} errors={errors} required />
      <Input id="password" label="Password" disable={isLoading} register={register} errors={errors} type="password" required />
      <Button outline label={isLoading ? 'Loading' : 'Masuk'} onClick={handleSubmit(onSubmit)} />
      <Link href='/buyer/reset' className="text-lime-500 hover:text-lime-700 hover:underline">Lupa Password?</Link>
    </>
  );
}

export default LoginForm;