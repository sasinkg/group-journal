import { useEffect } from "react";
import { VStack, Heading, Button } from "@chakra-ui/react";
import { auth } from "../utils/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, go to journal
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/journal");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Navigation will be handled by onAuthStateChanged listener.
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <Heading>Welcome to the Journal</Heading>
      <Button colorScheme="blue" onClick={handleGoogleSignIn}>
        Sign in with Google
      </Button>
    </VStack>
  );
}
