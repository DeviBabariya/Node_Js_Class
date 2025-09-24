const express = require('express');
const port = 8007;
const path = require('path')
const fs = require('fs')

const app = express();
const dbConnection = require('./config/dbConnection');
const userModel = require('./model/user.model');
const uploads = require('./middleware/uploadImage');
const { profile } = require('console');

app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use("/uploads", express.static('uploads'));

app.get('/', async (req, res) => {
    let users = await userModel.find();
    return res.render('index',{users});
});

app.post('/add-user', uploads.single('profile'), async (req, res) => {
    let imagePath = "";
    if(req.file){
        imagePath =  `/uploads/${req.file.filename}`
    }
    let user = await userModel.create({...req.body, profile: imagePath});
    return res.redirect("/");
})


app.get('/delete-user/:id', async (req, res) => {
    let id = req.params.id;
    let user = await userModel.findById(id);
    if(!user){
        console.log("User not found");
        return res.redirect('/');
    }
    if(user.profile != ""){
        try{
            let imagePath = path.join(__dirname, user.profile);
            await fs.unlinkSync(imagePath) 
        } catch (error){
            console.log("Missing File");
        }
    }
    await userModel.findByIdAndDelete(id);
    console.log("User deleted successfully");
    return res.redirect('/');
})

app.get('/edit-user/:id', async (req, res) => {
    let id = req.params.id;
    let user = await userModel.findById(id);
    if(!user){
        console.log("User not found");
        return res.redirect('/');
    }
    return res.render('edit-user', {user});
})

app.post('/update-user/:id',uploads.single('profile'), async (req, res) => {
    let id = req.params.id;
    let user = await userModel.findById(id);
    if(!user){
        console.log("User not found");
        return res.redirect('/');
    }
    let imagePath;
    if(req.file){
        if(user.profile != ""){
            try{
            imagePath = path.join(__dirname, user.profile);
            await fs.unlinkSync(imagePath) 
        } catch (error){
            console.log("Missing File");
        }
        }
        imagePath = `/uploads/${req.file.filename}`;
    } else{
        imagePath = user.profile;
    }
    user = await userModel.findByIdAndUpdate(id,{...req.body, profile:imagePath}, {new: true});
    console.log("User updated successfully");
    return res.redirect('/');
})

app.listen(port,() => {
    dbConnection();
    console.log(`Server started at http://localhost:${port}`);
})