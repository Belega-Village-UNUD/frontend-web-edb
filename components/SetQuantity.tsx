"use client";

import { useState } from "react";

interface SetQuantityProps {
  cartId: string;
  cartQty: number;
  onQtyChange: (cartId: string, qty: number) => void;
  stock: number;
}

const btnStyles =
  "border-[1.2px] border-slate-300 rounded h-7 w-7 flex items-center justify-center cursor-pointer transition-colors duration-300";

const enabledBtnStyles = "bg-white text-black hover:bg-gray-200";

const disabledBtnStyles = "bg-gray-300 text-gray-600 cursor-not-allowed";

const SetQuantity: React.FC<SetQuantityProps> = ({
  cartId,
  cartQty,
  onQtyChange,
  stock,
}) => {
  const [newQty, setNewQty] = useState(cartQty);

  const handleIncrease = () => {
    if (newQty < stock) {
      const updatedQty = newQty + 1;
      setNewQty(updatedQty);
      onQtyChange(cartId, updatedQty);
    }
  };

  const handleDecrease = () => {
    const updatedQty = newQty - 1;
    if (newQty > 1) {
      setNewQty(updatedQty);
      onQtyChange(cartId, updatedQty);
    }
  };

  return (
    <div className="flex gap-8 items-center">
      <div className="flex gap-4 items-center text-base">
        <button
          onClick={handleDecrease}
          className={`${btnStyles} ${
            newQty <= 1 ? disabledBtnStyles : enabledBtnStyles
          }`}
          disabled={newQty <= 1}
        >
          -
        </button>
        <div>{newQty}</div>
        <button
          onClick={handleIncrease}
          className={`${btnStyles} ${
            newQty >= stock ? disabledBtnStyles : enabledBtnStyles
          }`}
          disabled={newQty >= stock}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default SetQuantity;
