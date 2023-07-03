import bodyParser from "body-parser";
import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "u869868394_rabindra",
//   password: "Uh4wtUcrS5",
// //   port : '3306',
//   database: "u869868394_assinment",
// });

const db = mysql.createConnection({
    host: "sql12.freesqldatabase.com",
    user: "sql12630137",
    password: "NNyeqJFFDC",
    port : '3306',
    database: "sql12630137",
  });
  

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// const db = mysql.createConnection({
//     host : 'localhost',
//     user : 'root',
//     port : '3307',
//     password : '',
//     database : 'mern'
// })

app.get("/", (req, res) => {
  const sql = "Select * from users";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json(result);
  });
});

app.post("/upload", upload.single("image"), (req, res) => {
  const image = req.file.filename;
  console.log(image);
  const sql =
    "UPDATE `users` SET `image` = 'image_1688349430618.jpg' WHERE `users`.`id` = 1; ";
  db.query(sql, [image], (err, result) => {
    if (err) return res.json({ Message: err });
    return res.json({ Status: image });
  });

  // const sql = "SELECT * FROM users";
  // db.query(sql,(err,result)=>{
  //     if(err) return res.json({Status : err});
  //     return res.json({Status : 'Success'})
  // })
});

app.post("/uploads", upload.array("image"), async (req, res) => {
  const fileInfo = req.files;

  const values = fileInfo.map((file) => [file.filename]);

  const InsertQuery = "INSERT INTO `users`( `image`) VALUES ? ;";
  db.query(InsertQuery, [values], (err, result) => {
    if (err) return res.json({ Message: "Error" });
    return res.json({ data: values });
  });
});

app.post("/login", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  const query = "SELECT * from users WHERE username = ? and password = ?";

  db.query(query, [userName, password], (error, result) => {
    if (error) {
      console.log(error);
      return;
    }

    res.send({ result });
  });
});

app.post("/user", (req, res) => {
  const user = req.body.user;

  const query = "SELECT * from users WHERE username = ? ";
  db.query(query, [user], (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    res.send({ result });
  });
});

app.post("/register", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  // console.log(userName,password)

  const InsertQuery =
    "INSERT INTO `users`( `username`,`password`) VALUES (?, ?) ;";

  db.query(InsertQuery, [userName, password], (err, result) => {
    if (err) return res.json({ Message: "Error" });
    return res.json({ Message: "success" });
  });
});

app.listen(port, () => {
  console.log("server is started on port 3000");
});
