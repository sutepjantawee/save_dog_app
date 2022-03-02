import './App.css';
import Signin from './signin';
import User from './user';
import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div>
     <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="user" element={<User />} />
      </Routes>   
    </div>
  );
}

export default App;
