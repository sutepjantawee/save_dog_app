import * as React from 'react';
import {Routes,Route, } from 'react-router-dom';

import { useState, useMemo } from 'react';
import { Link } from "react-router-dom";
import { useContext } from 'react';
import DataContext from './DataContext';


function App() {

const [userName, setUserName] = useState([])
const value = useMemo( ()=>({userName, setUserName}),[userName] );

   return (
 
     <div>
       <DataContext.Provider value={value}>
       <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/user" element={<User />} />
       </Routes>
       </DataContext.Provider>
 
     </div>
 
   );
 }
 export default App;
 

const Login = () => {

 const { userName, setUserName } = useContext(DataContext)
 const change = event => setUserName(event.target.value)
 
  return (
    <div>
      
      <form> Username: 
        <input type="text" name="name" onChange={change} value={userName}/>
        <br/>
      <button>
        <Link to="/user">Login</Link>     
      </button>
      </form>
      
    </div>
  )
}


const User = () => {
  const {userName}=useContext(DataContext)
  
  return (
    <div> {userName} <br/>
      <button>
        <Link to="/">Logout</Link>
      </button>
    </div>
  )
}




