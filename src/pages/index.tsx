import { Container } from "@chakra-ui/react";
import JournalEntry from "../components/JournalEntry";

export default function Home() {
  return (
    <Container maxW="container.md" py={8}>
      <JournalEntry />
    </Container>
  );
}
