"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import ButtonConfirm from "@/components/button/ButtonConfirm";
import InputAuth from "@/components/inputs/InputAuth";
import Heading from "@/components/products/Heading";
import { usePersistedUser } from "@/zustand/users";

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [setToken] = usePersistedUser((state) => [state.setToken]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const responseJson = await response.json();
      if (responseJson.success === true) {
        setIsLoading(false);
        toast.success(responseJson.message);
        setToken(responseJson.data.token);
        router.push("/buyer/verif");
      } else if (responseJson.success === false) {
        setIsLoading(false);
        toast.error(responseJson.message);
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error("Terjadi kesalahan");
    }
  };

  useEffect(() => {
    setPassword(getValues("password"));
  }, [getValues, router]);

  return (
    <>
      <Heading title="Register with Email" />
      {/* <Button outline label="Sign Up with Google" icon={AiOutlineGoogle} onClick={() => { }} /> */}
      <hr className="bg-slate-300 w-full h-px" />
      <p className="text-base">
        Do you have account?{" "}
        <Link
          href="/buyer/login"
          className="text-lime-500 hover:text-lime-700 hover:underline"
        >
          Log in
        </Link>
      </p>
      <InputAuth
        name="email"
        type="email"
        label="Email"
        disable={isLoading}
        register={register}
        errors={errors}
        required
      />
      <InputAuth
        name="password"
        type="password"
        label="Password"
        disable={isLoading}
        register={register}
        errors={errors}
        required
      />
      <InputAuth
        name="confirmPassword"
        label="Confirm Password"
        disable={isLoading}
        register={register}
        errors={errors}
        type="password"
        validate={(value) =>
          value === getValues("password") || "Password tidak sama"
        }
        required
      />
      <ButtonConfirm
        outline
        label={isLoading ? "" : "Create an Account"}
        loading={isLoading}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default RegisterForm;
