﻿// Template for Alexa Skill Lambda Code based on ALexa Skills Kit SDK for Node.js
// Author: Sascha Wolter @saschawolter

const Alexa = require('alexa-sdk');


// utility methods for creating Image and TextField objects
const makePlainText = Alexa.utils.TextUtils.makePlainText;
const makeImage = Alexa.utils.ImageUtils.makeImage;

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
        var speechOutput = 'Tschüssi.';
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        var speechOutput = 'Hoffentlich bis bald.';
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
    
    'ShowBodyTemplateIntent': function () {
        const builder = new Alexa.templateBuilders.BodyTemplate1Builder();
        const bodyTemplate = builder.setTitle('My BodyTemplate1')
            .setBackgroundImage(makeImage('https://raw.githubusercontent.com/wolter/alexa-snippets/master/media/images/spider_720x480.jpg'))
            .setTextContent(makePlainText('Text content'))
            .build();
        this.response.speak('Rendering a body template!').renderTemplate(bodyTemplate);
        this.emit(':responseReady');
    },
    
    'ShowListTemplateIntent': function () {

        // Slot value
        // var intentObj = this.event.request.intent;
        // var slotValue = intentObj.slots.SLOT_NAME.value;

        const itemImage = makeImage('https://raw.githubusercontent.com/wolter/alexa-snippets/master/media/images/spider_720x480.jpg', 720, 480);
        const listItemBuilder = new Alexa.templateBuilders.ListItemBuilder();
        const listTemplateBuilder = new Alexa.templateBuilders.ListTemplate1Builder();
        listItemBuilder.addItem(itemImage, 'listItemToken1', makePlainText('Listenelement 1'));
        listItemBuilder.addItem(itemImage, 'listItemToken2', makePlainText('Listenelement 2'));
        listItemBuilder.addItem(itemImage, 'listItemToken1', makePlainText('Listenelement 3'));
        listItemBuilder.addItem(itemImage, 'listItemToken2', makePlainText('Listenelement 4'));
        listItemBuilder.addItem(itemImage, 'listItemToken1', makePlainText('Listenelement 5'));
        listItemBuilder.addItem(itemImage, 'listItemToken2', makePlainText('Listenelement 6'));        
        const listItems = listItemBuilder.build();
        const listTemplate = listTemplateBuilder.setToken('listToken')
           .setTitle('Mein ListTemplate1')
           .setListItems(listItems)
           .build();
        this.response.speak('Rendering a list template!').listen("repromptSpeech").renderTemplate(listTemplate);
        this.emit(':responseReady');

    },
    
    SelectIntent : function () {

        // Slot value
        var intentObj = this.event.request.intent;
        var slotValue = intentObj.slots.item.value;

        this.response.speak(intentObj.slots.item.value); // .listen('reprompt');
        this.emit(':responseReady');
    },
    
   "ElementSelected" : function() {
        // We will look for the value in this.event.request.token 
        console.log("ElementSelected " + this.event.request.token);
      
        this.response.speak(this.event.request.token); // .listen('reprompt');
        this.emit(':responseReady');
      
        // this.emit("CustomIntent");
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