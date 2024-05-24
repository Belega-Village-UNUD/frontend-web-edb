"use client";

import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useRef, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Avatar from '@/components/Avatar';
import ButtonConfirm from "@/components/button/ButtonConfirm";
import InputForm from '@/components/inputs/InputForm';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  phone: string;
  image: string;
  address: string;
  description: string;
}

const ProfileList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>()

  const router = useRouter();

  const handleGetProfile = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Anda belum login')
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const responseJson = await response.json();

      if (responseJson.success === true) {
        setValue('name', responseJson.data.profile.name);
        setValue('email', responseJson.data.user.email);
        setValue('phone', responseJson.data.profile.phone);
        setValue('address', responseJson.data.profile.address);
        setValue('description', responseJson.data.profile.description);
        setAvatarPreview(responseJson.data.profile.avatar_link);
      } else {
        console.log(responseJson.message)
      }

    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const handleChangeProfile: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Anda Belum Login');
        setIsLoading(false);
        return;
      }

      // const responseJson = await updateProfile(token, data)
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

      if (responseJson.success === true) {
        toast.success(responseJson.message);
        setIsLoading(false);
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

  const handleChangePhoto = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setIsLoading(true);
      const token = await localStorage.getItem('token');

      if (!token) {
        toast.error('Token tidak tersedia');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const responseJson = await response.json();

      setAvatarPreview(URL.createObjectURL(file));
      toast.success(responseJson.message);
      setIsLoading(false);

    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  }

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

      // const responseJson = await changePassword(token, data)
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
    handleGetProfile();
    const intervalId = setInterval(() => {
      handleGetProfile();
    }, 5000);
    return () => {
      clearInterval(intervalId);
    }
  });

  useEffect(() => {
    const isLoged = localStorage.getItem('is_login');
    if (isLoged === 'false' || isLoged === null) {
      toast.error('Anda Belum Login');
      router.push('/buyer/login');
    }
  });

  return (
    <div className="space-y-10 divide-y divide-gray-900/10 m-3">

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

              <div className="col-span-full">
                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  {avatarPreview ? (
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

              <div className="sm:col-span-4" >
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
                <div className="mt-0">
                  <InputForm
                    name='phone'
                    type="number"
                    register={register}
                    label='Phone Number'
                    errors={errors}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <InputForm
                  // id="description"
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
            <ButtonConfirm outline label={isLoading ? '' : 'Edit Profile'} loading={isLoading} onClick={handleSubmit(handleChangeProfile)} />
          </div>
        </form>
      </div >

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Change Password</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Update your password associated with your account.</p>
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

              <div className="sm:col-span-4">
                <InputForm
                  name="currentPassword"
                  type="password"
                  register={register}
                  label='Current Password'
                  errors={errors}
                />
              </div>

              <div className="sm:col-span-4">
                <InputForm
                  name="newPassword"
                  type="password"
                  register={register}
                  label='New Password'
                  errors={errors}
                />
              </div>

              <div className="sm:col-span-4">
                <InputForm
                  name="confirmNewPassword"
                  type="password"
                  register={register}
                  label='Confirm Password'
                  errors={errors}
                />
              </div>

            </div>
          </div>
          <div className="flex items-center justify-end gap-x-3 border-t border-gray-900/10 px-4 py-8 sm:px-8">
            <ButtonConfirm outline label={isLoading ? '' : 'Change Password'} loading={isLoading} onClick={setModalPassword} />
          </div>
        </form>
      </div >

      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setIsModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          Change Password
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to change password your account?
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={handleSubmit(handleChangePassword)}
                    >
                      Confirm Change Password
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setIsModalOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

    </div >
  );
}

export default ProfileList;