const bodyParser = require("body-parser");
var multer = require('multer');
const express = require("express");
const mongoose = require("mongoose");
const { json } = require("express");
var upload = multer();
mongoose.connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true
});

var personSchema = mongoose.Schema({
    name: String,
    age: Number,
    nationality: String
 });

 let Person = mongoose.model("Person", personSchema);

const app = express();

app.set("view engine", 'pug')
app.set('views','./views');

app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

app.get('/person', function(req, res){
    res.render('person');
 });

app.post('/person', function(req, res){
    //var personInfo = req.body; //Get the parsed information
   if (req.body.name == "" || req.body.age == "" || req.body.nationality == ""){
      /*res.render('show_message', {
         message: "Sorry, you provided worng info", type: "error"});*/
         console.log(req.body);
         res.send("User did not enter data");
   } else {
      let newPerson = new Person({
         name: req.body.name,
         age: req.body.age,
         nationality: req.body.nationality
      });
		
      newPerson.save(function(err, Person){
         if(err)
           // res.render('show_message', {message: "Database error", type: "error"});
           res.render("show_message", {
            message: err
          })
         else
            /*res.render('show_message', {
               message: "New person added", type: "success", person: personInfo});*/
               res.render("show_message", {
                message: "New Person added"
              })
      });
   }
 });

app.get("/", (req, res) => {
    res.render("routes")
})

app.get("/write/:name/:age", (req, res) => {
    const rand = names[Math.floor(Math.random() * names.length)]
    console.log("in homepage")
    /*res.download("server.js") You can let user download files with res.download("file")*/
    res.render("index", { text: `Added your name to the database`})
    let newPerson = new Person({
        name: `${req.params.name}`,
        age: `${req.params.age}`,
        nationality: "Nigerian"
    })

    newPerson.save((err, Person) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Worked");
        }
    })
})

app.get("/readAll", (req, res) => {
    Person.find(function(err, response) {
        //let person = res.json(response)
        let fullData = "";
        let fullAge = "";
        let fullNations = "";
       for (let i = 0; i < response.length; i++) {
            fullData += "#" + Number(i + 1) + ": "
            fullData += response[i]["name"];
            fullData += ", "
            fullAge += "#" + Number(i + 1) + ": "
            fullAge += response[i]["age"]
            fullAge += ", "
            fullNations += "#" + Number(i + 1) + ": "
            fullNations += response[i]["nationality"]
            fullNations += ", "
       }
        res.render("data", {
            userData: fullData.substring(0 ,fullData.length - 2),
            userAge: fullAge.substring(0, fullAge.length - 2),
            userNations: fullNations.substring(0, fullNations.length - 2)
        })
    })
})

app.get("/read", (req, res) => {
    res.render("read")
})

app.post("/read", (req, res) => {
    /*Person.find({name: req.body.name, age: {$gt: req.body.age}}, function(err, response) {
        //let person = res.json(response)
        console.log("Workes")
        res.render("data", {
            userData: response
        })
    })*/
    Person.find({name: req.body.name, age: {$gt: req.body.age}},function(err, response) {
        //let person = res.json(response)
        let fullData = "";
        let fullAge = "";
        let fullNations = "";
       for (let i = 0; i < response.length; i++) {
            fullData += "#" + Number(i + 1) + ": "
            fullData += response[i]["name"];
            fullData += ", "
            fullAge += "#" + Number(i + 1) + ": "
            fullAge += response[i]["age"]
            fullAge += ", "
            fullNations += "#" + Number(i + 1) + ": "
            fullNations += response[i]["nationality"]
            fullNations += ", "
       }
        res.render("data", {
            userData: fullData.substring(0, fullData.length - 2),
            userAge: fullAge.substring(0, fullAge.length - 2),
            userNations: fullNations.substring(0, fullNations.length - 2)
        })
    })
})

app.get("/update", (req, res) => {
    res.render("update")
})

app.post("/update", (req, res) => {
    Person.findOneAndUpdate({name: req.body.name}, {name: req.body.newName, age: req.body.age, nationality: req.body.country},
    function(err, response) {
        res.render("routes")
    }
    )
})

app.get("/delete/", (req, res) => {
    res.render("delete")
})

app.post("/delete", (req, res) => {
    Person.findOneAndDelete({name: req.body.name}, function(err, response) {
        res.render("routes")
    })
})

app.listen(3000, req => {
    console.log("Running at port localhost:3000")
})
