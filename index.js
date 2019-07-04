const express = require("express");

const server = express();

server.use(express.json());

const users = ["William", "Julia", "Patricia"];

//middleware global
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

//middleware para verificar se o usuário existe
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

//middleware para verificar se o usuário existe no index(array)
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  req.user = user;

  return next();
}

//listagem de todos os usuários
server.get("/users", (req, res) => {
  return res.json(users);
});

//listagem de um unico usuário
server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

//criação de usuários
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

//edição de usuários
server.put("/users/:index", checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

//deletar usuários
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
