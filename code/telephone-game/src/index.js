/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 **/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = "amzn1.ask.skill.83a63cee-99d1-4b34-83ff-1daedec22f20";  // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Telephone Game',
            HELP_MESSAGE: 'You can say my message is a tounge twister or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
        },
    },
    'en-US': {
        translation: {
            SKILL_NAME: 'Telephone Game',
        },
    },
    'en-GB': {
        translation: {
            SKILL_NAME: 'Chinese Whispers',
        },
    },
    'de': {
        translation: {
            SKILL_NAME: 'Stille Post',
            HELP_MESSAGE: 'Du kannst zum Beispiel sagen, „die Nachricht ist Schwarze Katzen kratzen mit scharfen Tatzen“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?',
            HELP_REPROMPT: 'Wie kann ich dir helfen?',
        },
    },
};

const handlers = {
    'AMAZON.HelpIntent': function () {
        this.response.speak(this.t("HELP_MESSAGE")).listen(this.t("HELP_REPROMT"));
        this.emit(':responseReady');
    },

    'AMAZON.CancelIntent': function () {
        this.response.speak('<say-as interpret-as="interjection">machs gut!</say-as>');
        this.emit(':responseReady');
    },

    'AMAZON.StopIntent': function () {
        this.response.speak('<say-as interpret-as="interjection">bis dann.</say-as>');
        this.emit(':responseReady');
    },

    'LaunchRequest': function () {        
        this.response.speak("Hallo bei Stille Post. Wie lautet deine Nachricht?").listen("Wie lautet deine Nachricht?");
        this.response.cardRenderer('Stille Post', 'Hallo bei Stille Post. Wie lautet deine Nachricht?' );
        this.emit(':responseReady');
    },
    
    'Unhandled': function () {        
        this.response.speak("Hm. Ich habe dich leider nicht verstanden. Wie lautet die Nachricht?").listen("Wie lautet deine Nachricht?");
        this.emit(':responseReady');
    },

    'RecognizeMessageIntent': function () {
        var message = this.event.request.intent.slots.message.value;
        if (message) {
            this.response.cardRenderer('Stille Post', 'Ich habe „' + message + '“ verstanden.' );
            this.response.speak('Ich habe <break strength="medium"/> <prosody volume="-6dB">' + message + '</prosody> <break strength="medium"/> gehört. Was hast du verstanden?').listen("Was hast du verstanden?");
        } else {
            this.response.cardRenderer('Stille Post', 'Ich habe leider nichts verstanden.' );
            this.response.speak("Hm. Ich habe dich leider nicht verstanden. Wie lautet die Nachricht?").listen("Wie lautet Deine Nachricht?");
        }
        this.emit(':responseReady');
    },
    'UnderstoodMessageIntent': function () {
        this.emit('RecognizeMessageIntent');
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};