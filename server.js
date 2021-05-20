const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes= express.Router();
const PORT = 4000;
const bodyparser = require('body-parser') 
const path = require('path') 
let Todo= require('./Prodcuts');
let user= require('./user.model');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');


app.use(cors());
app.use(bodyParser.json());


app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'ejs') 
mongoose.connect('mongodb+srv://admin:admin@cluster0.9fegk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true });
const connection = mongoose.connection;

const Publishable_Key="pk_test_51IsxYuDUkLoBY2UF4BmLptJiVivSwXPJNSBtSSeOw1Ju8K5OQiEm216A0NSr9WCR94O5CnDkfDIcsYrJJW6dLtiL00YWrsZTRY";
const Secret_Key="sk_test_51IsxYuDUkLoBY2UFxnnhDUW2mtGJSYLFdZyuhKwMaYkYTIjcudx0Okh9BPocfuUSaJjPwyidoBiqIDwZRDv6iZtl00TE10PWZa";
const stripe = require('stripe')(Secret_Key) 
app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json())

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'devassliit@gmail.com',
      pass: 'Devas123456*'
    }
  });
  transporter.set('views', path.join(__dirname, 'views')) 
  transporter.set('view engine', 'ejs') 
  

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.get('/makepayment', function(req, res){ 
    res.render('Home', { 
    key: Publishable_Key 
    }) 
}) 

app.post('/paywithcash', function(req, res){ 
    res.redirect("http://localhost:3000/paywithcash");
}) 
app.post('/payment', function(req, res){ 
    var mailOptions = {
        from: 'devassliit@gmail.com',
        to: req.body.stripeEmail,
        subject: 'Payment Sucessfull',
        text: 'Payment Has Been Sucessfully Made. Thank you for shopping !!',
        
      };

    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
    stripe.customers.create({ 
        email: req.body.stripeEmail, 
        source: req.body.stripeToken, 
        name: 'Gautam Sharma', 
        address: { 
            line1: 'TC 9/4 Old MES colony', 
            postal_code: '110092', 
            city: 'New Delhi', 
            state: 'Delhi', 
            country: 'India', 
        } 
    }) 
    .then((customer) => { 

        return stripe.charges.create({ 
            amount: 7000,    // Charing Rs 25 
            description: 'Web Development Product', 
            currency: 'USD', 
            customer: customer.id 
        }); 
    }) 
    .then((charge) => { 
       
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
       res.redirect("http://localhost:3000/product") // If no error occurs 
    }) 
    .catch((err) => { 
        res.send(err)    // If some error occurs 
    }); 
}) 

todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});



todoRoutes.route('/:id').get(function(req, res) {
    console.log("hiii")
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        if(err){
            console.log("errr")
        }else{
           
            res.json(todo);
        }
    });
}); 
todoRoutes.route('/add').post(function(req, res) {
    let Products = new Todo(req.body);
    Products.save()
        .then(Products => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});


todoRoutes.route('/addUser').post(function(req, res) {
    let User = new user(req.body);
    User.save()
        .then(User => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});


todoRoutes.route('/update/:id').post(function(req, res) {
    console.log("Inside Update")
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route('/deleteproduct/:id').delete(function(req, res) {
    console.log("Inside Delete")
    Todo.removeById(req.params.id,function(err,todo){
        if(!err){
            console.log("done");
        }else{
            console.log("Error");
        }

    });
});


todoRoutes.route('/Addshipment').post(function(req, res) {
    console.log(req.body);
    const fetch = require('node-fetch');

   
const url = 'https://api.easyship.com/v2/shipments';
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer prod_7hJTnGoLACc6O1wk1mpek4G1riniZaBAOztryWAnUy4='
  },
  body: JSON.stringify(req.body)
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err)); 
});


app.use('/todos', todoRoutes);
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});