'use server'

import { FieldValues } from "react-hook-form";

export async function postLogin(data: FieldValues){
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  const responseJson = await response.json();
  return responseJson;
}

export async function postRegister(data: FieldValues){
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  const responseJson = await response.json();
  return responseJson;
}

export async function postForgotPassword(data: FieldValues){
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password/forgot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  const responseJson = await response.json();
  return responseJson;
}

export async function putResetPassword(token: string, data: FieldValues){
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password/reset`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  const responseJson = await response.json();
  return responseJson;
}

export async function postResendOTP(token: string | null){
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  const responseJson = await response.json();
  return responseJson;
}

export async function postVerifyOTP(token: string, data: FieldValues){
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp/verify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  const responseJson = await response.json();
  return responseJson;
}