import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase.js'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/game');
    }
  }, [user, navigate]);

  async function handleAuth(e) {
    e.preventDefault();
    try {
      if (isSignUp) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCred.user.uid), {
          coins: 100,
          email: userCred.user.email,
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  }




  return (
    <div className="flex items-center justify-center min-h-screen px-4" style={{ backgroundColor: '#0a174e' }}>
      <div className="w-full max-w-md bg-black text-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isSignUp ? 'Sign Up' : 'Login'}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold transition duration-200"
            style={{
              backgroundColor: '#0a174e',
              color: 'white',
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#13327c'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#0a174e'}
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-300 underline hover:text-blue-400 transition"
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>

        {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
