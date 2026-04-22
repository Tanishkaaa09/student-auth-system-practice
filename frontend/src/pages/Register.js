import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: ""
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
      await axios.post(
        "https://student-auth-system-practice.onrender.com/api/register",
        form
      );

      alert("Registration Successful");
      navigate("/login");

    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="container-box">
      <h2>Register</h2>

      <form onSubmit={submitForm}>
        <input
          className="form-control mb-2"
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />

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

        <input
          className="form-control mb-2"
          type="text"
          name="course"
          placeholder="Course"
          onChange={handleChange}
          required
        />

        <button className="btn btn-primary w-100">
          Register
        </button>
      </form>

      <p className="mt-3 text-center">
        Already have account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;