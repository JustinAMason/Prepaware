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
        document.price = (document.price / document.servings).toFixed(2);
        document.weight /= document.servings;
        document.cals /= document.servings;
        document.carbs /= document.servings;
        document.fat /= document.servings;
        document.protein /= document.servings;
    });

    return(documents);
}

module.exports = {
    filterDocuments: filterDocuments,
    getPerServingNutrition: getPerServingNutrition
}