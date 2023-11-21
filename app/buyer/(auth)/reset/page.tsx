'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import ForgetForm from "./ForgotForm";
import ResetForm from "./ResetForm";
import VerifyToken from "./VerifyToken";

const Reset = () => {
  const [isForgetFormSubmitted, setIsForgetFormSubmitted] = useState(false);
  const [isTokenVerified, setIsTokenVerified] = useState(false);

  const router = useRouter();

  const handleResetFormSubmit = () => {
    setIsForgetFormSubmitted(true);
  }

  const handleTokenVerification = () => {
    setIsTokenVerified(true)
  }

  useEffect(() => {
    const onAuthSuccess = () => {
      router.push('/');
    };

  }, [router]);

  return (
    <Container>
      <FormWrap>
        {!isForgetFormSubmitted && <ForgetForm onForgetFormSubmit={handleResetFormSubmit} />}
        {isForgetFormSubmitted && !isTokenVerified && <VerifyToken onTokenVerified={handleTokenVerification} />}
        {isTokenVerified && <ResetForm onSubmit={handleResetFormSubmit} />}
      </FormWrap>
    </Container>
  );
}

export default Reset;