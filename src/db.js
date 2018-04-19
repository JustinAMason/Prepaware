// Bring-in Modules
const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const autoIncrement = require("mongoose-auto-increment");

// Configure database
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
    // if we're in PRODUCTION mode, then read the configration from a file
    // use blocking file io to do this...
    const fs = require('fs');
    const path = require('path');
    const fn = path.join(__dirname, 'config.json');
    const data = fs.readFileSync(fn);

    // our configuration file will be in json, so parse it and set the
    // conenction string appropriately!
    const conf = JSON.parse(data);
    dbconf = conf.dbconf;
} else {
    // if we're not in PRODUCTION mode, then use
    dbconf = 'mongodb://localhost/final_project';
}

// Initialize auto-incrementing
autoIncrement.initialize(mongoose.connection);

// Add your schemas

// Schema for created recipes
const RecipeSchema = new mongoose.Schema({
    name: String,
    servings: Number, //# of individual servings yielded by the recipe
    ingredients: [], // Array of embedded grocery items
    price: Number,
    displayPrice: String,
    cals: Number,
    carbs: Number, // Measured in grams
    fat: Number, // Measured in grams
    protein: Number // Measured in grams
});

// Schema for individual grocery items
const ItemSchema = new mongoose.Schema({
    category: String,
    brand: String,
    name: String,
    price: Number,
    displayPrice: String,
    servings: Number,
    weight: Number, // Total weight for grocery item (NOT just one serving)
    cals: Number, // (NOT just one serving)
    carbs: Number, // Measured in grams (NOT just one serving)
    fat: Number, // Measured in grams (NOT just one serving)
    protein: Number // Measured in grams (NOT just one serving)
});

// Use plugins (for slug)
RecipeSchema.plugin(URLSlugs("name"));
ItemSchema.plugin(URLSlugs("name"));

// Use plugins (for auto-increment)
RecipeSchema.plugin(autoIncrement.plugin, {
    model: "name",
    field: "recipeID",
    startAt: 1000,
    incrementBy: 1
});

ItemSchema.plugin(autoIncrement.plugin, {
    model: "name",
    field: "itemID",
    startAt: 1000,
    incrementBy: 1
});

// Models registration
mongoose.model("Recipe", RecipeSchema);
mongoose.model("Grocery_Item", ItemSchema);

// Connect to configured database
mongoose.connect(dbconf);