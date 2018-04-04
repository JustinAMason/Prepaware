The content below is an example project proposal / requirements document. Replace the text below the lines marked "__TODO__" with details specific to your project. Remove the "TODO" lines.

# Prepaware

## Overview

Meal Prepping is a very useful process for people attempting to eat well, yet on a budget, and in many cases, get fit. However, the uncertainty about specific nutritional value and monetary value of meals can steer people away from the attempt.

Prepaware  is a web application that will allow users to add ingredients and their prices, create recipes with those ingredients, and receive information on the cost and nutritional value of their meals.

## Data Model

The application will store grocery Items and Recipes.

* Every recipe can contain multiple items (embedded; slightly modified)

An example grocery Item:

```javascript
{
	category: “canned/jarred goods”,
	brand: “Trader Joe’s”,
	name: “Carolina BBQ Sauce”,
	weight: 510, //g or mL
	price: 2.69
	cals: 900,
	carbs: 210,
	fat: 0,
	protein: 0
}

```

An example Recipe with embedded grocery Items:

```javascript
{
	name: “Jerk Chicken”,
	servings: 4,
	ingredients: [
		{ category: “meat”, brand: “Trader Joe’s”, name: “boneless skinless chicken breast”, weight: 908, price: 5.58, cals: 880, carbs: 0, fat: 0, protein: 176},
		{ category: “canned/jarred goods”,  brand: “Grace’s”, name: “hot jerk marinade”, weight: 60, price: 1.32, cals: 0, carbs: 0, fat: 0, protein: 0}
	]
	price: 6.90,
	cals: 880,
	carbs: 0,
	fat: 0,
	protein: 176
}

```


## [Link to Commented First Draft Schema](db.js) 

(___TODO__: create a first draft of your Schemas in db.js and link to it_)

## Wireframes

(___TODO__: wireframes for recipe/item submission forms)

/ - the homepage for Prepaware

![home](documentation/wireframes/home.png)

/[recipes/items] - page for displaying currently existing recipes/grocery items

![recipes_items](documentation/wireframes/view.png)

/create - page for providing the user with an option to create a recipe or add an ingredient

![create](documentation/wireframes/create.png)

/create/[recipe/item]/confirmation - page for notifying the user that the submitted recipe/item has been accepted and added

![confirmation](documentation/wireframes/confirmation.png)

## Site map

![sitemap](documentation/sitemap.png)

## User Stories

1. As a viewer, I want a recipes page so that I can look at the list of recipes posted on the website.
2. As a viewer, I want a grocery items page so that I can look at the list of ingredients posted on the website.
3. As a creator, I want a grocery items page so that I can see what ingredients are available for creating recipes, and determine if I need to add any ingredients.
4. As a creator, I want to be able to create a recipe and contribute to the community.
5. As a creator, I want to be able to add an ingredient in case I want to create a recipe and the website doesn’t already have the ingredient.

## Research Topics

(___TODO__: the research topics that you're planning on working on along with their point values... and the total points of research topics listed_)

* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
    * And account has been made for testing; I'll email you the password
    * see <code>cs.nyu.edu/~jversoza/ait-final/register</code> for register page
    * see <code>cs.nyu.edu/~jversoza/ait-final/login</code> for login page
* (4 points) Perform client side form validation using a JavaScript library
    * see <code>cs.nyu.edu/~jversoza/ait-final/my-form</code>
    * if you put in a number that's greater than 5, an error message will appear in the dom
* (5 points) vue.js
    * used vue.js as the frontend framework; it's a challenging library to learn, so I've assigned it 5 points

10 points total out of 8 required points (___TODO__: addtional points will __not__ count for extra credit_)


## [Link to Initial Main Project File](app.js) 

(___TODO__: create a skeleton Express application with a package.json, app.js, views folder, etc. ... and link to your initial app.js_)

## Annotations / References Used

(___TODO__: list any tutorials/references/etc. that you've based your code off of_)

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. [tutorial on vue.js](https://vuejs.org/v2/guide/) - (add link to source code that was based on this)
