const express = require('express');
const router = express.Router();

const Place = require('../models/Place');

router.get('/', async (req, res) => {
    const place = await Place.find();
    res.json(place);
});

router.get('/:id', async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.json(place);
});

router.post('/', async (req, res) => {
    const place = new Place(req.body);
    await place.save();
    res.json({
        status : 'Place Saved'
    });
});

router.put('/:id', async (req, res) => {
    await Place.findByIdAndUpdate(req.params.id, req.body);
    res.json({
        status : 'Place Updated'
    });
});

router.delete('/:id', async (req, res) => {
    await Place.findByIdAndDelete(req.params.id);
    res.json({
        status : 'Place Deleted'
    });
});

module.exports = router;