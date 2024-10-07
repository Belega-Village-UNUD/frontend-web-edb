import React from "react";

function Discount() {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <div className="-mx-2 flex items-end justify-end">
        <div className="flex-grow px-2 w-full">
          <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">
            Discount code
          </label>
          <div>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="XXXXXX"
              type="text"
            />
          </div>
        </div>
        <div className="px-2">
          <button className="block w-full max-w-xs mx-auto border border-transparent bg-gray-400 hover:bg-gray-500 focus:bg-gray-500 text-white rounded-md px-5 py-2 font-semibold">
            APPLY
          </button>
        </div>
      </div>
    </div>
  );
}

export default Discount;
