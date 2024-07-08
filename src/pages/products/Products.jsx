









import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Input, Modal, Select, Table, message, Upload } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import LayoutApp from '../../components/Layout';

const Products = () => {
  const [productData, setProductData] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form] = Form.useForm();
  const [subcategories, setSubcategories] = useState([]);
  const [subsubcategories, setSubsubcategories] = useState([]);
  const [showAdditions, setShowAdditions] = useState(false);
  const [additions, setAdditions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get('/api/products/getproducts');
      setProductData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryChange = (value) => {
        if (value === 'Drinks') {
          setSubcategories(['Cold Drinks', 'Hot Drinks']);
        } else if (value === 'Food') {
          setSubcategories(['Rool Chicken', 'Rool Beaf', 'Crepes', 'French fries', 'Additions']);
        } else if (value === 'Desserts') {
          setSubcategories(['Cheesecake', 'Ice cream', 'Waffles', 'Casserole dessert', 'Molten Cake', 'Additions']);
        } else if (value === 'Shesh') {
          setSubcategories([]);
        } 
        else {
          setSubcategories([]);
        }
      };
    
      const handleSubcategoryChange = (value) => {
        if (value === 'Cold Drinks') {
          setSubsubcategories(['Milk Shake', 'Moheto', 'Fresh Juice', 'Smoothie', 'Mix Farsha', 'Ice Coffee', 'Soft Drinks']);
        } else if (value === 'Hot Drinks') {
          setSubsubcategories(['Varies Hot Drinks', 'Coffee']);
        } else {
          setSubsubcategories([]);
        }
        setShowAdditions(value === 'Food' || value === 'Desserts');
      };
    
      const handlerDelete = async (record) => {
        try {
          await axios.post('/api/products/deleteproducts', { productId: record._id });
          message.success("Product Deleted Successfully!");
          getAllProducts();
        } catch (error) {
          console.log(error);
          message.error("Error!");
        }
      };

      const columns = [
            {
              title: "Name",
              dataIndex: "name"
            },
            // {
            //   title: "Image",
            //   dataIndex: "image",
            //   render: (image, record) => (
            //     <img src={`/api/products/image/${record._id}`} alt={record.name} height={60} width={60} />
            //   )
              
            // }
            {
              title: "Category",
              dataIndex: "category"
            }

            ,
            {
              title: "Price",
              dataIndex: "price",
            },
            {
              title: "Action",
              dataIndex: "_id",
              render: (id, record) => (
                <div>
                  <DeleteOutlined className='cart-action' onClick={() => handlerDelete(record)} />
                </div>
              )
            }
          ];

  const handleAddNew = () => {
    form.resetFields(); // Reset form fields if adding a new product
    setEditProduct(null); // Reset editProduct state
    setModalVisible(true); // Open modal
  };

  // const handleFormSubmit = async (values) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('image', values.image[0].originFileObj);
  //     formData.append('name', values.name);
  //     formData.append('category', values.category);
  //     formData.append('price', values.price);
  //     // Append other form fields as needed

  //     await axios.post('/api/products/addproducts', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //     message.success("Product Added Successfully!");
  //     getAllProducts();

  //     form.resetFields(); // Reset form fields
  //     setModalVisible(false); // Close modal after submission
  //   } catch (error) {
  //     console.log(error);
  //     message.error("Error!");
  //   }
  // };
  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('image', values.image[0].originFileObj);
      formData.append('name', values.name);
      formData.append('category', values.category);
      formData.append('subCategory', values.subCategory); // Ensure this is appended
      formData.append('subSubCategory', values.subSubCategory); // Ensure this is appended
      formData.append('price', values.price);
      formData.append('additions', JSON.stringify(values.additions)); // Assuming additions is an array
  
      await axios.post('/api/products/addproducts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      message.success("Product Added Successfully!");
      getAllProducts();
  
      form.resetFields(); // Reset form fields
      setModalVisible(false); // Close modal after submission
    } catch (error) {
      console.log(error);
      message.error("Error!");
    }
  };
  
  // const AddProductForm = ({ form, onFinish, handleCategoryChange, handleSubcategoryChange, subcategories, subsubcategories, showAdditions, additions }) => {
  //   const normFile = (e) => {
  //     if (Array.isArray(e)) {
  //       return e;
  //     }
  //     return e && e.fileList;
  //   };

  //   return (
  //     <Form
  //       form={form}
  //       layout='vertical'
  //       onFinish={onFinish}
  //     >
  //       <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the product name!' }]}>
  //         <Input />
  //       </Form.Item>
  //       <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
  //         <Select onChange={handleCategoryChange}>
  //         <Select.Option value="Drinks">Drinks</Select.Option>
  //          <Select.Option value="Food">Food</Select.Option>
  //           <Select.Option value="Desserts">Desserts</Select.Option>
  //           <Select.Option value="Shesh">Shesh</Select.Option>
  //         </Select>
  //       </Form.Item>
  //       {subcategories.length > 0 && (
  //         <Form.Item name="subCategory" label="Subcategory" rules={[{ required: true, message: 'Please select a subcategory!' }]}>
  //           <Select onChange={handleSubcategoryChange}>
  //             {subcategories.map((subcategory) => (
  //               <Select.Option key={subcategory} value={subcategory}>{subcategory}</Select.Option>
  //             ))}
  //           </Select>
  //         </Form.Item>
  //       )}
  //       {showAdditions && (
  //         <Form.Item name="additions" label="Additions">
  //           <Select mode="multiple">
  //             {additions.map((addition) => (
  //               <Select.Option key={addition} value={addition}>{addition}</Select.Option>
  //             ))}
  //           </Select>
  //         </Form.Item>
  //       )}
  //       {subsubcategories.length > 0 && (form.getFieldValue('subCategory') === 'Cold Drinks'|| form.getFieldValue('subCategory') === 'Hot Drinks') && (
  //         <Form.Item name="subSubCategory" label="Subsubcategory" rules={[{ required: true, message: 'Please select a subsubcategory!' }]}>
  //           <Select>
  //             {subsubcategories.map((subsubcategory) => (
  //               <Select.Option key={subsubcategory} value={subsubcategory}>{subsubcategory}</Select.Option>
  //             ))}
  //           </Select>
  //         </Form.Item>
  //       )}
  //       <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the product price!' }]}>
  //         <Input />
  //       </Form.Item>
  //       <Form.Item name="image" label="Image" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: 'Please upload the image!' }]}>
  //         <Upload name="image" action="/upload/" listType="picture">
  //           <Button icon={<UploadOutlined />}>Click to upload</Button>
  //         </Upload>
  //       </Form.Item>
  //       <div className="form-btn-add">
  //         <Button htmlType='submit' className='add-new'>Submit</Button>
  //       </div>
  //     </Form>
  //   );
  // };
  const AddProductForm = ({ form, onFinish, handleCategoryChange, handleSubcategoryChange, subcategories, subsubcategories, showAdditions, additions }) => {
    const normFile = (e) => {
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    };
  
    return (
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the product name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
          <Select onChange={handleCategoryChange}>
            <Select.Option value="Drinks">Drinks</Select.Option>
            <Select.Option value="Food">Food</Select.Option>
            <Select.Option value="Desserts">Desserts</Select.Option>
            <Select.Option value="Shesh">Shesh</Select.Option>
          </Select>
        </Form.Item>
        {subcategories.length > 0 && (
          <Form.Item name="subCategory" label="Subcategory" rules={[{ required: true, message: 'Please select a subcategory!' }]}>
            <Select onChange={handleSubcategoryChange}>
              {subcategories.map((subcategory) => (
                <Select.Option key={subcategory} value={subcategory}>{subcategory}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {showAdditions && (
          <Form.Item name="additions" label="Additions">
            <Select mode="multiple">
              {additions.map((addition) => (
                <Select.Option key={addition} value={addition}>{addition}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {subsubcategories.length > 0 && (form.getFieldValue('subCategory') === 'Cold Drinks' || form.getFieldValue('subCategory') === 'Hot Drinks') && (
          <Form.Item name="subSubCategory" label="Subsubcategory" rules={[{ required: true, message: 'Please select a subsubcategory!' }]}>
            <Select>
              {subsubcategories.map((subsubcategory) => (
                <Select.Option key={subsubcategory} value={subsubcategory}>{subsubcategory}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the product price!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="image" label="Image" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: 'Please upload the image!' }]}>
          <Upload name="image" action="/upload/" listType="picture">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <div className="form-btn-add">
          <Button htmlType='submit' className='add-new'>Submit</Button>
        </div>
      </Form>
    );
  };
  
  return (
    <LayoutApp>
      <h2>All Products</h2>
      <Button className='add-new' onClick={handleAddNew}>Add New</Button>
      <Table dataSource={productData} columns={columns} bordered />

      <Modal
        title="Add New Product"
        visible={modalVisible} // Use modalVisible state to control modal visibility
        onCancel={() => { 
          form.resetFields(); // Reset form fields
          setModalVisible(false); // Close modal
        }}
        footer={null}
      >
        <AddProductForm
          form={form}
          onFinish={handleFormSubmit}
          handleCategoryChange={handleCategoryChange}
          handleSubcategoryChange={handleSubcategoryChange}
          subcategories={subcategories}
          subsubcategories={subsubcategories}
          showAdditions={showAdditions}
          additions={additions}
        />
      </Modal>
    </LayoutApp>
  );
};

export default Products;







// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Button, Form, Input, Modal, Select, Table, message, Upload } from 'antd';
// import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
// import LayoutApp from '../../components/Layout';

// const Products = () => {
//   const [productData, setProductData] = useState([]);
//   const [addModalVisible, setAddModalVisible] = useState(false);
//   const [updateModalVisible, setUpdateModalVisible] = useState(false);
//   const [editProduct, setEditProduct] = useState(null);
//   const [form] = Form.useForm();
//   const [updateForm] = Form.useForm();
//   const [subcategories, setSubcategories] = useState([]);
//   const [subsubcategories, setSubsubcategories] = useState([]);
//   const [showAdditions, setShowAdditions] = useState(false);
//   const [additions, setAdditions] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedSubCategory, setSelectedSubCategory] = useState('');

//   useEffect(() => {
//     getAllProducts();
//   }, []);

//   const getAllProducts = async () => {
//     try {
//       const { data } = await axios.get('/api/products/getproducts');
//       setProductData(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleCategoryChange = (value) => {
//     setSelectedCategory(value);
//     if (value === 'Drinks') {
//       setSubcategories(['Cold Drinks', 'Hot Drinks']);
//       setSubsubcategories([]);
//     } else if (value === 'Food') {
//       setSubcategories(['Rool Chicken', 'Rool Beaf', 'Crepes', 'French fries', 'Additions']);
//       setSubsubcategories([]);
//     } else if (value === 'Desserts') {
//       setSubcategories(['Cheesecake', 'Ice cream', 'Waffles', 'Casserole dessert', 'Molten Cake', 'Additions']);
//       setSubsubcategories([]);
//     } else if (value === 'Shesh') {
//       setSubcategories([]);
//       setSubsubcategories([]);
//     } else {
//       setSubcategories([]);
//       setSubsubcategories([]);
//     }
//   };

//   const handleSubcategoryChange = (value) => {
//     setSelectedSubCategory(value);
//     if (value === 'Cold Drinks') {
//       setSubsubcategories(['Milk Shake', 'Moheto', 'Fresh Juice', 'Smoozy', 'Mix Farsha', 'Ice Coffee', 'Soft Drinks']);
//     } else if (value === 'Hot Drinks') {
//       setSubsubcategories(['Varies Hot Drinks', 'Coffee']);
//     } else {
//       setSubsubcategories([]);
//     }
//     setShowAdditions(value === 'Food' || value === 'Desserts');
//   };

//   const handlerDelete = async (record) => {
//     try {
//       await axios.post('/api/products/deleteproducts', { productId: record._id });
//       message.success("Product Deleted Successfully!");
//       getAllProducts();
//     } catch (error) {
//       console.log(error);
//       message.error("Error!");
//     }
//   };

//   const handleEdit = (record) => {
//     setEditProduct(record);
//     setSelectedCategory(record.category);
//     setSelectedSubCategory(record.subCategory);
//     updateForm.setFieldsValue({
//       ...record,
//       additions: record.additions || [],
//       image: [],
//     });
//     handleCategoryChange(record.category);
//     handleSubcategoryChange(record.subCategory);
//     setUpdateModalVisible(true);
//   };

//   const columns = [
//     { title: "Name", dataIndex: "name" },
//     { title: "Category", dataIndex: "category" },
//     { title: "Price", dataIndex: "price" },
//     {
//       title: "Action",
//       dataIndex: "_id",
//       render: (id, record) => (
//         <div>
//           <EditOutlined className='cart-action' onClick={() => handleEdit(record)} />
//           <DeleteOutlined className='cart-action' onClick={() => handlerDelete(record)} />
//         </div>
//       )
//     }
//   ];

//   const handleAddNew = () => {
//     form.resetFields();
//     setAddModalVisible(true);
//   };

//   const handleAddFormSubmit = async (values) => {
//     try {
//       const formData = new FormData();
//       if (values.image) {
//         formData.append('image', values.image[0].originFileObj);
//       }
//       formData.append('name', values.name);
//       formData.append('category', values.category);
//       formData.append('subCategory', values.subCategory);
//       formData.append('subSubCategory', values.subSubCategory);
//       formData.append('price', values.price);
//       formData.append('additions', JSON.stringify(values.additions));

//       await axios.post('/api/products/addproducts', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       message.success("Product Added Successfully!");
//       getAllProducts();

//       form.resetFields();
//       setAddModalVisible(false);
//     } catch (error) {
//       console.log(error);
//       message.error("Error!");
//     }
//   };

//   const handleUpdateFormSubmit = async (values) => {
//     // Construct the payload
//     const payload = {
//       productId: editProduct._id,
//       name: values.name,
//       category: values.category,
//       subCategory: values.subCategory,
//       subSubCategory: values.subSubCategory,
//       price: values.price,
//       additions: values.additions || [],
//     };
//     console.log('Payload:', payload);
  
//     try {
//       await axios.put('/api/products/updateproduct', payload);
//       message.success("Product Updated Successfully!");
//       getAllProducts();
//       updateForm.resetFields();
//       setUpdateModalVisible(false);
//     } catch (error) {
//       console.log(error);
//       message.error("Error!");
//     }
//   };

//   const normFile = (e) => {
//     if (Array.isArray(e)) {
//       return e;
//     }
//     return e && e.fileList;
//   };

//   return (
//     <LayoutApp>
//       <h2>All Products</h2>
//       <Button className='add-new' onClick={handleAddNew}>Add New</Button>
//       <Table dataSource={productData} columns={columns} bordered />

//       <Modal
//         title="Add New Product"
//         visible={addModalVisible}
//         onCancel={() => {
//           form.resetFields();
//           setAddModalVisible(false);
//         }}
//         footer={null}
//       >
//         <Form
//           form={form}
//           layout='vertical'
//           onFinish={handleAddFormSubmit}
//         >
//           <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the product name!' }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
//             <Select onChange={handleCategoryChange}>
//               <Select.Option value="Drinks">Drinks</Select.Option>
//               <Select.Option value="Food">Food</Select.Option>
//               <Select.Option value="Desserts">Desserts</Select.Option>
//               <Select.Option value="Shesh">Shesh</Select.Option>
//             </Select>
//           </Form.Item>
//           {subcategories.length > 0 && (
//             <Form.Item name="subCategory" label="Subcategory" rules={[{ required: true, message: 'Please select a subcategory!' }]}>
//               <Select onChange={handleSubcategoryChange}>
//                 {subcategories.map((subcategory) => (
//                   <Select.Option key={subcategory} value={subcategory}>{subcategory}</Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           )}
//           {showAdditions && (
//             <Form.Item name="additions" label="Additions">
//               <Select mode="multiple">
//                 {additions.map((addition) => (
//                   <Select.Option key={addition} value={addition}>{addition}</Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           )}
//           {subsubcategories.length > 0 && (form.getFieldValue('subCategory') === 'Cold Drinks' || form.getFieldValue('subCategory') === 'Hot Drinks') && (
//             <Form.Item name="subSubCategory" label="Subsubcategory" rules={[{ required: true, message: 'Please select a subsubcategory!' }]}>
//               <Select>
//                 {subsubcategories.map((subsubcategory) => (
//                   <Select.Option key={subsubcategory} value={subsubcategory}>{subsubcategory}</Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           )}
//           <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the product price!' }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="image" label="Image" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: 'Please upload the image!' }]}>
//             <Upload name="image" action="/upload/" listType="picture">
//               <Button icon={<UploadOutlined />}>Click to upload</Button>
//             </Upload>
//           </Form.Item>
//           <div className="form-btn-add">
//             <Button htmlType='submit' className='add-new'>Submit</Button>
//           </div>
//         </Form>
//       </Modal>
//       <Modal
//   title="Update Product"
//   visible={updateModalVisible}
//   onCancel={() => {
//     updateForm.resetFields();
//     setUpdateModalVisible(false);
//   }}
//   footer={null}
// >
//   <Form
//     form={updateForm}
//     layout='vertical'
//     onFinish={handleUpdateFormSubmit}
//   >
//     <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the product name!' }]}>
//       <Input />
//     </Form.Item>
//     <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
//       <Select onChange={handleCategoryChange}>
//         <Select.Option value="Drinks">Drinks</Select.Option>
//         <Select.Option value="Food">Food</Select.Option>
//         <Select.Option value="Desserts">Desserts</Select.Option>
//         <Select.Option value="Shesh">Shesh</Select.Option>
//       </Select>
//     </Form.Item>
//     {subcategories.length > 0 && (
//       <Form.Item name="subCategory" label="Subcategory" rules={[{ required: true, message: 'Please select a subcategory!' }]}>
//         <Select onChange={handleSubcategoryChange}>
//           {subcategories.map((subcategory) => (
//             <Select.Option key={subcategory} value={subcategory}>{subcategory}</Select.Option>
//           ))}
//         </Select>
//       </Form.Item>
//     )}
//     {showAdditions && (
//       <Form.Item name="additions" label="Additions">
//         <Select mode="multiple">
//           {additions.map((addition) => (
//             <Select.Option key={addition} value={addition}>{addition}</Select.Option>
//           ))}
//         </Select>
//       </Form.Item>
//     )}
//     {subsubcategories.length > 0 && (updateForm.getFieldValue('subCategory') === 'Cold Drinks' || updateForm.getFieldValue('subCategory') === 'Hot Drinks') && (
//       <Form.Item name="subSubCategory" label="Subsubcategory" rules={[{ required: true, message: 'Please select a subsubcategory!' }]}>
//         <Select>
//           {subsubcategories.map((subsubcategory) => (
//             <Select.Option key={subsubcategory} value={subsubcategory}>{subsubcategory}</Select.Option>
//           ))}
//         </Select>
//       </Form.Item>
//     )}
//     <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the product price!' }]}>
//       <Input />
//     </Form.Item>
    
//     <div className="form-btn-add">
//       <Button htmlType='submit' className='add-new'>Submit</Button>
//     </div>
//   </Form>
// </Modal>
//     </LayoutApp>
//   );
// };

// export default Products;