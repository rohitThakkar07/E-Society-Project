const User = require("../../../db/models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

/* Register Resident */
const registerResident = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, name, email, password, role } = req.body;
    const residentName = name || fullName;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: residentName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "Resident"
    });


    console.log("after send email");
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Resident created and welcome email sent!",
      user: userResponse
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* Login */

const login = async (req, res) => {
  console.log(req.body)
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
 console.log("hash password "+hashedPassword)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role
      },process.env.JWT_SECRET,{ expiresIn: "1d" }
    );

    res.json({success: true,token,user});

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

/* Logout */
const logout = async (req, res) => {
  try {
    // If you are using Cookies to store the JWT, clear the cookie:
    // res.clearCookie('token'); 

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};
module.exports = {
  // registerResident,
  login,
  logout
};