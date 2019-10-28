

let kaaro_stream_bridge_url = "boomboom.store:3012";
let stream_key = 'live_464705733_AOJAD2W2HuvODc3o7sK9wyKtdy9lzB';

let mediaRecorder;
let mediaStream;
let ws_url = window.location.protocol.replace('http', 'ws') + '//' + // http: => ws:, https: -> wss:
  kaaro_stream_bridge_url +
  '/rtmp/' +
  encodeURIComponent(`rtmp://live-sin.twitch.tv/app/${stream_key}`);
console.log(ws_url);


async function startStreamingTheCanvas() {
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
}
// startStreamingTheCanvas();
export { startStreamingTheCanvas };