import { Button, Modal, Table, Popconfirm } from 'antd';
import axios from 'axios';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { EyeOutlined, DeleteOutlined, DeleteFilled, PrinterOutlined, EditOutlined,PlusCircleOutlined,MinusCircleOutlined  } from '@ant-design/icons';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Layout from '../../components/Layout';
import Product from '../../components/Product';
import BillOption from '../BillOption/BillOption';

const Bills = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
const [editedBill, setEditedBill] = useState(null);
  const user = JSON.parse(localStorage.getItem("auth"));
  const navigate = useNavigate();

  const { cartItems } = useSelector(state => state.rootReducer);
  const [isBillOptionVisible, setIsBillOptionVisible] = useState(false); // State to control BillOption visibility

 
  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity >= 1) {
      setEditedBill((prevBill) => {
        const updatedCartItems = [...prevBill.cartItems];
        updatedCartItems[index].quantity = newQuantity;
  
        // Recalculate the subtotal
        const newSubTotal = updatedCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
        return {
          ...prevBill,
          cartItems: updatedCartItems,
          subTotal: newSubTotal,
        };
      });
    }
  };
  
  
  const updateBillAPI = async (updatedBill) => {
    try {
      const response = await axios.put(`/api/bills/updatebills`, updatedBill);
      console.log("Bill updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating bill:", error);
    }
  };

  const handleUpdateBill = async () => {
    try {
      // Send updated bill details to the backend API
      await axios.put(`/api/bills/updatebills/${editedBill._id}`, editedBill);
      // Update the local billsData state with the updated bill details
      setBillsData((prevBills) =>
        prevBills.map((bill) =>
          bill._id === editedBill._id ? editedBill : bill
        )
      );
      // Close the modal
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Error updating bill:", error);
    }
  };

  const handleCartItemChange = (index, key, value) => {
    setEditedBill((prevBill) => {
      const updatedCartItems = [...prevBill.cartItems];
      updatedCartItems[index][key] = value;
      return {
        ...prevBill,
        cartItems: updatedCartItems,
      };
    });
  };

  
  
  const handleRemoveCartItem = (indexToRemove) => {
    setEditedBill((prevBill) => {
      // Calculate the new subtotal after removing the item
      const updatedCartItems = [...prevBill.cartItems];
      const removedItem = updatedCartItems.splice(indexToRemove, 1)[0];
      const newSubTotal = prevBill.subTotal - removedItem.price * removedItem.quantity;
  
      return {
        ...prevBill,
        cartItems: updatedCartItems,
        subTotal: newSubTotal,
      };
    });
  };
  
  
  const getAllBills = async () => {
    try {
      dispatch({
        type: 'SHOW_LOADING',
      });
      const { data } = await axios.get('/api/bills/getbills');
      setBillsData(data);
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
    getAllBills();
  }, []);
  const handleAddProductToBill = (newProduct) => {
    // Check if the product already exists in editedBill.cartItems
    const existingItemIndex = editedBill.cartItems.findIndex(
      (item) => item._id === newProduct._id
    );

    if (existingItemIndex !== -1) {
      // If the product exists, increase its quantity by one
      setEditedBill((prevBill) => {
        const updatedCartItems = [...prevBill.cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;

        // Recalculate the subtotal
        const newSubTotal = prevBill.subTotal + newProduct.price;

        return {
          ...prevBill,
          cartItems: updatedCartItems,
          subTotal: newSubTotal,
        };
      });
    } else {
      // If the product does not exist, add it to cartItems
      setEditedBill((prevBill) => {
        const updatedCartItems = [...prevBill.cartItems, { ...newProduct, quantity: 1 }];
        const newSubTotal = prevBill.subTotal + newProduct.price;
        
        return {
          ...prevBill,
          cartItems: updatedCartItems,
          subTotal: newSubTotal,
        };
      });
    }

    setIsBillOptionVisible(false); // Close the BillOption modal after adding a product
  };
  const handleDeleteBill = async (id) => {
    try {
      await axios.delete(`/api/bills/deletebill/${id}`);
      setBillsData((prevData) => prevData.filter((bill) => bill._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // const handleDeleteBillsForDay = async (date) => {
  //   try {
  //     const isoDate = new Date(date).toISOString();
  //     await axios.delete(`/api/bills/deletebillsforday/${isoDate}`);
  //     setBillsData((prevData) => prevData.filter((bill) => !isSameDay(new Date(bill.createdAt), new Date(date))));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrintClick = useCallback((record) => {
    setSelectedBill(record);
    setPopModal(true);
    setTimeout(() => {
      handlePrint();
    }, 500);
  }, [handlePrint]);

  const columns = [
    {
      title: 'Table Number',
      dataIndex: 'tableNumber',
    },
    {
      title: 'ID',
      dataIndex: '_id',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
    },
    {
      title: 'Sub Total',
      dataIndex: 'subTotal',
    },
    {
      title: 'Action',
      dataIndex: '_id',
      render: (id, record) => (
        <div>
          <EyeOutlined className="cart-edit eye" onClick={() => { setSelectedBill(record); setPopModal(true); }} />
          <Popconfirm
            title="Are you sure to delete this bill?"
            onConfirm={() => handleDeleteBill(id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined className="cart-edit eye" />
          </Popconfirm>
          <PrinterOutlined className="cart-edit eye" onClick={() => handlePrintClick(record)} />
          <EditOutlined
  className="cart-edit eye"
  onClick={() => {
    setEditedBill(record);
    setIsEditModalVisible(true);
  }}
/>
        </div>
      ),
    },
  ];

  const uniqueDates = [...new Set(billsData.map(bill => new Date(bill.createdAt).toLocaleDateString()))];

  return (
    <><style>
    {`
    @media print {
      @page {
        margin: 0;
      }
      body {
        margin: 0;
      }
    }
    `}
  </style>
    <Layout>
    <h2>All Invoice</h2>
    {uniqueDates.map(date => (
      <div key={date}>
        <h3>{date}</h3>
        
        <Table 
          dataSource={billsData.filter(bill => new Date(bill.createdAt).toLocaleDateString() === date)} 
          columns={columns} 
          bordered 
        />
      </div>
    ))}
    {
      popModal &&
      <Modal 
        title="Invoice Details" 
        width={400} 
        pagination={false} 
        visible={popModal} 
        onCancel={() => setPopModal(false)} 
        footer={false} 
        className="modal-content"
      >
        <div className="card" ref={componentRef}>
          <div className="cardHeader">
            <h2 className="logo">Farsha</h2>
            <span>Number: <b>01221128088</b></span>
            <span>Address: <b>العريش , أسفل قسم ثانى , بجوار فندق قويدر</b></span>
          </div>
          <div className="cardBody">
            <div className="group">
              <span>Table Number:</span>
              <span><b>{selectedBill.tableNumber}</b></span>
            </div>
            <div className="group">
              <span>Customer Name:</span>
              <span><b>{selectedBill.customerName}</b></span>
            </div>
            <div className="group">
              <span>Casher:</span>
              <span><b>{user.user.name}</b></span>
            </div>
            <div className="group">
              <span>Date Order:</span>
              <span><b>{new Date(selectedBill.createdAt).toLocaleString()}</b></span>
            </div>
            <div className="group">
              <span>Total Amount:</span>
              <span><b>{selectedBill.subTotal} LE</b></span>
            </div>
          </div>
          <div className="cardFooter">
            {/* <h4>Your Order</h4>
            {selectedBill.cartItems.map((product, index) => (
  <div className="footerCard" key={index}>
    <div className="group">
      <div className="column">
        <span>Product:</span>
        <span><b>{product.name}</b></span>
      </div>
      <div className="column">
        <span>Qty:</span>
        <span><b>{product.quantity}</b></span>
      </div>
      <div className="column">
        <span>Price:</span>
        <span><b>{product.price} LE</b></span>
      </div>
    </div>
  </div>









  
))} */}




<h4>Your Order</h4>
<div className="footerCard">
  <div className="group">
    <div className="column">
      <span><b>Product</b></span>
    </div>
    <div className="column">
      <span><b>Qty</b></span>
    </div>
    <div className="column">
      <span><b>Price</b></span>
    </div>
  </div>
</div>
{selectedBill.cartItems.map((product, index) => (
  <div className="footerCard" key={index}>
    <div className="group">
      <div className="column">
        <span>{product.name}</span>
      </div>
      <div className="column">
        <span>{product.quantity}</span>
      </div>
      <div className="column">
        <span>{product.price} LE</span>
      </div>
    </div>
  </div>
))}


            <div className="footerCardTotal">
              <div className="group">
                <h3>Total:</h3>
                <h3><b> {selectedBill.subTotal} LE</b></h3>
              </div>
            </div>
            <div className="footerThanks">
              <span>Visit us again ❤️</span>
            </div>
          </div>
        
          <span>Developed by: techTrova company </span>
          <div className="group" style={{ display: 'flex', margin: 0, padding: 0 }}>
            <FaPhoneAlt style={{ marginRight: '8px', fontSize: '20px' }} />
            <span style={{ marginRight: '10px' }}>+201033057342</span>
            <FaWhatsapp style={{ marginRight: '8px', fontSize: '20px' }} />
            <span>+201069393570</span>
          </div>
        </div>
      </Modal>
    }
  </Layout>
  <Modal
          title="Edit Bill"
          visible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleUpdateBill}>
              Update
            </Button>,
          ]}
          className="custom-modal"
        >
          <form>
            <div className="form-group">
              <label htmlFor="tableNumber">Table Number:</label>
              <input
                type="text"
                id="tableNumber"
                value={editedBill?.tableNumber || ""}
                onChange={(e) =>
                  setEditedBill({ ...editedBill, tableNumber: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="customerName">Customer Name:</label>
              <input
                type="text"
                id="customerName"
                value={editedBill?.customerName || ""}
                onChange={(e) =>
                  setEditedBill({ ...editedBill, customerName: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="subTotal">Sub Total:</label>
              <input
                type="number"
                id="subTotal"
                value={editedBill?.subTotal || ""}
                onChange={(e) =>
                  setEditedBill({ ...editedBill, subTotal: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="cartItems">Cart Items:</label>
              {editedBill?.cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      setEditedBill({
                        ...editedBill,
                        cartItems: editedBill.cartItems.map((cartItem, cartIndex) =>
                          cartIndex === index
                            ? { ...cartItem, name: e.target.value }
                            : cartItem
                        ),
                      })
                    }
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      setEditedBill({
                        ...editedBill,
                        cartItems: editedBill.cartItems.map((cartItem, cartIndex) =>
                          cartIndex === index
                            ? { ...cartItem, price: parseFloat(e.target.value) }
                            : cartItem
                        ),
                      })
                    }
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      setEditedBill({
                        ...editedBill,
                        cartItems: editedBill.cartItems.map((cartItem, cartIndex) =>
                          cartIndex === index
                            ? { ...cartItem, quantity: parseInt(e.target.value, 10) }
                            : cartItem
                        ),
                      })
                    }
                  />
                  <Button type="text" onClick={() => handleUpdateQuantity(index, item.quantity - 1)}><MinusCircleOutlined /></Button>
                  <Button type="text" onClick={() => handleUpdateQuantity(index, item.quantity + 1)}><PlusCircleOutlined /></Button>
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveCartItem(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Button onClick={() => setIsBillOptionVisible(true)}>Add Product</Button>
          </form>
        </Modal>

        <Modal
          title="Select Product"
          visible={isBillOptionVisible}
          onCancel={() => setIsBillOptionVisible(false)}
          footer={null}
          width={800}
        >
          <BillOption onAddProduct={handleAddProductToBill} />
        </Modal>
  </>
  );
};

export default Bills;
