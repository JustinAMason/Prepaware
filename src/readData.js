function filterDocuments(documents, key, value) {
    if (value === "") {
        return(documents);
    } else {
        const filtered = documents.filter(function(document) {
            return(("" + document[key]).toLowerCase() === value.toLowerCase());
        });
        return(filtered);
    }
}

function getPerServingNutrition(documents, type) {
    documents.forEach(function(document) {
        document.price = (document.price / document.servings);
        document.displayPrice = document.price.toFixed(2);
        document.weight = Math.round(document.weight / document.servings);
        document.cals = Math.round(document.cals / document.servings);
        document.carbs = Math.round(document.carbs / document.servings);
        document.fat = Math.round(document.fat / document.servings);
        document.protein = Math.round(document.protein / document.servings);
    });

    return(documents);
}

// Scaled according to given amount
function getScaledNutrition(document, amount) {

    const scale = amount / document.weight;

    document.weight = Math.round(amount);
    document.price = (document.price * scale).toFixed(2);
    document.cals = Math.round(document.cals * scale);
    document.carbs = Math.round(document.carbs * scale);
    document.fat = Math.round(document.fat * scale);
    document.protein = Math.round(document.protein * scale);

    return(document);

}

module.exports = {
    filterDocuments: filterDocuments,
    getPerServingNutrition: getPerServingNutrition,
    getScaledNutrition: getScaledNutrition
};