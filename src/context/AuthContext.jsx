import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const SESSION_DURATION = 24 * 60 * 60 * 1000;
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(0);
  const [sessionStart, setSessionStart] = useState(null);
  const lastActivityRef = useRef(Date.now());

  // Fetch user data and initialize coins
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setCoins(userDoc.data().coins); // Load from Firestore
          } else {
            // Create document for new users
            await setDoc(doc(db, "users", firebaseUser.uid), {
              coins: 100,
              email: firebaseUser.email,
            });
            setCoins(100);
          }
        } catch (err) {
          console.error("Error fetching user coins:", err);
          setCoins(100);
        }
      } else {
        setCoins(0); // Reset if logged out
      }
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  // Sync coins to Firestore on change
  useEffect(() => {
    const updateCoinsInFirestore = async () => {
      if (user?.uid && typeof coins === "number") {
        try {
          await setDoc(doc(db, "users", user.uid), { coins }, { merge: true });
        } catch (error) {
          console.error("Failed to update coins in Firestore:", error);
        }
      }
    };
    updateCoinsInFirestore();
  }, [coins, user]);

const logout = async () => {
  // Remove the Firestore update here
  setUser(null);
  setCoins(0); // Reset UI balance to 0 (local state only)
  setSessionStart(null);
  localStorage.removeItem("user");
  localStorage.removeItem("coins");
  localStorage.removeItem("sessionStart");
  if (auth) await auth.signOut(); // Sign out without touching Firestore
};




  const placeBet = (betAmount, guess) => {
    if (betAmount > coins) return { success: false, message: "Not enough coins!" };
    const result = Math.random() < 0.5 ? "heads" : "tails";
    let win = guess === result;
    if (win) {
      setCoins((prev) => prev + betAmount);
    } else {
      setCoins((prev) => prev - betAmount);
    }
    return { success: true, win, result };
  };

  const deposit = (amount) => setCoins((prev) => prev + amount);
  const withdraw = (amount) => setCoins((prev) => Math.max(prev - amount, 0));

  return (
    <AuthContext.Provider value={{
      user, coins, logout,
      placeBet, deposit, withdraw
    }}>
      {children}
    </AuthContext.Provider>
  );
};
