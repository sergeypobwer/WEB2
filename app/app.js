const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
 
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});
 
const pool = mysql.createPool({
  connectionLimit: 5,
  host: "db",
  user: "mysql",
  database: "users",
  password: "Ric1090sRic1090s"
});
 
var curr_user;

app.set("view engine", "hbs");
 
// переход на страницу авторизации
app.get("/", function(req, res) {
  res.render("index.hbs");
});

app.post("/", urlencodedParser, function (req, res) {
  if(!req.body) return res.sendStatus(400);
  const u_login = req.body.auth_email;
  const u_passw = req.body.auth_pass;
  pool.query("SELECT * FROM authorization", function(err, data, field) {
    if(err) return console.log(err);
    for (let i = 0; i < data.length; i++)
    {
      //console.log(data[i].login);
      //console.log(data[i].pass);
      if(data[i].login == u_login && data[i].pass == u_passw)
        {
          curr_user = u_login;
          res.redirect("/work");
      }
    }
  })
  //res.render("work.hbs");
});


//получение списка пользователей
app.get("/work", function(req, res){
    pool.query("SELECT * FROM users WHERE usr =?",curr_user, function(err, data) {
      if(err) return console.log(err);
      res.render("work.hbs", {
          users: data
      });
    });
});


app.post("/work", urlencodedParser, function (req, res) {
 
  if(!req.body) return res.sendStatus(400);
  pool.query("SELECT * FROM users", function(err, data) {
    if(err) return console.log(err);
    res.render("work.hbs", {
        users: data
    });
  });
});

// возвращаем форму для добавления данных
app.get("/create", function(req, res){
    res.render("create.hbs");
});
// получаем отправленные данные и добавляем их в БД 
app.post("/create", urlencodedParser, function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
    const name = req.body.name_bot;
	const data = [curr_user, name, false];
    pool.query("INSERT INTO users (usr, name_bot, state) VALUES (?, ?, ?)", data, function(err, data) {
      if(err) return console.log(err);
      res.redirect("/work");
    });
});
 
// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
app.get("/edit/:id", function(req, res){
  const id = req.params.id;
  pool.query("SELECT * FROM users WHERE id=?", [id], function(err, data) {
    if(err) return console.log(err);
     res.render("edit.hbs", {
        user: data[0]
    });
  });
});
// получаем отредактированные данные и отправляем их в БД
app.post("/edit", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
  const name = req.body.name_bot;
  //console.log(name);
  const st = req.body.state;
  var state = req.body.state ? true : false;
  //console.log(state);
  const id = req.body.id;
  //console.log(id);

  pool.query("UPDATE users SET name_bot=?, state=? WHERE id=?", [name, state, id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/work");
  });
});
 
// получаем id удаляемого пользователя и удаляем его из бд
app.post("/delete/:id", function(req, res){
          
  const id = req.params.id;
  pool.query("DELETE FROM users WHERE id=?", [id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/work");
  });
});
 
app.listen(3001, function(){
  console.log("Сервер ожидает подключения...");
});