const express = require('express');
const port = 8001;

const server = express();

server.set("view engine", "ejs");
server.use(express.urlencoded());

let students = [
    {
        id:"101",
        name:"Jinny",
        email:"jin@test.in",
        course:"Full Stack Developement"
    },
    {
        id:"102",
        name:"Nina",
        email:"nina@test.in",
        course:"UI/UX Designer"
    },
    {
        id:"103",
        name:"Elle",
        email:"elle@test.in",
        course:"Game Developement"
    },
    {
        id:"104",
        name:"Lee",
        email:"lee@test.in",
        course:"Graphics Designer"
    },
]

server.get("/", (req, res) =>{
    res.render("index",{ students})
})

server.get("/add-student", (req, res) =>{
    res.render('addStudent')
})

server.post("/add-student", (req, res) =>{
    students.push(req.body);
    return res.redirect("/")
})

server.get("/delete-student/:id", (req, res) =>{
    let id = req.params.id;
    students = students.filter(std => std.id != id);
    return res.redirect("/");
})

server.get("/edit-student/:id", (req, res) =>{
    let id = req.params.id;
    let record = students.find(std => std.id == id);
    return res.render('editStudent', {record});
})

server.post("/edit-student/:id", (req, res) =>{
    let id = req.params.id; 
    let updateData = students.map(std =>{
        if(std.id == id)
            return{id , ...req.body}
        else
            return std;
    })
    students = updateData
    return res.redirect("/")
})

server.listen(port, () =>{
    console.log(`server start at  http://localhost:${port}`);
})






