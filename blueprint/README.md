# Alexa Blueprint
If you build your Alexa Skill' programming logic using AWS Lambda and the "Alexa Skills Kit SDK for Node.js" (see https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs) it might be handy, to have the latest version as starting point. Therefore you simply only need to use "npm install --save alexa-sdk" on your command line, zip evrythign and upload it to your Lambda function as starting point. Well, to optimize it you should exclude everything which is already build-in in AWS Lambda (only the Alexa and the localization packages are neeed).

If this seems complicated to you, this repository contains already everything you need. So, no installation, no optimaziation, and no zipping required anymore. Just create an empty Lamba function and use the provided blueprint.zip from the deployment package as a starting point. This is done throught the "Code entry type" field. Once uploaded to your Lambda function you can change this back to "Edit code inline" and then use the latest feature without hassle. But please be aware that uploading the package does override everythign you have. It's only a starting point.