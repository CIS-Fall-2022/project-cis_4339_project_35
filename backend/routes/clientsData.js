const express = require("express"); 
const router = express.Router(); 

//importing data model schemas
let { clientdata } = require("../models/models"); 
let { eventdata } = require("../models/models"); 

//GET all client entries
router.get("/", (req, res, next) => { 
    clientdata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET a single client entry by ID
router.get("/id/:id", (req, res, next) => {
    clientdata.find( 
        { _id: req.params.id }, 
        (error, data) => {
            if (error) {
                return next(error);
            } else if(Object.keys(data).length === 0){
                res.status(404).send("Could not find client(s) information with that ID!");
                console.log("Could not find client(s) information with that ID!");
            } else {
                res.json(data);
            }
        }
    );
});

//GET API to retrieve client entries based on search query
//Ex: '...?firstName=Bob&lastName=&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { firstName: { $regex: `^${req.query["firstName"]}`, $options: "i" }, lastName: { $regex: `^${req.query["lastName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'number') {
        dbQuery = {
            "phoneNumbers.primaryPhone": { $regex: `^${req.query["phoneNumbers.primaryPhone"]}`, $options: "i" }
        }
    };
    clientdata.find( 
        dbQuery, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET events for a single client
router.get("/events/:id", (req, res, next) => { 
    eventdata.find(
        {attendees: req.params.id },
        (error, data) => {
            if (error) {
                return next(error);
            } else if(Object.keys(data).length === 0){
                res.status(404).send("Could not find client(s) information with that ID!");
                console.log("Could not find client(s) information with that ID!");
            } else {
                res.json(data);
            }
        }
    );
});

//POST API to create a new client
router.post("/", (req, res, next) => { 
    clientdata.create( 
        req.body,
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data); 
            }
        }
    );
    clientdata.createdAt;
    clientdata.updatedAt;
    clientdata.createdAt instanceof Date;
});

//PUT API to update a client 
router.put("/:id", (req, res, next) => { 
    clientdata.findOneAndUpdate( 
        { _id: req.params.id }, 
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else if(data === null){ // error handler response to not finding an ID
                res.status(404).send("Could not find client(s) information with that ID!");
                console.log("Could not find client(s) information with that ID!"); 
            } else {
                res.json(data);
            }
        }
    );
});

//DELETE API to remove a client 
router.delete("/:id",(req, res, next) => {
    clientdata.findOneAndRemove(
        { _id: req.params.id },
        req.body,
        (error) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Successfully removed the client!");
            }
        }
    ),
    eventdata.updateMany(
        {"attendees": req.params.id},
        {$pull: {attendees: req.params.id}},
        req.body,
        (error) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Successfully removed the client!");
            }
        }
    );
});

module.exports = router;
