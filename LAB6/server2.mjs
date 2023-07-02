"use strict";

import express from "express"; 
import morgan from "morgan";
import fs from "fs";
const app = express();

const port = process.argv[2] || 8000;

app.use(morgan('dev'));
app.use(express.json())

var db_file = fs.readFileSync("db.json");
var db = JSON.parse(db_file);

app.get('/', (req, res) => res.send('Hi'));

app.get('/end', function (req, res) {
  res.send("Stopping the server...");
  process.exit(0);
  });


app.get('/restart',  (req, res) => {
  db = fs.readFileSync("db.json");
  db = JSON.parse(db);
  res.type("text/plain");
  res.send("db.json reloaded");
});

app.get('/nbpapers', (req, res) => {
  res.type("text/plain");
  res.send((new Number(db.length)).toString());
  });

app.get('/author/:name', (req, res)=>{

  var author = req.params.name;
  var count = 0;
  for (const val of db){
    for (const a of val.authors) {
	  if(a.toLowerCase().includes(author.toLowerCase())){count++}
	}
  }
  res.type("text/plain");
  res.send((new Number(count)).toString());
})

app.get('/papers_from/:name', (req, res)=>{
  var array_descriptor=[];
  var author = req.params.name;
  for (const val of db){
      for (const a of val.authors) {
	    if(a.toLowerCase().includes(author.toLowerCase())){array_descriptor.push(val);}
	}
  }
  res.type("application/json");
  res.send(JSON.stringify(array_descriptor));
})

app.get('/ttlist/:name', (req, res)=>{
  var array_title=[];
  var author = req.params.name;
  for (const val of db){
    for (const a of val.authors) {
	  if(a.toLowerCase().includes(author.toLowerCase())){array_title.push(val.title);}
	}
  }
  res.type("application/json");
  res.send(JSON.stringify(array_title));
})

app.get('/pubref/:key', (req, res)=>{
  var key_id = req.params.key;
  var descriptor={};
  for (var val of db){
    if (val.key==key_id){
      descriptor = val;
    }
  }
  if (descriptor!={}){
    res.type("application/json");
    res.send(JSON.stringify(descriptor));
  }
  else {
    res.sendStatus(404);
  }
})

app.delete('/pubref/:key', (req, res)=>{
  var key_id = req.params.key;
  var index = undefined;
  for (var i in db){
    if (db[i].key==key_id){
      var index=i;
    }
  }
  if (index!=undefined){
    db.splice(index, 1)
    res.type("application/json");
    res.send(JSON.stringify(db));
  }
  else {
    res.sendStatus(404);
  }
})

app.post('/pubref', (req, res) => {
    let key = "imaginary";
    let title = req.body.title;
    let journal = req.body.journal;
    let year = req.body.year;
    let authors = req.body.authors;

    let new_pub = {
        "key": key,
        "title": title,
        "journal": journal,
        "year": year,
        "authors": authors
    }

    db.push(new_pub);

    res.type("text/plain")
    res.send('Publication added');
})

app.put('/pubref/:key', (req, res) => {
    let key = req.params.key;
    let found = false;
    for (let i = 0; i < db.length; i++) {
        if (db[i].key == key) {
            if (req.body.title) {
                db[i].title = req.body.title;
            }
            if (req.body.journal) {
                db[i].journal = req.body.journal;
            }
            if (req.body.year) {
                db[i].year = req.body.year;
            }
            if (req.body.authors) {
                db[i].authors = req.body.authors;
            }
            found = true;
            break;
        }
    }
    if (!found) {
        res.status(404).send('Not found');
    }
    else {
        res.type("text/plain")
        res.send('Publication updated');
    }
})

app.listen(port, () => console.log('Server listening on port '+ port));