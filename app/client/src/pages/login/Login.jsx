import React, { useState } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import {ethers} from "ethers";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [signer, setsigner] = useState("");
  const [signerAdd, setsignerAdd] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", { username, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/")
    } catch (err) {
      setError(err.response.data);
    }
  };
  async function connectwallet() {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });

        
        const provider = await new ethers.providers.Web3Provider(ethereum);
        setsigner((provider.getSigner()));
        
        setsignerAdd(await (provider.getSigner().getAddress()));
      }
        
      else {
        alert("Please install metamask");
      }}
    catch (e) {
      alert(e);
    }
  }
  return (
    <div className="login">
      <div className="form">
        <h1>Sign in</h1>
        <label htmlFor="">Username</label>
        <input
          name="username"
          type="text"
          placeholder="johndoe"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="signup-fields"
          type="text"
          value={signerAdd}
          disabled
          required
          
        />
        <button onClick={connectwallet} className="signup-btn">
          connectwallet
        </button>
        <label htmlFor="">Password</label>
        <input
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit}>Login</button>
        {error && error}
        </div>
    </div>
  );
}

export default Login;