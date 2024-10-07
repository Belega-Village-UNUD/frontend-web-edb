import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

interface RatingProps {
  value: number;
  onChange: (value: number) => void;
}

const Rating: React.FC<RatingProps> = ({ value, onChange }) => {
  const [rating, setRating] = useState(value);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setRating(index + 1);
    onChange(index + 1);
  };

  const handleMouseEnter = (index: number) => {
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          className={`w-8 h-8 cursor-pointer ${
            (hoverRating !== null ? index < hoverRating : index < rating)
              ? "text-yellow-500"
              : "text-gray-400"
          }`}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
};

export default Rating;
