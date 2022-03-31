const {
    HTTP_OK,
    HTTP_NOT_FOUND,
    HTTP_CREATED
} = require('../utils/Constants')

const simpleDatabase = []


/**
 * It evaluates if the index corresponds to a resource on the database
 */
function isValidIndex(index) {
    return index >= 0 && index < simpleDatabase.length
}


module.exports = {

    register(req, res) {
        console.log(req);
        res.json({resp: 'FUNCIONA'});
    },
    
}