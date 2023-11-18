'use client'

import { useEffect, useState } from "react";

import Container from "@/app/components/Container";
import FormWrap from "@/app/components/FormWrap";
import ForgetForm from "./ForgotForm";
import ResetForm from "./ResetForm";
import VerifyToken from "./VerifyToken";
import { useRouter } from "next/navigation";
import { checkMiddlewareAuth, middlewareAuth } from "@/app/middleware";

const Reset = () => {
  const [isForgetFormSubmitted, setIsForgetFormSubmitted] = useState(false);
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const token = localStorage.getItem('token');

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

    checkMiddlewareAuth(onAuthSuccess, router)();
    middlewareAuth(() => { }, router)();
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