const express =require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const exp = require("constants");
const port = 3000;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));


mongoose.connect("mongodb://localhost:27017/userDB",
{
 useNewUrlParser : true,
 useFindAndModify : false,
 useUnifiedTopology: true,
 useCreateIndex :true
},(err) => {
    if(!err){
        console.log("connected succesfully");
    }
    else{
        console.log(err);
    }
});

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        unique : true,
        require : true
    },
    password : {
        type : String,
        require  : true
    }
});


const User = new mongoose.model("User",userSchema); 


app.get("/",(req,res) => {
    res.render("home");
})

app.get("/register",(req,res) => {
    res.render("register");
});

app.post("/register",(req,res) => {
    bcrypt.hash(req.body.password,saltRounds,(err,hash) => {
        
        const user = new User({
            email : req.body.username,
            password : hash
        });
     
        user.save( (err) => {
            if(!err){
                res.render("secrets");
            }else{
                console.log("something went wrong");
            }
        });
    })
   
});

app.get("/login",(req,res) => {
    res.render("login");
});

app.post("/login",(req,res) => {
    const username = req.body.username;
   const password = req.body.password;

   User.findOne({email : username},function(err,result) {
       if(!err){
           if(result){
               bcrypt.compare(password,result.password,(err,hashResult) =>{
                   if(hashResult === true){
                       res.render("secrets");
                   }
               })
           }
       }else{
           console.log(err);
       }
   });
});

app.listen(port , () => {
    console.log(`surver is running on port ${port}`)
})