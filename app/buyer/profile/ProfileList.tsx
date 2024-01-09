"use client";

import Avatar from '@/app/components/Avatar';
import { useEffect, useState } from 'react';

import Input from '@/app/components/inputs/Input';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from "../../components/Button";

interface User {
  name: string;
  phone: string;
  image: string;
  address: string;
}

const ProfileList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userImage, setUserImage] = useState(null);
  const [userAddress, setUserAddress] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    }
  });

  const handleGetProfile = async () => {
    const token = await localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const responseJson = await response.json();

      if (responseJson.success) {
        setUserName(responseJson.data.profile.name);
        setUserEmail(responseJson.data.user.email);
        setUserPhone(responseJson.data.profile.phone);
        setUserImage(responseJson.data.profile.avatar_link);
        setUserAddress(responseJson.data.profile.address);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeProfile: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      const token = await localStorage.getItem('token');

      if (!token) {
        toast.error('Token tidak tersedia');
        setIsLoading(false);
        return;
      }

      console.log(data);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
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
    }
    catch (error: any) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan saat mengirim request');
      setIsLoading(false);
      // toast.error(error);
      // setIsLoading(false);
    }
  }

  useEffect(() => {
    handleGetProfile();
  }, [handleGetProfile]);

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
                  <Avatar size={48} />
                  <button
                    type="button"
                    className="rounded-md bg-white px-2.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                  Full name
                </label>
                <div className="mt-2">
                  <Input
                    type="text"
                    id="name"
                    value={userName || ''}
                    register={register}
                    {...register('name')}
                    label='Full Name'
                    errors={errors}
                  />

                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <Input
                    type="email"
                    id="email"
                    value={userEmail || ''}
                    label='Email'
                    errors={errors}
                    register={register}
                    {...register('email')}
                    readonly={true}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                  Street address
                </label>
                <div className="mt-2">
                  <Input
                    type="text"
                    id="address"
                    value={userAddress || ''}
                    register={register}
                    {...register('address')}
                    label='Address'
                    errors={errors}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="phone-number" className="block text-sm font-medium leading-6 text-gray-900">
                  Phone Number
                </label>
                <div className="relative mt-2 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <label htmlFor="country" className="sr-only">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      autoComplete="country"
                      className="h-full rounded-md border-0 bg-transparent py-0 px-0 pl-3 pr-1 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    >
                      <option>ID</option>
                    </select>
                  </div>
                  <Input
                    type="number"
                    id="phone"
                    value={userPhone || ''}
                    register={register}
                    {...register('phone')}
                    label='Phone Number'
                    errors={errors}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <Button outline label={isLoading ? 'Loading...' : 'Update Profile'} onClick={handleSubmit(handleChangeProfile)} />
          </div>
        </form>
      </div>

    </div>
  );
}

export default ProfileList;