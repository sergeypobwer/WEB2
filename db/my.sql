CREATE DATABASE IF NOT EXISTS users;

use users;

CREATE TABLE IF NOT EXISTS users
(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    usr varchar(30), 
    name_bot varchar(30), 
    state boolean
);


INSERT INTO users (usr, name_bot, state)
VALUES
    ('taddy@mail.com', 'TaddyBot', false),
    ('a@a', 'aaa', true);
    
CREATE TABLE IF NOT EXISTS authorization
(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    login varchar(30), 
    pass varchar(30)
);

INSERT INTO authorization (login, pass)
VALUES
    ('taddy@mail.com', '123ss'),
    ('a@a', 'aaa');