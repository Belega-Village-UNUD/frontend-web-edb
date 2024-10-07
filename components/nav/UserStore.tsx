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

import { usePersistedStore, useStore } from "@/zustand/stores";
import { usePersistedUser } from "@/zustand/users";
import { useShallow } from "zustand/react/shallow";
import Avatar from "../Avatar";
import BackDrop from "./BackDrop";
import MenuItem from "./MenuItem";

const UserStore = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [token, is_login, is_store, logout] = usePersistedUser(
    useShallow((state) => [
      state.token,
      state.is_login,
      state.is_store,
      state.logout,
    ])
  );
  const [name] = usePersistedStore(useShallow((state) => [state.name]));
  const [avatarPreview, handleGetStoreProfile] = useStore(
    useShallow((state) => {
      return [state.avatarPreview, state.handleGetStoreProfile];
    })
  );

  useEffect(() => {
    if (!token) {
      <h1>Loading..</h1>;
    }
  });

  useEffect(() => {
    handleGetStoreProfile();
    // setInterval(() => {
    //   handleGetStoreProfile();
    // }, 10000);
  }, [handleGetStoreProfile]);

  const router = useRouter();

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSignOut = () => {
    try {
      setIsOpen(false);
      logout();
      toast.success("Logout store berhasil");
      router.push("/buyer/login");
    } catch (error) {
      setIsOpen(false);
      console.error(error);
      toast.error("Logout gagal");
    }
  };

  return (
    <>
      <div className="relative z-30">
        {is_login ? (
          <div
            onClick={toggleOpen}
            className="p-2 flex flex-row items-center rounded-md cursor-pointer hover:border-[1px] hover:border-lime-900 text-lime-900"
          >
            {avatarPreview ? (
              <Avatar width={30} height={30} size={30} src={avatarPreview} />
            ) : (
              <Avatar width={30} height={30} size={30} />
            )}
            <span
              className="mx-2 text-sm font-semibold leading-6 text-gray-900"
              aria-hidden="true"
            >
              {name}
            </span>
            {isOpen ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
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
          <div className="absolute rounded-md shadow-md w-[170px] bg-white overflow-hidden right-0 top-12 text-sm flex flex-col cursor-pointer">
            {is_login ? (
              <div>
                {is_store === true && (
                  <Link href="/">
                    <MenuItem onClick={toggleOpen}>Go to Buyer Page</MenuItem>
                  </Link>
                )}
                <hr className="border-t border-gray-300" />
                <MenuItem
                  className="text-red-500 font-bold"
                  onClick={() => {
                    handleSignOut();
                  }}
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
      {isOpen ? <BackDrop onClick={toggleOpen} /> : null}
    </>
  );
};

export default UserStore;
