var express = require("express");
var router = express.Router();

const Course = require('../models/course')

router.get("/", function(req, res, next) {
res.send("API is working properly");
});


router.post("/course", async function (req, res){
    const route = req.body.route
    try {
        var newCourse = new Course({
            date: route.date,
            geoJson: route.geoJson
        });
        console.log(newCourse);
        await newCourse.save();
        res.status(200).send();
    } catch (e) {
        res.status(500).send(e);
    }
});


router.get("/course", async function (req, res){
    try{
    const result= await Course.find({})
    res.status(200).send(result)
    }
    catch(e){
        res.status(500).send(e)
    }
});

module.exports = router;