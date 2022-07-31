 /**
 * Application Type: Router
 * Route Handler: Ping
 * Description: Ping Handler, useable on the router in place to give ping request anwser
 * 
 */

// Dependencies


// Create module to export
let _ = {};


// Get Request to /ping route
_.verify = async (req, res) => {
    console.log(req.body)
    console.log('Time:', Date.now())
    let code = 200;
    res.json({
        'ping' : 'successful',
        'status' : code,
        'timestamp' : Date.now(),
        'message': "Hello, I am alive.", 
        'response': req.body
    });
    return res.status(code).json(new ResquestError(code));
};

// _.post = async (req, res) => {

// }

// _.all = async (req, res) => {   
//     let code = 200;
//     res.json({
//         'ping' : 'successful',
//         'status' : code,
//         'timestamp' : Date.now(),
//         'message': "I am alive"
//     });
//     return res.status(code).json(new ResquestError(code));
// }


// Export router module as _ to handle ping route and errors
module.exports = _;