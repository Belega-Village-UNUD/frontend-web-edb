'use server'

export async function getAllProducts() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/guest/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const responseJson = await response.json();
  return responseJson;
}

export async function getProductById(id: any) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/guest/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const responseJson = await response.json();
}