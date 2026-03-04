import React,{useState} from "react";
import api from "./api";

export default function Register({setShowLogin}){

 const [username,setUsername] = useState("");
 const [password,setPassword] = useState("");

 const register = async ()=>{

  await api.post("/auth/register",{
   username,
   password
  });

  alert("User created. Please login.");
  setShowLogin(true);

 };

 return(

  <div>

   <h2>Create Account</h2>

   <input
    placeholder="Username"
    onChange={e=>setUsername(e.target.value)}
   />

   <input
    placeholder="Password"
    type="password"
    onChange={e=>setPassword(e.target.value)}
   />

   <button onClick={register}>
    Register
   </button>

  </div>

 );

}