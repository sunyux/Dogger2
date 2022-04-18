import cors from "cors";
import path from "path";
import fs, { appendFileSync } from "fs";
import { isAsyncFunction } from "util/types";
import { assert } from "console";
import express from "express";
import minimal from "./src/minimal";

//const app = minimal();
const app = express();

app.use(cors());
app.use(express.json());

// userId: number
// let DoggrDatabase = {
//   users: [1, 2, 3],
// };

const createUser = (userId, userName, userAge, password) => ({
  userId,
  userName,
  userAge,
  password,
});

let DoggrDatabase = {
  users: [
    createUser(1, "george", 21, "hunter2"),
    createUser(2, "karen", 81, "12345678"),
    createUser(3, "tim", 15, "sioafnwoin"),
  ],
};

// Returns a response of 200 if user exists, 404 otherwise
app.get("/users/:userId", (req, res) => {
  let id = req.params.userId;

  //let numericId = parseInt(id, 10);
  id = Number(id);

  //const userFound = DoggrDatabase.users[numericId - 1];

  let userFound = DoggrDatabase.users.find((entry) => {
    return entry.userId === id;
  });

  if (userFound) {
    res.status(200).json(userFound);
    res.status(200).send(`
    <html>
    <head><title>Doggr User</title></head>
    <body>
      <h1>Doggr User</h1>
      <table>
       <tr>  
          <th>User ID</th>
          <th>Name</th>
          <th>Age</th>
          <th>Password</th>
        </tr>
      <tr>
          <td>${userFound.userId}</td>
          <td>${userFound.userName}</td>
          <td>${userFound.userAge}</td>
          <td>${userFound.password}</td>
        </tr>
      </table>
    </body>
    </html>
    `);
  } else {
    res.status(404).send("user not found");
  }
});

app.put("/users/", (req, res) => {
  //let id = Number(req.params.userId);
  let requestJson = req.body;

  DoggrDatabase.users.push(requestJson);
  res.status(200).send("User added to database");
});





// app.get("/about", (req, res) => {
//   res.send("I am the about page via GET");
// });

// app.get("/", (req, res) => {
//   fs.readFile(path.resolve(__dirname, "..", "public", "index.html"),
//     (err, data) => {
//       if (err) {
//         return res.status(500).send("Error Occured");
//       }
//       return res.status(200).send(data);
//     });
// });

const server = app.listen(9000, () => {
  console.log("Server is running");
});
