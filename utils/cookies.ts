"use server"

import { cookies } from "next/headers";
import { COOKIES_NAME, COOKIES_VALUE } from "./const";

export async function getToken(){
  cookies().get(`${COOKIES_NAME}`)
}

export async function create() {
  const threeHours = 3 * 60 * 60 * 1000;
  cookies().set(`${COOKIES_NAME}`, `${COOKIES_VALUE}`, { expires: Date.now() + threeHours });
}

export async function deleteCookie() {
  cookies().delete(`${COOKIES_NAME}`,)
}