import Link from "next/link";
import Container from "../components/Container";
import FormWrap from "../components/FormWrap";
import ResetForm from "./ResetForm";

const Login = () => {
  return (  
    <Container>
      <FormWrap>
        <ResetForm />
      </FormWrap>
    </Container>
  );
}

export default Login;