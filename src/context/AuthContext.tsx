"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  username: string;
  role: "user" | "superadmin";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  loginAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
  loginAsGuest: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user profile from Firestore
  const fetchProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  // Refresh the current user's profile (after updates)
  const refreshProfile = async () => {
    if (user) {
      const profile = await fetchProfile(user.uid);
      setUserProfile(profile);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const profile = await fetchProfile(firebaseUser.uid);
        setUserProfile(profile);
        setLoading(false);
      } else {
        // Check if we are in guest mode
        const isGuest = typeof window !== "undefined" && localStorage.getItem("is_guest") === "true";
        if (isGuest) {
          loginAsGuest();
        } else {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
        }
      }
    });
    return unsubscribe;
  }, []);


  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Check if user profile exists
      const profile = await fetchProfile(firebaseUser.uid);

      if (!profile) {
        // First-time user → redirect to onboarding
        router.push("/onboarding");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error; // re-throw so login page can show the error
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("is_guest");
      setUser(null);
      setUserProfile(null);
      router.push("/");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  // Login as Guest
  const loginAsGuest = () => {
    const mockUser = {
      uid: "guest-user-123",
      email: "guest@adisource.test",
      displayName: "Guest Tester",
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
    } as User;

    const mockProfile: UserProfile = {
      uid: "guest-user-123",
      email: "guest@adisource.test",
      displayName: "Guest Tester",
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
      username: "guest_tester",
      role: "user",
      createdAt: new Date().toISOString(),
    };

    setUser(mockUser);
    setUserProfile(mockProfile);
    localStorage.setItem("is_guest", "true");
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithGoogle,
        logout,
        refreshProfile,
        loginAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
