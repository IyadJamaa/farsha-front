


import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import img from '../Icons/file (2).png'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  UserSwitchOutlined,
  MoneyCollectOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  AreaChartOutlined,
  LineChartOutlined,
  DropboxOutlined
} from '@ant-design/icons';
import './layout.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';

const { Header, Sider, Content } = Layout;

const LayoutApp = ({children}) => {
  const { cartItems, loading } = useSelector(state => state.rootReducer);
  const user = JSON.parse(localStorage.getItem("auth"));
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems]);

  return (
    <Layout >
      {loading && <Spinner />}
      <Sider  trigger={null} collapsible collapsed={collapsed}>
        <div className="logo"  style={{ display: 'flex', justifyContent: 'center' , margin:'20px'}}>
            <img src={img} className='w-25' alt="" />

            <h2 className="logo-title" style={{  padding:'5px'}}>Farsha</h2>
        </div>

        <Menu theme='dark' mode="inline" defaultSelectedKeys={window.location.pathname}>
            <Menu.Item key='/' icon={<HomeOutlined />} >
                <Link  to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key='/bills' icon={<MoneyCollectOutlined />}>
                <Link  to="/bills">Bills</Link>
            </Menu.Item>
            <Menu.Item key="/products" icon={<HomeOutlined />}>
                <Link to="/products">Products</Link>
            </Menu.Item>
            <Menu.Item key='/customers' icon={<UserSwitchOutlined />}>
                <Link to="/customers">Customers</Link>
            </Menu.Item>
            {user.user.role === 'admin' && (
              <>
                <Menu.Item key='/DailyInventory' icon={<AreaChartOutlined/>} >
                  <Link to="/DailyInventory">Daily Inventory</Link>
                </Menu.Item>
                <Menu.Item key='/MonthlyInventory' icon={<LineChartOutlined />} >
                  <Link to="/MonthlyInventory">Monthly Inventory</Link>
                </Menu.Item>
                <Menu.Item key='/Storage' icon={<DropboxOutlined />} >
                <Link  to="/Storage">Storage</Link>
                </Menu.Item>
              </>
            )}
            <Menu.Item key='/logout' icon={<LogoutOutlined />} onClick={() => {localStorage.removeItem("auth"); navigate("/login");}}>
                LogOut
            </Menu.Item>
            
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: toggle,
          })}
          <div className="cart-items" onClick={() => navigate('/cart')}>
            <ShoppingCartOutlined />
            <span className="cart-badge">{cartItems.length}</span>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutApp;
