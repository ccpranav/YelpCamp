const mongoose = require('mongoose');
const Campground = require('./models/camprground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Mongo Connection Open");
}).catch(err => {
    console.log("Mongo Connection Error", err);
});

const cleanReviews = async () => {
    await Campground.updateMany({}, { $set: { reviews: [] } });
    console.log("Removed null reviews!");
    mongoose.connection.close();
};

cleanReviews();
