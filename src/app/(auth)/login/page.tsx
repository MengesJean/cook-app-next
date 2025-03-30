import Container from "@/components/Container";
import Heading from "@/components/Heading";
import LoginForm from "./LoginForm";

const Page = async () => {
  return (
    <Container size={"max-w-md"}>
      <Heading tag="h1">Login</Heading>
      <LoginForm />
    </Container>
  );
};

export default Page;
