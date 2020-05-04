const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.sendNotification = functions.storage.object().onFinalize(async (object) => {
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const meta = object.metadata; // File content type.
    console.log("File uploaded:"+filePath +" content Type:"+contentType+" bucket:"+fileBucket+" Meta data"+meta);
    var attachmentString = "Course Description: ";
    var notificationHelperString = ", Click here to download file";
    const course = attachmentString + meta.FileDescription + notificationHelperString;
    const payload = {
        notification : {
            to : "/topics/courses",
            click_action : "OPEN_ACTIVITY_1",
            filename:`${filePath}` ,
            title: 'New Course Available',
            icon  : "ic_notification",
            body: `${course}`
            }, 
         data: { 
            filename:`${filePath}` ,
            title: 'New Course Available',
            body: `${course}`
         }
     };
    return admin.messaging().sendToTopic("courses",payload)
        .then(function(response){
            console.log('Notification sent successfully:',response);
            return response;
        }) 
        .catch(function(error){
            console.log('Notification sent failed:',error);
        });
});