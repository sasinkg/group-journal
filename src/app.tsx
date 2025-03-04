import { ChakraProvider, Container } from "@chakra-ui/react";
import JournalEntry from "./components/JournalEntry";

export default function App() {
  return (
    <ChakraProvider>
      <Container maxW="container.md" py={8}>
        <JournalEntry />
      </Container>
    </ChakraProvider>
  );
}
