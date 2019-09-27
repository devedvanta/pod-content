## Jumper


## Modules
* Speech-to-Text
* Entity Linking
* RTS-Knowledge base population
* RTS-Knowledge visualization


### Speech-to-Text
Currently using browser APIs for STT.
Exploring alternatives like Watson. Would like to be platform agnostic.

Quality of service takes precidence over others.

* [Web Speech APIs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API)
* [Microsft Cognative Services](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started) - [In JavaScript Browser](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/quickstart-js-browser)
* We also have self hosted services like Moz-DeepSpeech. 


We can fine tune the grammer of the Speech Regonition system to focus on `Entites?`
[JSgf - JSpeech Grammar Format](https://www.w3.org/TR/jsgf/)

```
Speech recognition systems provide computers with the ability to listen to user speech and determine what is said. Current technology does not yet support unconstrained speech recognition: the ability to listen to any speech in any context and transcribe it accurately. To achieve reasonable recognition accuracy and response time, current speech recognizers constrain what they listen for by using grammars.
```



## Entity Linking
* http://nlpprogress.com/english/entity_linking.html
* [opentapioca](https://github.com/wetneb/opentapioca) - [Live Demo](https://opentapioca.org/)
* NIF = NLP Interchage Format - [NIF 2.0 Specs](https://persistence.uni-leipzig.org/nlp2rdf/specification/api.html) 

Opentapioca can be self hosted, and also has a [public NIF API](https://opentapioca.org/api/nif)

