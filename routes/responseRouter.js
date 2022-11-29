
/** @module Response  */
const express = require('express');
require('dotenv').config();
const config = require('config');
const mysql = require("mysql2/promise");
const Response = express.Router();

Response.route('/')
.get(async (req,res,next) => {
    try{
        const [resp] = await db.query(`SELECT * FROM response;`);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
})
.post(async (req,res,next) => {
    try{
        const response = req.body.response;
        const Ques_id = req.body.Ques_id;

        db.query(`INSERT INTO response(response ,Ques_id) VALUES ("${response}",${Ques_id});`);
        var [newres] = await db.query(`SELECT response_id FROM response WHERE response =  "${response}";`);
        newres = newres[0].response_id;

        db.query(`UPDATE question SET responseid = ${newres} WHERE Ques_ID = ${Ques_id};`);
        db.query(`UPDATE question SET responded = true WHERE Ques_ID = ${Ques_id};`);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({"result" : "responded"});
    }catch(err){
        res.status(err.status || 500);
        res.render('error');
    }
});

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

module.exports = Response;