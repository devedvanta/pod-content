
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList

var g_height = 0;
let entities_captured = {};
let entities_height = {};

async function entityMatch(query = "John Trivolta's performace in Pulp fiction was jazzy") {
    let headers = {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
      };
  console.log("init");
  console.log(query);
  if (!query || query.length < 3) {
    return [];
    
  }
  const wikiEntityLikingResponse = await fetch(`https://cors-anywhere.herokuapp.com/https://opentapioca.org/api/annotate?query=${encodeURI(query)}`, {
    method: 'GET',
    mode: 'cors',
    headers: headers
  });
  console.log(wikiEntityLikingResponse);
  let wikiEntityLiking;
  try {
    wikiEntityLiking = await wikiEntityLikingResponse.json();
  } catch (error) {
      console.log(error);
      return []
  }
  console.log(wikiEntityLiking);
  let qid_list = wikiEntityLiking.annotations.map(each_match => each_match.best_qid);
  quid_list = qid_list.filter(quid => !!quid)
  console.log(qid_list);
  return qid_list;
    // return ['Q712548', 'Q9570'];
}

async function getEntityImages(QID) {
  let primaryImages = await _getEntityPrimaryImages(QID);
  let linkedImages = await _getEntitySecondaryImages(QID);

  console.log("primaryImages", primaryImages);
  console.log("linkedImages", linkedImages);

  let mixed_list = [...primaryImages, ...linkedImages];
  let array_of_imags = mixed_list.map(data => data.url);
  array_of_imags = array_of_imags.map(imgURL => imgURL.replace('http://', 'https://'));
  array_of_imags = array_of_imags.filter(imgURL => !imgURL.includes('.svg'));
  return array_of_imags;
}

async function _getEntityPrimaryImages(QID) {
  let headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36",
      "Accept": "application/sparql-results+json"
  };
  const SPARQL = `
      SELECT ?img
      WHERE 
      {
        wd:${QID} wdt:P18 ?image
      
        BIND(REPLACE(wikibase:decodeUri(STR(?image)), "http://commons.wikimedia.org/wiki/Special:FilePath/", "") as ?fileName) .
        BIND(REPLACE(?fileName, " ", "_") as ?safeFileName)
        BIND(MD5(?safeFileName) as ?fileNameMD5) .
        BIND(CONCAT("https://upload.wikimedia.org/wikipedia/commons/thumb/", SUBSTR(?fileNameMD5, 1, 1), "/", SUBSTR(?fileNameMD5, 1, 2), "/", ?safeFileName, "/650px-", ?safeFileName) as ?img)
    
      }
    `;
  const primaryImagesResponse = await fetch(`https://query.wikidata.org/sparql?query=${SPARQL}&format=json`,{
    method: 'GET',
    headers: headers,
    qs: { 'format': 'json'},
  });
  const primaryImages = await primaryImagesResponse.json();
  console.log('primaryImages', primaryImages);

  if (
    primaryImages &&
    primaryImages.results &&
    primaryImages.results.bindings
  ) {
    console.log(primaryImages.results.bindings);
    return primaryImages.results.bindings.map(data => {
      return { url: data.img.value };
    });
  }
  return null;
}

async function _getEntitySecondaryImages(QID) {
  let headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36",
      "Accept": "application/sparql-results+json"
  };
  const SPARQL = `
    SELECT ?itemLevel2Label ?prop ?imgLvl2
    WHERE 
    {
        wd:${QID} ?prop ?itemLevel2.
        ?itemLevel2 wdt:P18 ?image.
        BIND(REPLACE(wikibase:decodeUri(STR(?image)), "http://commons.wikimedia.org/wiki/Special:FilePath/", "") as ?fileName) .
        BIND(REPLACE(?fileName, " ", "_") as ?safeFileName)
        BIND(MD5(?safeFileName) as ?fileNameMD5) .
        BIND(CONCAT("https://upload.wikimedia.org/wikipedia/commons/thumb/", SUBSTR(?fileNameMD5, 1, 1), "/", SUBSTR(?fileNameMD5, 1, 2), "/", ?safeFileName, "/650px-", ?safeFileName) as ?imgLvl2)
      
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }
    `;
  const secondaryImagesResponse = await fetch(`https://query.wikidata.org/sparql?query=${SPARQL}`, {
    method: 'GET',
    headers: headers,
    qs: { 'format': 'json'},
    json: true
  });
  const secondaryImages = await secondaryImagesResponse.json();
  console.log("secondaryImages", secondaryImages);
  return secondaryImages.results.bindings.map(data => {
    return {
      url: data.imgLvl2.value,
      prop: data.prop,
      value: data.itemLevel2Label.value
    };
  });
}

async function pushImagesToViewer(array_of_imags) {
    let nodes_to_append = [];
    array_of_imags.forEach((image, i) => {
        let entityEl = document.createElement("a-box");
    
        console.log(image);
        console.log(i);
    
        const r = 4 + (array_of_imags.length/10); //radius of the scene
        const angle = ((2 * Math.PI) / array_of_imags.length) * i;
        entityEl.setAttribute(
          "position",
          `${r * Math.sin(angle)} ${g_height} ${r * Math.cos(angle)}`
        );
        entityEl.setAttribute("width", "2");
        entityEl.setAttribute("depth", "0.2");
        entityEl.setAttribute("height", "2");
        // entityEl.setAttribute('color','');
        entityEl.setAttribute("static-body", "true");
        entityEl.setAttribute("look-at", "#camera");
        entityEl.setAttribute("material", `src: url(${image})`);
        nodes_to_append.push(entityEl);
      });
      document.getElementById("theScene").append(...nodes_to_append);
      g_height += 2;
      document.getElementById("rig").setAttribute('position', `0 ${1.6 + g_height} 0`);
}

async function jumpToAHeight(height) {
    document.getElementById("rig").setAttribute('position', `0 ${1.6 + height} 0`);
}

async function parseAndActOnText(text) {
    let quid_list = await entityMatch(text);
    quid_list.forEach( async (quid) => {
        if (quid) {
            if (entities_captured[quid]) {
                jumpToAHeight(entities_height[quid]);
            } else {
                entities_captured[quid] = true;
                entities_height[quid] = g_height;
                let images_from_wiki = await getEntityImages(quid);
                pushImagesToViewer(images_from_wiki);
            }

        }
    });
}

async function listenForAllTheThingsTheUserSaysMostlyEntities() {
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

    recognition.onresult = function (event) {
        let value_to_send = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                value_to_send += event.results[i][0].transcript;
            }
          }
        parseAndActOnText(value_to_send);
    }

    recognition.onaudiostart = (event) => {
        console.log("Mic is On");
        let el = document.createElement("a-entity");
        el.setAttribute('gltf-model','#mic-asset');
        el.setAttribute('position',`2 ${g_height} -2`);
        // <a-entity gltf-model="#type-person-boy" position="2 2 -2" static-body></a-entity>
        document.getElementById('theMic').setAttribute('gltf-model','#mic-asset');
    }

    recognition.onend = (event) => {
        console.log("Ended");
        document.getElementById('theMic').setAttribute('gltf-model', '#type-person-boy');
        setTimeout(() => {
            recognition.start();
        },1000);
    }

    recognition.error = (event) => {
        console.log("Ended", event);
        document.getElementById('theMic').setAttribute('gltf-model', '#type-person-boy');
    }

    
}

listenForAllTheThingsTheUserSaysMostlyEntities();
