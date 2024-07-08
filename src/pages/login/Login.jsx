import { Button, Form, Input, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlerSubmit = async (values) => {
    try {
        dispatch({ type: "SHOW_LOADING" });
        const res = await axios.post('/api/users/login', values);
        dispatch({ type: "HIDE_LOADING" });

        message.success("User Login Successfully!");

        // Store user information including role in local storage
        localStorage.setItem("auth", JSON.stringify(res.data));

        // Redirect to home page
        navigate("/");
    } catch (error) {
        dispatch({ type: "HIDE_LOADING" });
        message.error("Error!");
        console.log(error);
    }
}
  useEffect(() => {
    if(localStorage.getItem("auth")) {
      localStorage.getItem("auth");
      navigate("/");
    }
    
  }, [navigate]);

  return (
    <div className='form'>
        <h2>POS SYSTEM</h2>
        <p>Login</p>
        <div className="form-group">
          <Form layout='vertical' onFinish={handlerSubmit}>
            <FormItem name="userId" label="Email Address">
              <Input placeholder='Enter Email Address'/>
            </FormItem>
            <FormItem name="password" label="Password">
              <Input type="password" placeholder='Enter Password'/>
            </FormItem>
            <div className="form-btn-add">
              <Button htmlType='submit' className='add-new'>Login</Button>
              <Link className='form-other' to="/register">Register Here!</Link>
            </div>
          </Form>
        </div>
    </div>
  )
}

export default Login
