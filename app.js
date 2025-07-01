const express = require("express");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/contactDance', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB successfully!");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 8000;

// Define mongoose Schema
var contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    desc: String
});

var Contact = mongoose.model('Contact', contactSchema);

//EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')); //For serving static files
// app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// PUG SPECIFIC STUFF
app.set('view engine', 'pug');//Set the template engine as pug
app.set('views', path.join(__dirname, 'views'));//Set the views directory

// ENDPOINTS
app.get('/', (req, res)=>{
    const params = {}
    res.status(200).render('home.pug', params);
});

// About page
app.get('/about', (req, res) => {
    res.render('about.pug');
});

// Services page
app.get('/services', (req, res) => {
    res.render('services.pug');
});

// Class Info page
app.get('/classinfo', (req, res) => {
    res.render('classinfo.pug');
});

app.get('/contact', (req, res)=>{
    const params = {}
    res.status(200).render('contact.pug', params);
});

app.post('/contact', (req, res) => {
    console.log("Received data:", req.body);  // Debugging line
    var myData = new Contact(req.body);
    
    myData.save()
        .then(() => res.send("This item has been saved to the database"))
        .catch((err) => {
            console.error("Error saving data:", err);
            res.status(400).send("Item was not saved to the database");
        });
});


// START THE SERVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});