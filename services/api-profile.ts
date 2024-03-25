'use server'

import { FieldValues } from "react-hook-form";

// export async function getProfile(token: string) {

//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles`, {
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//   })

//   const responseJson = await response.json();
//   return responseJson;
// }

export async function updateProfile(token: string, data:FieldValues) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: data.name,
      phone: data.phone,
      address: data.address,
      description: data.description
    })
  })

  const responseJson = await response.json();
  return responseJson;
}

export async function changeAvatar(token: string, formData: FormData) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  })

  const responseJson = await response.json();
  return responseJson;
}

export async function changePassword(token: string, data: FieldValues) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password/change`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  const responseJson = await response.json();
  return responseJson;
}