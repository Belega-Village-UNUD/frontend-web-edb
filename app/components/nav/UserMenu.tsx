"use client"

import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import BackDrop from "./BackDrop";
import toast from "react-hot-toast";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

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
    const logged = localStorage.getItem('is_login')
    if (!logged || logged === 'false') { return false }
    return true
  }

  return (
    <>
      <div className="relative z-30">
        <div onClick={toggleOpen} className="p-2 border-[1px] border-lime-900 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-lime-900">
          <Avatar />
          {isOpen ? <AiFillCaretUp /> : <AiFillCaretDown />}
        </div>

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
      </div>
      {isOpen ? <BackDrop onClick={toggleOpen} /> : null}
    </>
  );
}

export default UserMenu;