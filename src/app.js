const express = require('express');
const mongoose = require('mongoose');

const db = require('./db');

const modifyQuery = require("./readData");

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
    res.render("index.hbs", {
    });
});

// View Recipes
app.get('/recipes', (req, res) => {
    res.render("recipes-view.hbs", {
    });
});

// View Grocery Items
app.get('/items', (req, res) => {

    GroceryItem.find({}, function(err, grocery_items) {

        Object.keys(req.query).forEach(function(key) {
            grocery_items = modifyQuery.filterDocuments(grocery_items, key, req.query[key]);
        });

        if (grocery_items.length !== 0) {

            grocery_items = modifyQuery.getPerServingNutrition(grocery_items);

            res.render("items-view.hbs", {
                "grocery_items": grocery_items
            });
        } else {
            res.render("items-view.hbs", {
                "grocery_items": grocery_items,
                "message": "Sorry, no grocery item meeting those specifications currently exists."
            });
        }

    });

});

// View Specific Recipe
app.get('/recipes/:slug', (req, res) => {
    res.render("recipe-view.hbs");
});

// View Specific Grocery Item
app.get('/items/:slug', (req, res) => {
    GroceryItem.find({"slug": req.params.slug}, function(err, grocery_item) {
        grocery_item = modifyQuery.getPerServingNutrition(grocery_item);
        res.render("item-view.hbs", {"grocery_item": grocery_item[0]});

    });
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

    const ingredients = [];

    console.log(req.body);
    console.log(req.body.price);

    // RECIPE SUBMISSION
        if (req.body.add === "recipe") {

    // INGREDIENT ADDITION TO RECIPE
        } else if (req.body.add === "ingredient") {

            // Add ingredient to current recipe (if valid)
            if (req.body.newItemID === "" && req.body.newItem_weight === "") {
                res.render("recipes-add", {"error": "INGREDIENT INFORMATION NOT GIVEN"});
            } else if (req.body.newItemID === "") {
                res.render("recipes-add", {"error": "ITEM ID NOT GIVEN"});
            } else if (req.body.newItem_weight === "") {
                res.render("recipes-add", {"error": "ITEM AMOUNT NOT GIVEN"});
            } else {
                GroceryItem.find({"itemID": req.body.newItem_ID}, function(err, grocery_items) {
                    if (grocery_items.length === 0) {
                        res.render("recipes-add", {"error": "NO ITEM FOUND WITH GIVEN ID"});
                    } else {
                        let grocery_item = grocery_items[0];
                        grocery_item = modifyQuery.getScaledNutrition(grocery_item, req.body.newItem_weight);
                        ingredients.push(grocery_item);
                        res.render("recipes-add", {"ingredients": ingredients});
                    }
                });
            }
        }

    //res.redirect("/");
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
            price: +req.body.price,
            servings: +req.body.servings,
            weight: +req.body.weight * +req.body.servings,
            cals: +req.body.calories * +req.body.servings,
            carbs: +req.body.carbs * +req.body.servings,
            fat: +req.body.fat * +req.body.servings,
            protein: +req.body.protein * +req.body.servings
        }).save(function(err, newItem) {
            if (err) {
                res.redirect("/create/failure");
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