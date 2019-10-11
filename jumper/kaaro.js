var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

import { entityMatch } from "./entity_matching.mjs";
import { getEntityImages } from "./fetch_knowledge.mjs";
import { pushImagesToViewer, jumpToAHeight, entityInGraphCheck } from './gviewr_functions.mjs';
import { showMicAtLevel, showSessionEnd, showSessionError } from './gviewr_functions.mjs';


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

async function listenForAllTheThingsTheUserSaysMostlyEntitiesAndShowThemOnTheViewer() {
  
  
  var recognition = new SpeechRecognition();
  recognition.interimResults = true;
  
  recognition.start();

  recognition.onresult = function(event) {
    let value_to_send = "";
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        value_to_send += event.results[i][0].transcript;
      }
    }
    parseAndActOnText(value_to_send);
  };

  recognition.onaudiostart = event => {
    console.log("Mic is On");
    showMicAtLevel();
  };

  recognition.onend = event => {
    console.log("Ended");
    
    showSessionEnd();

    setTimeout(() => {
      recognition.start();
    }, 1000);
  };

  recognition.error = event => {
    console.log("Ended", event);
    showSessionError();
  };
}

export { listenForAllTheThingsTheUserSaysMostlyEntitiesAndShowThemOnTheViewer };
