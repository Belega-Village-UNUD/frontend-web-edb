import Container from "@/components/Container";
import CartList from "./CartList";

interface ProductIdProps {
  productId?: string
}

const Cart = ({ params }: { params: ProductIdProps }) => {
  // console.log("params", params)

  return (
    <Container>
      <CartList />
    </Container>
  );
}

export default Cart;