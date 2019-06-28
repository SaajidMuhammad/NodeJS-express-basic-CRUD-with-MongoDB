const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// middlewears
app.use(bodyParser.json());


// connecting to Database
const monk = require('monk');
const db = monk('localhost/my_test_db');

// checking db Connection
db.then(() => {
    console.log('connected succesfully')
});


// selecting database table
const players = db.get('players');


// inserting to database
app.post('/players', (req, res) => { 
    players.insert([
        {   name:"Test1", 
            country:"India"
        }, 
        {   name:"Test2", 
            country:"USA"
        }, 
        {   name:"Test3",  
            country:"Germany"
        }
    ])
    .then((docs) => {
        res.status(200).json(docs);
    }).catch((err) => {
        console.log(err)
        res.status(500).json({
            message: "error in finding"
        })

    }).then(() => db.close())
});


// get all players
app.get('/players', (req, res) => {
    players.find({})
    .then((docs) => {
        // res.json(docs);
        if(docs !== null) {
            res.json({
                error : false,
                data: docs
            })
        }
        else{
            res.status(404).json({
                error : true,
                message : "data data found"
            })
        }
    }).catch(e => {
        res.status(500).json({
            message: "error in finding"
        })
    })
});


// get user by id
app.get('/players/:id', (req, res) => {
    players.findOne({_id: req.params.id})
    .then((docs) => {
        if (docs !== null) {
            res.json({
                error: false,
                data: docs
            });
        } else {
            res.status(404).json({
                error: true,
                message: "no data found for this id"
            })
        }
    }).catch(e => {
        res.status(500).json({
            message: "error in finding"
        })
    })
});


// update user by id
app.put('/players/:id', (req, res) => {
    players.findOneAndUpdate({_id: `${req.params.id}`},
     { 
         $set: { name: 'New Name'} })
     .then((updatedDoc) => {
         if(updatedDoc !== null){
             res.json({
                 error: false,
                 updatedId: `${req.params.id}`,
                 data: updatedDoc
             })
         } else {
             res.status(404).json({
                 error: true,
                 message: "you have enterd invalid id " 
             })
         }
        
     }).catch( e=> {
        res.status(500).json({
            message: "error in finding or update"
        })    
    })
});



// delete user by id
app.delete('/players/:id', (req, res) => {
    players.findOneAndDelete({_id: `${req.params.id}`})
    .then((doc) => {
        if( doc !== null){
            res.json({
                error: false,
                deletedId: `${req.params.id}`,
                data : doc
            })
        } else {
            res.status(404).json({
                error : true,
                message : "Selected id not found"
            })
        }
        
    }).catch( e=> {
        res.status(500).json({
            message: "error in finding or deleting"
        })
    })
});



// start server
app.listen(3000, (err) => {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log("server running in 3000")
});