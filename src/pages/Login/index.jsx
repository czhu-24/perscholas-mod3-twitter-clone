import axios from 'axios';
import React, { useState } from 'react';

const Login = ({setUser}) => {
    
    const [formData, setFormData] = useState({
        password: '',
        email: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios({
                url: "/login",
                method: "POST",
                data: formData
            });
            console.log(response);
            // token does not have encoded pw info
            // we should've removed the pw info on the server before sending the token
            localStorage.setItem("user_token", response.data.token);
            if(response.data.dbUser){
                setUser(response.data.dbUser);
            }
            setMessage(response.data.message || 'login successful!');
        }catch(error){
            // the ?. optional chaining operator will allow error.response to return undefined instead of an error if error.response is undefined, for example
            setMessage(error.response?.data?.message || "error during signup");
        }
    }

    return (
    <>
      <h2>Log In Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          {message}
        </div>
        <label htmlFor="email">Email:</label><input onChange={handleChange} value={formData.email} type="text" name="email" id="email" /><br />
        <label htmlFor="password">Password:</label><input onChange={handleChange} value={formData.password} type="text" name="password" id="password" /><br />
        <button type="submit">Log In</button>
      </form>
    </>
    )
}

export default Login