import Image from "next/image";
import { useRouter } from "next/navigation";

const products = [
  {
    id: 1,
    name: 'Nomad Tumbler',
    description:
      'This durable and portable insulated tumbler will keep your beverage at the perfect temperature during your next adventure.',
    href: '#',
    price: '35.00',
    status: 'Preparing to ship',
    step: 3,
    date: 'March 24, 2021',
    datetime: '2021-03-24',
    address: ['Floyd Miles', '7363 Cynthia Pass', 'Toronto, ON N3Y 4H8'],
    email: 'f•••@example.com',
    phone: '1•••••••••40',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/confirmation-page-03-product-01.jpg',
    imageAlt: 'Insulated bottle with white base and black snap lid.',
  },
  {
    id: 2,
    name: 'Minimalist Wristwatch',
    description: 'This contemporary wristwatch has a clean, minimalist look and high quality components.',
    href: '#',
    price: '149.00',
    status: 'Shipped',
    step: 0,
    date: 'March 23, 2021',
    datetime: '2021-03-23',
    address: ['Floyd Miles', '7363 Cynthia Pass', 'Toronto, ON N3Y 4H8'],
    email: 'f•••@example.com',
    phone: '1•••••••••40',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/confirmation-page-03-product-02.jpg',
    imageAlt:
      'Arm modeling wristwatch with black leather band, white watch face, thin watch hands, and fine time markings.',
  },
]

const CheckoutList = () => {

  return (
    <div className="pt-10">

      <div className="bg-white rounded-md shadow-sm">

        <div className='p-4 text-end text-gray-300 font-medium grid grid-cols-6'>
          <div className='col-span-3 grid justify-self-start'>
            <p className="text-slate-700 text-lg font-semibold">Product Ordered</p>
          </div>
          <p>Unit Price</p>
          <p>Quantity</p>
          <p>Product Subtotal</p>
        </div>

        <div className="px-4 py-2">
          <h4 className="text-lime-800 text-xl font-semibold">Terawan Store</h4>
        </div>

        <div className="grid border-b border-gray-200">
          {products.map((product) => (
            <div key={product.id} className="px-4 flex lg:grid lg:grid-cols-6 lg:place-content-center">
              <div className="pr-4 aspect-auto w-14 h-14 overflow-hidden rounded-lg sm:aspect-none sm:h-40 sm:w-40">
                <Image
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  width={50}
                  height={50}
                  className="h-full w-full object-cover object-center md:h-full md:w-full sm:h-full sm:w-full"
                />
              </div>

              <div className='col-span-2 flex items-center'>
                <h3 className="text-base font-medium text-slate-700">
                  <a href={product.href}>{product.name}</a>
                </h3>
              </div>


              <p className="text-end py-20 text-sm font-medium text-slate-700">${product.price}</p>
              <p className="text-end py-20 text-sm font-medium text-slate-700">1</p>
              <p className="text-end py-20 text-sm font-medium text-slate-700">${product.price}</p>

            </div>
          ))}
        </div>

        <div className="px-4 py-2 grid justify-items-stretch grid-cols-2">
          <h4 className="">Total</h4>
          <h4 className="justify-self-end text-lime-800 text-xl font-semibold">2198391238</h4>
        </div>
      </div>

    </div >
  )
}

export default CheckoutList;