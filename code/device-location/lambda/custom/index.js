
 "use strict";
 const Alexa = require('alexa-sdk');
 const url = require('url');
 var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

 var handlers = {
     'LaunchRequest': function () {
        this.response.speak("Hallo");
        this.emit(':responseReady');
     },
     'AMAZON.HelpIntent': function () {
        this.response.speak("Hilfe");
        this.emit(':responseReady');
     },
     'AMAZON.CancelIntent': function () {
        this.response.speak("Abbruch");
        this.emit(':responseReady');
     },
     'AMAZON.StopIntent': function () {
        this.response.speak("Ence");
        this.emit(':responseReady');
     },
     'SessionEndedRequest': function () {
         //this.emit(':saveState', true);//uncomment to save attributes to db on session end
         this.response.speak("Session Ende");
         this.emit(':responseReady'); 
     },
     "DeviceIntent": function () {

         /*
         if (this.event.context.System.user.permissions) {
               console.log("Foo");
               let token = this.event.context.System.user.permissions.consentToken;
               let apiEndpoint = this.event.context.System.apiEndpoint;
               let deviceId = this.event.context.System.device.deviceId;
 
               let das = new Alexa.services.DeviceAddressService();
               das.getFullAddress(deviceId, apiEndpoint, token)
                     .then((data) => {
                        console.log('Address get: ' + JSON.stringify(data));      
                            this.response.speak('<address information>');
                            this.emit(':responseReady');
                      })
                    .catch((error) => {
                            this.response.speak('I\'m sorry. Something went wrong.');
                            this.emit(':responseReady');
                            console.log(error.message);
                      });
         } else {             
               var permissionArray = ['read::alexa:device:all:address'];
               this.emit(':tellWithPermissionCard', 'Bitte erlaube dem Skill, die Adresse zu ermitteln.', permissionArray);
         }
         */
         
         if (this.event.context.System.user.permissions) {
               console.log("Foo");
               let token = this.event.context.System.user.permissions.consentToken;
               let apiEndpoint = url.parse(this.event.context.System.apiEndpoint).hostname;
               let deviceId = this.event.context.System.device.deviceId;
               const DEVICE_ADDRESS_PATH_PREFIX = '/v1/devices/';
               const DEVICE_ADDRESS_PATH_POSTFIX = '/settings/address';
 
               // Update these options with the details of the web service you would like to call
               var options = {
                 hostname: apiEndpoint,
                 path: DEVICE_ADDRESS_PATH_PREFIX 
                         + deviceId
                         + DEVICE_ADDRESS_PATH_POSTFIX,
                 method: "GET",
                 headers: {'Authorization': `Bearer ${token}`}
               };
     
               httpsGet(options,  myAddress => {
                console.log('Address get: ' + JSON.stringify(myAddress));
                this.response.speak("Hallo " + myAddress.city);
                this.emit(':responseReady');
               });
         } else {              
               var permissionArray = ['read::alexa:device:all:address'];
               this.emit(':tellWithPermissionCard', 'Bitte erlaube dem Skill, die Adresse zu ermitteln.', permissionArray);
         }        
         
     },

 };
 
 exports.handler = (event, context) => {
     var alexa = Alexa.handler(event, context);
     alexa.APP_ID = APP_ID;
     // To enable string internationalization (i18n) features, set a resources object.
     //alexa.resources = languageStrings;
     alexa.registerHandlers(handlers);
     //alexa.dynamoDBTableName = 'DYNAMODB_TABLE_NAME'; //uncomment this line to save attributes to DB
     alexa.execute();
 };
  
 const https = require('https');
 
 function httpsGet(options, callback) {
 
     // GET is a web service request that is fully defined by a URL string
 
     var req = https.request(options, res => {
 
         res.setEncoding('utf8');
         var returnData = "";
 
         res.on('data', chunk => {
             returnData = returnData + chunk;
         });
 
         res.on('error', function(err) {
             // Handle error
             console.log(err);
         });
 
         res.on('end', () => {
             // we have now received the raw return data in the returnData variable.
             // We can see it in the log output via:
             // console.log(JSON.stringify(returnData))
             // we may need to parse through it to extract the needed data
 
             var data = JSON.parse(returnData);
 
             callback(data);  // this will execute whatever function the caller defined, with one argument
 
         });
 
     });
     req.end();
 
 }