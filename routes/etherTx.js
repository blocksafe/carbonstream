/**
 * Application Type: Router
 * Route Handler: Users
 * Description: File handles all the routes (requests and responses) for users
 * 
 */

// Dependencies
const EtherTx = require('./../models/etherTx');

// Model Dependencies

// Process Dependencies
const PayloadError = require('./../errors/payload');
const { get } = require('lodash');


// Routing Files


// Create module to export
let _ = {};

// POST requests
_.getTx = async (req, res) => {
    
    try {
          console.log(req.params)
          // Instantiate a new user. Either pulls a user by ID, or pulls a user in default data
          let tx = new EtherTx();
          // Set the user's data by using getters and setters function in modes/user.js
          // Defaults for the validation process
          let key = false;
          let msg = false;
          // let policyName = false;

          // Set address 
          key = 'txaddress';
          address = req.params.txaddress
          msg = await tx.setTxAddress(address, );

          // key = 'hash';
          // address = req.params.hash
          // msg = await tx.setTxHash(hash);

          key = 'startblock';
          msg = await tx.setTxStartBlock(get(req.body.startblock));
          // if(msg) return res.status(400).json(new PayloadError(key, msg));

          // key = 'endblock';
          msg = await tx.setTxEndBlock(get(req.body.endblock));
          // if(msg) return res.status(400).json(new PayloadError(key, msg));

          // console.log(tx)
          // let tx_by_hash = await tx.get_tx_by_hash()
          let tx_details = await tx.get_tx()
   
          console.log(tx_details)
          console.log(tx.res.to)
          contract = await tx.isContract(tx.res.to, 'latest')
          console.log(contract)
          console.log(tx.res.contractAddress)
          let contract_abi = await tx.get_tx_abi(tx.res.to)
          console.log(tx.contractAbi)


          // res.json({
          //      'ping' : 'successful',
          //      'status' : code,
          //      'verification': 'successfully verified',
          //      'timestamp' : Date.now(),
          //      'message': "Hello, I am alive.", 
          //      'request': req.params,
          //      'public_key': nizkp.publicKey,
          //      'message': nizkp.msg,
          //      'signature': nizkp.sig
               
          //  });
          // // Set DOB Month
          // key = 'dob.month';
          // msg - await user.setDobMonth(get(req.body.key));
          // if(msg) return res.status(400).json(new PayloadError(key, msg));

          // // Set DOB Year
          // key = 'dob.month';
          // msg - await user.setDobDay(get(req.body.key));
          // if(msg) return res.status(400).json(new PayloadError(key, msg));

          // Validate Age  of the  User
          // let isAgeValid = await user.isAgeValid(18);
          // if(!isAgeValid) return res.status(403).end();

          
          // Set first name
          //    key = 'name.first';
          //    msg = await user.setFirstName(get(req.body, key));
          //    if(msg) return res.status(400).json(new PayloadError(key, msg));


          // Set last name
          //    key = 'name.last';
          //    msg = await user.setLastName(get(req.body, key));
          //    if(msg) return res.status(400).json(new PayloadError(key, msg));

          // // Set handle
          // key = 'handle';
          // msg = await user.setHandle(get(req.body, key));
          // if(msg) return res.status(400).json(new PayloadError(key, msg));

          // // Set Poilicy - terms
          // // policyName = 'terms';
          // // key = 'policies.' + policyName;
          // // msg = await user.setPolicyAgreement(policyName,get(req.body, key));
          // // if(msg) return res.status(400).json(new PayloadError(key, msg));

          // // Set Poilicy - privacy
          // // policyName = 'privacy';
          // // key = 'policies.' + policyName;
          // // msg = await user.setPolicyAgreement(policyName,get(req.body, key));
          // // if(msg) return res.status(400).json(new PayloadError(key, msg));

          // // Set Password Hash
          // key = 'password';
          // msg = await user.setPasswordHash(get(req.body, key));
          // if(msg) return res.status(400).json(new PayloadError(key, msg));

          // // Check the token that was set
          // key = 'emailToken._id';
          // let emailToken = new EmailToken(get(req.body, key));
          // if(emailToken.err) return res.status(400).json(new PayloadError(key, emailToken.err));

          // // Sync email token data with the data from the database
          // await emailToken.load();
          // if(emailToken.err) return res.status(400).json(new PayloadError(key, emailToken.err));

          // // Check to see if email token is expired
          // msg = ['Token must not be expired'];
          // if(emailToken < Date.now()) return res.status(400).json(new PayloadError(key, msg));

          // // Set email
          // msg = await user.setEmailAddress(emailToken.email);
          // if(msg) return res.status(400).json(new PayloadError(key, msg));

          // // Create a new email object using  the token
          // let emailAddress = new EmailAddress(emailToken.email);
          // if(msg) return res.status(400).json(new PayloadError(key, msg));

          // // Set the refType for the email 
          // msg = await emailAddress.setRefType('user');
          // if(msg) return res.status(500).end();

          // // Set the refId for the email 
          // msg = await emailAddress.setRefId(user._id);
          // if(msg) return res.status(500).end();

          // // Save the new email in dynamo, only if such an email doesn't exist
          // let doNotUpdate = true;
          // try {
          //     await emailAddress.save(doNotUpdate);
          // } catch (err) {
          //     return res.status(400).json(new PayloadError('emailToken._id', ['Email Address refrenced in token already exists']));
          // }

          
          // // Create new path and set it for the handle
          // let path = new Path(user.handle);
          
          // if(path.err) return res.send(500).end();
          // // Set the refType for the path
          // msg = await path.setRefType('user');
          // if(msg) return res.send(500).end();

          // // Set the refType for the path
          // msg = await path.setRefId(user._id);
          
          // if(msg) return res.send(500).end();

          // Save the new path,, only if such a pth doesnot exist
          
          // doNotUpdate = true;
          // key = 'handle';
          // try {

          //     await path.save(doNotUpdate);

               
          // } catch (e) {
          //     return res.status(400).json(new PayloadError(key, ['Already Exists']))
          // }


          // Save that object
          // await user.save();
          // // Retrieve the data for it, filtered by what should be visible to the owner of the record
          // let record = await user.getRecordByRole('owner');

          // // Return the filtered data
          // res.json(record);


    } catch (err) {
        // console.log(500);
        // console.log(err);
        
        res.sendStatus(500).end(); 
    }
}


// Get Request to /ping route
_.get = async (req, res) => {
    let code = 200;
    res.json({
        'ping' : 'successful',
        'status' : code,
        'timestamp' : Date.now()
    });
    // return res.status(code).json(new ResquestError(code));
};




// Export router module as _ to handle ping route and errors
module.exports = _;