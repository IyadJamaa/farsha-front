











// import React, { useState, useEffect } from 'react';
// import { Table, Modal, Button, Form, Input } from 'antd';
// import axios from 'axios';
// import Layout from '../../components/Layout';
// import { MinusCircleOutlined  } from '@ant-design/icons';

// const ManageItems = () => {
//   const [items, setItems] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [itemName, setItemName] = useState('');
//   const [quantity, setQuantity] = useState('');

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   const fetchItems = async () => {
//     try {
//       const response = await axios.get('/api/items/items');
//       setItems(response.data);
//     } catch (error) {
//       console.error('Error fetching items:', error);
//     }
//   };

//   const handleAddItem = async () => {
//     try {
//       const dateAdded = new Date(); // Get current date
//       const dateConsumed = quantity === 0 ? new Date() : null; // Check if quantity is 0
      
//       await axios.post('/api/items/items', { itemName, quantity, dateAdded, dateConsumed });
//       fetchItems();
//       setModalVisible(false);
//       setItemName(''); // Clear the form fields
//       setQuantity(''); // Clear the form fields
//     } catch (error) {
//       console.error('Error adding item:', error);
//     }
//   };

//   const handleDeleteItem = async (id) => {
//     try {
//       await axios.delete(`/api/items/items/${id}`);
//       fetchItems();
//     } catch (error) {
//       console.error('Error deleting item:', error);
//     }
//   };

//   const handleDecrementQuantity = async (id, currentQuantity) => {
//     if (currentQuantity > 0) {
//       try {
//         const updatedData = { quantity: currentQuantity - 1 };
//         if (currentQuantity - 1 === 0) {
//           updatedData.dateConsumed = new Date(); // Set dateConsumed to current date
//         }

//         await axios.put(`/api/items/items/${id}`, updatedData);
//         fetchItems();
//       } catch (error) {
//         console.error('Error decrementing quantity:', error);
//       }
//     }
//   };

//   const columns = [
//     {
//       title: 'Item Name',
//       dataIndex: 'itemName',
//       key: 'itemName',
//     },
//     {
//       title: 'Quantity',
//       dataIndex: 'quantity',
//       key: 'quantity',
//     },
//     {
//       title: 'Date Added',
//       dataIndex: 'dateAdded',
//       key: 'dateAdded',
//     },
//     {
//       title: 'Date Consumed',
//       dataIndex: 'dateConsumed',
//       key: 'dateConsumed',
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <div>
//           <Button type="link" onClick={() => handleDecrementQuantity(record._id, record.quantity)}>
//             <MinusCircleOutlined /> 
//           </Button>
//           <Button type="link" danger onClick={() => handleDeleteItem(record._id)}>
//             Delete
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <Layout>
//       <h2>Manage Items</h2>
//       <Button type="primary" onClick={() => setModalVisible(true)}>
//         Add Item
//       </Button>
//       <Modal
//         title="Add Item"
//         visible={modalVisible}
//         onCancel={() => setModalVisible(false)}
//         onOk={handleAddItem}
//       >
//         <Form layout="vertical">
//           <Form.Item label="Item Name">
//             <Input value={itemName} onChange={(e) => setItemName(e.target.value)} />
//           </Form.Item>
//           <Form.Item label="Quantity">
//             <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
//           </Form.Item>
//         </Form>
//       </Modal>
//       <Table dataSource={items} columns={columns} />
//     </Layout>
//   );
// };

// export default ManageItems;




import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Form, Input } from 'antd';
import axios from 'axios';
import Layout from '../../components/Layout';
import { MinusCircleOutlined } from '@ant-design/icons';

const formatDate = (date) => {
  if (!date) return null;
  const options = { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
  return new Date(date).toLocaleString('en-US', options).replace(',', '');
};

const ManageItems = () => {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/items/items');
      const formattedItems = response.data.map(item => ({
        ...item,
        dateAdded: formatDate(item.dateAdded),
        dateConsumed: formatDate(item.dateConsumed),
      }));
      setItems(formattedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddItem = async () => {
    try {
      if (!itemName || !quantity) {
        throw new Error('Item name and quantity are required.');
      }
      const dateAdded = new Date();
      const dateConsumed = quantity === '0' ? new Date() : null;

      await axios.post('/api/items/items', { itemName, quantity, dateAdded, dateConsumed });
      fetchItems();
      setModalVisible(false);
      setItemName('');
      setQuantity('');
    } catch (error) {
      console.error('Error adding item:', error.message);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`/api/items/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleDecrementQuantity = async (id, currentQuantity) => {
    if (currentQuantity > 0) {
      try {
        const updatedData = { quantity: currentQuantity - 1 };
        if (currentQuantity - 1 === 0) {
          updatedData.dateConsumed = new Date();
        }

        await axios.put(`/api/items/items/${id}`, updatedData);
        fetchItems();
      } catch (error) {
        console.error('Error decrementing quantity:', error);
      }
    }
  };

  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Date Added',
      dataIndex: 'dateAdded',
      key: 'dateAdded',
    },
    {
      title: 'Date Consumed',
      dataIndex: 'dateConsumed',
      key: 'dateConsumed',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => handleDecrementQuantity(record._id, record.quantity)}>
            <MinusCircleOutlined />
          </Button>
          <Button type="link" danger onClick={() => handleDeleteItem(record._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h2>Manage Items</h2>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Add Item
      </Button>
      <Modal
        title="Add Item"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleAddItem}
      >
        <Form layout="vertical">
          <Form.Item label="Item Name">
            <Input value={itemName} onChange={(e) => setItemName(e.target.value)} />
          </Form.Item>
          <Form.Item label="Quantity">
            <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
      <Table dataSource={items} columns={columns} />
    </Layout>
  );
};

export default ManageItems;
