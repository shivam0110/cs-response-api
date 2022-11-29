
/** @module Question  */
const express = require('express');
require('dotenv').config();
const config = require('config');
const mysql = require("mysql2/promise");
const Question = express.Router();

Question.route('/')
.get(async (req,res,next) => {
    try{
        const [ques] = await db.query(`SELECT * from question;`);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(ques);
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
})
.post(async (req,res,next) => {
    try{

        const User_ID = req.body.User_ID;
        const Timestamp_UTC = req.body.Timestamp_UTC;
        const Message_Body = req.body.Message_Body;

        db.query(`INSERT INTO question(User_ID,Timestamp_UTC,Message_Body) VALUES (${User_ID},"${Timestamp_UTC}","${Message_Body}");`);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({"result" : "added"});
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
});

Question.route('/unans')
.get(async (req,res,next) => {
    try{
        const [ques] = await db.query(`SELECT * from question where responded = 0  order by Timestamp_UTC;`);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(ques);
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
})

async function main(){
    db = await mysql.createConnection({
      host: config.get('db.host'),
      user: config.get('db.user'),
      password: config.get('db.password'),
      database: config.get('db.database'),
      timezone: config.get('db.timezone'),
      charset: config.get('db.charset')
    });
}
main();

module.exports = Question;