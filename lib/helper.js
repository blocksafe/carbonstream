/**
 * General purpose utilities
 */

 let _ = {};

 // Get an object from JSON, without throwing

 _.getObjectFromJson = (str) => {
    try {
        let obj = JSON.parse(str);
        return obj;
    } catch {
        return false;
    }
 };








 // Export all (_) as a module
 module.exports = _;