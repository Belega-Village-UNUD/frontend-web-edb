import axios from "axios";

export const postLogin = async (data: any) => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL
  const response = await axios.post(`${baseURL}/auth/login`);

  return response
}