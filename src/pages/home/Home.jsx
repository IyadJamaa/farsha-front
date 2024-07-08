










import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LayoutApp from '../../components/Layout';
import { Row, Col } from 'antd';
import Product from '../../components/Product';
import { useDispatch } from 'react-redux';

const Home = () => {
  const dispatch = useDispatch();

  const [productData, setProductData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedSubsubcategory, setSelectedSubsubcategory] = useState(null);

  const categories = [
    {
      name: "Desserts",
      subcategories: [
        { name: "Cheesecake", subsubcategories: [] },
        { name: "Ice cream", subsubcategories: [] },
        { name: "Waffles", subsubcategories: [] },
        { name: "Casserole dessert", subsubcategories: [] },
        { name: "Molten Cake", subsubcategories: [] },
        { name: "Additions", subsubcategories: [] },
      ],
    },
    {
      name: "Food",
      subcategories: [
        { name: "Rool Chicken", subsubcategories: [] },
        { name: "Rool Beaf", subsubcategories: [] },
        { name: "Crepes", subsubcategories: [] },
        { name: "French fries", subsubcategories: [] },
        { name: "Additions", subsubcategories: [] },
      ],
    },
    {
      name: "Drinks",
      subcategories: [
        {
          name: "Cold Drinks",
          subsubcategories: [
            { name: "Milk Shake" },
            { name: "Moheto" },
            { name: "Fresh Juice" },
            { name: "Smoothie" },
            { name: "Mix Farsha" },
            { name: "Ice Coffee" },
            { name: "Soft Drinks" },
          ],
        },
        {
          name: "Hot Drinks",
          subsubcategories: [
            { name: "Varies Hot Drinks" },
            { name: "Coffee" },
          ],
        },
      ],
    },
    { name: "Shesh", subcategories: [] }
  ];

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        dispatch({ type: "SHOW_LOADING" });
        const { data } = await axios.get('/api/products/getproducts');
        setProductData(data);
        dispatch({ type: "HIDE_LOADING" });
      } catch (error) {
        console.log(error);
      }
    };

    getAllProducts();
  }, [dispatch]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedSubsubcategory(null);
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setSelectedSubsubcategory(null);
  };

  const handleSubsubcategorySelect = (subsubcategory) => {
    setSelectedSubsubcategory(subsubcategory);
  };

  const filteredProducts = productData.filter((product) => {
    return (
      (!selectedCategory || product.category === selectedCategory) &&
      (!selectedSubcategory || product.subCategory === selectedSubcategory) &&
      (!selectedSubsubcategory || product.subSubCategory === selectedSubsubcategory)
    );
  });

  useEffect(() => {
    console.log("Selected Category:", selectedCategory);
    console.log("Selected Subcategory:", selectedSubcategory);
    console.log("Selected Subsubcategory:", selectedSubsubcategory);
    console.log("Filtered Products:", filteredProducts);
  }, [selectedCategory, selectedSubcategory, selectedSubsubcategory, filteredProducts]);

  return (
    <LayoutApp>
      <div className="category">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`categoryFlex ${selectedCategory === category.name && 'category-active'}`}
            onClick={() => handleCategorySelect(category.name)}
          >
            <h3 className="categoryName">{category.name}</h3>
          </div>
        ))}
      </div>
      <div className="subcategory" style={{ display: 'flex', justifyContent: 'center' }}>
        {selectedCategory &&
          categories
            .find((cat) => cat.name === selectedCategory)
            ?.subcategories.map((subcategory) => (
              <div
                key={subcategory.name}
                className={`categoryFlex ${selectedSubcategory === subcategory.name && 'category-active'}`}
                onClick={() => handleSubcategorySelect(subcategory.name)}
              >
                <h4 className="categoryName">{subcategory.name}</h4>
              </div>
            ))}
      </div>
      <div className="subsubcategory" style={{ display: 'flex', justifyContent: 'center', padding: '30px' }}>
        {selectedSubcategory &&
          categories
            .find((cat) => cat.name === selectedCategory)
            ?.subcategories.find((subcat) => subcat.name === selectedSubcategory)
            ?.subsubcategories?.map((subsubcategory) => (
              <div
                key={subsubcategory.name}
                className={`categoryFlex ${selectedSubsubcategory === subsubcategory.name && 'category-active'}`}
                onClick={() => handleSubsubcategorySelect(subsubcategory.name)}
              >
                <h5 className="categoryName">{subsubcategory.name}</h5>
              </div>
            ))}
      </div>
    
      <Row>
        {filteredProducts.map((product) => (
          <Col xs={24} sm={6} md={12} lg={6} key={product.id}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </LayoutApp>
  );
};

export default Home;

