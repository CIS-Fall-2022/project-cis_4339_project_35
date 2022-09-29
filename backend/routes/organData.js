const express = require("express");
const router = express.Router();

//importing data model schemas
let { organdata } = require("../models/models"); 

//GET all entries
router.get("/", (req, res, next) => { 
    organdata.find( 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single entry by ID
router.get("/id/:id", (req, res, next) => {
    organdata.find( 
        { _id: req.params.id }, 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET entries based on search query
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { orgName: { $regex: `^${req.query["orgName"]}`, $options: "i" }}
    } else if (req.query["searchBy"] === 'number') {
        dbQuery = { orgPhone: { $regex: `^${req.query["orgPhone"]}`, $options: "i" }} 
    };
    organdata.find( 
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
    
});

//POST
router.post("/", (req, res, next) => { 
    organdata.create( 
        req.body,
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data); 
            }
        }
    );
    organdata.createdAt;
    organdata.updatedAt;
    organdata.createdAt instanceof Date;
});

//PUT update (make sure req body doesn't have the id)
router.put("/:id", (req, res, next) => { 
    organdata.findOneAndUpdate( 
        { _id: req.params.id }, 
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});



//API to delete an organization
router.delete("/:id", (req, res, next) => {
    console.log(req.params);
    organData.deleteOne({ id: req.params.id }, (error, data) => {
      if (error) {
        console.log(error);
        return next(error);
      } else {
        res.send("deleted from db");
        console.log("deleted from db");
      }
    });
});


module.exports = router;
