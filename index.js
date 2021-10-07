const express = require('express');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();
const port = 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w6tui.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("cse10").collection("friendsData");
  //friends data Read
  app.get('/students', (req, res) => {
    collection.find({}).sort({"name": 1})
   .toArray((err, documents) => {
     res.send(documents);
   })
 })
  //add friends
  app.post("/addFriend", (req, res) => {
    const friendsData = req.body;
    collection.insertOne(friendsData)
    .then(result => {
      res.redirect('https://cse10-pust.web.app/');
    })
  })
  //update student data
  app.get('/singleStudent/:id', (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      res.send(documents[0]);
    })
  })
   app.patch('/update/:id', (req, res) => {
        collection.updateOne({ _id: ObjectId(req.params.id)}, 
        {
            $set: {name: req.body.name, email: req.body.email, about: req.body.about}
        })
        .then(result =>{
            // console.log(result);
            res.send(result.modifiedCount > 0);
        })
    })

  //delete a student
  app.delete('/delete/:id', (req, res) => {
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  })
});

app.get('/', (req, res) => {
    res.send('Hello, I am Working...');
})

app.listen(process.env.PORT || port)