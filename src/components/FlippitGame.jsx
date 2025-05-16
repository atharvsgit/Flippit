import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Wallet from './Wallet';

const FlippitGame = () => {
  const { logout, coins, placeBet } = useAuth();
  const navigate = useNavigate();
  const [walletOpen, setWalletOpen] = useState(false);

  
  const [bet, setBet] = useState(10);
  const [guess, setGuess] = useState('heads');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleFlip = () => {
    setError('');
    setResult(null);

    if (bet < 1) {
      setError('Bet must be at least 1 coin.');
      return;
    }
    if (bet > coins) {
      setError('Not enough coins!');
      return;
    }

    const flip = placeBet(bet, guess);
    setResult(flip);
  };

  return (
    <div className="min-h-screen bg-[#0a174e]">
      <Wallet open={walletOpen} onClose={() => setWalletOpen(false)} />
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 w-full h-16 bg-black flex flex-col sm:flex-row items-center justify-between px-2 sm:px-6 shadow-lg z-50">
        {/* Left: Flippit Logo */}
        <div className="w-full sm:w-auto flex justify-between items-center">
          <div className="text-[#d3af37] text-lg sm:text-2xl font-extrabold tracking-wide select-none">
            Flippit
          </div>
          {/* Show logout on right for mobile */}
          <button
            onClick={handleLogout}
            className="sm:hidden bg-red-600 hover:bg-red-700 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-base transition"
          >
            Logout
          </button>
        </div>

        {/* Center: Balance and Wallet */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mt-1 sm:mt-0">
          <span className="text-white text-sm sm:text-lg font-semibold">
            Balance: <span className="text-[#d3af37]">{coins}</span>
          </span>
          <button
            className="bg-[#d3af37] hover:bg-yellow-400 text-black px-2 py-1 sm:px-3 sm:py-1 rounded-lg font-semibold text-xs sm:text-base transition"
            onClick={() => {setWalletOpen(!walletOpen)}}
          >
            Wallet
          </button>
        </div>

        {/* Right: Logout Button (hidden on mobile, shown on desktop) */}
        <button
          onClick={handleLogout}
          className="hidden sm:block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-base transition"
        >
          Logout
        </button>
      </nav>

      {/* Page Content */}
      <div className="pt-24 max-w-xl mx-auto">
        <div className="bg-black text-white rounded-2xl shadow-2xl p-4 sm:p-8 mt-8">
          <h2 className="text-xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">Flippit</h2>

          {/* Coin Flip Game UI */}
          <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-center items-center">
              <input
                type="number"
                min={1}
                max={coins}
                value={bet}
                onChange={e => setBet(Number(e.target.value))}
                className="w-24 px-2 py-1 rounded bg-white text-black text-sm sm:text-base focus:outline-none"
                placeholder="Bet"
              />
              <select
                value={guess}
                onChange={e => setGuess(e.target.value)}
                className="px-2 py-1 rounded bg-white text-black text-sm sm:text-base focus:outline-none"
              >
                <option value="heads">Heads</option>
                <option value="tails">Tails</option>
              </select>
              <button
                onClick={handleFlip}
                className="bg-[#d3af37] hover:bg-yellow-400 text-black px-4 py-1 rounded font-semibold text-sm sm:text-base transition"
              >
                Flip!
              </button>
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            {result && (
              <div className={`text-center rounded p-2 mt-2 ${result.win ? 'bg-green-700' : 'bg-red-700'} text-white`}>
                {result.win
                  ? `You WON! It was ${result.result.toUpperCase()}. You now have ${result.win ? coins : coins} coins.`
                  : `You LOST! It was ${result.result.toUpperCase()}. You now have ${result.win ? coins : coins} coins.`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlippitGame;
