//variable declaration
var audioChunks = [];
var mediaRecorder;
var mic;
var textFin;
var txt;

//good functions for organization
const constrA = {
  audio: true
}
var audio;
async function microphone(){
  mic = await navigator.mediaDevices.getUserMedia(constrA)
}
async function startRec(){
  mediaRecorder = new MediaRecorder(mic);
  mediaRecorder.addEventListener("dataavailable", event => {
    audioChunks.push(event.data);
  });
  mediaRecorder.start();
  onRecording();
}
async function stopRec(){
  mediaRecorder.stop();
  mediaRecorder = null;
  onStopRecording();
  setTimeout(async function(){
    message.textContent = await assemblyText();
  },1500)
}

//api fuckery, very bad for organization but good enough overall
async function assemblyText(){
  var bod;
  bod = await audioChunks["at"](-1).arrayBuffer();
  status.textContent = "Status: Processing powered by AssemblyAI. Please wait.";
  headers = new Headers({'authorization': "86f53aeb8de048a6adc2fd5246a24177"});
  txt = await fetch('https://api.assemblyai.com/v2/upload',
  {'method':'POST', "headers":headers, "body":bod});
  txt = await txt.json();
  headers = new Headers({"authorization": "86f53aeb8de048a6adc2fd5246a24177",
                          "content-type": "application/json"});
  dat = {"audio_url": txt["upload_url"]};
  txt = await fetch("https://api.assemblyai.com/v2/transcript",
  {'method':'POST', "headers":headers, "body":JSON.stringify(dat)});
  txt = await txt.json();
  endpoint = "https://api.assemblyai.com/v2/transcript/"+txt['id'];
  headers = new Headers({'authorization': "86f53aeb8de048a6adc2fd5246a24177"});
  textFin = await fetch(endpoint, {'method':'GET', "headers":headers});
  textFin = await textFin.json();
  while(textFin['status'] != "completed" && textFin['status'] != "error"){
     textFin = await fetch(endpoint, {'method':'GET', "headers":headers});
     textFin = await textFin.json();
  }
  onSTTComplete();
  return textFin["text"];
}


// A trio of functions. I reccomend you put whatever dynamic UI things you want in these
function onRecording(){ //activates alongside
  status.textContent = "Status: Collecting voice data";
}
function onStopRecording(){
  status.textContent = "Status: Preparing voice data";
}
function onSTTComplete(){
  status.textContent = "Status: Complete";
}


const startButt = document.getElementById("startButton");
const stopButt = document.getElementById("stopButton");
const message = document.getElementById("message");
const status = document.getElementById("status");

microphone();

startButt.onclick = startRec;
stopButt.onclick = stopRec;
