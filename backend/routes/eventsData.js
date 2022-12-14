const express = require("express");
const { now } = require("mongoose");
const router = express.Router();

//importing data model schemas
let { eventdata } = require("../models/models"); 

//GET all event entries 
router.get("/", (req, res, next) => { 
    eventdata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single event entry by ID
router.get("/id/:id", (req, res, next) => { 
    eventdata.find({ _id: req.params.id }, (error, data) => {
        if (error) {
            return next(error)
        } else if(Object.keys(data).length === 0){
            res.status(404).send("Could not find event(s) information with that ID!");
            console.log("Could not find event(s) information with that ID!");
        } else {
            res.json(data)
        }
    })
});

//GET event entries based on search query
//Ex: '...?eventName=Food&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" } }
    } else if (req.query["searchBy"] === 'date') {
        dbQuery = {
            date:  req.query["eventDate"]
        }
    };
    eventdata.find( 
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

//GET events for which a client is signed up
router.get("/client/:id", (req, res, next) => { 
    eventdata.find( 
        { attendees: req.params.id }, 
        (error, data) => { 
            if (error) {
                
                return next(error);
            } else if(Object.keys(data).length === 0){
                res.status(404).send("Could not find event(s) information for that client!");
                //console.log("Could not find event(s) information for that client!")
            } else {
                res.json(data);
            }
        }
    );
});

// GET aggregated list of events in the last two months and the counts of their attendees array
router.get("/dash/", (req, res, next) => {
    // Adds a 0 to a one digit number
    // https://electrictoolbox.com/pad-number-two-digits-javascript/
    function td (number){
        return (number < 10? '0': '') + number
    }
    // turning current date in to a string
    let currentDate = new Date();
    let cDay = currentDate.getDate();
    let pMonth = currentDate.getMonth() -2; // Supposed to be +1 but need to -3 to get 2 months
    let cMonth = currentDate.getMonth() +1;
    let cYear = currentDate.getFullYear();
    let pDate = cYear+"-"+pMonth+"-"+td(cDay);
    let cDate = cYear+"-"+cMonth+"-"+td(cDay);
    eventdata.aggregate([
        {
            $match:{$and:[{date:{$gte:new Date(pDate)}},{date:{$lte: new Date(cDate)}}]}
        },{
            $project:{
                _id: 0, // Removes id property
                eventName: 1, // Adds eventName property
                // Adds attendess count
                numberOfAttendees:{$cond:{if:{$isArray:"$attendees"},then:{$size:"$attendees"}, else:"NA"}}
            }
        }
    ],(error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data);
        }
    }
    );
});

//POST API to create a new event
router.post("/", (req, res, next) => { 
    eventdata.create( 
        req.body, 
        (error, data) => { 
            if (error) {

                console.log("Unable to add event.");
                res.status(500).send("Unable to add event.");
            } else {
                res.json(data);
            }
        }
    );
});

//PUT API to update an existing event
router.put("/:id", (req, res, next) => {
    eventdata.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        (error, data) => {
            if (error) {
                console.log(error);
                return next(error);
            } else if (data === null){
                res.status(404).send("Could not find event with that ID!");
                console.log("Could not find event with that ID!");
            } else {
                res.json(data);
            }
        }
    );
});

//PUT add attendee to event
router.put("/addAttendee/:id", (req, res, next) => {
    //only add attendee if not yet signed up
    eventdata.find( 
        { _id: req.params.id, attendees: req.body.attendee }, 
        (error, data) => { 
            if (error) {  
                return next(error);             
            } else {
                if (data.length == 0) {
                    eventdata.updateOne(
                        { _id: req.params.id }, 
                        { $push: { attendees: req.body.attendee } },
                        (error, data) => {
                            if (error) {
                                console.log(error);
                                return next(error);
                            } else {  
                                res.json(data);
                            }
                        }
                    );
                }
                 // error handling for when a client is already signed up for the selected event
                else {
                    res.status(500).send("Client is already signed up for that event!");
                    console.log("Client is already signed up for that event!");
                }

            }
        }
    );
    
});

//DELETE an event
router.delete("/:id", (req, res, next) =>{
    eventdata.findOneAndRemove(
        {_id: req.params.id},
        req.body,
        (error, data) => {
            if (error) {            
                return next(error);
            } else if (data === null){
                res.status(404).send("Could not find event with that ID!");
                console.log("Could not find event with that ID!");
            } else { 
                res.json(data);
            }
        }
    );
});

module.exports = router;
