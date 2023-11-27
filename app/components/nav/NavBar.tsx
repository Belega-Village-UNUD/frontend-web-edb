"use client"

import Link from 'next/link';
import { Redressed } from 'next/font/google';

import Container from '../Container';
import UserMenu from './UserMenu';
import SearchBar from './SearchBar';
import { usePathname } from 'next/navigation';
import { DisableNav } from './DisableNav';

const redressed = Redressed({ subsets: ['latin'], weight: ['400'] })

const NavBar = () => {
  const pathname = usePathname()

  return (
    !DisableNav(pathname) && (
      <div className="sticky top-0 w-full bg-white z-30 shadow-sm" >
        <div className="py-4 border-b-[1px]">
          <Container>
            <div className='flex items-center justify-between gap-3 md:gap-0'>
              <Link href="/" className={`${redressed.className} font-bold text-2xl`}>B-commerce</Link>
              <SearchBar />
              <div className='flex items-center gap-8 md:gap-12'>
                <div>Cart</div>
                <UserMenu />
              </div>
            </div>
          </Container>
        </div>
      </div>
    )
  );
}

export default NavBar;