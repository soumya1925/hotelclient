import { use, useState } from "react"
import React  from 'react'
import { setLogin } from "../redux/state"
import {useDispatch} from 'react-redux'
import { useNavigate } from "react-router-dom"
import  "../styles/Login.scss"


const LoginPage = () => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const dispatch= useDispatch();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://hotelserver-9wlo.onrender.com/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(`Login failed: ${data.message || "Invalid credentials"}`);
        return;
      }
  
      dispatch(setLogin({
        user: data.user,
        token: data.token
      }));
  
      navigate('/');
    } catch (err) {
      console.log("Login Failed:", err.message);
    }
  };
  return (
    <div className='login'>
      <div className='login_content'>
        <form className='login_content_form' onSubmit={handleSubmit}>
          <input
            placeholder='Email'
            type='email'
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            required
          />
          <input
            placeholder='Password'
            type='password'
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            required
          />

          <button type='submit'>LOG IN</button>
        </form>
        <a href='/register'>Dont't have an acoount Sign In Here</a>
      </div>
    </div>
  )
}

export default LoginPage