/**
 * Module dependencies.
 */
var express = require('express');
var logger = require('morgan');
var path = require('path');
var moment = require('moment');
const { query, validationResult } = require('express-validator');

var app = (module.exports = express());

app.use(logger('dev'));

// models
var Event = require('../../models/event');

// middleware
app.set('views', path.resolve(__dirname + '/../views'));
app.set('view engine', 'ejs');

/*
 * Send a new cohort event
 */
app.get(
    '/event',
    [
        query('user_id', 'User id is required')
            .not()
            .isEmpty(),
        query('event', 'Event is required')
            .not()
            .isEmpty(),

        query('user_joined_at', 'User joined date is required')
            .not()
            .isEmpty(),
        query('via', 'Via is required')
            .not()
            .isEmpty(),
    ],
    function(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        var event = new Event();
        event.user_id = req.query.user_id;
        event.user_joined_at = req.query.user_joined_at;
        event.event = req.query.event;
        event.via = req.query.via;
        if (req.query.info) {
            event.info = JSON.parse(req.query.info);
        }

        event.save(function(err) {
            console.log(err);
        });

        //return a 1x1 pixel image to say we saved the event (although this may not be the case as the save is async)
        var imgPath = path.resolve(__dirname + '/../resources/res.png');
        res.sendFile(imgPath);
    }
);

app.get('/data', [query('days', 'Days is required').isInt()], function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    Event.aggregate(
        [
            {
                $match: {
                    user_joined_at: {
                        $gt: moment()
                            .subtract(req.query.days || 7, 'days')
                            .toDate(),
                        $lt: moment().toDate(),
                    },
                },
            },
            {
                $group: {
                    _id: '$event',
                    count: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    count: -1,
                },
            },
        ],
        function(err, result) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(err);
                return;
            }

            if (req.query.format === 'html') {
                res.render('data', {
                    route: app.route,
                    data: JSON.stringify(result),
                });
            } else {
                //by default return results in json format
                res.json(result);
            }
        }
    );
});
