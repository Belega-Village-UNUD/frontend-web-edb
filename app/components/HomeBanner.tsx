const HomeBanner = () => {
  return (  
    <div className="relative bg-gradient-to-r from-lime-600 to-lime-900 mb-8">
      <div className="mx-auto px-8 py-12 flex flex-col gap-2 md:flex-row items-center justify-evenly">
        <div className="mb-8 md:mb-0 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Happy New Years</h1>
          <p className="text-lg md:text-xl text-white mb-2">Enjoy discounts on selected item</p>
          <p className="text-2xl md:text-5xl text-yellow-300 font-bold">50%</p>
        </div>
      </div>
    </div>
  );
}

export default HomeBanner;