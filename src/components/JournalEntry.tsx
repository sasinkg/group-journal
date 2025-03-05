import { useState, useEffect } from "react";
import { VStack, Heading, Text, Textarea, Button, Container } from "@chakra-ui/react";
import Responses from "./Responses";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../utils/firebaseConfig"; // adjust the import path as needed
import { onAuthStateChanged, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const questions = [
  "What was the highlight of your day?",
  "What is something new you learned today?",
  "What are you grateful for today?",
  "If you could have any superpower, what would it be and why?",
  "Describe your perfect day."
];

export default function JournalEntry() {
  const navigate = useNavigate();
  const [currentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<{ id: string; name: string; response: string }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check auth state and redirect if not logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/");
      } else {
        setUser(currentUser);
        // For authenticated users, check Firestore for an existing submission
        const docRef = doc(db, "journalEntries", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSubmitted(true);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Listen for realtime updates in the "journalEntries" collection
  useEffect(() => {
    const q = query(collection(db, "journalEntries"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const answersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; name: string; response: string }[];
      setAnswers(answersData);
    });
    return () => unsubscribe();
  }, []);

  // Save the journal entry to Firestore
  const handleSubmit = async () => {
    if (answer.trim() && user) {
      try {
        // Use the user's UID as the document ID to prevent duplicate submissions
        await setDoc(doc(db, "journalEntries", user.uid), {
          name: user.displayName || "Anonymous",
          response: answer,
          createdAt: new Date(),
        });
        setSubmitted(true);
        setAnswer("");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  return (
    <Container maxW = "md" py={8}>
      <VStack spacing={4} align="stretch">
        <Heading size="lg">Daily Journal</Heading>
        <Text fontSize="md" fontWeight="bold">
          {questions[currentQuestion]}
        </Text>
        {!submitted ? (
          <>
            <Textarea
              placeholder="Write your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <Button colorScheme="blue" onClick={handleSubmit}>
              Submit
            </Button>
          </>
        ) : (
          <Responses answers={answers} />
        )}
      </VStack>
    </Container>
  );
}
