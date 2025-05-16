import React from "react";
import { useAuth } from "../context/AuthContext";

const Wallet = ({ open, onClose }) => {
  const { coins } = useAuth();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl shadow-xl p-6 w-80 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-center mb-4 text-[#0a174e]">Wallet</h2>
        <div className="text-center mb-6">
          <span className="text-lg font-semibold text-gray-700">Current Balance:</span>
          <div className="text-3xl font-bold text-[#d3af37]">{coins}</div>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className="bg-[#0a174e] text-white px-4 py-2 rounded-lg font-semibold opacity-80 cursor-not-allowed"
            disabled
          >
            Deposit
          </button>
          <button
            className="bg-[#d3af37] text-black px-4 py-2 rounded-lg font-semibold opacity-80 cursor-not-allowed"
            disabled
          >
            Withdraw
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">(Deposit and Withdraw coming soon)</p>
      </div>
    </div>
  );
};

export default Wallet;
