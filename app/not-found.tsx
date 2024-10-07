import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative isolate min-h-screen min-w-full">
      <div className="absolute inset-0 -z-10 object-top opacity-50">
        <Image
          src="https://images.unsplash.com/photo-1642448379920-d60e1e3544f6?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8 text-lime-700">
        <p className="text-base font-semibold leading-8 ">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight  sm:text-5xl">Page not found</h1>
        <p className="mt-4 text-base sm:mt-6">Sorry, we couldn`t find the page you’re looking for.</p>
        <div className="mt-10 flex justify-center items-center gap-2 ">
          <ArrowLeft className="w-5 h-5" /><Link href="/" className="text-sm font-semibold leading-7 ">Back to home</Link>
        </div>
      </div>
    </main>
  );
}