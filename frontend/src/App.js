import * as React from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { fakeAuthProvider } from "./auth";
import Axios from "axios";
import { useEffect, useState } from "react";
import Avata from "../src/Assets/avata2.svg";
import Unlock from "../src/Assets/unlock.svg";

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
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let username = formData.get("username");

    auth.signin(username, () => {
      navigate(from, { replace: true });
    });
  }

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-30 space-y-10 ">
      <div className="items-center justify-center flex text-center h-screen lg:grid lg:grid-cols-2">
        <div className="flex justify-center">
          <img
            src={Unlock}
            className="hidden lg:block w-2/3 hover:scale-125 transition-all duration-500 transform mx-auto"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <img src={Avata} className="w-2/3 " />
          </div>
          <div className="text-4xl sm:text-5xl text-blue-900  ">
            Log in to your account{" "}
          </div>
          <div className="flex flex-col pt-8 mx-5">
            <span className="text-sky-800 text-2xl text-left pb-1">
              Username{" "}
            </span>
            <input
              name="username"
              type="text"
              required
              className="  px-3 py-2 border items-center justify-center border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm w-full "
              placeholder="Username"
            ></input>
          </div>

          <div className="bg-sky pt-4 mx-5">
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-800  rounded-md w-full h-8 text-white"
            >
              Login
            </button>
          </div>
        </form>
      </div>
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
    const saveUser = localStorage.getItem("user");
    if (saveUser && "null" !== saveUser) {
      return saveUser;
    } else {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("user", user);
  }, [user]);

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

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

//หน้า User
function AuthStatus() {
  let auth = useAuth();
  let navigate = useNavigate();
  let location = useLocation();
  console.log("location ", location);
  console.log(auth.user);

  if (location.pathname === "/login" && auth.user) {
    return <Navigate to="protected" replace />;
  }

  if (!auth.user) {
    return <div></div>;
  }

  return (
    <div className=" pt-100 bg-gradient-to-r from-pink-100 via-violet-100 to-pink-100  sm:pl-8 pl-4  ">
      <div className="text-sky-800 lg:text-7xl sm:text-5xl text-4xl pt-7">
        Welcome!
      </div>
      <div className="text-2xl lg:text-4xl sm:text-3xl space-y-10 pt-4 flex flex-row ">
        {" "}
        Username: {auth.user}{" "}
        <div className="pl-5">
          <button
            className="bg-red-400 hover:bg-red-300 rounded-md w-20 
        h-8 text-white text-lg sm:text-xl
      shadow-lg shadow-orange-400/40 "
            onClick={() => {
              auth.signout(() => navigate([]));
            }}
          >
            Sign out
          </button>
        </div>
      </div>
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
  const [imgDog, setImgdog] = useState("");
  const [save, setSave] = useState(() => {
    const saveData = localStorage.getItem("save");
    if (saveData) {
      return JSON.parse(saveData);
    } else {
      return [];
    }
  });

  let auth = useAuth();

  useEffect(() => {
    Axios.get("https://dog.ceo/api/breeds/image/random").then((response) => {
      setImgdog(response.data.message);
    });
  }, []);

  const changeImg = () => {
    Axios.get("https://dog.ceo/api/breeds/image/random").then((response) => {
      setImgdog(response.data.message);
    });
  };

  const saveImg = () => {
    setSave([...save, { img: imgDog, nameuser: auth.user }]);
    changeImg();
  };

  const deleteImg = (index) => {
    save.splice(index, 1);
    setSave([...save]);
  };

  useEffect(() => {
    localStorage.setItem("save", JSON.stringify(save));
  }, [save]);

  return (
    <div className="bg-gradient-to-r from-pink-100 via-violet-100 to-pink-100">
      <br />
      <br />
      <div className="text-center text-3xl lg:text-4xl sm:text-4xl text-stone-800">
        Little Puppy Picture
      </div>
      <br />
      <br />
      <div className="justify-center flex ">
        <img
          className="sm:w-96 sm:h-72 w-64 h-52 rounded-xl shadow-lg shadow-indigo-300/40 hover:scale-125 transition-all duration-500 transform mx-auto "
          src={imgDog}
        />
      </div>
      <br />
      <br />
      <button
        onClick={saveImg}
        className="bg-lime-600 hover:bg-lime-400  rounded-md w-28 h-10 text-white sm:ml-40 ml-14 text-xl shadow-lg shadow-yellow-400/40"
      >
        ADD
      </button>{" "}
      <button
        onClick={changeImg}
        className="bg-amber-500 hover:bg-amber-300  rounded-md w-28 h-10 text-white float-right sm:mr-40 mr-14 text-xl
      shadow-lg shadow-yellow-400/40 "
      >
        CHANGE
      </button>
      <div className="p-10 hidden md:block  ">
        <table className="w-full drop-shadow-lg text-stone-700">
          <thead className="bg-gray-50 border-y-2 border-x-2 border-gray-300 ">
            <tr className="flex justify-between ">
              <th className="p-5 pl-20 text-xl font-semibold tracking-wide text-left ">
                Image
              </th>
              <th className="p-5 text-xl font-semibold tracking-wide text-left ">
                Details
              </th>
              <th className="p-5 pr-20 text-xl font-semibold tracking-wide text-left">
                Status
              </th>
            </tr>
          </thead>
        </table>

        <thead className=" ">
          <tr className="">
            <th className="bg-gray-100 w-screen drop-shadow-lg ">
              {save.map((value, index) => {
                return (
                  <div className=" h-64 border-b-2 border-x-2 border-gray-300 ">
                    <div className="flex justify-between">
                      <div>
                        <img
                          className="w-72 h-52 md:w-52 md:h-48 rounded-lg mt-8 ml-6"
                          src={value.img}
                        />
                      </div>
                      <div className="pt-28 pr-14 text-4xl text-stone-800">
                        save from {value.nameuser}
                      </div>
                      <div className="pt-28 pr-16">
                        <button
                          onClick={() => deleteImg(index)}
                          className="bg-rose-400 hover:bg-red-300 rounded-md w-28 h-12 text-white shadow-lg shadow-orange-400/40 text-xl"
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </th>
          </tr>
        </thead>
      </div>
      <div className=" md:hidden flex flex-col ">
        {save.map((value, index) => {
          return (
            <div
              className="flex justify-center grid-cols-1  
              mx-16 mt-10 drop-shadow-lg rounded-2xl backdrop-blur-xl bg-white/80 "
            >
              <div className="">
                <div className="">
                  <img
                    className="sm:w-64 sm:h-52 w-52 h-44 rounded-lg mt-10 ml-5"
                    src={value.img}
                  />
                </div>
                <div className="flex justify-center sm:text-3xl text-2xl pt-5 ">
                  save from {value.nameuser}
                </div>
                <div className=" flex justify-center pb-10 pt-5">
                  <button
                    onClick={() => deleteImg(index)}
                    className="bg-rose-400 hover:bg-red-300  rounded-md w-28 h-10 text-white  shadow-lg shadow-orange-400/40 text-lg"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
