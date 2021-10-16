var constr = {
  audio: true
}
async function doThing(){
  const mic = await navigator.mediaDevices.getUserMedia(constr)
  const video = document.querySelector('video');
  video.srcObject = mic;
  video.play();
}

doThing();
