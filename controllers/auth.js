import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  // CHECK TO SEE IF USER EXIST
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length)
      return res.status(409).json("Account with same username already exits.");
    // CREATE NEW USER
    // HASH PASSWORD
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO users (`name`, `username`, `password`, `email`) VALUE(?)";
    const values = [
      req.body.name,
      req.body.username,
      hashedPassword,
      req.body.email,
    ];

    db.query(q, [values], (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Account has been created.");
    });
  });
};

export const login = (req, res) => {
  // CHECK IF USER EXISTS
  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [req.body.username], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json("Account not found");
    // CHECK IF PASSWORD MATCHES
    const matchPassword = bcrypt.compareSync(
      req.body.password,
      result[0].password
    );

    if (!matchPassword)
      return res.status(400).json("Wrong password or username.");

    const token = jwt.sign({ id: result[0].id }, "secret");
    const { password, ...others } = result[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has logged out");
};
