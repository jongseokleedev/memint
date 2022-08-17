import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signout } from "../lib/Auth";
import useAuth from "../utils/hooks/useAuth";
import useAuthActions from "../utils/hooks/useAuthAction";
import "./Header.scss";

export default function Header() {
  const auth = useAuth();
  const { logout } = useAuthActions();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    signout();
    navigate("/");
  };
  return (
    <div className="header">
      <Link to="/">
        <h2>Memint</h2>
      </Link>

      <div className="navbar">
        {auth ? null : (
          <Link to="login">
            <span>로그인</span>
          </Link>
        )}

        {auth ? (
          <>
            <Link to="confirm">
              <span>미팅 인증</span>
            </Link>
            <span className="logout-button" onClick={handleLogout}>
              로그아웃
            </span>{" "}
          </>
        ) : null}
      </div>
    </div>
  );
}
