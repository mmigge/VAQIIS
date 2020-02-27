var express = require("express");
var router = express.Router();

const Course = require('../models/course')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });



router.post("/course", async function (req, res){
    try {
        const route = req.body.route
        var newCourse = new Course({
            date: route.date,
            geoJson: route.geoJson
        });
        console.log(newCourse);
        await newCourse.save();
        res.status(200).send();
    } catch (e) {
        console.log(e)
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