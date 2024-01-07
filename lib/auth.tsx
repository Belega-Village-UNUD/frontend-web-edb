const login = async (data: any) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
  console.log("🚀 ~ file: auth.tsx:8 ~ login ~ url:", url)
  // const response = await axios.post(url, data)
  const response = await fetch(url, data)
  console.log("🚀 ~ file: auth.tsx:10 ~ login ~ response:", response)

  return response
}

export default login;