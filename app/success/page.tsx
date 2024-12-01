"use client"

import { useRouter } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessPaymentPage = () => {
  const router = useRouter();

  const handleGoToRoot = () => {
    router.push('/buyer/history');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center transform transition duration-500 hover:scale-105">
        <div className="flex justify-center mb-4">
          <FaCheckCircle className="text-green-500 text-6xl animate-bounce" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase. Your transaction has been completed successfully.</p>
        <button
          className="px-6 py-3 bg-green-700 text-white rounded-full hover:bg-green-600 transition duration-300 transform hover:scale-110 shadow-lg" // Tambahkan efek transformasi dan bayangan
          onClick={handleGoToRoot}
        >
          Go to History Order
        </button>
      </div>
    </div>
  );
}

export default SuccessPaymentPage;