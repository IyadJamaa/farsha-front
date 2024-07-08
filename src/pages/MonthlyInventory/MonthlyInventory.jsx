












///correct


import { Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout';

const MonthlyInventory = () => {
  const dispatch = useDispatch();
  const [monthlyProductData, setMonthlyProductData] = useState([]);

  const getMonthlyProductData = async () => {
    try {
      dispatch({
        type: 'SHOW_LOADING',
      });
      const { data } = await axios.get('/api/bills/getbills');

      // Group product quantities by month
      const monthlyProducts = {};
      data.forEach(bill => {
        const date = new Date(bill.createdAt);
        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!monthlyProducts[month]) {
          monthlyProducts[month] = {
            products: [],
            totalPrice: 0,
          };
        }
        bill.cartItems.forEach(item => {
          const { name, quantity, image, price } = item;
          const existingProductIndex = monthlyProducts[month].products.findIndex(p => p.name === name);
          if (existingProductIndex !== -1) {
            monthlyProducts[month].products[existingProductIndex].quantity += quantity;
          } else {
            monthlyProducts[month].products.push({ name, quantity, image, price });
          }
          // Update total price for the month
          monthlyProducts[month].totalPrice += quantity * price;
        });
      });

      setMonthlyProductData(monthlyProducts);
      dispatch({
        type: 'HIDE_LOADING',
      });
    } catch (error) {
      dispatch({
        type: 'HIDE_LOADING',
      });
      console.log(error);
    }
  };

  useEffect(() => {
    getMonthlyProductData();
  }, []);

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => <img src={image} alt={record.name} height={60} width={60} />
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Total Price',
      render: (text, record) => record.quantity * record.price,
    },
  ];

  return (
    <Layout>
      <h2>Monthly Inventory</h2>
      {Object.keys(monthlyProductData).map(month => (
        <div key={month}>
          <h3 style={{ fontSize: '40px' }}>{month}</h3>
          <Table
            dataSource={monthlyProductData[month].products}
            columns={columns}
            bordered
            footer={() => (
              <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                Total Price: {monthlyProductData[month].totalPrice.toFixed(2)}
              </div>
            )}
          />
        </div>
      ))}
    </Layout>
  );
};

export default MonthlyInventory;



















