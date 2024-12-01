"use client"

import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

const FailedPaymentPage = () => {
  const router = useRouter();

  const handleGoToRoot = () => {
    router.push('/buyer/history');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center transform transition duration-500 hover:scale-105">
        <div className="flex justify-center mb-4">
          <FaTimes className="text-red-500 text-6xl animate-bounce" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Failed!</h1>
        <p className="text-gray-600 mb-6">Unfortunately, your payment could not be processed. Please try again or contact support.</p>
        <button
          className="px-6 py-3 bg-red-700 text-white rounded-full hover:bg-red-600 transition duration-300 transform hover:scale-110 shadow-lg" // Tambahkan efek transformasi dan bayangan
          onClick={handleGoToRoot}
        >
          Go to History Order
        </button>
      </div>
    </div>
  );
};

export default FailedPaymentPage;