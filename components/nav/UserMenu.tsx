"use client"

import { ChevronDownIcon, ChevronUpIcon, UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { usePersistedUser, useUsers } from "@/zustand/users";
import { useShallow } from "zustand/react/shallow";
import Avatar from "../Avatar";
import BackDrop from "./BackDrop";
import MenuItem from "./MenuItem";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogged, setLogged, role, handleGetProfile, avatarPreview] = useUsers(
    useShallow((state) => {
      return [
        state.isLogged,
        state.setLogged,
        state.role,
        state.handleGetProfile,
        state.avatarPreview,
      ]
    })
  )
  const [name] = usePersistedUser(useShallow((state) => [state.name]))

  useEffect(() => {
    setLogged()
  }, [setLogged])

  useEffect(() => {
    handleGetProfile();
    setInterval(() => {
      handleGetProfile();
    }, 10000);
  }, [handleGetProfile]);

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

  return (
    <>
      <div className="relative z-30">

        {isLogged ? (
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

            {isLogged ? (
              <div>
                {!role.includes('WGVUqKhyoV') ? (
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