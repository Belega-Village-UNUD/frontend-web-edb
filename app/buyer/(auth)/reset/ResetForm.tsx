import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import ButtonConfirm from "@/components/button/ButtonConfirm";
import InputAuth from "@/components/inputs/InputAuth";
import Heading from "@/components/products/Heading";

interface ResetFormProps {
  onSubmit: () => void;
}

const ResetForm = ({ onSubmit }: ResetFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FieldValues>({
    defaultValues: {
      newPassword: "",
      "confirmNewPassword": "",
    },
  });

  const handleFormSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);

      const token = await localStorage.getItem('token');

      if (!token) {
        toast.error('Email atau token tidak tersedia');
        setIsLoading(false);
        return;
      }

      // const responseJson = await putResetPassword(token, data)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password/reset`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const responseJson = await response.json();

      if (responseJson.success === true) {
        toast.success(responseJson.message);
        onSubmit();
        localStorage.clear();
        setIsLoading(false);
        router.push('/buyer/login');
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
    setNewPassword(getValues('newPassword'));
  }, [getValues]);

  return (
    <>
      <Heading title="Create New Password" />
      <hr className="bg-slate-300 w-full h-px" />
      <InputAuth name="newPassword" type="password" label="New Password" disable={isLoading} register={register} errors={errors} required />
      <InputAuth name="confirmNewPassword" type="password" label="Confirm New Password" disable={isLoading} register={register} errors={errors} validate={(value) => value === getValues('newPassword') || "Password tidak sama"} required />
      <ButtonConfirm outline label={isLoading ? '' : 'Confirm your new password'} loading={isLoading} onClick={handleSubmit(handleFormSubmit)} />
    </>
  );
}

export default ResetForm;