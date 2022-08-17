import { onAuthStateChanged } from "firebase/auth";
import { authApp } from "./firebase";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Confirm from "./pages/Confirm";
import Login from "./pages/Login";
import Main from "./pages/Main";
import NotFound from "./pages/NotFound";
import useAuthActions from "./utils/hooks/useAuthAction";

function App() {
  const { authorize, logout } = useAuthActions();
  useEffect(() => {
    checkAuth();
  }, []);
  const checkAuth = () => {
    onAuthStateChanged(authApp, (user) => {
      if (user) {
        authorize({ id: user.id });
      } else {
        logout();
      }
    });
  };
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <div>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/confirm" element={<Confirm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
