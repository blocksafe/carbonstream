/**
 * Application Type: Model
 * Model Handler: Users
 * Description: File handles all the user model (datastore and functions) for users
 * 
 */


//  Base Dependencies
const base = require('./mongo');
const {cloneDeep, at} = require('lodash');
const TOKEN_API = 'N7QHYXYBSFRH5TMP1T82I6QKZ6QXYC3URT'

var api = require('etherscan-api').init(TOKEN_API,'rinkeby', '3000');

// var api = require('etherscan-api').init('N7QHYXYBSFRH5TMP1T82I6QKZ6QXYC3URT','rinkeby', '3000');
// const Etherscan = require('node-etherscan-api')

// Create module to export 

// const etherscan = new Etherscan.init(TOKEN_API,'rinkeby', '3000');


// Security Dependencies
const zxcvbn = require('zxcvbn');
const bcrypt = require('bcryptjs');
// Model Dependencies


// Validation Dependencies
const constraints = require('./../lib/constraints');
const format = require('./../lib/format');
const validate = require('validate.js');

// Other Deependencies
const moment = require('moment');

const { v4: uuidv4 } = require('uuid');


// Create model to export to app
let _ = class extends base{

    // Load a user, or create a new user with default values
    // Set Defaults using the parent base  class (models/mongo.js)
    /**
     * constructor() function will set the default value by initiating the constructor inside of the base class (models/mongo.js) class 
     * 
     *      constructor() {
     *          this.created = Date.now()
     *          this._id = uuidv4();
     *      }
     * 
     * 
     */


     // https://api-rinkeby.etherscan.io/api
     // ?module=account
     // &action=txlist
     // &address=0x7e09e481f2cc36d201bde90c86fc7f0838aaf36d
     // &startblock=11229175
     // &endblock=11229175
     // &page=1
     // &offset=10
     // &sort=asc
     // &apikey=N7QHYXYBSFRH5TMP1T82I6QKZ6QXYC3URT

     
    constructor(userId = false) {

        // If a userId is set, load the userData from the DB
          if(userId) {
               // @TODO 
          } else {

            // Inherit all defaults using the parent base  class (models/mongo.js) and use is as 'super' e.g super.save()
            super();
            this.created = Date.now()
            this._id = uuidv4();
            // Now set the default tx data
            this.address = null,
            this.hash = null
            this.options = {
               action : false,
               startblock : false,
               endblock : false,
               page : 1,
               offset : 100,
               sort : 'asc',
               unit : 'eth',
               tag : 'latest',
               network: 'rinkeby',
               timeout: 3000
            };
            this.to = null

            this.res = {
               timestamp : null,
               nonce : null,
               transactionIndex : null,
               from : null,
               hash : null,
               to : null,
               value : null,
               gas : null,
               gasPrice : null,
               input : null,
               methodId : null,
               functionName : null,
               contractAddress : null,
               cumulativeGasUsed : null,
               txreceipt_status : null,
               gasUsed : null,
               confirmations : null,
               isError : null,
            }
            this.contractAbi = null


        
          }
     }



    // Save this user to the "users" collection
    async save() {
        await super.save('etherscan_tx');
    }

    async get_tx_by_hash() {
          let txlist = api.proxy.eth_getTransactionByHash(this.hash).then(response => {
               console.log(response)
          })
    }

    async get_tx () {
          console.log('Finding txs for address: ' + this.address)
          let result = await api.account.txlist(
               this.address, 
               this.options.startblock, 
               this.options.endblock, 
               
          )
          .then(res => {
               // this.res.to = result.result.to
               // this.to = result.result.to
               // console.log(this.res.to)
               // console.log(result)
               return res
          }).catch(err => {
               console.log(err)
          })

          // console.log(result)
          

          if (result.status == '1') {
               console.log("res.status.inside")
               if (result.message == 'OK'){
                    console.log("res.message.inside")
                    // x = 0
                    let res = result.result
                    // console.log(res)
                    // res.forEach(function (res) {
                         // var x = arrayItem.prop1 + 2;
                         // console.log(res[0].timeStamp)
                         this.res.timestamp = res.timeStamp
                         this.res.nonce = res[0].nonce
                         this.res.transactionIndex = res[0].transactionIndex
                         this.res.from = res[0].from
                         this.res.hash = res[0].hash
                         this.res.to = res[0].to
                         this.res.value = res[0].value
                         this.res.gas = res[0].gas
                         this.res.gasPrice = res[0].gasPrice
                         this.res.input = res[0].input
                         this.res.methodId = res[0].methodId
                         this.res.functionName = res[0].functionName
                         this.res.contractAddress = res[0].contractAddress
                         this.res.cumulativeGasUsed = res[0].cumulativeGasUsed
                         this.res.txreceipt_status = res[0].txreceipt_status
                         this.res.gasUsed = res[0].gasUsed
                         this.res.confirmations = res[0].confirmations
                         this.res.isError = res[0].isError
                         
                    //  });
                    // console.log(res[0])
                    // console.log(this.res)
                    // return true 
               }
          }
              
         
          return result
    }

     async isContract(address, tag = 'latest') {
          console.log("this is inside the isCOntract function")
          console.log(address)
          var res = await api.proxy.eth_getCode(address,  tag).then(res => {
               console.log("this is inside the isCOntract await")
               console.log(res)
               return res
          }).catch(err => {
               console.log(err)
          });
          
          if (res.length > 5){
               console.log(true)
               return true
          } else {
               return false 
          }
          
     }

    async get_tx_abi (contractAddress) {
     // if (this.res.contractAddress){
          console.log('insode checking contract address')
          console.log(contractAddress)
          if (contractAddress){
               let abi = await api.contract.getabi(contractAddress)
               .then(res => {
                    console.log("inside abi then statement")
                    console.log(res)
                    this.contractAbi = res.result
                    return res 
               }).catch(err => {
                    console.log(err)
               })
          }
          
     }

     async decode () {
          const InputDataDecoder = require('ethereum-input-data-decoder');
          const decoder = new InputDataDecoder(this.contractAbi);   
          const data = `0x67043cae0000000000000000000000005a9dac9315fdd1c3d13ef8af7fdfeb522db08f020000000000000000000000000000000000000000000000000000000058a20230000000000000000000000000000000000000000000000000000000000040293400000000000000000000000000000000000000000000000000000000000000a0f3df64775a2dfb6bc9e09dced96d0816ff5055bf95da13ce5b6c3f53b97071c800000000000000000000000000000000000000000000000000000000000000034254430000000000000000000000000000000000000000000000000000000000`;
          const result = decoder.decodeData(data);
          console.log(result);
     }
          
//     }


//     async verifyEscada() {
//        //
    
//        var publicKeyRemote = PublicKey.fromPem(this.publicKey);
//        console.log("Public Key Received Successul!!!");
//        console.log("Public Key Remote : ", publicKeyRemote.toPem());
//        console.log("EC Parameters : ", privateKey.toPem());
//        let publicKey = privateKeyProver.publicKey(); //.PublicKey();
//        console.log("Public Key Server : ", publicKey.toPem());
//        let msg = this.msg;
//        console.log("Message Received : ", msg);
//        //let sig = Signature.fromDem(this.sig);
//        let signatureRemote = Signature.fromBase64(this.sig);
//        //console.log("Digital Signature Received : ", signatureRemote);
//        this.verification =  Ecdsa.verify(msg, signatureRemote, publicKeyRemote);
        
        
//     }
    // Set the Tx Address
     async setTxAddress(address) {
          try {

               // Get the validation message, if any
          //   let msg = validate.single(lastname, constraints.name());
               // console.log(address)
            // if the validation passes, format the input accordingly
            this.address = address 
          //   console.log("Saving address as : " + this.address)
            return false;
               
          } catch (err) {
               throw( new Error(err));
          }
     }

     // / Set the Tx Address
     // async setTxHash(hash) {
     //      try {

     //           // Get the validation message, if any
     //      //   let msg = validate.single(lastname, constraints.name());
     //           // console.log(address)
     //        // if the validation passes, format the input accordingly
     //        this.hash = hash 
     //      //   console.log("Saving address as : " + this.address)
     //        return false;
               
     //      } catch (err) {
     //           throw( new Error(err));
     //      }
     // }
     async setTxStartBlock(startblock = 11229175) {
          try {
          this.options.startblock = startblock;
          // console.log("Saving start block as : " + this.options.startblock)
          return false;
          } catch (err) {
          throw( new Error(err));
          }
     }

     async setTxEndBlock(endblock = 11229175) {
          try {
          this.options.endblock = endblock;
          // console.log("Saving end block as : " + this.options.endblock)
          return false;
          } catch (err) {
          throw( new Error(err));
          }
     }
   

    

    // Set the password hash
    async  setPasswordHash(password) {

        try {

            // Get validation message(s), if any
            let msg = validate.single(password, constraints.password());
            if(msg) return msg;
            
            // Get password strength
            let passwordResult = zxcvbn(password);

            if(passwordResult.score <= 2) {
                let feedback = passwordResult.feedback.warning;
                msg = feedback.length ? feedback : "Password is not strong enough";
                return (msg)
            }

            // Hash the password
            let passwordHash = await bcrypt.hash(password, 10);
            this.security.passwordHash = passwordHash;

            return  false;

        } catch (err) {
            throw(new Error(err));
        }
    }

  
   


   



}



module.exports = _;