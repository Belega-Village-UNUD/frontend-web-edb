"use client";

import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import ButtonConfirm from "@/components/button/ButtonConfirm";
import InputAuth from "@/components/inputs/InputAuth";
import Heading from "@/components/products/Heading";
import { usePersistedUser } from "@/zustand/users";
import Link from "next/link";
import { useRouter } from "next/navigation";

const VerifForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  const [token, setToken] = usePersistedUser((state) => [state.token, state.setToken])

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      otp: "",
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);

      if (!token) {
        toast.error('Token tidak tersedia');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const responseJson = await response.json();

      if (responseJson.success === true) {
        setToken(responseJson.data.token);
        toast.success(responseJson.message);
        router.push('/buyer/login')
        setIsLoading(false);
        return
      }

      toast.error(responseJson.message);
      setIsLoading(false);

    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  }

  const onResendOTP = async () => {
    try {
      setIsLoading(true);

      if (!token) {
        toast.error('Anda belum login');
        setIsLoading(false);
        return;
      }

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
        setCountdown(60)
        setIsLoading(false);
        return
      }

      toast.error(responseJson.message);
      setIsLoading(false);

    }
    catch (error: any) {
      setIsLoading(false);
      toast.error(error.message)
    }
  }

  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [countdown]);

  return (
    <>
      <Heading title="Enter OTP Code" />
      <hr className="bg-slate-300 w-full h-px" />
      <h4>Check your email to see the OTP Code</h4>
      <InputAuth name="otp" label="OTP Code" disable={isLoading} register={register} errors={errors} required />
      <ButtonConfirm outline label={isLoading ? '' : 'Confirm your OTP Code'} loading={isLoading} onClick={handleSubmit(onSubmit)} />
      {countdown > 0 && (
        <p className="text-sm">OTP time remaining : {formatCountdown()} second</p>
      )}
      {countdown === 0 && (
        <p className="text-base">
          Not receiving OTP Code?{" "}
          <Link href="/buyer/verif" className="text-lime-500 hover:text-lime-700" onClick={onResendOTP}>
            Send again
          </Link>
        </p>
      )}
    </>
  );
}

export default VerifForm;