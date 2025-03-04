import { Box, VStack, Heading, Text } from "@chakra-ui/react";

type ResponseProps = {
  answers: { name: string; response: string }[];
};

export default function Responses({ answers }: ResponseProps) {
  return (
    <VStack align="start" w="full">
      <Heading size="md">Responses:</Heading>
      {answers.map((ans, index) => (
        <Box key={index} p={4} bg="gray.100" borderRadius="md" w="full">
          <Text fontWeight="bold">{ans.name}:</Text>
          <Text>{ans.response}</Text>
        </Box>
      ))}
    </VStack>
  );
}
