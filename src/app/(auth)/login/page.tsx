import Container from "@/components/Container";
import LoginForm from "@/components/forms/LoginForm";
import Heading from "@/components/Heading";

const Page = async () => {
  return (
    <Container size={"max-w-md"}>
      <Heading tag="h1">Login</Heading>
      <LoginForm />
    </Container>
  );
};

export default Page;
