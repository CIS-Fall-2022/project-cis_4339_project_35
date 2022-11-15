const express = require("express");
const router = express.Router();
//importing data model schemas
let { organdata } = require("../models/models"); 
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
module.exports = router;
