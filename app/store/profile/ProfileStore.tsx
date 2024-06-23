"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Avatar from '@/components/Avatar';
import ButtonConfirm from "@/components/button/ButtonConfirm";
import InputForm from '@/components/inputs/InputForm';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  phone: string;
  image: string;
  address: string;
  description: string;
}

const ProfileStore = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>()

  const router = useRouter();

  const getToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Please Login First');
      return null;
    }
    return token;
  }, []);

  const handleGetProfileStore = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) { return; }

      if (!token) {
        console.error('Anda belum login')
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseJson = await response.json();
      console.log(responseJson)
      if (responseJson.success === true) {
        setValue('name', responseJson.data.name);
        setValue('email', responseJson.data.user.email);
        setValue('phone', responseJson.data.phone);
        setValue('address', responseJson.data.address);
        setValue('description', responseJson.data.description);
        setAvatarPreview(responseJson.data.avatar_link);
      } else {
        console.log(responseJson.message)
      }

    } catch (error: any) {
      toast.error(error.message);
    }
  }, [getToken, setValue])

  useEffect(() => {
    handleGetProfileStore();
  }, [handleGetProfileStore]);

  const handleUpdateStore: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) { return; }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          address: data.address,
          description: data.description
        })
      })

      const responseJson = await response.json();

      if (responseJson.success === true) {
        toast.success(responseJson.message);
        setIsLoading(false);
        handleGetProfileStore();
      } else {
        toast.error(responseJson.message);
        setIsLoading(false);
      }

    }
    catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  }

  const handleChangePhoto = useCallback(async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) { setIsLoading(false); return; }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const responseJson = await response.json();
      console.log(responseJson)
      if (responseJson.success === true) {
        toast.success(responseJson.message);
        setIsLoading(false);
        setAvatarPreview(URL.createObjectURL(file));
        handleGetProfileStore()
      } else {
        setIsLoading(false);
        toast.error(responseJson.message);
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  }, [getToken, handleGetProfileStore])

  const handleChangePassword: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      console.log(data)

      if (!token) {
        toast.error('Anda Belum Login');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password/change`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const responseJson = await response.json();

      if (responseJson.success === true) {
        toast.success(responseJson.message);
        setIsLoading(false);
      } else {
        toast.error(responseJson.message);
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  }

  const setModalPassword = (event: any) => {
    event.preventDefault();
    setIsModalOpen(true)
  }
  const cancelButtonRef = useRef(null)

  useEffect(() => {
    const isLoged = localStorage.getItem('is_login');
    if (isLoged === 'false' || isLoged === null) {
      toast.error('Anda Belum Login');
      router.push('/buyer/login');
    }
  });

  return (
    <div className="lg:px-8 sm:px-6">

      <div className="lg:-mx-8 lg:mb-4 text-sm text-gray-400 breadcrumbs">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link href={'/store'}>Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">Store Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="lg:-mx-8 lg:mb-2 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="flex-1 text-2xl font-bold text-gray-900">Store Profile</h1>
          <p className="text-sm text-gray-500">
            Manage your store profile information
          </p>
        </div>
      </div>

      <div className="mt-8 lg:-mx-8 sm:-mx-6">

        <form className="mt-4 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="sm:p-8">
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-6">

              <div className="col-span-full">
                <label htmlFor="photo" className="block text-sm font-semibold leading-6 text-gray-900">
                  Photo
                </label>
                <div className="mt-3 flex items-center gap-x-3">
                  {avatarPreview ? (
                    <Avatar width={70} height={70} size={70} src={avatarPreview} />
                  ) : (
                    <Avatar width={70} height={70} size={70} />
                  )}
                  <button
                    type="button"
                    className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => document.getElementById('avatar')?.click()}
                  >
                    Change
                  </button>
                  <input
                    type="file"
                    id="avatar"
                    style={{ display: 'none' }}
                    onChange={handleChangePhoto}
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <InputForm
                  name="name"
                  type="text"
                  register={register}
                  label='Full Name'
                  errors={errors}
                />
              </div>

              <div className="sm:col-span-4  opacity-50" >
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
              </div>

              <div className="col-span-full  opacity-50">
                <InputForm
                  name='phone'
                  type='text'
                  register={register}
                  label='Phone Number'
                  errors={errors}
                  readonly
                />
              </div>

              <div className="col-span-full">
                <InputForm
                  name='description'
                  type='textarea'
                  register={register}
                  label='Description'
                  errors={errors}
                />
              </div>

            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-8 sm:px-8">
            <ButtonConfirm outline label={isLoading ? '' : 'Edit Profile'} loading={isLoading} onClick={handleSubmit(handleUpdateStore)} />
          </div>
        </form>

      </div>
    </div >
  );
}

export default ProfileStore;