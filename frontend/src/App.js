import * as React from "react";
import { Routes, Route, useNavigate, useLocation, Navigate, Outlet, } from "react-router-dom";
import { fakeAuthProvider } from "./auth";
import Axios from "axios"
import { useEffect, useState } from "react";


export default function App() {
  return (

    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route
            path="/protected"
            element={
              <RequireAuth>
                <Username />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

//createContext
let DataContext = React.createContext([]);

function useAuth() {
  return React.useContext(DataContext);
}

//หน้า Login
function Login() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();
  let from = location.state?.from?.pathname || "/";

  function handleSubmit(event) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let username = formData.get("username")

    auth.signin(username, () => {
      navigate(from, { replace: true });
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        Username: <input name="username" type="text" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

//หน้า Layout  
function Layout() {
  return (
    <div>
      <AuthStatus />
      <Outlet />
    </div>
  );
}

//เชื่อม server
function AuthProvider({ children }) {
  let [user, setUser] = React.useState(null);

  let signin = (newUser, callback) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  let signout = (callback) => {
    return fakeAuthProvider.signout(() => {
      setUser(null);
      callback();
    });
  };
  let value = { user, signin, signout };

  return <DataContext.Provider value={value}>{children}
  </DataContext.Provider>;
}

//หน้า User
function AuthStatus() {
  let auth = useAuth();
  let navigate = useNavigate();

  if (!auth.user) {
    return <div></div>;
  }

  return (
    <div>
      Welcome: {auth.user}{" "}
      <button
        onClick={() => {
          auth.signout(() => navigate([]));
        }}
      >
        Sign out
      </button>
    </div>
  );
}

function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}


// Add image และ Remove Image
function Username() {
  useEffect(()=>{
    Axios.get('https://dog.ceo/api/breeds/image/random').then(response =>{
      setImgdog(response.data.message)
    })
  },[])
  const [imgDog, setImgdog] = useState('');

  const [save,setSave] = useState([])
  const saveimg = () => {
    setSave([...save,imgDog])
  }
 console.log(save)

  const [deletesave,setDeletesave] = useState([])
  const deleteimg = () => {
    save.splice(0,1)
    console.log(save)
    setDeletesave([...deletesave,imgDog])
  }


  return <div>
 <img src={imgDog} />
 <br></br>
 <button onClick={saveimg}>ADD</button>
 <br></br>
 <br></br>

 {save.map((todo,index)=>{
    return <img src={todo}/>
  })}
 <button onClick={deleteimg}>DELETE</button>
 
  </div>
}






