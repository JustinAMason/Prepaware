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

function getPerServingNutrition(documents) {
    documents.forEach(function(document) {
        document.price = (document.price / document.servings);
        document.displayPrice = document.price.toPrecision(2);
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

    document.weight = amount;
    document.price *= scale;
    document.cals *= scale;
    document.carbs *= scale;
    document.fat *= scale;
    document.protein *= scale;

    return(document);

}

module.exports = {
    filterDocuments: filterDocuments,
    getPerServingNutrition: getPerServingNutrition,
    getScaledNutrition: getScaledNutrition
};