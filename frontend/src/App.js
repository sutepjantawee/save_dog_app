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
                <Usernametest />
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
    save.shift()
    console.log(save)
    setDeletesave([...deletesave,imgDog])
  }


  return <div>
 <img src={imgDog} />

<button onClick={saveimg}>ADD</button>
  
 <button onClick={deleteimg}>DELETE</button>
 {save.map((todo,index)=>{
    return <img src={todo}/>
  })}


  </div>
}







function Todo({ todo, index, removeTodo }) {
  return (
    <div
      className="todo"
      style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}
    >
      {todo.text}
      <div>

        <button onClick={() => removeTodo(index)}>x</button>
      </div>
    </div>
  );
}

function TodoForm({ addTodo }) {
  const [value, setValue] = React.useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </form>
  );
}

function Usernametest() {
  const [todos, setTodos] = React.useState([
    {
      text: "Learn about React",
      isCompleted: false
    },
    {
      text: "Meet friend for lunch",
      isCompleted: false
    },
    {
      text: "Build really cool todo app",
      isCompleted: false
    }
  ]);



  const addTodo = text => {
    const newTodos = [...todos, { text }];
    setTodos(newTodos);
  };


  const removeTodo = index => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  return (
    <div className="app">
      <div className="todo-list">
        {todos.map((todo, index) => (
          <Todo
            key={index}
            index={index}
            todo={todo}
            removeTodo={removeTodo}
          />
        ))}
        <TodoForm addTodo={addTodo} />
      </div>
    </div>
  );
}