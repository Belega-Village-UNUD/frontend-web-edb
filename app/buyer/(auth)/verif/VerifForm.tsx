"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import axios from "axios";
import Link from "next/link";
import Button from "../../../components/Button";
import Input from "../../../components/inputs/Input";
import Heading from "../../../components/products/Heading";

const VerifForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      otp: "",
    },
  })

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

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Token tidak tersedia');
        setIsLoading(false);
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // const response = await axios.post(`${verifyForm}`, data);
      const endpoint = 'https://belega-commerce-api-staging-tku2lejm6q-et.a.run.app/api/auth/otp/verify'
      const response = await axios.post(endpoint, data)
      const responseJson = response.data;

      if (responseJson.data.token !== null) {
        localStorage.setItem('token', responseJson.data.token);

        toast.success(responseJson.message);
        router.push('/');
        setIsLoading(false);
      }

    }
    catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  }

  const onResendOTP = async () => {
    try {
      setIsLoading(true);
      setCountdown(60)

      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');

      let params = null

      if (!token) { params = { email: email }; }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // const response = await axios.post(`${resendOtpForm}`, params);
      // const endpoint = 'https://belega-commerce-api-staging-tku2lejm6q-et.a.run.app/api/auth/otp'
      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/otp`;
      const response = await axios.post(url, params)
      const responseJson = response.data;

      if (responseJson.success === true) {
        toast.success(responseJson.message);
        setIsLoading(false);
      }

    }
    catch (error: any) {
      console.log(error)
      setCountdown(60);
      setIsLoading(false);
    }
  }

  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };


  return (
    <>
      <Heading title="Masukkan OTP Code" />
      <hr className="bg-slate-300 w-full h-px" />
      <h4>Cek email anda untuk melihat OTP Code</h4>
      <Input id="otp" label="OTP Code" disable={isLoading} register={register} errors={errors} required />
      <Button outline label={isLoading ? 'Loading' : 'Masukkan OTP'} onClick={handleSubmit(onSubmit)} />
      {countdown > 0 && (
        <p className="text-sm">Waktu OTP tersisa : {formatCountdown()} detik</p>
      )}
      {countdown === 0 && (
        <p className="text-base">
          Tidak menerima kode OTP?{" "}
          <Link href="/buyer/verif" className="text-lime-500 hover:text-lime-700" onClick={onResendOTP}>
            Kirim Ulang
          </Link>
        </p>
      )}
    </>
  );
}

export default VerifForm;