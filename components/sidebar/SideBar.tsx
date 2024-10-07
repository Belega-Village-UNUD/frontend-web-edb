"use client";

import {
  Dialog,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  Transition,
} from "@headlessui/react";
import {
  Bars3Icon,
  ChartPieIcon,
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  DocumentDuplicateIcon,
  HomeModernIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ShoppingBag,
  StoreIcon,
  HandCoins,
  Banknote,
  WalletCards,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import UserStore from "../nav/UserStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { usePersistedUser } from "@/zustand/users";
import Loading from "../Loading";
import { formatRupiah } from "@/lib/utils";

const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

type navigationType = {
  main: any;
};

const SideBar: React.FC<navigationType> = ({ main }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname();

  const [token, setToken] = useState<string>();

  useEffect(() => {
    const tokenFromStore = usePersistedUser.getState().token;
    setToken(tokenFromStore);
  }, [token]);

  const {
    isFetching,
    data: balance,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/store/balance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data.data;
    },
    queryKey: ["get-balance"],
    enabled: !!token,
  });

  const navigation = [
    { name: "Dashboard", href: "/store", icon: HomeModernIcon },
    {
      name: "Product",
      href: "#",
      icon: ShoppingBag,
      children: [
        { name: "My Product", href: "/store/product" },
        { name: "Create New Product", href: "/store/product/new" },
      ],
    },
    {
      name: "Transaction",
      href: "/store/transaction",
      icon: ClipboardDocumentCheckIcon,
      children: [
        { name: "My Transaction", href: "/store/transaction" },
        { name: "Cancellation", href: "/store/transaction/cancellation" },
      ],
    },
    {
      name: "Bank Account",
      href: "#",
      icon: HandCoins,
      children: [
        { name: "My Bank Account", href: "/store/bank-account" },
        { name: "Create New Bank Account", href: "/store/bank-account/new" },
      ],
    },
    {
      name: "Payout",
      href: "#",
      icon: WalletCards,
      children: [
        { name: "History Payout", href: "/store/payout" },
        { name: "Request Payout", href: "/store/payout/new" },
      ],
    },
    {
      name: "Store",
      href: "#",
      icon: StoreIcon,
      children: [
        { name: "Store Profile", href: "/store/profile" },
        // { name: "Store Decoration", href: "/store/store/new" },
      ],
    },
    // {
    //   name: "Documents",
    //   href: "#",
    //   icon: DocumentDuplicateIcon,
    // },
    // {
    //   name: "Reports",
    //   href: "#",
    //   icon: ChartPieIcon,
    // },
  ];

  if (isFetching) {
    return <Loading />;
  }

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center mt-4">
                      <Link
                        href="/"
                        className="relative rounded-full overflow-hidden "
                      >
                        <Image
                          src="/logo.png"
                          alt=""
                          width={50}
                          height={50}
                          className="object-contain transform scale-125"
                        />
                      </Link>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => {
                              const splitPath = pathname.split("/").join("/");
                              const isActive = splitPath === item.href;
                              return (
                                <li key={item.name}>
                                  <Link
                                    href={item.href}
                                    key={item.name}
                                    className={classNames(
                                      isActive
                                        ? "bg-green-100 text-green-700"
                                        : "text-gray-700 hover:text-green-700 hover:bg-green-100",
                                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                    )}
                                  >
                                    <item.icon
                                      className={classNames(
                                        isActive
                                          ? "text-green-700"
                                          : "text-gray-400 group-hover:text-green-700",
                                        "h-6 w-6 shrink-0"
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center mt-4">
              <Link href="/" className="relative rounded-full overflow-hidden ">
                <Image
                  src="/logo.png"
                  alt=""
                  width={50}
                  height={50}
                  className="object-contain transform scale-125"
                />
              </Link>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                      return (
                        <li key={item.name}>
                          {!item.children ? (
                            <Link
                              href={item.href}
                              key={item.name}
                              className={classNames(
                                pathname.endsWith(item.href)
                                  ? "bg-green-100 text-green-700"
                                  : "text-gray-700 hover:text-green-700 hover:bg-green-100",
                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  pathname.endsWith(item.href)
                                    ? "text-green-700"
                                    : "text-gray-400 group-hover:text-green-700",
                                  "h-6 w-6 shrink-0"
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </Link>
                          ) : (
                            <Disclosure as="div" defaultOpen={true}>
                              {({ open }) => (
                                <>
                                  <DisclosureButton
                                    className={classNames(
                                      pathname.endsWith(item.href)
                                        ? "bg-gray-50"
                                        : "hover:bg-gray-50",
                                      "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700"
                                    )}
                                  >
                                    <item.icon
                                      className="h-6 w-6 shrink-0 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                    <ChevronRightIcon
                                      className={classNames(
                                        open
                                          ? "rotate-90 text-gray-500"
                                          : "text-gray-400",
                                        "ml-auto h-5 w-5 shrink-0"
                                      )}
                                      aria-hidden="true"
                                    />
                                  </DisclosureButton>
                                  <DisclosurePanel as="ul" className="mt-1">
                                    {item.children.map((subItem) => {
                                      return (
                                        <li key={subItem.name}>
                                          <Link
                                            href={subItem.href}
                                            key={subItem.name}
                                            className={classNames(
                                              pathname.endsWith(subItem.href)
                                                ? "bg-green-100 text-green-700"
                                                : "text-gray-700 hover:text-green-700 hover:bg-green-100",
                                              "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6"
                                            )}
                                          >
                                            <div
                                              className={classNames(
                                                pathname.endsWith(subItem.href)
                                                  ? "text-green-700"
                                                  : "text-gray-400 group-hover:text-green-700",
                                                "h-6 w-6 shrink-0"
                                              )}
                                              aria-hidden="true"
                                            ></div>
                                            {subItem.name}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </DisclosurePanel>
                                </>
                              )}
                            </Disclosure>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div
              className="h-6 w-px bg-gray-200 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form className="relative flex flex-1 " action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                {/* <MagnifyingGlassIcon
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                  aria-hidden="true"
                /> */}
                {/* <input
                  id="search-field"
                  className="block h-full w-full border-0 py-0 pl-8 pr-0 bg-white  text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Searchs..."
                  type="search"
                  name="search"
                /> */}
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 flex flex-row items-center justify-center gap-2"
                >
                  <Banknote className="h-6 w-6" aria-hidden="true" />
                  <span className="">
                    {formatRupiah(balance?.balance || 0)}
                  </span>
                </button>

                {/* Separator */}
                <div
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                  aria-hidden="true"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <UserStore />
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-5">
            <div className="px-4 sm:px-6 lg:px-8">{main}</div>
          </main>
        </div>
      </div>
    </>
  );
};

export default SideBar;
