var constrA = {
  audio: true
}
var audio;
async function doThing(){
  const mic = await navigator.mediaDevices.getUserMedia(constrA)
  microphone(mic);
}
async function microphone(mic){
  audio = document.querySelector('audio');
  audio.srcObject = mic;
  audio.play();
}

doThing();