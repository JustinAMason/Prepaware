const express = require('express');
const mongoose = require('mongoose');

require('./db');

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

        Object.keys(req.query).forEach(function(key) {
            recipes = readData.filterDocuments(recipes, key, req.query[key]);
        });

        const numRecipes = recipes.reduce(function(numRecipes) {
            return(numRecipes + 1);
        },0);

        if (recipes.length !== 0) {

            recipes = readData.getPerServingNutrition(recipes);

            res.render("recipes-view.hbs", {
                "recipes": recipes,
                "numRecipes": numRecipes
            });

        } else {
            res.render("recipes-view.hbs", {
                "grocery_items": recipes,
                "message": "Sorry, no recipes meeting those specifications currently exists."
            });
        }

    });

});

// View Grocery Items
app.get('/items', (req, res) => {

    GroceryItem.find({}, function(err, groceryItems) {

        Object.keys(req.query).forEach(function(key) {
            groceryItems = readData.filterDocuments(groceryItems, key, req.query[key]);
        });

        const numItems = groceryItems.reduce(function(numItems) {
            return(numItems + 1);
        },0);

        if (groceryItems.length !== 0) {

            groceryItems = readData.getPerServingNutrition(groceryItems);

            res.render("items-view.hbs", {
                "grocery_items": groceryItems,
                "numItems": numItems
            });
        } else {
            res.render("items-view.hbs", {
                "grocery_items": groceryItems,
                "message": "Sorry, no grocery item meeting those specifications currently exists."
            });
        }

    });

});

// View Specific Recipe
app.get('/recipes/:slug', (req, res) => {
    Recipe.find({"slug": req.params.slug}, function(err, recipe) {
        recipe = readData.getPerServingNutrition(recipe);
        res.render("recipe-view.hbs", {
            "recipe": recipe[0],
            "serving_price": (recipe[0].price / recipe[0].servings).toPrecision(2)
        });
    });
});

// View Specific Grocery Item
app.get('/items/:slug', (req, res) => {
    GroceryItem.find({"slug": req.params.slug}, function(err, groceryItem) {
        groceryItem = readData.getPerServingNutrition(groceryItem);
        res.render("item-view.hbs", {"grocery_item": groceryItem[0]});

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
                "displayPrice": ("" + req.body.price),
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
            } else if (req.body.recipe_name === "") {
                res.render("recipes-add", {
                    "ingredients": ingredients,
                    "error": "RECIPE NAME NOT GIVEN",
                    "total": totalNutrition
                });
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
                }).save(function(err) {
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
                GroceryItem.find({"itemID": req.body.newItem_ID}, function(err, groceryItems) {
                    if (groceryItems.length === 0) {
                        res.render("recipes-add", {
                            "ingredients": ingredients,
                            "error": "NO ITEM FOUND WITH GIVEN ID",
                            "total": totalNutrition
                        });
                    } else {
                        let groceryItem = groceryItems[0];
                        groceryItem = readData.getScaledNutrition(groceryItem, req.body.newItem_weight);
                        ingredients.push(groceryItem);

                        totalNutrition.weight += +groceryItem.weight;
                        totalNutrition.price += +groceryItem.price;
                        totalNutrition.cals += +groceryItem.cals;
                        totalNutrition.carbs += +groceryItem.carbs;
                        totalNutrition.fat += +groceryItem.fat;
                        totalNutrition.protein += +groceryItem.protein;

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
            displayPrice: ("" + req.body.price),
            servings: +req.body.servings,
            weight: +req.body.weight * +req.body.servings,
            cals: +req.body.calories * +req.body.servings,
            carbs: +req.body.carbs * +req.body.servings,
            fat: +req.body.fat * +req.body.servings,
            protein: +req.body.protein * +req.body.servings
        }).save(function(err) {
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