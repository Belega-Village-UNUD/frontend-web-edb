"use client";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { usePersistedUser, useUsers } from "@/zustand/users";
import { useShallow } from "zustand/react/shallow";
import Avatar from "../Avatar";
import BackDrop from "./BackDrop";
import MenuItem from "./MenuItem";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [handleGetProfile, avatarPreview] = useUsers(
    useShallow((state) => [state.handleGetProfile, state.avatarPreview])
  );
  const router = useRouter();
  const [name, is_store, is_login, exist_store, logout] = usePersistedUser(
    useShallow((state) => [
      state.name,
      state.is_store,
      state.is_login,
      state.exist_store,
      state.logout,
    ])
  );

  useEffect(() => {
    const token = usePersistedUser.getState().token;
    if (token) {
      useUsers.getState().handleGetProfile();
      // if (!name) {
      //   router.push("/buyer/profile");
      // }
    }
  }, [name, router]);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSignOut = () => {
    try {
      setIsOpen(false);
      logout();
      toast.success("Logout berhasil");
      router.push("/");
    } catch (error) {
      setIsOpen(false);
      toast.error("Logout gagal");
    }
  };

  return (
    <>
      <div className="relative z-30">
        {is_login ? (
          <div
            onClick={toggleOpen}
            className="flex items-center p-2 rounded-md cursor-pointer text-lime-900 hover:border hover:border-lime-900"
          >
            <Avatar
              width={30}
              height={30}
              size={30}
              src={avatarPreview || undefined}
            />
            <span
              className="mx-2 text-sm font-semibold leading-6 text-gray-900"
              aria-hidden="true"
            >
              {name}
            </span>
            {isOpen ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>
        ) : (
          <div
            onClick={toggleOpen}
            className="p-2 text-gray-400 hover:text-gray-500 lg:ml-4"
          >
            <span className="sr-only">Account</span>
            <UserIcon className="h-6 w-6" aria-hidden="true" />
          </div>
        )}

        {isOpen && (
          <div className="absolute rounded-md shadow-md w-[200px] bg-white overflow-hidden right-0 top-12 text-sm flex flex-col cursor-pointer">
            {is_login ? (
              <div>
                {!is_store && !exist_store ? (
                  <Link href="/store/register">
                    <MenuItem onClick={toggleOpen}>
                      Register Your Store
                    </MenuItem>
                  </Link>
                ) : is_store && exist_store ? (
                  <Link href="/store">
                    <MenuItem onClick={toggleOpen}>Dashboard Store</MenuItem>
                  </Link>
                ) : (
                  <MenuItem onClick={toggleOpen}>Waiting Confirmation</MenuItem>
                )}
                <hr className="border-t border-gray-300" />
                <Link href="/buyer/history">
                  <MenuItem onClick={toggleOpen}>History Orders</MenuItem>
                </Link>
                <Link href="/buyer/profile">
                  <MenuItem onClick={toggleOpen}>Your Profile</MenuItem>
                </Link>
                <hr className="border-t border-gray-300" />
                <MenuItem
                  className="text-red-500 font-bold"
                  onClick={handleSignOut}
                >
                  Log Out
                </MenuItem>
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
      </div>
      {isOpen && <BackDrop onClick={toggleOpen} />}
    </>
  );
};

export default UserMenu;
