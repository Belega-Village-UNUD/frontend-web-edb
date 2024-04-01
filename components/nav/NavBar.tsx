"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Image from 'next/image';
import Container from '../Container';
import CartMenu from './CartMenu';
import { DisableNav } from './DisableNav';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

const NavBar = () => {
  const pathname = usePathname()

  const currentUser = () => {
    const logged = localStorage.getItem('is_login')
    if (!logged || logged === 'false') { return false }
    return true
  }

  return (
    !DisableNav(pathname) && (
      <div className="sticky top-0 w-full bg-white z-30 shadow-sm" >
        <div className="py-4 border-b-[1px]">
          <Container>
            <div className='flex items-center justify-between gap-4 md:gap-0'>
              <Link href="/" className='relative rounded-full overflow-hidden '>
                <Image src="/logo.png" alt='' width={50} height={50} className='object-contain transform scale-125' />
              </Link>
              <div className='flex items-center gap-2 md:gap-6 sm:gap-6'>
                <SearchBar />
                {currentUser() ? <CartMenu /> : null}
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