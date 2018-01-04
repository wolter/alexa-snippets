"use strict";
var Alexa = require('alexa-sdk');
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var handlers = {
    'LaunchRequest': function () {
        this.response.speak("Stelle Deine Frage!").listen("Sage Hilfe, um zu erfahren, was du fragen kannst!");
        this.emit(':responseReady');
    },
	'AMAZON.HelpIntent': function () {
        this.response.speak("Du kannst fragen, soll A oder B das machen?!").listen("Frage, soll A oder B das machen?");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak("Bis dann.");
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak("Tschüss.");
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log("SessionEndedRequest");
        //this.emit(':saveState', true);//uncomment to save attributes to db on session end
    },
	'WhoShouldIntent': function () {

        if (this.event.request.dialogState === "STARTED") {
            console.log(this.event.request.dialogState);
            // this.response.cardRenderer(cardTitle, cardContent, cardImage);
            this.emit(":delegate");
            // optional with updated intent 
            // var updatedIntent = this.event.request.intent
            // this.emit(":delegate", updatedIntent);
        } else if (this.event.request.dialogState === "IN_PROGRESS" ) {
            console.log(this.event.request.dialogState);
            // optional with updated intent 
            // var updatedIntent = this.event.request.intent
            // this.emit(":delegate", updatedIntent);

            //this.emit(":delegate");
            
    		this.handler.response = buildSpeechletResponse({
    			sessionAttributes: this.attributes,
    			directives: getDialogDirectives('Dialog.Delegate', null, null),
                cardTitle: "Mama",
                cardContent: "Wir haben es gleich...",
                // cardImage: imageObj,    			
    			shouldEndSession: false
    		});
		    this.emit(':responseReady');            
            
        } else {
            if (this.event.request.intent.confirmationStatus === 'CONFIRMED') {
                console.log(this.event.request.intent.confirmationStatus);
                var personASlotRaw = this.event.request.intent.slots.personA.value;
                var personBSlotRaw = this.event.request.intent.slots.personB.value;
                var randomPerson = randomPhrase([personASlotRaw, personBSlotRaw]);
                this.response.speak("Wunderbar. Dann macht es " + randomPerson + "!").cardRenderer("Mama", "Wunderbar. Dann macht es " + randomPerson + "!");
                this.emit(':responseReady');
            } else {
                // this.event.request.intent.confirmationStatus === 'DENIED'
                console.log(this.event.request.intent.confirmationStatus);
                this.response.speak("Schade, dann macht es wohl keiner.").cardRenderer("Mama", "Schade, dann macht es wohl keiner.");
                this.emit(':responseReady');
            }
        }
    },	
	'Unhandled': function () {
        this.response.speak(':ask', "Das habe ich jetzt nicht verstanden. Versuche was anderes.").listen("Das habe ich jetzt nicht verstanden. Versuche was anderes.");
        this.emit(':responseReady');        
    }
};

exports.handler = (event, context) => {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
	//alexa.dynamoDBTableName = 'DYNAMODB_TABLE_NAME'; //uncomment this line to save attributes to DB
    alexa.execute();
};

// Helper Function  =================================================================================================

function resolveCanonical(slot){
	//this function looks at the entity resolution part of request and returns the slot value if a synonyms is provided
    try{
		var canonical = slot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
	}catch(err){
	    console.log(err.message);
	    var canonical = slot.value;
	};
	return canonical;
};

function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}
function isSlotValid(request, slotName){
        var slot = request.intent.slots[slotName];
        //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
        var slotValue;

        //if we have a slot, get the text and store it into speechOutput
        if (slot && slot.value) {
            //we have a value in the slot
            slotValue = slot.value.toLowerCase();
            return slotValue;
        } else {
            //we didn't get a value in the slot.
            return false;
        }
}

// These functions are here to allow dialog directives to work with SDK versions prior to 1.0.9
// will be removed once Lambda templates are updated with the latest SDK
// Can also be useed for custom responses (i.e. Dialog.Delegate plus Card)

function createSpeechObject(optionsParam) {
    if (optionsParam && optionsParam.type === 'SSML') {
        return {
            type: optionsParam.type,
            ssml: optionsParam['speech']
        };
    } else {
        return {
            type: optionsParam.type || 'PlainText',
            text: optionsParam['speech'] || optionsParam
        };
    }
}

function buildSpeechletResponse(options) {
    var alexaResponse = {
        shouldEndSession: options.shouldEndSession
    };

    if (options.output) {
        alexaResponse.outputSpeech = createSpeechObject(options.output);
    }

    if (options.reprompt) {
        alexaResponse.reprompt = {
            outputSpeech: createSpeechObject(options.reprompt)
        };
    }

    if (options.directives) {
        alexaResponse.directives = options.directives;
    }

    if (options.cardTitle && options.cardContent) {
        alexaResponse.card = {
            type: 'Simple',
            title: options.cardTitle,
            content: options.cardContent
        };

        if(options.cardImage && (options.cardImage.smallImageUrl || options.cardImage.largeImageUrl)) {
            alexaResponse.card.type = 'Standard';
            alexaResponse.card['image'] = {};

            delete alexaResponse.card.content;
            alexaResponse.card.text = options.cardContent;

            if(options.cardImage.smallImageUrl) {
                alexaResponse.card.image['smallImageUrl'] = options.cardImage.smallImageUrl;
            }

            if(options.cardImage.largeImageUrl) {
                alexaResponse.card.image['largeImageUrl'] = options.cardImage.largeImageUrl;
            }
        }
    } else if (options.cardType === 'LinkAccount') {
        alexaResponse.card = {
            type: 'LinkAccount'
        };
    } else if (options.cardType === 'AskForPermissionsConsent') {
        alexaResponse.card = {
            type: 'AskForPermissionsConsent',
            permissions: options.permissions
        };
    }

    var returnResult = {
        version: '1.0',
        response: alexaResponse
    };

    if (options.sessionAttributes) {
        returnResult.sessionAttributes = options.sessionAttributes;
    }
    return returnResult;
}

function getDialogDirectives(dialogType, updatedIntent, slotName) {
    let directive = {
        type: dialogType
    };

    if (dialogType === 'Dialog.ElicitSlot') {
        directive.slotToElicit = slotName;
    } else if (dialogType === 'Dialog.ConfirmSlot') {
        directive.slotToConfirm = slotName;
    }

    if (updatedIntent) {
        directive.updatedIntent = updatedIntent;
    }
    return [directive];
}