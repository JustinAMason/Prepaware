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

module.exports = {
    filterDocuments: filterDocuments
}