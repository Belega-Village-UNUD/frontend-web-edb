import ImageSlider from "./ImageSlider";

const HomeBanner = () => {
  const carouselUrl = ["/images/belega-1.jpeg", "/images/belega-2.jpg", "/images/belega-3.jpeg", "/images/belega-4.jpg"];

  return (
    <div className="bg-green-50">
      <div aria-hidden="true" className="relative">
        <section className="w-full sm:h-[75vh] h-[50vh]">
          <ImageSlider urls={carouselUrl} />
        </section>
        <div className="absolute inset-0 bg-gradient-to-t from-green-50" />
      </div>

      <div className="relative mx-auto -mt-20 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-10 lg:px-8 z-10">
        <div className="mx-auto max-w-2xl text-center lg:max-w-4xl bg-white px-4 border-2 py-6 rounded-xl z-10 pb-10">
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl ">
            Find furniture made for you
          </h2>
          <p className="mt-4 text-black">
            Support Local Artisans By choosing our bamboo crafts, you
            contribute to the livelihoods of local artisans. We take pride in
            supporting communities and preserving the rich heritage of bamboo
            craftsmanship.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
