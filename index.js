import express from "express";
import cors from "cors";
import cookieParser from "cookieparser";

const app = express();

app.use(express.json());
app.use(cors());
// app.use(cookieParser());

app.listen(3030, () => {
  console.log("Backend running at port 3030");
});
