const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// Add your schemas
const RecipeSchema = new mongoose.Schema({
    name: String,
    servings: Number,
    ingredients: [],
    price: Number,
    cals: Number,
    carbs: Number,
    fat: Number,
    protein: Number
});

const ItemSchema = new mongoose.Schema({
    category: String,
    brand: String,
    name: String,
    weight: Number,
    price: Number,
    cals: Number,
    carbs: Number,
    fat: Number,
    protein: Number
});

// Use plugins (for slug)
RecipeSchema.plugin(URLSlugs("title"));
ItemSchema.plugin(URLSlugs("title"));

// Register your model
mongoose.model("Recipe", RecipeSchema);
mongoose.model("Item", ItemSchema);

// Connect MongoDB (locally, temporarily)
mongoose.connect('mongodb://localhost/prepaware');