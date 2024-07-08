import React from 'react';
import { Button, Card } from 'antd';

const ProductBill = ({ product, onAddToBill }) => {
  const handleAddToBill = () => {
    // Invoke the callback to add the product to the bill
    onAddToBill(product);
  };

  const { Meta } = Card;

  return (
    <Card
      hoverable
      style={{ width: 240, marginBottom: 30 }}
      cover={<img alt={product.name} src={product.image} style={{ height: 200 }} />}
    >
      <Meta title={product.name} description={`${product.price} LE`} />
      <div className="product-btn">
        <Button onClick={handleAddToBill}>Add to Bill</Button>
      </div>
    </Card>
  );
};

export default ProductBill;
