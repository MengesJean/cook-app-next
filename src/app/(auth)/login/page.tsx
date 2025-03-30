import LoginForm from "@/app/(auth)/login/LoginForm";
import Container from "@/components/Container";
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
