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
  getDocs,
  updateDoc,
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import { db, auth } from "../utils/firebaseConfig"; // adjust import path as needed
import { onAuthStateChanged, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { questions } from "../utils/questions";

export default function JournalEntry() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
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
        await checkDailyQuestion(); // Ensure question updates daily
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch current question and reset if needed
  const checkDailyQuestion = async () => {
    const docRef = doc(db, "appState", "questionState");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const lastUpdated = data.lastUpdated.toDate();
      const today = new Date();

      if (
        lastUpdated.getDate() !== today.getDate() ||
        lastUpdated.getMonth() !== today.getMonth() ||
        lastUpdated.getFullYear() !== today.getFullYear()
      ) {
        // New day: Move to the next question and clear answers
        const newQuestionIndex = (data.currentQuestion + 1) % questions.length;
        await updateDoc(docRef, {
          currentQuestion: newQuestionIndex,
          lastUpdated: new Date(),
        });
        setCurrentQuestion(newQuestionIndex);
        await clearPreviousAnswers();
      } else {
        setCurrentQuestion(data.currentQuestion);
      }
    } else {
      // First-time setup
      await setDoc(docRef, { currentQuestion: 0, lastUpdated: new Date() });
      setCurrentQuestion(0);
    }
  };

  // Clear previous day's answers from Firestore
  const clearPreviousAnswers = async () => {
    try {
      const entriesRef = collection(db, "journalEntries");
      const snapshot = await getDoc(entriesRef);

      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      setAnswers([]); // Clear local state
      setSubmitted(false);
    } catch (error) {
      console.error("Error clearing previous answers:", error);
    }
  };

  // Clear all journal entries manually (for testing purposes)
  const clearAllEntries = async () => {
    try {
      const entriesRef = collection(db, "journalEntries"); // Reference the collection
      const snapshot = await getDocs(entriesRef); // 🔹 Use getDocs() for collections
  
      const batch = writeBatch(db); // 🔹 Use batch to delete efficiently
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
  
      await batch.commit(); // 🔹 Execute all deletions at once
  
      setAnswers([]); // Clear local state
      setSubmitted(false);
      console.log("All journal entries cleared for testing.");
    } catch (error) {
      console.error("Error clearing entries:", error);
    }
  };
  

  // Listen for real-time updates in the "journalEntries" collection
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
    <Container maxW="md" py={8}>
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

        {/* Developer-only button to clear all entries */}
        {process.env.NODE_ENV === "development" && (
          <Button colorScheme="red" onClick={clearAllEntries}>
            Clear All Entries (Dev)
          </Button>
        )}
      </VStack>
    </Container>
  );
}
