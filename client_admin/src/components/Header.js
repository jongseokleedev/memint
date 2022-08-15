import React from "react";
import { Link } from "react-router-dom";
import './Header.scss';

export default function Header() {
  return (
    <div className="header">
      <Link to="/">
        <div>Memint</div>
      </Link>

      <div className="navbar">
        <Link to="login">
          <span>로그인</span>
        </Link>
        <Link to="confirm">
          <span>미팅 인증</span>
        </Link>
      </div>
    </div>
  );
}
