// Bring-in Modules
const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// Add your schemas
    // Schema for created recipes
    const RecipeSchema = new mongoose.Schema({
        name: String,
        servings: Number, //# of individual servings yielded by the recipe
        ingredients: [], // Array of embedded grocery items
        price: Number,
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
        weight: Number, // Total weight for grocery item (NOT just one serving)
        price: Number,
        cals: Number, // (NOT just one serving)
        carbs: Number, // Measured in grams (NOT just one serving)
        fat: Number, // Measured in grams (NOT just one serving)
        protein: Number // Measured in grams (NOT just one serving)
    });

// Use plugins (for slug)
RecipeSchema.plugin(URLSlugs("title"));
ItemSchema.plugin(URLSlugs("title"));

// Models registration
mongoose.model("Recipe", RecipeSchema);
mongoose.model("Item", ItemSchema);

// MongoDB Connection (locally, temporarily)
mongoose.connect('mongodb://localhost/prepaware');