import RegisterForm from "@/app/(auth)/register/RegisterForm";
import Container from "@/components/Container";
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
