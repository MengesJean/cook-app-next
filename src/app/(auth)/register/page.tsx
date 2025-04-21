import Container from "@/components/Container";
import RegisterForm from "@/components/forms/RegisterForm";
import Heading from "@/components/Heading";

const Page = async () => {
  return (
    <Container size={"max-w-md"}>
      <Heading tag="h1">Register</Heading>
      <RegisterForm />
    </Container>
  );
};

export default Page;
