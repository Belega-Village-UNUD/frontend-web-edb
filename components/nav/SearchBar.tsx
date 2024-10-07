"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { Search } from "lucide-react";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchContainerRef = useRef(null);

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        searchContainerRef.current &&
        // @ts-ignore
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    setIsOpen(false);

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [pathname]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "products",
          value: search,
        });

        router.push(`${newUrl}`, { scroll: false });
      } else {
        if (query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["products", "type"],
          });

          router.push(`${newUrl}`, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, router, pathname, searchParams, query]);

  return (
    <div className="relative md:w-[450px] w-52">
      <div
        className="relative flex-center min-h-4 grow items-center text-primary-foreground w-full"
        ref={searchContainerRef}
      >
        <Search
          width={16}
          height={16}
          className="cursor-pointer absolute left-6 top-3 "
          color="gray"
        />

        <Input
          type="text"
          placeholder="What are you looking for?"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);

            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          className="no-focus border-none bg-transparent shadow-none outline-none text-gray-700 placeholder:text-gray-700/80 font-dmSans ml-5 pl-10 focus:border-none focus-visible::ring-0"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};

const GlobalSearchWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GlobalSearch />
    </Suspense>
  );
};

export default GlobalSearchWrapper;
