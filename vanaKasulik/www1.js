//elagu mu veebileht
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const querystring = require('querystring');
const dateTime = require('./dateTimeET');
const pageHead ='<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>JMK</title>\n</head><body>'
const pageBanner = '\n\t<img src="banner.png" alt="Kursuse bänner">';
const pageBody = '\n\t<h1>JMK</h1>\n<p>See veebileht on tehtud <a href="https://www.tlu.ee/" target="_blank">TLÜ</a> digitehnoloogiate instituudi informaatika eriala õppetöö käigus</p>'
const pageFoot = '\n\t<hr></body></html>'

const semester = '\n\t<hr><p><a href="semesterprogress">Infot 2023 sügissemestri kohta</a></p>';
const semesterBegin = new Date('08/28/2023');   // semestri alguse kuupaev
const semesterEnd = new Date('01/28/2024');     // semestri lopu kuupaev
const today = new Date();
let semesterLasted = Math.floor((today.getTime() - semesterBegin.getTime()) / 86.4e6);
let semesterStill = Math.floor((semesterEnd.getTime() - today.getTime()) / 86.4e6);
const semesterDuration = Math.floor((semesterEnd - semesterBegin) / 86.4e6);


http.createServer(function(req, res){
	let currentURL = url.parse(req.url, true);
	//console.log(currentURL);
	if(req.method === 'POST'){
		//res.end('Tuligi POST!');
		collectRequestData(req, result => {
            console.log(result);
			//Kirjutame andmeid tekstifaili
			fs.open('public/namelog.txt', 'a', (err, file) =>{
				if (err) {
					throw err;
				}
				else {
					fs.appendFile('public/namelog.txt', result.firstNameInput + result.lastNameInput + ':' + dateTime.dateNAformatted + ';', (err) => {
						if (err) {
							throw err;
						}
						else {
							console.log('fail kirjutati')
						}
					});
					/*fs.close(file, (err)=>{
						if (err);
							throw err
					});*/
				}

			});


			res.end(result.firstNameInput);
		});
	}

	else if (currentURL.pathname === "/"){
		res.writeHead(200, {"Content-type": "text/html"}); // 200 = leht töötab
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write(semester);
		res.write('\n\t<hr>\n\t<p><a href="addname">Lisa oma nimi</a>!</p>');
		res.write(pageFoot);
		res.write('\n\t<p><a href="tluphoto">Pilte Tallinna Ülikoolist</a></p>');
		res.write('<p>Täna on ' + dateTime.timeETformatted() + ', ' + dateTime.dateETformatted() + '</p>');
		//console.log("Keegi vaatab!");
		return res.end();
	}
	
	else if (currentURL.pathname === "/addname"){
		res.writeHead(200, {"Content-type": "text/html"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write('\n\t<hr>\n\t<h2>Lisa palun oma nimi</h2>');
		res.write('\n\t<form method="POST">\n<label for="firstNameInput">Eesnimi</label>\n<input type="text" name="firstNameInput" id="firstNameInput" placeholder="Sinu Eesnimi">\n<br>\n<label for="lastNameInput">Perekonnami</label>\n<input type="text" name="lastNameInput" id="lastNameInput" placeholder="Sinu Perekonnanimi">\n<br>\n<input type="submit" name="submit" value="Kinnita">\n</form>');
		res.write(pageFoot);
		return res.end();
	}
	
	else if (currentURL.pathname === "/tluphoto"){
		//loeme kataloogist fotode nimekirja ja loosime ühe pildi
		let htmlOutput = '\n\t<p>Pilti ei saa näidata!</p>';
		fs.readdir('public/tluphotos', (err, fileList)=>{
			if(err) {
				throw err;
				tluPhotoPage(res, htmlOutput);
			}
			else {
				//console.log(fileList);
				let photoNum = Math.floor(Math.random() * fileList.length);
				htmlOutput = '\n\t<img src="' + fileList[photoNum] + '" alt="TLÜ pilt">';
				//console.log(htmlOutput);
				
				listOutput = '\n\t<ul>';
				for (fileName of fileList) {
					listOutput += '\n\t<li>' + fileName + '</li>'
				}
				listOutput += '\n\t</ul>';
				//console.log(listOutput);
				tluPhotoPage(res, htmlOutput, listOutput);
			}
		});
	}
	//else if (currentURL.pathname === "/tlu_10.jpg"){ 
	
	else if (currentURL.pathname === '/semesterprogress'){
		res.writeHead(200, {'Content-type': 'text/html'});
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		const dateFormat = {day: 'numeric', month: 'numeric', year: 'numeric'};
		const startFormat = semesterBegin.toLocaleDateString('et-EE', dateFormat);
		const endFormat = semesterEnd.toLocaleDateString('et-EE', dateFormat);
		if (semesterBegin <= today && today <= semesterEnd){
				res.write('<hr><p>Semester algas: ' + startFormat + '</p>');
				res.write('<p>Semester lõpeb: ' + endFormat + '</p>');
				res.write('<p>Kokku kestab: ' + semesterDuration + ' päeva</p>');
				res.write('<p>läbitud on ' + semesterLasted + ' päeva ja veel on ees ' + semesterStill + ' päeva</p>');
				res.write(`<meter min="0" max="${semesterDuration}" value="${semesterLasted}"></meter>`);
				}
		else if (semesterBegin > today){
				res.write('<p>Semester pole alanud! Veel on aega ' + Math.floor((semesterBegin.getTime() - today.getTime()) / 86.4e6) + ' päeva!</p>');
		}
		else if (semesterEnd < today){
				res.write('<p>Semester on kahjuks läbi!!!</p>');
		}
		res.write(pageFoot);
		return res.end();

	}
	
	else if (currentURL.pathname === "/banner.png"){
		console.log("Tahame pilti!");
		let bannerPath = path.join(__dirname, "public", "banner");
		//let tluPhotoPath = path.join(__dirname, "public", "photos");
		//console.log(bannerPath + currentURL.pathname);
		fs.readFile(bannerPath + currentURL.pathname, (err, data)=>{
			if (err) {
				throw err;
			}
			else {
				console.log("Tuli ära!");
				res.writeHead(200, {"Content-type": "image/png"});
				res.end(data);
			}
		});

	}
    //else if (currentURL.pathname === "/tlu_42.jpg"){
	else if (path.extname(currentURL.pathname) === ".jpg"){
		console.log(path.extname(currentURL.pathname));
		//let filePath = path.join(__dirname, "public", "tluphotos/tlu_42.jpg");
		let filePath = path.join(__dirname, "public", "tluphotos");
		fs.readFile(filePath + currentURL.pathname, (err, data)=>{
			if(err){
				throw err;
			}
			else {
				res.writeHead(200, {"Content-Type": "image/jpeg"});
				res.end(data);
			}
		});
	} 
	else {
		res.end("ERROR 404");
	}
	//valmis, saada ära
}).listen(5119);

function tluPhotoPage(res, htmlOut){
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(pageHead);
	res.write(pageBanner);
	res.write(pageBody);
	res.write('\n\t<hr>');
	res.write(htmlOut);
	//res.write('\n\t<img src="tlu_42.jpg" alt="TLÜ foto">');
	res.write('\n\t <p><a href="/">Tagasi avalehele</a>!</p>');
	res.write(listOutput)
	res.write(pageFoot);
	//et see kõik valmiks ja ära saadetaks
	return res.end();
}
function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let receivedData = '';
        request.on('data', chunk => {
            receivedData += chunk.toString();
        });
        request.on('end', () => {
            callback(querystring.decode(receivedData));
        });
    }
    else {
        callback(null);
    }
}
    //rinde .listen(5100)