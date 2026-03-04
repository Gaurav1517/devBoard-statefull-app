import React,{useState,useEffect} from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import api from "./api";

function App(){

 const [logged,setLogged] = useState(false);
 const [loading,setLoading] = useState(true);

 useEffect(()=>{

   const checkSession = async ()=>{

     try{

       await api.get("/auth/session");
       setLogged(true);

     }catch(err){

       setLogged(false);

     }

     setLoading(false);

   };

   checkSession();

 },[]);

 if(loading){
   return <div>Loading...</div>
 }

 if(!logged){
   return <Login setLogged={setLogged}/>
 }

 return <Dashboard setLogged={setLogged}/>

}

export default App;