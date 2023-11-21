const ProductSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-25">
      <div className="skeleton h-32 w-full"></div>
      <div className="skeleton h-4 w-28"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-14"></div>
    </div>
  );
}

export default ProductSkeleton;