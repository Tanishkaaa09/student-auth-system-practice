const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Student = require("../models/Student");
const authMiddleware = require("../middleware/authMiddleware");


// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, course } = req.body;

    const existingUser = await Student.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      course
    });

    await newStudent.save();

    res.status(201).json({ message: "Registration Successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      student: {
        name: student.name,
        email: student.email,
        course: student.course
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// DASHBOARD
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// UPDATE PASSWORD
router.put("/update-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const student = await Student.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, student.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    student.password = hashedPassword;
    await student.save();

    res.json({ message: "Password Updated Successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// UPDATE COURSE
router.put("/update-course", authMiddleware, async (req, res) => {
  try {
    const { course } = req.body;

    const student = await Student.findById(req.user.id);

    student.course = course;
    await student.save();

    res.json({ message: "Course Updated Successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;