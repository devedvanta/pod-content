// import { mqtt } from "mqtt";
import { entityMatch } from "./entity_matching.mjs";
import { getEntityImages } from "./fetch_knowledge.mjs";
import {
  pushImagesToViewer,
  jumpToAHeight,
  entityInGraphCheck,
  showTextFeedbackToUserForContext,
  switchCamera
} from "./gviewr_functions.mjs";
import {
  showMicAtLevel,
  showSessionEnd,
  showSessionError
} from "./gviewr_functions.mjs";

async function parseAndActOnText(text) {
  let quid_list = await entityMatch(text);
  quid_list.forEach(async quid => {
    if (entityInGraphCheck(quid)) {
      jumpToAHeight(quid);
    } else {
      let images_from_wiki = await getEntityImages(quid);
      pushImagesToViewer(images_from_wiki, quid);
    }
  });
}

async function listenOnOpenChannelForUserHasSaidOnDifferentPlatforms() {
  var ID = function() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return (
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  };
  var client = new Paho.Client(
    "api.akriya.co.in",
    8083,
    `clientId-kaaroStream_Canvas_${ID}`
  );

  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // connect the client
  client.connect({ onSuccess: onConnect });

  // called when the client connects
  function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("kaaroStream/input");
    client.subscribe("kaaroStream/cameraSwitch");
    let message = new Paho.Message("Hello from Streaming canvas");
    message.destinationName = "kaaroStream/streaming_canvas";
    client.send(message);
  }

  // called when the client loses its connection
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  }

  // called when a message arrives
  function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
    if (message.destinationName === 'kaaroStream/cameraSwitch') {
        console.log('switching cam');
        switchCamera();
    } else {
        parseAndActOnText(message.payloadString);
    }
    showTextFeedbackToUserForContext(message.payloadString);
  }
}

export { listenOnOpenChannelForUserHasSaidOnDifferentPlatforms };
