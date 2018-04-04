const express = require('express');
const mongoose = require('mongoose');

require('./db');
const session = require('express-session');
const path = require('path');

const app = express();

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'add session secret here!',
    resave: false,
    saveUninitialized: true,
}));

// Homepage
app.get('/', (req, res) => {
});

// View Recipes
app.get('/recipes', (req, res) => {
});

// View Grocery Items
app.get('/items', (req, res) => {
});

// View Specific Recipe
app.get('/recipes/:slug', (req, res) => {
});

// View Specific Grocery Item
app.get('/items/:slug', (req, res) => {
});

// Create
app.get('/create', (req, res) => {
});

// Create a Recipe (send form)
app.get('/create/recipe', (req, res) => {
});

// Create a Grocery Item (send form)
app.get('/create/item', (req, res) => {
});

// Create a Recipe (receive form)
app.post('/create/recipe', (req, res) => {
});

// Create a Grocery Item (receive form)
app.post('/create/item', (req, res) => {
});

// Creation Success
app.get('/create/success', (req, res) => {
});

// Creation Failure
app.get('/create/failure', (req, res) => {
});

app.listen(3000);