import { Outlet } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./contexts/authContext";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import LoadingPage from "./components/infos/LoadingPage";
import { auth } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      // Firebase auth is initialized and we know the user's state
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <AuthProvider>
      <Outlet />
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
