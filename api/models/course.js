// jshint esversion: 6
// jshint node: true
"use strict";

const mongoose = require('mongoose');

// schema for course
const CourseSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    geoJson: {
        type: mongoose.Mixed,
        required: true
    }
});


module.exports = mongoose.model('Course', CourseSchema);