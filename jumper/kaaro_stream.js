// var canvas = document.querySelector("canvas");

// // Optional frames per second argument.
// var stream = canvas.captureStream(25);
// var recordedChunks = [];

// console.log(stream);
// var options = { mimeType: "video/webm; codecs=vp9" };
// mediaRecorder = new MediaRecorder(stream);

// mediaRecorder.ondataavailable = handleDataAvailable;
// mediaRecorder.start();

// function handleDataAvailable(event) {
//   console.log("data-available");
//   if (event.data.size > 0) {
//     recordedChunks.push(event.data);
//     console.log(recordedChunks);
//     download();

//   } else {
//     // ...
//   }
// }
// function download() {
//   var blob = new Blob(recordedChunks, {
//     type: 'video/webm'
//   });
//   var url = URL.createObjectURL(blob);
//   var a = document.createElement('a');
//   document.body.appendChild(a);
//   a.style = 'display: none';
//   a.href = url;
//   a.download = 'test.webm';
//   a.click();
//   window.URL.revokeObjectURL(url);
// }

// //for logging status
// setInterval((event) => {

//   console.log(mediaRecorder);

// }, 1500);

// // demo: to download after 9sec
// setTimeout((event) => {
//   console.log("stopping");
//   mediaRecorder.stop();
// }, 15000);



let kaaro_stream_bridge_url = "boomboom.store:3012";
let stream_key = '--';

let mediaRecorder;
let mediaStream;
let ws_url = window.location.protocol.replace('http', 'ws') + '//' + // http: => ws:, https: -> wss:
  kaaro_stream_bridge_url +
  '/rtmp/' +
  encodeURIComponent(`rtmp://live-sin.twitch.tv/app/${stream_key}`);
console.log(ws_url);
const ws = new WebSocket(ws_url);
ws.addEventListener('open', (e) => {
  console.log('WebSocket Open', e);
  mediaStream = document.querySelector('canvas').captureStream(30); // 30 FPS
  mediaRecorder = new MediaRecorder(mediaStream, {
    mimeType: 'video/webm;codecs=h264',
    videoBitsPerSecond: 3000000
  });
  mediaRecorder.addEventListener('dataavailable', (e) => {
    ws.send(e.data);
  });
  mediaRecorder.addEventListener('stop', ws.close.bind(ws));
  mediaRecorder.start(1000); // Start recording, and dump data every second
});
ws.addEventListener('close', (e) => {
  console.log('WebSocket Close', e);
  mediaRecorder.stop();
});