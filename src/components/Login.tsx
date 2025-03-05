import { useState, useEffect } from "react";
import {
  VStack,
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import { auth } from "../utils/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // For new account creation, allow the user to enter a name.
  const [name, setName] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // toggle between sign in and sign up
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // If user is already logged in, go to the journal page.
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
      // onAuthStateChanged will navigate once the user is signed in.
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      setErrorMessage(error.message);
    }
  };

  const handleEmailAuth = async () => {
    setErrorMessage("");
    try {
      if (isSignUp) {
        // Create a new account
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Optionally update the user's display name if provided.
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
      } else {
        // Sign in with an existing account.
        await signInWithEmailAndPassword(auth, email, password);
      }
      // onAuthStateChanged will handle navigation after sign in/up.
    } catch (error: any) {
      console.error("Error with email authentication:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <Heading>Welcome to GroupThoughts</Heading>
      <Button colorScheme="yellow" onClick={handleGoogleSignIn}>
        Sign in with Google
      </Button>
      <Button
        colorScheme="blue"
        onClick={() => setShowEmailForm((prev) => !prev)}
      >
        {showEmailForm ? "Return" : "Sign in / Sign up with Email"}
      </Button>
      {showEmailForm && (
        <VStack spacing={3}>
          {isSignUp && (
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name (for sign up)"
              />
            </FormControl>
          )}
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>
          <Button colorScheme="blue" onClick={handleEmailAuth}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          <Button variant="link" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>
          {errorMessage && <Text color="red.500">{errorMessage}</Text>}
        </VStack>
      )}
    </VStack>
  );
}
