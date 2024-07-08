import React from 'react';
import { Button, Card } from 'antd';
import { useDispatch } from 'react-redux';

const Product = ({ product, onAddToBill, isUpdateBill }) => {
  const dispatch = useDispatch();

  const handlerToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity: 1 }
    });
    onAddToBill(product);
  };

  const { Meta } = Card;

  return (
    <Card
      hoverable
      style={{ width: 240, marginBottom: 30}}
      cover={<img alt={product.name} src={product.image} style={{ height: 200}} />}
    >
      <Meta title={product.name} description={`${product.price} LE`} />
      <div className="product-btn">
        {!isUpdateBill && (
          <Button onClick={() => handlerToCart()}>Add To Cart</Button>
        )}
        {isUpdateBill && (
          <Button onClick={() => onAddToBill(product)}>Add to Bill</Button>
        )}
      </div>
    </Card>
  );
};

export default Product;
