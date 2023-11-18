import Link from "next/link";
import Container from "../../../components/Container";
import FormWrap from "../../../components/FormWrap";
import VerifForm from "./VerifForm";

const Verif = () => {
  return (  
    <Container>
      <FormWrap>
        <VerifForm />
      </FormWrap>
    </Container>
  );
}

export default Verif;