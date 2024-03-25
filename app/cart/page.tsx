import CartList from "./CartList";

interface IParams {
  productId?: string
}

const Cart = ({ params }: { params: IParams }) => {
  // console.log("params", params)

  return (
    <div>
      <CartList />
    </div>
  );
}

export default Cart;