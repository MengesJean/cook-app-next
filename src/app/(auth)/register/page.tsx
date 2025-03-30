import Container from "@/components/Container";
import Heading from "@/components/Heading";
import RegisterForm from "./RegisterForm";

const Page = async () => {
  return (
    <Container size={"max-w-md"}>
      <Heading tag="h1">Register</Heading>
      <RegisterForm />
    </Container>
  );
};

export default Page;
