interface IParams {
  productId?: string
}

const Cart = ({params}: {params: IParams}) => {
  console.log("params",params)
  console.log("params",params.productId)

  return (  
    <div>
      <h1>Cart</h1>
    </div>
  );
}

export default Cart;