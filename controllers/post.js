import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";

export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("You are not logged in.");

  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON ( u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId =? OR p.userId = ? ORDER BY p.createdAt DESC`;

    db.query(q, [user.id, user.id], (err, results) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(results);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("You are not logged in.");

  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.status(403).json("Token is not valid");

    const q =
      "INSERT INTO posts (`desc`, `img`, `userId`, `createdAt`) VALUES(?)";
    const values = [
      req.body.desc,
      req.body.img,
      user.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q, [values], (err, results) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has created successfully.");
    });
  });
};
