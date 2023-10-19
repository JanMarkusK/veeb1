const express = require('express');
const app = express();
const timeInfo = require('./vanaKasulik/dateTimeET.js');
const fs = require("fs");
const mysql = require("mysql2")
const dbInfo = require('../../vp23config.js')
const bodyparser = require('body-parser')


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: false}));
//loon andmebaasiga ühenduse. See saab info kaustast janhara/vp23config.js'st
const conn = mysql.createConnection({
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.password,
    database: dbInfo.configData.database
});

app.get('/', (req, res)=>{
    //res.send('See töötab!');
    //res.download('index.js')
    res.render('index');
});

app.get('/test',(req, res)=>{
    res.send('Test, see töötab!');
    //res.download('index.js')
});
app.get('/timenow', (req, res) => {
    const dateNow = timeInfo.dateETformatted();
    const timeNow = timeInfo.timeETformatted();
    res.render('timenow', {nowD: dateNow, nowT: timeNow})
});
app.get('/wisdom' , (req, res) => {
    let folkWisdom = [];
    fs.readFile('public/txtfiles/vanasonad.txt', 'utf8', (err, data)=>{
        if (err){
            throw err;
        }
        else
            folkWisdom = data.split(';');
            res.render('justlist', {h1: 'Vanasõnad', wisdom: folkWisdom})
    });
});
app.get('/names' , (req, res) => {
    let names = [];
    fs.readFile('public/txtfiles/namelog.txt', 'utf8', (err, data)=>{
        if (err){
            throw err;
        }
        else
            data = data.trim();
            const lines = data.split(';')
            const formattedEntries = [];
//POOLIK
            lines.forEach(line=>{
                const formattedEntries = {
                    firstName: values[0],
                    lastName: values[1],
                    date: dateInfo.convertDate(values[2], "ET")
                };
            });
            
            res.render('justlist', {h1: 'Nimed', names: names})
    });
});

//filmindus
app.get('/eestifilm', (req, res) => {
    res.render('filmindex')
});
app.get('/eestifilm/filmiloend', (req, res) => {
    let sql = 'SELECT title, production_year FROM movie';
    let sqlResult = []
    conn.query(sql, (err, result) =>{
        if (err){
            res.render('filmlist', {filmlist: sqlResult});
            conn.end();
            throw err;
        }
        else {
            console.log(result);
            res.render('filmlist', {filmlist: result});
            conn.end();
        }
    });
});
app.get('/eestifilm/singlemovie', (req, res) => {
    res.render('singlemovie', {singlemovie: result});
    //pane kõik allolev app.post'i
    let notice = '';
    let sql = 'SELECT title, production_year FROM movie';
    let sqlResult = [];
    conn.query(sql, (err, result) =>{
        if (err){
            res.render('singlemovie', {singlemovie: sqlResult});
            conn.end();
            throw err;
        }
        else {
            console.log(result);
            res.render('singlemovie', {singlemovie: result});
            conn.end();
        }
    });
});
app.get('/eestifilm/addfilmperson', (req, res) => {
    res.render('addfilmperson')
});
app.post('/eestifilm/addfilmperson', (req, res) => {
    //res.render('addfilmperson')
    //res.send(erq.body)
    let notice = '';
	let sql = 'INSERT INTO person (first_name, last_name, birth_date) VALUES (?,?,?)';
	conn.query(sql, [req.body.firstNameInput, req.body.lastNameInput, req.body.birthDateInput], (err, result)=>{
		if(err) {
			notice = 'Andmete salvestamine ebaõnnestus!' + err;
			res.render('addfilmperson', {notice: notice});
            throw err;
		}
		else {
			notice = 'Filmitegelase ' + req.body.firstNameInput + ' ' + req.body.lastNameInput + ' salvestamine õnnestus!';
			res.render('addfilmperson', {notice: notice});
		}
	});
});
app.listen(5119);