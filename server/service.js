'use strict';

const express = require('express');
const service = express();
const config = require('../config');
const request = require('superagent')
const moment = require('moment');

service.get('/service/:location', (req, res, next) => {

    request.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.params.location}&key=${config.geoCodingGoogleKey}`, (err, response) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        //res.json(response.body.results[0].geometry.location);
        const location = response.body.results[0].geometry.location;

        request.get(`http://api.openweathermap.org/data/2.5/weather?units=metric&lat=${location.lat}&lon=${location.lng}&APPID=${config.openWeatherKey}`, (err, response) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }

            const result = response.body;
            const tempCelsius = result.main.temp;
            const weatherString = result.weather[0].main.toLowerCase() + " with " + tempCelsius.toFixed(1) + " degrees celsius";  

            res.json({result: weatherString});
        });

    });

});

module.exports = service;