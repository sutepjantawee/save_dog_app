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
  let from = location.state?.sfrom?.pathname || "/";
  useEffect(() => {
    //auth.signout()
  },[])
  
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
  let [user, setUser] = React.useState(() => {
    const saveUser = localStorage.getItem("user")
    if (saveUser && "null" !== saveUser) {
      return saveUser
    } else {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('user', (user))
  }, [user])

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
  let location = useLocation();
  console.log("location ", location)
  console.log(auth.user)


  if(location.pathname === "/login" && auth.user){
    return <Navigate to="protected" replace />
  }

  if (!auth.user) {
    return <div>

    </div>
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



// Add image และ Remove Image และ change Image
function Username() {

  const [imgDog, setImgdog] = useState('')
  const [save, setSave] = useState(() => {
    const saveData = localStorage.getItem("save")
    if (saveData) {
      return JSON.parse(saveData);
    } else {
      return [];
    }
  });

  let auth = useAuth();

  useEffect(() => {
    Axios.get('https://dog.ceo/api/breeds/image/random').then(response => {
      setImgdog(response.data.message)
    })
  }, [])

  const changeImg = () => {
    Axios.get('https://dog.ceo/api/breeds/image/random').then(response => {
      setImgdog(response.data.message)
    })
  }

  const saveImg = () => {
    setSave([...save, { img: imgDog, nameuser: auth.user }])
    changeImg()
  }

  const deleteImg = (index) => {
    save.splice(index, 1)
    setSave([...save])
  }

  useEffect(() => {
    localStorage.setItem('save', JSON.stringify(save))
  }, [save])

  return <div>
    <br /><br />
    <span style={{ fontSize: 25 }} >ภาพน้องหมา</span>
    <br /><br />
    <img style={{ width: 130, height: 130 }} src={imgDog} />
    <br /><br />
    <button onClick={saveImg}>ADD</button>{" "}
    <button onClick={changeImg}>CHANGE</button>
    <br /><br />
    {save.map((value, index) => {
      return <div>
        <img style={{ width: 130, height: 130 }} src={value.img} />
        <span style={{ fontSize: 25 }}>บันทึกโดย{" "}{value.nameuser}</span>
        <button onClick={() => deleteImg(index)}>DELETE</button>
      </div>
    })}
  </div>
}






