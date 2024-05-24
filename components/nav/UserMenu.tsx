"use client"

import { ChevronDownIcon, ChevronUpIcon, UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import Avatar from "../Avatar";
import BackDrop from "./BackDrop";
import MenuItem from "./MenuItem";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [name, setName] = useState();

  const router = useRouter()

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleSignOut = () => {
    try {
      setIsOpen(false);
      localStorage.clear()
      toast.success("Logout berhasil");
      router.push('/buyer/login');

    } catch (error) {
      setIsOpen(false);
      console.error(error);
      toast.error("Logout gagal");
    }
  }

  const currentUser = () => {
    if (typeof window !== 'undefined') {
      const logged = localStorage.getItem('is_login')
      if (!logged || logged === 'false') { return false }
      return true
    }
    return false
  }

  const currentRole = (): string => {
    const role = localStorage.getItem('role')
    if (!role) { return '' }
    return role
  }

  const handleGetProfile = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Anda belum login')
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profiles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': `application/json`
        }
      })

      const responseJson = await response.json();
      // console.log(responseJson)

      if (responseJson.success === true) {
        setAvatarPreview(responseJson.data.profile.avatar_link);
        setName(responseJson.data.profile.name);
        return
      } else {
        console.error(responseJson.message);
        localStorage.clear();
        return
      }

    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  }

  useEffect(() => {
    handleGetProfile();
    const intervalId = setInterval(() => {
      handleGetProfile();
    }, 10000);
    return () => {
      clearInterval(intervalId);
    }
  });

  return (
    <>
      <div className="relative z-30">

        {currentUser() ? (
          <div onClick={toggleOpen} className="p-2 flex flex-row items-center rounded-md cursor-pointer hover:border-[1px] hover:border-lime-900 text-lime-900">

            {avatarPreview ? (
              <Avatar width={30} height={30} size={30} src={avatarPreview} />
            ) : (
              <Avatar width={30} height={30} size={30} />
            )}
            <span className="mx-2 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
              {name}
            </span>
            {isOpen ? <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : <ChevronDownIcon className="h-5 w-5 text-gray-400" />}
          </div>
        ) : (
          <div onClick={toggleOpen} className="p-2 text-gray-400 hover:text-gray-500 lg:ml-4">
            <span className="sr-only">Account</span>
            <UserIcon className="h-6 w-6" aria-hidden="true" />
          </div>
        )}

        {isOpen && (
          <div className="absolute rounded-md shadow-md w-[170px] bg-white overflow-hidden right-0 top-12 text-sm flex flex-col cursor-pointer">

            {currentUser() ? (
              <div>
                {!currentRole().includes('WGVUqKhyoV') ? (
                  <Link href='#'>
                    <MenuItem onClick={toggleOpen}>Register Your Store</MenuItem>
                  </Link>
                ) : (
                  <Link href='/store'>
                    <MenuItem onClick={toggleOpen}>Dashboard Store</MenuItem>
                  </Link>
                )}
                <hr className="border-t border-gray-300" />
                <Link href="/buyer/history">
                  <MenuItem onClick={toggleOpen}>History Orders</MenuItem>
                </Link>
                <Link href="/buyer/profile">
                  <MenuItem onClick={toggleOpen}>Your Profile</MenuItem>
                </Link>
                <hr className="border-t border-gray-300" />
                <MenuItem onClick={() => {
                  handleSignOut()
                }}>Log Out</MenuItem>
              </div>
            ) : (
              <div>
                <Link href="/buyer/login">
                  <MenuItem onClick={toggleOpen}>Log in</MenuItem>
                </Link>
                <Link href="/buyer/register">
                  <MenuItem onClick={toggleOpen}>Sign Up</MenuItem>
                </Link>
              </div>
            )}

          </div>
        )}

      </div >
      {isOpen ? <BackDrop onClick={toggleOpen} /> : null
      }
    </>
  );
}

export default UserMenu;