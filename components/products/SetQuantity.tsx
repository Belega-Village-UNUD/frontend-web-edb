"use client";


interface SetQuantityProps {
  cartCounter?: boolean,
  // cartProduct: CartProductType,
  cartProduct: number,
  handleQtyIncrease: () => void,
  handleQtyDecrease: () => void
}

const btnStyles = 'border-[1.2px] border-slate-300 rounded h-7 w-7 flex items-center justify-center cursor-pointer'

const SetQuantity: React.FC<SetQuantityProps> = ({ cartCounter, cartProduct, handleQtyIncrease, handleQtyDecrease, }) => {
  return (
    <div className="flex gap-8 items-center">
      {/* {cartCounter ? null : <div className="font-semibold">QUANTITY:</div>} */}
      <div className="flex gap-4 items-center text-base">
        <button onClick={handleQtyDecrease} className={btnStyles}>-</button>
        <div>{cartProduct}</div>
        <button onClick={handleQtyIncrease} className={btnStyles}>+</button>
      </div>
    </div>
  );
}

export default SetQuantity;