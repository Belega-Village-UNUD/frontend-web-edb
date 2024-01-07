"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Button from "../../../components/Button";
import Input from "../../../components/inputs/Input";
import Heading from "../../../components/products/Heading";

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

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, data)
      const responseJson = response.data;

      if (responseJson.data.token !== null) {
        localStorage.setItem('token', responseJson.data.token);

        toast.success(responseJson.message);
        router.push('/buyer/verif');
        setIsLoading(false);
      }

    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
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
      <Heading title="Daftar dengan email" />
      {/* <Button outline label="Sign Up with Google" icon={AiOutlineGoogle} onClick={() => { }} /> */}
      <hr className="bg-slate-300 w-full h-px" />
      <p className="text-base">
        Sudah punya akun? <Link href='/buyer/login' className="text-lime-500 hover:text-lime-700 hover:underline">Log in</Link>
      </p>
      <Input id="email" type="email" label="Email" disable={isLoading} register={register} errors={errors} required />
      <Input id="password" type="password" label="Password" disable={isLoading} register={register} errors={errors} required />
      <Input id="confirmPassword" label="Confirm Password" disable={isLoading} register={register} errors={errors} type="password" validate={(value) => value === getValues('password') || "Password tidak sama"} required />
      <Button outline label={isLoading ? 'Loading' : 'Daftar akun'} onClick={handleSubmit(onSubmit)} />
    </>
  );
}

export default RegisterForm;