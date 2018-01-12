// Template for Alexa Skill Lambda Code based on ALexa Skills Kit SDK for Node.js
// Author: Sascha Wolter @saschawolter

const Alexa = require('alexa-sdk');

const languageStrings = {
    'en-GB': {
        'translation': {
            'SAY_HELLO_MESSAGE' : 'Hello World!'
        }
    },
    'en-US': {
        'translation': {
            'SAY_HELLO_MESSAGE' : 'Hello World!'
        }
    },
    'de-DE': {
        'translation': {
            'SAY_HELLO_MESSAGE' : 'Hallo Welt!'
        }
    }
};

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context, callback);
    // alexa.appId = appId;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    // alexa.dynamoDBTableName = 'YourTableName'; //uncomment this line to save attributes to DB
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        // var speechOutput = 'Hallo.';
        // var reprompt = 'Und nun?';        
        this.emit("HelloWorldIntent");
    },    
	'AMAZON.HelpIntent': function () {
        var speechOutput = 'Hallo.';
        var reprompt = 'Und nun?'; 
        this.response.speak(speechOutput).listen('reprompt');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        var speechOutput = 'Bye.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        var speechOutput = 'Bye.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log("SessionEndedRequest");        
        this.emit(':saveState',true); //uncomment to save attributes to db on session end
    },    
    'HelloWorldIntent': function () {

        // Slot value
        // var intentObj = this.event.request.intent;
        // var slotValue = intentObj.slots.SLOT_NAME.value;

        this.response.speak(this.t('SAY_HELLO_MESSAGE')); // .listen('reprompt');
        this.emit(':responseReady');
    },
	'Unhandled': function () {
        var speechOutput = 'Hallo.';
        var reprompt = 'Und nun?'; 
        this.response.speak(speechOutput).listen('reprompt');
        this.emit(':responseReady');
    }        
};

// Helper functions

// usage callDirectiveService(this.event);
function callDirectiveService(event) {
    // Call Alexa Directive Service.
    console.log(event.context.System.apiEndpoint);
    const ds = new Alexa.services.DirectiveService();
    const requestId = event.request.requestId;
    const endpoint = event.context.System.apiEndpoint;
	const token = event.context.System.apiAccessToken;
	const directive = new Alexa.directives.VoicePlayerSpeakDirective(
       requestId, "Ein bisschen Geduld bitte...");
    ds.enqueue(directive, endpoint, token)
    .catch((err) => {
        console.log("Irgendwas ging schief " + err);
    });
}

// const https = require('https');
const http = require('http');

function httpRequest(options, callback, postData) {
    var req = http.request(options, res => {    
        var returnData = "";   
        res.on('data', chunk => {
            returnData = returnData + chunk;
        });
        res.on('end', () => {
            var data = JSON.parse(returnData);
            callback(data); // this will execute the callback function
        });
    });
    req.end();
}