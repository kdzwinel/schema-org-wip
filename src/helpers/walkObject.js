module.exports = function walkObject(obj, callback, path = []) {
    if (obj === null) {
        return;
    }

    Object.keys(obj).forEach(fieldName => {
        const fieldValue = obj[fieldName];
        const newPath = Array.from(path);
        newPath.push(fieldName);

        callback(fieldName, fieldValue, newPath, obj);

        if (typeof fieldValue === 'object') {
            walkObject(fieldValue, callback, newPath);
        }
    });
}