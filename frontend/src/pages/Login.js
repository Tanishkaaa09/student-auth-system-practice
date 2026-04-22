import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://student-auth-system-practice.onrender.com/api/login",
        form
      );

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");

    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="container-box">
      <h2>Login</h2>

      <form onSubmit={submitForm}>
        <input
          className="form-control mb-2"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button className="btn btn-success w-100">
          Login
        </button>
      </form>

      <p className="mt-3 text-center">
        New user? <Link to="/">Register</Link>
      </p>
    </div>
  );
}

export default Login;