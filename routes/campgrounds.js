const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/camprground');
const { campgroundSchema } = require('../schemas.js')
const { isLoggedIn } = require('../middleware.js');
// const { isAuthor } = require('../middleware.js');
const { validateCampground } = require('../middleware.js')
const { isAuthor } = require('../middleware.js');

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id // or currentUser._id
    await camp.save();
    req.flash('success', 'Successfully created a new camp');
    res.redirect(`/campgrounds/${camp._id}`)

}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    if (!camp) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { camp })
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('author').populate({
        path:'reviews',
        populate:{
            path:'author'
        }});//populate the author of the campground and populate the author of the reviews;
    if (!camp) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    // res.render('campgrounds/show', { camp,msg:req.flash('success') })//either like this flash
    res.render('campgrounds/show', { camp })
}))

router.put('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    req.flash('success', 'Successfully updated camp');
    res.redirect(`/campgrounds/${camp._id}`)
}))
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted camp');
    res.redirect('/campgrounds')
}))

module.exports = router;