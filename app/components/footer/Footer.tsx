import Link from 'next/link';
import { AiFillFacebook, AiFillInstagram, AiFillTwitterCircle, AiFillYoutube } from 'react-icons/ai';

import Container from '../Container'
import FooterList from './FooterList';

const Footer = () => {
  return ( 
    <footer className="bg-lime-900 text-slate-200 text-sm mt-16">
      <Container>
        <div className='flex flex-col md:flex-row justify-between pt-16 pb-8'>
          <FooterList>
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
          </FooterList>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className='text-base font-bold mb-2'>About Us</h3>
            <p className='mb-2'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim soluta iusto ducimus aspernatur porro accusamus assumenda unde vero in, minus qui numquam maiores praesentium! Deserunt cupiditate aliquid id labore necessitatibus.</p>
            <p>&copy; {new Date().getFullYear()} B-Commerce. All right reserved</p>
          </div>
          <FooterList>
            <h3 className='text-base font-bold mb-2'>Follow Us</h3>
            <div className="flex gap-2">
              <Link href='#'>
                <AiFillYoutube size={24} />
              </Link>
              <Link href='#'>
                <AiFillFacebook size={24} />
              </Link>
              <Link href='#'>
                <AiFillTwitterCircle size={24} />
              </Link>
              <Link href='#'>
                <AiFillInstagram size={24} />
              </Link>
            </div>
          </FooterList>
        </div>
      </Container>
    </footer> 
  );
}

export default Footer;