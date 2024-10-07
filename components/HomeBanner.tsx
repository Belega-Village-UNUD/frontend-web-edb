import Image from "next/image";
import ImageSlider from "./ImageSlider";

const HomeBanner = () => {
  // const features = [
  //   { name: 'Origin', description: 'Designed by Good Goods, Inc.' },
  //   { name: 'Material', description: 'Solid walnut base with rare earth magnets and polycarbonate add-ons.' },
  //   { name: 'Dimensions', description: '15" x 3.75" x .75"' },
  //   { name: 'Finish', description: 'Hand sanded and finished with natural oil' },
  //   { name: 'Includes', description: 'Pen Tray, Phone Tray, Small Tray, Large Tray, Sticky Note Holder' },
  //   { name: 'Considerations', description: 'Made from natural materials. Grain and color vary with each item.' },
  // ];

  const carouselUrl = ["/images/image1.png", "/images/image2.png"];

  return (
    <div className="bg-green-50">
      <div aria-hidden="true" className="relative">
        {/* <Image
          src="https://tailwindui.com/img/ecommerce-images/product-feature-02-full-width.jpg"
          alt=""
          width={2560}
          height={1000}
          className="h-96 w-full object-cover object-center"
        /> */}
        <section className="w-full sm:h-[75vh] h-[50vh]">
          <ImageSlider urls={carouselUrl} />
        </section>
        <div className="absolute inset-0 bg-gradient-to-t from-green-50" />
      </div>

      <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8 z-10">
        <div className="mx-auto max-w-2xl text-center lg:max-w-4xl bg-gray-200 px-4 border-2 border-gray-300 py-6 rounded-xl z-10 pb-20">
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl ">
            Find furniture made for you
          </h2>
          <p className="mt-4 text-black">
            Support Local Artisans: By choosing our bamboo crafts, you
            contribute to the livelihoods of local artisans. We take pride in
            supporting communities and preserving the rich heritage of bamboo
            craftsmanship.
          </p>
        </div>

        {/* <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
          {features.map((feature) => (
            <div key={feature.name} className="border-t border-gray-200 pt-4">
              <dt className="font-medium text-gray-900">{feature.name}</dt>
              <dd className="mt-2 text-sm text-gray-500">{feature.description}</dd>
            </div>
          ))}
        </dl> */}
      </div>
    </div>
  );
};

export default HomeBanner;
