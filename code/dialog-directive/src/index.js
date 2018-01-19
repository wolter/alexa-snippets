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
    alexa.dynamoDBTableName = 'WhoIsTheBest'; //uncomment this line to save attributes to DB
    alexa.execute();
};

var states = {
    MALE: '_MALE', 
    FEMALE: '_FEMALE'
};

const maleHandlers = Alexa.CreateStateHandler(states.MALE, {
    'GenderIntent': function () {
        this.emit(":tell", "Du bist ein Mann.");
    },
    "WhoIsTheBestIntent": function () {
        this.emit("WhoIsTheBestIntent");
    }
});

const femaleHandlers = Alexa.CreateStateHandler(states.FEMALE, {
    'GenderIntent': function () {
        this.emit(":tell", "Du bist eine Frau.");
    },
    "WhoIsTheBestIntent": function () {
        this.emit("WhoIsTheBestIntent");
    }
});

const handlers = {
    'LaunchRequest': function () {
          this.emit(':ask', "Bist du eine Frau?", "Bist du eine Frau?");
    },
    'AMAZON.YesIntent': function () {
        this.handler.state = states.FEMALE;
        this.emit(':ask', "Was möchtest du wissen?");
    },    
    'AMAZON.NoIntent': function () {
        this.handler.state = states.MALE;
        this.emit(':ask', "Was möchtest du wissen?");
    },    
	'AMAZON.HelpIntent': function () {
        var speechOutput = 'Frage einfach, sage mir wer ist der tollste?';
        var reprompt = 'Frage einfach Alexa, sage mir wer ist der tollste?';
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit('StopIntent');
    },
    'AMAZON.StopIntent': function () {
        var speechOutput = 'Stop Stop Stop';
        this.response.speak(speechOutput).audioPlayerStop();
         this.emit(':responseReady');
        
    },
    'SessionEndedRequest': function () {
        var speechOutput = '';
        this.emit(':saveState',true);//uncomment to save attributes to db on session end
        this.emit(':tell', speechOutput);
    },
	"WhoIsTheBestIntent": function () {
	    
	    callDirectiveService(this.event);
	    
        // Check if it's the first time the skill has been invoked
        if(Object.keys(this.attributes).length === 0) { 
           this.attributes['whoIsTheBestCount'] = 0;
        }
	    
		var speechOutput = "";
    	//any intent slot variables are listed here for convenience

    	//Your custom intent handling goes here
        if (this.attributes['whoIsTheBestCount'] >= 1) {
            let count = this.attributes['whoIsTheBestCount'];
            speechOutput = "Du schon wieder. Das hast du doch bereits " + ((count==1)?"ein":this.attributes['whoIsTheBestCount'].toString()) + " mal gefragt." ;    
        } else {
            speechOutput = "Das bist natürlich du?";
        }
    	this.attributes['whoIsTheBestCount']++;
    	
    	var owner = this;
    	setTimeout(function() {
    	    owner.emit(":tell", speechOutput, speechOutput);
    	}, 4000);
        
    },
	"ShowSnowIntent": function () {
		var speechOutput = "";
    	//any intent slot variables are listed here for convenience

    	// Your custom intent handling goes here
    	// speechOutput = "Horst Schlämmer war stellvertretender Chefredakteur des Grevenbroicher Tagblatts bis er beschloss als Bundeskanzler zu kandidieren. Ein weiteres Ziel von ihm: Sein Heimatort Grevenbroich soll Bundeshauptstadt werden";
        // this.emit(":tell", speechOutput, speechOutput);
        if (this.event.context.System.device.supportedInterfaces.VideoApp) {
            this.response.playVideo("https://streamsrv62.feratel.co.at/streams/1/05302_5a23fef9-9a5aVid.mp4", {title:"Rauris" , subtitle:"Live"});
        } else {
            // this.response.speak("Das Video kann auf diesem Gerät nicht angezeigt werden. " +
            //    "Um es zu betrachten, starten sie bitte diesen Skill auf einem Echo-Gerät mit Bildschirm.");
            this.response.speak("Das Video kann auf diesem Gerät nicht angezeigt werden.").audioPlayer('play', 'REPLACE_ALL', 'https://s3-eu-west-1.amazonaws.com/saschawolter/xmass.mp3', 'xxx', null, 0);
        }
        this.emit(':responseReady');
        
    },
    'PlaybackNearlyFinished': function () {
        var speechOutput = 'Stop und weiter.';
        this.response.audioPlayer('play', 'REPLACE_ALL', 'https://s3-eu-west-1.amazonaws.com/saschawolter/xmass.mp3', 'xxx', null, 0);
        this.emit(':responseReady');
    },
	'Unhandled': function () {
        var speechOutput = "Leider habe ich dich nicht verstanden. Probiere es doch nochmal.";
        this.emit(':ask', speechOutput, speechOutput);
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