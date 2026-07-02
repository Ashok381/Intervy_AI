import { useContext, createContext, useState, useEffect } from 'react'
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Dashboard from './dashboardPage/Dashboard';
import Home from './HomePage/Home';
import About from './components/About';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import Info from './components/Info_banner';

const loginContext = createContext();
const AboutContext = createContext();
// InfoContext lets ANY component (even Login/Signup, which render before
// the user is authenticated) show a message in the Info banner without
// prop-drilling a setter down through every layer.
const InfoContext = createContext();

const route = createBrowserRouter(
  [
    {
      path: "/",
      element: <div>
        <Navbar /> <Dashboard />
      </div>
    },
    {
      path: "/Dashboard",
      element: <div>
        <Navbar /> <Dashboard />
      </div>
    },
    {
      path: "/home",
      element: <div>
        <Navbar /> <Home />
      </div>
    },
    {
      path: "/About",
      element: <div>
        <Navbar /> <About />
      </div>
    }
  ]
)

let checkAuth;

function App() {
  const [isLogin, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [info, setInfo] = useState(null);

  // Any component can call this (via useContext(InfoContext)) to show a
  // message in the Info component for a few seconds.
  function showInfo(message, color) {
    setInfo({ message, color });
    setTimeout(() => setInfo(null), 4000);
  }

  useEffect(() => {
    (async () => {
      await checkAuth();
    })()
  }, []);

  checkAuth = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/info",
        {
          method: "POST",
          credentials: "include",
        }
      );
      const Data = await response.json();
      setData(Data);
      if (response.ok && Data.statuscode == 200) {
        setLogin(true);
      } else {
        setLogin(false);
      }
    } catch (err) {
      console.log(err);
      setLogin(false);
      showInfo("Could not reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <InfoContext.Provider value={showInfo}>
      <Info message={info?.message} color={info?.color} />

      {loading ? (
        <Loading />
      ) : !isLogin ? (
        <Login setLogin={setLogin} />
      ) : (
        <loginContext.Provider value={{ isLogin, setLogin }}>
          <AboutContext.Provider value={data}>
            <RouterProvider router={route} />
          </AboutContext.Provider>
        </loginContext.Provider>
      )}
    </InfoContext.Provider>
  );
}

export default App;
export { loginContext, AboutContext, InfoContext, checkAuth };
