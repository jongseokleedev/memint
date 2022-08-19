const express = require("express");
const notification = express.Router();
const admin = require("firebase-admin");
// const db = getFirestore();
const app = require("../app");

async function onUserCreateAlarm(receiver, message) {
  //get receiver's details
  const owner = await admin.firestore().collection("User").doc(receiver).get();
  const messageData = {
    notification: { title: "Memint", body: message },
    tokens: owner.data().deviceTokens,
  };
  return await admin
    .messaging()
    .sendMulticast(messageData)
    .then((response) => {
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(owner.data().deviceTokens[idx]);
          }
        });
        console.log("List of tokens that caused failures: " + failedTokens);
      }
    });
}

notification.route("/").post((req, res) => {
  onUserCreateAlarm(req.body.receiver, req.body.message)
    .then((alarm) => {
      res.status(200).send("success!");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = notification;
