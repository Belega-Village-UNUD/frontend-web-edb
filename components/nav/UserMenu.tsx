"use client"

import { UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

import Avatar from "../Avatar";
import BackDrop from "./BackDrop";
import MenuItem from "./MenuItem";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

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
      console.log(error);
      toast.error("Logout gagal");
    }
  }

  const currentUser = () => {
    // const logged = localStorage.getItem('is_login')
    // if (!logged || logged === 'false') { return false }
    // return true

    if (typeof window !== 'undefined') {
      const logged = localStorage.getItem('is_login')
      if (!logged || logged === 'false') { return false }
      return true
    }
    return false
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

      if (responseJson.success === true) {
        console.log(responseJson.message)
        setAvatarPreview(responseJson.data.profile.avatar_link);
        return
      } else {
        console.error(responseJson.message);
        return
      }

    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  }

  useEffect(() => {
    handleGetProfile();
  });

  return (
    <>
      <div className="relative z-30">

        {currentUser() ? (
          <div onClick={toggleOpen} className="p-2 border-[1px] border-lime-900 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-lime-900">
            {avatarPreview ? (
              <Avatar width={30} height={30} size={30} src={avatarPreview} />
            ) : (
              <Avatar width={30} height={30} size={30} />
            )}
            {isOpen ? <AiFillCaretUp /> : <AiFillCaretDown />}
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
                <Link href="#">
                  <MenuItem onClick={toggleOpen}>Your Orders</MenuItem>
                </Link>
                <Link href="/buyer/profile">
                  <MenuItem onClick={toggleOpen}>Your Profile</MenuItem>
                </Link>
                <hr />
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

            {/* <div>
              <Link href="#">
                <MenuItem onClick={toggleOpen}>User Dashboard</MenuItem>
              </Link>
              <hr />
            </div>

            <div>
              <Link href="#">
                <MenuItem onClick={toggleOpen}>Seller Dashboard</MenuItem>
              </Link>
              <hr />
            </div> */}

          </div>
        )}

      </div >
      {isOpen ? <BackDrop onClick={toggleOpen} /> : null
      }
    </>
  );
}

export default UserMenu;