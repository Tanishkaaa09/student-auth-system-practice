import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({});
  const [course, setCourse] = useState("");
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        "https://student-auth-system-practice.onrender.com/api/dashboard",
        {
          headers: { Authorization: token }
        }
      );

      setStudent(res.data);
    } catch {
      navigate("/login");
    }
  };

  const updateCourse = async () => {
    await axios.put(
      "https://student-auth-system-practice.onrender.com/api/update-course",
      { course },
      {
        headers: { Authorization: token }
      }
    );

    alert("Course Updated");
    fetchDashboard();
  };

  const updatePassword = async () => {
    await axios.put(
      "https://student-auth-system-practice.onrender.com/api/update-password",
      passwords,
      {
        headers: { Authorization: token }
      }
    );

    alert("Password Updated");
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container-box">
      <h2>Dashboard</h2>

      <p><b>Name:</b> {student.name}</p>
      <p><b>Email:</b> {student.email}</p>
      <p><b>Course:</b> {student.course}</p>

      <hr />

      <input
        className="form-control mb-2"
        placeholder="New Course"
        onChange={(e) => setCourse(e.target.value)}
      />

      <button
        className="btn btn-warning w-100 mb-3"
        onClick={updateCourse}
      >
        Update Course
      </button>

      <input
        className="form-control mb-2"
        type="password"
        placeholder="Old Password"
        onChange={(e) =>
          setPasswords({
            ...passwords,
            oldPassword: e.target.value
          })
        }
      />

      <input
        className="form-control mb-2"
        type="password"
        placeholder="New Password"
        onChange={(e) =>
          setPasswords({
            ...passwords,
            newPassword: e.target.value
          })
        }
      />

      <button
        className="btn btn-info w-100 mb-3"
        onClick={updatePassword}
      >
        Update Password
      </button>

      <button
        className="btn btn-danger w-100"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;