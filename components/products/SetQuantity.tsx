"use client";

import { useState } from "react";

interface SetQuantityProps {
  cartQty: number,
  onQtyChange: (qty: number) => void,
}

const btnStyles = 'border-[1.2px] border-slate-300 rounded h-7 w-7 flex items-center justify-center cursor-pointer'

const SetQuantity: React.FC<SetQuantityProps> = ({ cartQty, onQtyChange }) => {
  const [newQty, setNewQty] = useState(cartQty);


  const handleIncrease = () => {
    const updatedQty = newQty + 1;
    setNewQty(updatedQty);
    onQtyChange(updatedQty);
  }

  const handleDecrease = () => {
    const updatedQty = newQty - 1;
    if (newQty > 1) {
      setNewQty(updatedQty);
      onQtyChange(updatedQty);
    }
  }

  return (
    <div className="flex gap-8 items-center">
      <div className="flex gap-4 items-center text-base">
        <button onClick={handleDecrease} className={btnStyles}>-</button>
        <div>{newQty}</div>
        <button onClick={handleIncrease} className={btnStyles}>+</button>
      </div>
    </div>
  );
}

export default SetQuantity;