var constr = {
  video: {
    width: 1280,
    height: 720,
  }
}
async function doThing(){
  const cam = await navigator.mediaDevices.getUserMedia(constr)
  const video = document.querySelector('video');
  video.srcObject = cam;
  video.play();
}

doThing();