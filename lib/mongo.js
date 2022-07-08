/**
 * Application Type: Library
 * Library Handler: Mongo Integration
 * Description: File handles all the rmongo db integration
 * 
 */

// mongodb+srv://sabza-localhost:<password>@sabza-prod-db-cluster-01-aelcs.mongodb.net/test?retryWrites=true&w=majority


//  Dependencies
const MongoClient = require('mongodb').MongoClient;
const secretsLib = require('./secrets');


// Create module to export 
let _ = {};



// Load MongoDB
_.start = async (secrets) => {

    try {
        // Get the current state of secrets 
        let secrets = secretsLib.secrets;
        let msg = '';
        let store = {
            'cloud' : true,
            'error'   : {
                'local' : false,
                'cloud' : false,
                'msg' : {
                    'local' : '',
                    'cloud' : ''
                }
            }
        }

        
        if (store.error.cloud == false ) {
            if (store.cloud === true){
                try {
                    
                    // Get the mongo settings from the secrets
                    _.settings = secrets.mongodb;
            
                    // Connection String
                    _.connectionUri = `${_.settings.protocol}${_.settings.username}:${_.settings.password}@${_.settings.url}`;
            
                    // Create Client
                    _.client = new MongoClient(_.connectionUri, { useNewUrlParser: true, useUnifiedTopology: true });
            
                    // Check to establish connection with Mongo DB Cloud Atlas Service
                    await _.client.connect();
            
                    // Create a specific connection to the databse
                    _.db = await _.client.db(_.settings.databse)
            
                    // Log and return
                    console.log('MongoDB connection established with MongoDB Cloud Atlas');
                    return true;
                } catch (err) { 
                    store.error.msg.cloud = err.name; 
                    store.error.cloud = true;
                    

                    console.log('Tried to connect to Mongo DB Cloud Atlas Service but failed. Reason:  ' + store.error.msg.cloud);
                }

            } else {
                console.log('Mongo DB Atlas Cloud Service has  been switched off. Will try to connect to local datastore.');
            }
        } 
        
        
        if (store.cloud == false || store.error.cloud == true ) {
            try {
                console.log('Trying to connect to local database store ...')
                // Get the mongo settings from the secrets
                _.settings = secrets.mongodbLocal;

                // Connection String
                
                // _.connectionUri = `mongodb://localhost:27017/sabzadb`
                _.connectionUri = `${_.settings.protocol}${_.settings.url}/${_.settings.database}`;

                // Create Client
                _.client = new MongoClient(_.connectionUri, { useNewUrlParser: true, useUnifiedTopology: true });
                
                // Check to establish connection with Mongo DB Local Service
                await _.client.connect();

                // Create a specific connection to the databse
                _.db = await _.client.db(_.settings.databse)

                // Log and return
                console.log('MongoDB connection established with MongoDB Local Service');
                
            } catch (err) {
                store.error.msg.local =  err.name;
                store.error.local = true;
                console.log('Tried to connect to local DB but failed because: Reason:  ' + store.error.msg.local);
                return false;
            }
            
        } 
        // console.log(store);
        
        
        

        


    } catch (err) {

        throw( new Error(err));

    }
};

_.local = async (secret) => {

}



module.exports = _;



// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://sabza-localhost:<password>@sabza-prod-db-cluster-01-aelcs.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
