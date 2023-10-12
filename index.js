const express = require('express');
const app = express();
const timeInfo = require('./vanaKasulik/dateTimeET.js');
const fs = require("fs");



app.set('view engine', 'ejs');
app.use(express.static('public'));

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
            folkWisdom = data.split(';');
            res.render('justlist', {h1: 'Nimed', names: names})
    });
});
app.listen(5119);