"use server"

import axios from "axios"

export const login = async (data: any) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, data)
  console.log(response)

  return response
}