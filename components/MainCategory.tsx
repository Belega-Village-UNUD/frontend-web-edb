import Link from "next/link";
import { RiMenu2Line } from "react-icons/ri";

export const CATEGORY_LINKS = [
  {
    label: 'Furniture',
    path: '/furniture',
  },
  {
    label: 'Craft',
    path: '/craft',
  },
  {
    label: 'Toys',
    path: '/toys',
  },
  {
    label: 'Home Decor',
    path: '/home-decor',
  },
];

const MainCategory = () => {
  return (
    <div className="border-b border-b-green-700 ">
      <div className="flex items-center bg-white gap-6 text-sm py-4">
        <Link href={'/lists'} className="flex items-center gap-3">
          <RiMenu2Line fontSize={18} /> All Category
        </Link>
        {CATEGORY_LINKS.map((category, idx) => (<Link key={idx} href={category.path}>{category.label}</Link>))}
      </div>
    </div>
  );
}

export default MainCategory;