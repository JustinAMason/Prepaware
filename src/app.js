const express = require('express');
const mongoose = require('mongoose');

const db = require('./db');
const GroceryItem = mongoose.model("Grocery_Item");
const session = require('express-session');
const path = require('path');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + "/views");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'add session secret here!',
    resave: false,
    saveUninitialized: true,
}));

// Homepage
app.get('/', (req, res) => {
    res.render("index.hbs");
});

// View Recipes
app.get('/recipes', (req, res) => {
    res.render("recipes-view.hbs");
});

// View Grocery Items
app.get('/items', (req, res) => {
    GroceryItem.find({}, function(err, grocery_items) {
        res.render("items-view.hbs", {"grocery_items": grocery_items});
    });

});

// View Specific Recipe
app.get('/recipes/:slug', (req, res) => {
    res.render("recipe-view.hbs");
});

// View Specific Grocery Item
app.get('/items/:slug', (req, res) => {
    res.render("item-view.hbs");
});

// Create
app.get('/create', (req, res) => {
    res.render("create.hbs", {"additionalStylesheet":"/css/create.css"});
});

// Create a Recipe (send form)
app.get('/create/recipe', (req, res) => {
    res.render("recipes-add.hbs");
});

// Create a Grocery Item (send form)
app.get('/create/item', (req, res) => {
    res.render("items-add.hbs");

});

// Create a Recipe (receive form)
app.post('/create/recipe', (req, res) => {
    res.redirect("/");
});

// Create a Grocery Item (receive form)
app.post('/create/item', (req, res) => {

    const GroceryItem = mongoose.model("Grocery_Item");

    if (req.body.category === "" || req.body.brand === "" || req.body.name === "" || req.body.weight === "" || req.body.price === "" || req.body.calories === "" || req.body.carbs === "" || req.body.fat === "" || req.body.protein === "") {
        res.redirect("/create/failure");
    } else {
        new GroceryItem({
            category: req.body.category,
            brand: req.body.brand,
            name: req.body.name,
            weight: +req.body.weight,
            price: +req.body.price,
            cals: +req.body.calories,
            carbs: +req.body.carbs,
            fat: +req.body.fat,
            protein: +req.body.protein
        }).save(function(err, newItem) {
            if (err) {
                res.redirect("/create/failure");
                console.log(err);
            } else {
                res.redirect("/create/success");
            }
        });
    }

});

// Creation Success
app.get('/create/success', (req, res) => {
    res.render("creation-notification.hbs", {"result": "Congratulations!", "description": "Your submission has been accepted and is now available to the community!"});
});

// Creation Failure
app.get('/create/failure', (req, res) => {
    res.render("creation-notification.hbs", {"result": "Sorry,", "description": "Your submission was unable to be accepted. Your submission may have included empty fields or letters where numbers are requested. Please try again."});
});

app.listen(process.env.PORT || 3000);