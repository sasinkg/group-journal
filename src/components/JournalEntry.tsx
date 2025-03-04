import { useState } from "react";
import { Box, Button, Input, Textarea, VStack, Heading, Text } from "@chakra-ui/react";
import Responses from "./Responses";

const questions = [
  "What was the highlight of your day?",
  "What is something new you learned today?",
  "What are you grateful for today?",
  "If you could have any superpower, what would it be and why?",
  "Describe your perfect day."
];

export default function JournalEntry() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<{ name: string; response: string }[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (name.trim() && answer.trim()) {
      setAnswers([...answers, { name, response: answer }]);
      setSubmitted(true);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Heading size="lg">Daily Journal</Heading>
      <Text fontSize="md" fontWeight="bold">{questions[currentQuestion]}</Text>

      {!submitted ? (
        <>
          <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea placeholder="Write your answer here..." value={answer} onChange={(e) => setAnswer(e.target.value)} />
          <Button colorScheme="blue" onClick={handleSubmit}>Submit</Button>
        </>
      ) : (
        <Responses answers={answers} />
      )}
    </VStack>
  );
}
