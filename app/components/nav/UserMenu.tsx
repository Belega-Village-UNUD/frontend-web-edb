"use client"

import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { useCallback, useState } from "react";
import Link from "next/link";

import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import BackDrop from "./BackDrop";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return (  
    <>
      <div className="relative z-30">
        <div onClick={toggleOpen} className="p-2 border-[1px] border-lime-900 flex flex-row items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-lime-900">
          <Avatar />
          {isOpen? <AiFillCaretUp /> : <AiFillCaretDown />}
        </div>

        {isOpen && (
          <div className="absolute rounded-md shadow-md w-[170px] bg-white overflow-hidden right-0 top-12 text-sm flex flex-col cursor-pointer">
            <div>
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
            </div>

            <div>
              <Link href="#">
                <MenuItem onClick={toggleOpen}>Your Orders</MenuItem>
              </Link>
              <Link href="#">
                <MenuItem onClick={toggleOpen}>Your Profile</MenuItem>
              </Link>
              <hr />
              <MenuItem onClick={() => {}}>Log Out</MenuItem>
            </div>

            <div>
              <Link href="/buyer/login">
                <MenuItem onClick={toggleOpen}>Log in</MenuItem>
              </Link>
              <Link href="/buyer/register">
                <MenuItem onClick={toggleOpen}>Sign Up</MenuItem>
              </Link>
            </div>
          </div>
        )}
      </div>
      {isOpen? <BackDrop onClick={toggleOpen}/> : null}
    </>
  );
}

export default UserMenu;