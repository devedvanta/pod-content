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
  console.log("In main:", quid_list);
  quid_list.forEach(async quid => {
    
      if (entityInGraphCheck(quid)) {
        jumpToAHeight(quid);
      } else {
        console.log('Getting image');
        let images_from_wiki = await getEntityImages(quid);
        console.log('pushing image');
        pushImagesToViewer(images_from_wiki, quid);
      }

  });
}

async function listenForAllTheThingsTheUserSaysMostlyEntitiesAndShowThemOnTheViewer() {
  // var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral' ... ];
  // var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
  var recognizing;
  var recognition = new SpeechRecognition();
  // reset();
  // recognition.onend = reset;

  // var speechRecognitionList = new SpeechGrammarList();
  // speechRecognitionList.addFromString(grammar, 1);

  // recognition.grammars = speechRecognitionList;
  // recognition.continuous = true;
  // recognition.lang = 'en-US';
  recognition.interimResults = true;
  // recognition.maxAlternatives = 1;
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
