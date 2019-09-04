
const express = require("express");

const server = express();

const postsRouter = require('./routes/postsRouter');

server.use(express.json()); //allows server to parse incoming req objects
// server.use(express.urlencoded({ extended: true }))
server.use("/api/posts", postsRouter);


server.listen(8000, () => console.log('API running on port 8000'));

// server.get("/", (req, res) => {
//     res.send("welcome to the node-api server");
//   });