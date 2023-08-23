const videoElement = document.getElementsByClassName('input_video')[0];
videoElement.style.display = "none";  //非表示
const canvasElement = document.getElementsByClassName('output_canvas')[0];
canvasElement.style.display = "none";  //非表示
const canvasCtx = canvasElement.getContext('2d');

const movie_play = document.querySelector("video");


let isGestureDetected = false;  // ジェスチャーを検出したかのフラグ

i = 0;

const hands = new  Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  selfieMode:true,  //canvasを反転
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 540,
  height: 320
});
camera.start();

const onGestureDetected = () => {
  isGestureDetected = true;
  setTimeout(() => {
    isGestureDetected = false;
  }, 1000);
};

function onResults(results) {
  canvasCtx.save();
  //canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,{color: '#02c8a7', lineWidth: 4});
      drawLandmarks(canvasCtx, landmarks, {color: '#f9be02', lineWidth: 0.05});
      //landmark = landmarks;
      //console.log(results.multi HandLandmarkLandmarks[0]);
      const hand  = results.multiHandLandmarks;
      const hand1 = results.multiHandLandmarks[0] ;
      const hand2 = results.multiHandLandmarks[1];
      //console.log(hand1);

      if (!isGestureDetected && Math.abs(hand1[4].x - hand1[12].x) < 0.03 && Math.abs(hand1[4].y - hand1[12].y) < 0.03 && hand1[8].y < hand1[6].y && hand1[18].y < hand1[20].y && hand1[14].y < hand1[16].y){
        console.log("そえてる");
        i = i + 1;
        console.log(i)
        //onGestureDetected(); 　//反応が１秒ごと(なくてもいいのかも)
      }

      if (!isGestureDetected && hand1[4].y < hand1[12].y && hand1[4].y < hand1[12].y && hand1[8].y < hand1[6].y && hand1[18].y < hand1[20].y && i >= 1){
        console.log("できた");
        movie_play.play();
        i = 0;
        //onGestureDetected();  //反応が１秒ごと(なくてもいいのかも)
      }

    //canvasCtx.restore();

    }
  }
}
