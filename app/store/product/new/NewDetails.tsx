import { useEffect, useState } from "react";

// type NewProductListStoreType = {
//   id: string,
//   name_product: string,
//   stock: number,
//   price: string,
//   type_id: string,
//   image_product: string,
// }

const NewProductListStore = () => {
  const [products, setProducts] = useState([])

  const handleGetAllProduct = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/guest/all`, { // Change this to Seller API URL
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const responseJson = await response.json();
      setProducts(responseJson.data)
    } catch (error: any) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    handleGetAllProduct()
  }, [])

  return (
    <div className="px-8 pt-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">Information Product</h1>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                <div className="col-span-full">
                  <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                    Photo
                  </label>
                  <div className="mt-2 flex items-center gap-x-3">
                    {/* {avatarPreview ? (
                      <Avatar width={70} height={70} size={70} src={avatarPreview} />
                    ) : (
                      <Avatar width={70} height={70} size={70} />
                    )}
                    <button
                      type="button"
                      className="rounded-md bg-white px-2.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick={() => document.getElementById('avatar')?.click()}
                    >
                      Change
                    </button>
                    <input
                      type="file"
                      id="avatar"
                      style={{ display: 'none' }}
                      onChange={handleChangePhoto}
                    /> */}
                  </div>
                </div>

                {/* <div className="sm:col-span-4">
                  <InputForm
                    name="name"
                    type="text"
                    register={register}
                    label='Full Name'
                    errors={errors}
                  />
                </div> */}

                {/* <div className="sm:col-span-4" >
                  <InputForm
                    name='email'
                    type="email"
                    label='Email'
                    errors={errors}
                    register={register}
                    readonly
                  />
                </div>

                <div className="col-span-full">
                  <InputForm
                    name='address'
                    type="text"
                    register={register}
                    label='Street Address'
                    errors={errors}
                  />
                </div> */}

                <div className="col-span-full">
                  {/* <div className="absolute inset-y-0 left-0 flex items-center">
                    <label htmlFor="country" className="sr-only">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      autoComplete="country"
                      className="h-full rounded-md border-0 bg-transparent py-0 px-0 pl-3 pr-1 text-gray-500 focus:outline-none focus:ring-0 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    >
                      <option>ID</option>
                    </select>
                  </div> */}
                  {/* <div className="mt-0">
                    <InputForm
                      name='phone'
                      type="number"
                      register={register}
                      label='Phone Number'
                      errors={errors}
                    />
                  </div> */}
                </div>

                {/* <div className="col-span-full">
                  <InputForm
                    // id="description"
                    name='description'
                    type='textarea'
                    register={register}
                    label='Description'
                    errors={errors}
                  />
                </div> */}

              </div>
            </div>
            {/* <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-8 sm:px-8">
              <ButtonConfirm outline label={isLoading ? '' : 'Edit Profile'} loading={isLoading} onClick={handleSubmit(handleChangeProfile)} />
            </div> */}
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewProductListStore;