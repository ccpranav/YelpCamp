const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/camprground');
const Review = require('../models/review')
const { reviewSchema } = require('../schemas.js')
const { validateReview,isLoggedIn,isReviewAuthor } = require('../middleware.js')



router.post('/', isLoggedIn,validateReview, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id;
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete('/:reviewId', isLoggedIn,isReviewAuthor,catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}))
module.exports = router;