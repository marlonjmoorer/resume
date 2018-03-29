const express = require('express');
const exphbs  = require('express-handlebars');
const fs = require('fs');
const port=process.env.PORT||3000
const app = express();

const hbs=exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main'
})
const openResume=()=>new Promise((resolve,reject)=>{
    fs.readFile("resume.json",(err,data)=>{
        if(err){reject(err)}
        else{resolve(JSON.parse(data))}
    })
}) 
app.engine(".hbs",hbs.engine)
app.set('view engine', '.hbs');
app.use(express.static(__dirname))


app.get('/', function (req, res) {
    openResume().then(content=>{
        res.render('home',content);
    }).catch(err=>{
        res.status(404).send("Error in reading the json file")
    })
});
app.get('/json', function (req, res) {
   openResume().then(content=>{
        res.send(content); 
    }).catch(err=>{
        res.status(404).send("Error in reading the json file")
    }) 
});
app.get("/get/:key",(req,res)=>{
    openResume().then(content=>{
         res.send(content[req.params.key]);
    }).catch(err=>res.status(404).send("Oops"))
})
app.listen(port,()=>console.log('Ready , port : '+port));