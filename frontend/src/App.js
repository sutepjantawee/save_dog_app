import * as React from "react";
import {Routes,Route,useNavigate,useLocation,Navigate,Outlet,} from "react-router-dom";
import { fakeAuthProvider } from "./auth";
import Axios from "axios"
import { useEffect, useState } from "react";
export default function App() {
  return (
    
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}> 
          <Route path="/login" element={<Login/>} />
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


let DataContext = React.createContext([]);

function useAuth() {
  return React.useContext(DataContext);
}

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

function Layout() {
  return (
    <div>
      <AuthStatus />
      <Outlet />
    </div>
  );
}



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

function Username() {
useEffect(() => {
  Axios.get('https://dog.ceo/api/breeds/image/random').then(response => {
    setimgdog(response.data.message)
    console.log(response.data.message)
  })
},[])
  const [imgdog, setimgdog] = useState('');

  
  return <div>
    <form>
       <img src={imgdog}/>
       </form>
  </div>;
}
