import {Button, Box, VStack, Heading, Text } from "@chakra-ui/react";
import { db } from '../utils/firebaseConfig';

type ResponseProps = {
  answers: { name: string; response: string }[];
  resetAnswers: () => void;
};

export default function Responses({ answers, resetAnswers }: ResponseProps) {
  return (
    <VStack align="start" w="full">
      <Heading size="md">Responses:</Heading>
      {answers.map((ans, index) => (
        <Box key={index} p={4} bg="blue.100" borderRadius="md" w="full">
          <Text fontWeight="bold">{ans.name}:</Text>
          <Text>{ans.response}</Text>
        </Box>
      ))}
      <Button colorScheme="pink" onClick ={resetAnswers}>
        Reset! (For Testing)
      </Button>
    </VStack>
  );
}
