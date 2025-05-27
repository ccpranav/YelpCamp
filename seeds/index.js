const mongoose = require('mongoose');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

const Campground = require('../models/camprground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database Connected")
})
const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const Random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '68248c4cb83674dc04c68333',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[Random1000].city}, ${cities[Random1000].state}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. A rem, sequi ut eum assumenda suscipit est repellat? Totam,
            necessitatibus nesciunt eveniet consequatur dolorum aliquam facere beatae laboriosam quod, temporibus veritatis!`,
            price: price
        })
        await camp.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})