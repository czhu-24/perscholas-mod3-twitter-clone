import axios from 'axios';
import React, { useState } from 'react'
import validator from 'validator'

const Signup = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Your passwords don't match");
      return;
    } else if (!validator.isEmail(email)) {
      setEmailError(true);
      return;
    } else if (!validator.isStrongPassword(password, { minLength: 8, minNumbers: 1, minSymbols: 1 })) {
      setPasswordError("Your password is too weak. Your password must contain at least 8 characters with at least one number and one special symbol");
      return;
    } else {
      setPasswordError(false);
      try {
        const response = await axios({
          method: "POST",
          url: "/users",
          data: { email, password }
        });
        if (response.status >= 200 && response.status < 300) {
          console.log("Created a new user!", response.data);
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        } else {
          console.error("Error creating a new user");
        }
      } catch (error) {
        console.error("Error sending GET request", error);
      }
    }
  }

  return (
    <>
      <h2>Sign Up Page</h2>
      <form onSubmit={submitForm}>
        <div>
          {emailError ? "Not a valid email" : ""}
        </div>
        <label htmlFor="email">Email:</label><input onChange={(e) => setEmail(e.target.value)} value={email} type="text" name="email" id="email" /><br />
        <div>
          {passwordError ? passwordError : ""}
        </div>
        <label htmlFor="password">Password:</label><input onChange={(e) => setPassword(e.target.value)} value={password} type="text" name="password" id="password" /><br />
        <label htmlFor="confirmPassword">Confirm Password:</label><input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="text" name="confirmPassword" id="confirmPassword" /><br />
        <button type="submit">Add user</button>
      </form>
    </>
  )
}

export default Signup