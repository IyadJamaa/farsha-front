


import { Table, Button, Modal } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../../components/Layout';
import { DeleteFilled } from '@ant-design/icons'; // Import the DeleteOutlined icon

const DailyInventory = () => {
  const dispatch = useDispatch();
  const [dailyProductData, setDailyProductData] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const getDailyProductData = async () => {
    try {
      dispatch({
        type: 'SHOW_LOADING',
      });
      const { data } = await axios.get('/api/bills/getbills');
      console.log('Raw data:', data); // Debugging: log raw data from the server
  
      // Group product quantities by day
      const dailyProducts = {};
      data.forEach((bill) => {
        const date = new Date(bill.createdAt);
        date.setHours(date.getHours() - 4); // Subtract 4 hours to make the day end at 4 am
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        console.log('Date:', date); // Debugging: log the date
  
        const dateString = date.toLocaleDateString();
        if (!dailyProducts[dateString]) {
          dailyProducts[dateString] = {
            products: [],
            totalPrice: 0,
          };
        }
        bill.cartItems.forEach((item) => {
          const { name, quantity, image, price } = item;
          console.log('Item:', name, quantity, image, price); // Debugging: log each item
          const existingProductIndex = dailyProducts[dateString].products.findIndex((p) => p.name === name);
          if (existingProductIndex !== -1) {
            dailyProducts[dateString].products[existingProductIndex].quantity += quantity;
          } else {
            dailyProducts[dateString].products.push({ name, quantity, image, price });
          }
          // Update total price for the day
          dailyProducts[dateString].totalPrice += quantity * price;
        });
      });
  
      console.log('Daily product data:', dailyProducts); // Debugging: log daily product data
      setDailyProductData(dailyProducts);
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
    getDailyProductData();
  }, []);

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      render: (image, record) => <img src={image} alt={record.name} height={60} width={60} />,
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
      <h2>Daily Inventory</h2>
      {Object.keys(dailyProductData).map((date) => (
        <div key={date}>
          <h3 style={{ fontSize: '40px' }}>Day : {date}</h3>
          <div style={{ marginBottom: '16px' }}>
       
          </div>
          <Table
            dataSource={dailyProductData[date].products.map(product => ({ ...product, date }))} // Pass date along with each product
            columns={columns}
            bordered
            footer={() => (
              <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                Total Price: {dailyProductData[date].totalPrice.toFixed(2)}
              </div>
            )}
          />
        </div>
      ))}
      {/* <Modal
        title="Delete Products for this Day"
        visible={deleteModalVisible}
        onOk={handleDeleteProductForDay}
        onCancel={() => setDeleteModalVisible(false)}
      >
        <p>Are you sure you want to delete all products for this day?</p>
      </Modal> */}
    </Layout>
  );
};

export default DailyInventory;
