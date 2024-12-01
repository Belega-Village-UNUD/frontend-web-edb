"use client";

import Link from "next/link";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillTwitterCircle,
  AiFillYoutube,
} from "react-icons/ai";

import { usePathname } from "next/navigation";
import Container from "../Container";
import { DisableNav } from "../nav/DisableNav";
import FooterList from "./FooterList";

const Footer = () => {
  return (
    !DisableNav(usePathname()) && (
      <footer className="bg-white text-slate-800 text-sm">
        <hr />
        <Container>
          <div className="flex flex-col md:flex-row justify-between pt-10 pb-8 gap-8">
            {/* <FooterList>
              <h3 className='text-base font-bold mb-2'>Bamboo Categories</h3>
              <Link href='#'>Furniture</Link>
              <Link href='#'>Craft</Link>
              <Link href='#'>Toys</Link>
              <Link href='#'>Home Decor</Link>
            </FooterList>
            <FooterList>
              <h3 className='text-base font-bold mb-2'>Customer Service</h3>
              <Link href='#'>Contact Us</Link>
              <Link href='#'>Watches</Link>
              <Link href='#'>Shipping Policy</Link>
              <Link href='#'>FAQs</Link>
            </FooterList> */}

            <div className="w-full md:w-1/4 mb-6 md:mb-0 flex flex-col justify-center items-center">
              <p>
                &copy; {new Date().getFullYear()} B-Commerce. All right reserved
              </p>
            </div>
            <div className="w-full md:w-full mb-6 md:mb-0">
              <h3 className="text-base font-bold mb-2">About Us</h3>
              <p className="mb-2">
                BCommerce (Belega Ecommerce) is dedicated to connecting our
                local artisans with a global market. Our platform enables the
                promotion and sale handmade products from Desa Belega
              </p>
            </div>

            <FooterList>
              <h3 className="text-base font-bold mb-2">Follow Us</h3>
              <div className="flex gap-2">
                <Link href="#">
                  <AiFillYoutube size={24} />
                </Link>
                <Link href="#">
                  <AiFillFacebook size={24} />
                </Link>
                <Link href="#">
                  <AiFillTwitterCircle size={24} />
                </Link>
                <Link href="#">
                  <AiFillInstagram size={24} />
                </Link>
              </div>
            </FooterList>
          </div>
        </Container>
      </footer>
    )
  );
};

export default Footer;
