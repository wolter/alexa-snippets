// Variety

function getRandomPhrase(phrasesAsArray) {
    let i = 0;
    i = Math.floor(Math.random() * phrasesAsArray.length);
    return(phrasesAsArray[i]);
}


var handlers = {
    'LaunchRequest': function () {
        let welcomePhrases = ["Hallo!", "Guten Tag!", "Hi."];
        this.response.speak(getRandomPhrase(welcomePhrases)).listen();
        this.emit(':responseReady');
    }
}

// ------------------------------------------------------------------------

// User ID

var handlers = {
    'LaunchRequest': function () {
        // check if the user is known
        // users could be managed through a database (i.e. using DynamoDB)
        if (this.event.context.System.user.userId === "amzn1.ask.account.XAEOZQUHHWUYJ2WCYCGU62YNCCKMJFLVS5XXIBKV264PV7AE2YN4JDMUWVB5MDJ3ROVYSHY4LC6RRS6MBXGZNZD3MDOS2YL3MS2DLOJXA4FHZDUCRITBTI52RGL4OIKOHHRXLHVRWGUWUFGDQ2DZOIQH3YHOKGW7QYJOCFK7DLQVKHFMBZSBT7XF44NJYW26V62XJI7XEZYW47LQ") { 
            this.response.speak("Schön, dass du wieder da bist. Stelle nun deine Frage.").listen("Sage Hilfe, um zu erfahren, was du fragen kannst!");
        } else {
            this.response.speak("Herzlich willkommen beim Task Master. Du kannst fragen, soll A oder B das machen. Stelle nun deine Frage!").listen("Sage Hilfe, um zu erfahren, was du fragen kannst!");
        }
        this.emit(':responseReady');
    }
}

// Device ID
var handlers = {
    'LaunchRequest': function () {
        // check if the device is known
        // devices could be managed through a database (i.e. using DynamoDB)
        if (this.event.context.System.device.deviceId === "amzn1.ask.device.AEMKBS4BADMACMAXGTXT7OPCV3UTE6YSCBNDSWTDDAYUATIFOOMZWRK2CQXFRG3J7NFURMEKNTRBGASW3RRAZCG43SPUEQIP75RXTWL7YSCRF7YPX3ZFEL36CYIAQC6SWNUYLNWG7LPE3XVBUDP6DGJCJLSQ") { 
            this.response.speak("Ah, du bist wieder in der Küche, möchtest du, dass...").listen("Sage Hilfe, um zu erfahren, was du fragen kannst!");
        } else {
            this.response.speak("Was kann ich für dich tun?").listen("Sage Hilfe, um zu erfahren, was du fragen kannst!");
        }
        this.emit(':responseReady');
    }
}


