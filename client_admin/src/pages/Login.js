import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signin } from "../lib/Auth";
import useAuth from "../utils/hooks/useAuth";
import useAuthActions from "../utils/hooks/useAuthAction";
import "./Login.scss";

export default function Login() {
  const auth = useAuth();
  const { authorize } = useAuthActions();
  const [input, setInput] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const handleInput = (e) => {
    setInput({ ...input, [e.target.id]: e.target.value });
  };
  const handleSubmit = async () => {
    if (input.email !== "admin@naver.com") {
      alert("관리자만 로그인할 수 있습니다.");
      return;
    }
    signin(input).then((res) => {
      authorize({ id: res.uid });
      alert("로그인 성공!");
      navigate("/");
    });
  };

  useEffect(() => {
    if (auth) {
      navigate("/");
    }
  });
  return (
    <div className="login-container">
      <div>관리자 로그인</div>
      <div>
        <input
          id="email"
          type="text"
          placeholder="EMAIL"
          onChange={handleInput}
        />
        <input
          id="password"
          type="password"
          placeholder="PASSWORD"
          onChange={handleInput}
        />
        <button onClick={handleSubmit}>login</button>
      </div>
    </div>
  );
}
