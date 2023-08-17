const mongoose = require('mongoose');
const model = mongoose.model('trips'); // Use the correct variable name 'model'
mongoose.set('debug', true);

// GET: /trips - lists all trips
const tripsList = async (req, res) => {
    model
        .find({}) // empty filter for all
        .then((trips) => {
            if (!trips || Object.keys(trips).length === 0) {
                return res
                    .status(404)
                    .json({ "message": "trips not found" });
            } else {
                return res
                    .status(200)
                    .json(trips);
            }
        }).catch((err) => {
            if (err) {
                return res.status(404)
            }
        });
};

// GET: /trips/:tripCode - returns a single trip
const tripsFindCode = async (req, res) => {
    console.log('Searching for trip code:', req.params.tripCode);
    model
        .findOne({ 'code': req.params.tripCode })
        .then((trip) => {
            console.log('Found trip:', trip);
            if (!trip) {
                console.log('Trip not found.');
                return res
                    .status(404)
                    .json({ "message": "trip not found" });
            } else {
                console.log('Sending trip data:', trip);
                return res
                    .status(200)
                    .json(trip);
            }
        }).catch((err) => {
            console.error('Error:', err);
            return res
                .status(500) // Internal Server Error
                .json({ "message": "An error occurred" });
        });
};

// POST: creates a single trip
const tripsAddTrip = async (req, res) => {
    model
        .create({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        },
            (err, trip) => {
                if (err) {
                    return res
                        .status(400)  // bad request, invalid content
                        .json(err);
                } else {
                    return res
                        .status(201) // created
                        .json(trip);
                }
            })
}

// PUT: changes a single trip
const tripsUpdateTrip = async (req, res) => {
    console.log(req.body);
    model
        .findOneAndUpdate({ 'code': req.params.tripCode }, {
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        }, { new: true })
        .then(trip => {
            if (!trip) {
                return res
                    .status(404)
                    .send({
                        message: "Trip not found with code " + req.params.tripCode
                    });
            }
            res.send(trip);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res
                    .status(404)
                    .send({
                        message: "Trip not found with code " + req.params.tripCode
                    });
            }
            return res
                .status(500) // server error
                .json(err);
        });
}

module.exports = {
    tripsList,
    tripsFindCode,
    tripsAddTrip,
    tripsUpdateTrip
};
