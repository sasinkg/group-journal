import { useState, useEffect } from "react";
import {
  Container,
  VStack,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";
import Responses from "./Responses";
import {
  collection,
  setDoc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
} from "firebase/firestore";
import { db, auth } from "../utils/firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

// Helper: Get day of year (used to pick today's question)
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Option A: Local date in YYYY-MM-DD
function getLocalDateString(): string {
  // "en-CA" produces "YYYY-MM-DD" format in many browsers
  return new Date().toLocaleDateString("en-CA");
}

const questions = [
  "What was the highlight of your day?",
  "What is something new you learned today?",
  "What are you grateful for today?",
  "If you could have any superpower, what would it be and why?",
  "Describe your perfect day.",
];

export default function JournalEntry() {
  const [user, setUser] = useState<User | null>(null);

  // 1. Determine today's question
  //    If you want a daily cycle, use day-of-year % questions.length
  const dayIndex = getDayOfYear(new Date()) % questions.length;
  const [currentQuestion] = useState(questions[dayIndex]);

  // 2. Use local date string to avoid UTC mismatch
  const dateKey = getLocalDateString();
  console.log("Current local dateKey:", dateKey);

  // Local states
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<{ id: string; name: string; response: string }[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // On mount, check auth state & see if user has submitted today
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      if (!usr) {
        // If not logged in, redirect to login
        window.location.href = "/";
      } else {
        setUser(usr);
        // Use doc ID = user.uid + dateKey
        const docId = `${usr.uid}_${dateKey}`;
        console.log("Checking if doc exists:", docId);
        const docRef = doc(db, "journalEntries", docId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          console.log("User already submitted for today:", snapshot.data());
          setSubmitted(true);
        } else {
          setSubmitted(false);
        }
      }
    });
    return () => unsubscribe();
  }, [dateKey]);

  // Listen for all of today's answers (from all users)
  useEffect(() => {
    const q = query(
      collection(db, "journalEntries"),
      where("date", "==", dateKey), // Only fetch today's entries
      orderBy("createdAt", "asc")
    );
  
    console.log("Querying Firestore for entries with dateKey:", dateKey);
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; name: string; response: string }[];
  
      console.log("Fetched responses:", data);
      setAnswers(data);
    }, (error) => {
      console.error("Error fetching documents:", error);
    });
  
    return () => unsubscribe();
  }, [dateKey]);
  

  // Submit today's entry, doc ID = user.uid + dateKey
  const handleSubmit = async () => {
    if (!user) return;
    if (!answer.trim()) {
      console.warn("Answer is empty.");
      return;
    }
  
    const entryName = user.displayName || name || "Anonymous";
    const docId = `${user.uid}_${dateKey}`;
  
    console.log("Submitting response:", {
      docId,
      name: entryName,
      response: answer,
      dateKey,
    });
  
    try {
      await setDoc(doc(db, "journalEntries", docId), {
        name: entryName,
        response: answer,
        createdAt: new Date(),
        date: dateKey, // Local date
        userId: user.uid,
      });
  
      console.log("Document successfully written.");
      setSubmitted(true);
      setAnswer("");
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };
  

  // For convenience, sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Container maxW="md" py={8}>
      <VStack spacing={4} align="stretch">
        <Heading size="lg">Daily Journal</Heading>
        <Text fontSize="md" fontWeight="bold">
          {currentQuestion}
        </Text>
        <Button onClick={handleSignOut} colorScheme="red">
          Sign Out
        </Button>
        {!submitted ? (
          <>
            {/* If user doesn't have a displayName, show an input for their name */}
            {!user?.displayName && (
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
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
