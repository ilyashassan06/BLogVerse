// UserContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// ⬇️ Import your own initialized Firebase instances
// Make sure your ../firebase/firebase exports: `auth` and `db`
import { auth, db } from "../firebase/firebase";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null); // raw Firebase user
  const [username, setUsername] = useState("");           // input field value
  const [savedName, setSavedName] = useState("");         // value from Firestore
  const [loading, setLoading] = useState(true);           // overall loading state
  const [saving, setSaving] = useState(false);            // saving state for UX
  const [error, setError] = useState(null);               // last error (optional)

  // 🔄 Keep track of auth and fetch username whenever auth changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (!user) {
        setSavedName("");
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setSavedName(snap.data()?.username || "");
        } else {
          setSavedName("");
        }
      } catch (err) {
        console.error("Error fetching username:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // ✅ Save / update username to Firestore
  const handleSaveName = async (e) => {
    e?.preventDefault?.();

    if (!username.trim()) return;
    try {
      setSaving(true);
      setError(null);

      const user = auth.currentUser;
      if (!user) {
        alert("Please log in first.");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { username: username.trim() }, { merge: true });

      setSavedName(username.trim());
      setUsername("");
      console.log("✅ Username saved successfully!");
    } catch (err) {
      console.error("❌ Error saving username:", err);
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  const value = useMemo(
    () => ({
      // Auth
      user: firebaseUser,

      // Username states
      username,
      setUsername,
      savedName,
      setSavedName,

      // Status
      loading,
      saving,
      error,

      // Actions
      handleSaveName,
    }),
    [firebaseUser, username, savedName, loading, saving, error]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// 🔓 Easy hook for consumers
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a <UserProvider>");
  }
  return ctx;
}
