const express = require('express');
const mongoose = require('mongoose');

const db = require('./db');

const readData = require("./readData");

const GroceryItem = mongoose.model("Grocery_Item");
const Recipe = mongoose.model("Recipe");
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

    Recipe.find({}, function(err, recipes) {

        /*Object.keys(req.query).forEach(function(key) {
            recipes = readData.filterDocuments(recipes, key, req.query[key]);
        });*/

        if (recipes.length !== 0) {

            /*recipes = readData.getPerServingNutrition(recipes);*/

            res.render("recipes-view.hbs", {
                "recipes": recipes
            });

        } else {
            res.render("recipes-view.hbs", {
                "grocery_items": recipes,
                "message": "Sorry, no recipes meeting those specifications currently exists."
            });
        }

    });


    /*res.render("recipes-view.hbs", {
    });*/
});

// View Grocery Items
app.get('/items', (req, res) => {

    GroceryItem.find({}, function(err, grocery_items) {

        Object.keys(req.query).forEach(function(key) {
            grocery_items = readData.filterDocuments(grocery_items, key, req.query[key]);
        });

        if (grocery_items.length !== 0) {

            grocery_items = readData.getPerServingNutrition(grocery_items);

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
        grocery_item = readData.getPerServingNutrition(grocery_item);
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
    const totalNutrition = {
        weight: 0,
        price: 0,
        cals: 0,
        carbs: 0,
        fat: 0,
        protein: 0
    };

    // Maintain previously given ingredients
    if (req.body.price !== undefined) {

        //One ingredient previously given
        if (typeof(req.body.name) === "string") {
            totalNutrition.weight += +req.body.weight;
            totalNutrition.price += +req.body.price;
            totalNutrition.cals += +req.body.cals;
            totalNutrition.carbs += +req.body.carbs;
            totalNutrition.fat += +req.body.fat;
            totalNutrition.protein += +req.body.protein;
            ingredients.push({
                "name": req.body.name.trim(),
                "weight": req.body.weight,
                "price": req.body.price,
                "cals": req.body.cals,
                "carbs": req.body.carbs,
                "fat": req.body.fat,
                "protein": req.body.protein,
                "slug": req.body.slug
            });
        // Multiple ingredients previously given
        } else {
            for (let i = 0; i < req.body.name.length; i++) {
                totalNutrition.weight += +req.body.weight[i];
                totalNutrition.price += +req.body.price[i];
                totalNutrition.cals += +req.body.cals[i];
                totalNutrition.carbs += +req.body.carbs[i];
                totalNutrition.fat += +req.body.fat[i];
                totalNutrition.protein += +req.body.protein[i];
                ingredients.push({
                    "name": req.body.name[i].trim(),
                    "weight": req.body.weight[i],
                    "price": req.body.price[i],
                    "cals": req.body.cals[i],
                    "carbs": req.body.carbs[i],
                    "fat": req.body.fat[i],
                    "protein": req.body.protein[i],
                    "slug": req.body.slug[i]
                });
            }
        }
    }

    // RECIPE SUBMISSION
        if (req.body.add === "recipe") {

            if (ingredients.length === 0) {
                res.redirect("/create/failure");
            } else {

                new Recipe({
                    name: req.body.recipe_name,
                    servings: req.body.recipe_servings,
                    ingredients: ingredients,
                    price: totalNutrition.price,
                    cals: totalNutrition.cals,
                    carbs: totalNutrition.carbs,
                    fat: totalNutrition.fat,
                    protein: totalNutrition.protein
                }).save(function(err, newItem) {
                    if (err) {
                        res.redirect("/create/failure");
                    } else {
                        res.redirect("/create/success");
                    }
                });

            }

    // INGREDIENT ADDITION TO RECIPE
        } else if (req.body.add === "ingredient") {

            // Add ingredient to current recipe (if valid)
            if (req.body.newItem_ID === "" && req.body.newItem_weight === "") {
                res.render("recipes-add", {
                    "ingredients": ingredients,
                    "error": "INGREDIENT INFORMATION NOT GIVEN",
                    "total": totalNutrition
                });
            } else if (req.body.newItem_ID === "") {
                res.render("recipes-add", {
                    "ingredients": ingredients,
                    "error": "ITEM ID NOT GIVEN",
                    "total": totalNutrition
                });
            } else if (req.body.newItem_weight === "") {
                res.render("recipes-add", {
                    "ingredients": ingredients,
                    "error": "ITEM AMOUNT NOT GIVEN",
                    "total": totalNutrition
                });
            } else {
                GroceryItem.find({"itemID": req.body.newItem_ID}, function(err, grocery_items) {
                    if (grocery_items.length === 0) {
                        res.render("recipes-add", {
                            "ingredients": ingredients,
                            "error": "NO ITEM FOUND WITH GIVEN ID",
                            "total": totalNutrition
                        });
                    } else {
                        let grocery_item = grocery_items[0];
                        grocery_item = readData.getScaledNutrition(grocery_item, req.body.newItem_weight);
                        ingredients.push(grocery_item);

                        totalNutrition.weight += +grocery_item.weight;
                        totalNutrition.price += +grocery_item.price;
                        totalNutrition.cals += +grocery_item.cals;
                        totalNutrition.carbs += +grocery_item.carbs;
                        totalNutrition.fat += +grocery_item.fat;
                        totalNutrition.protein += +grocery_item.protein;

                        res.render("recipes-add", {
                            "ingredients": ingredients,
                            "total": totalNutrition
                        });
                    }
                });
            }
        }
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
            name: req.body.name.trim(),
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