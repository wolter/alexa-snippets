const SKILL_NAME = "Octopus";

const Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    // alexa.appId = 'amzn1.echo-sdk-ams.app.1234';
    // alexa.dynamoDBTableName = 'YourTableName'; // creates new table for session.attributes
    // alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {  
    'WhatsUpIntent': function () {

        // Update these options with the details of the web service you would like to call
        var options = {
            hostname: "blynk-cloud.com",
            path: "/TOKEN_TO_REPLACE/get/V2",
            method: "GET"
        };

        httpRequest(options,  myResult => {
            console.log(myResult);           
            var virtualPin = myResult[0];
            var msg = "";
            if (virtualPin>200) {
                msg = "Es scheint ein sonniger Tag zu sein."                    ;
            } else {
                msg = "Ganz schön dunkel hier.";
            }
            this.response.speak(msg);
            this.emit(':responseReady');
        });
    },
};

// END of Intent Handlers {} ========================================================================================

// Helper Function  =================================================================================================

const http = require('http');

// http is a default part of Node.JS.  Read the developer doc:  https://nodejs.org/api/http.html

function httpRequest(options, callback, postData) {

    var req = http.request(options, res => {

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

    if (postData) {
        req.write(postData);
    }

    req.end();

}