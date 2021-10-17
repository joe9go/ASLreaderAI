//variable declaration
var audioChunks = [];
var mediaRecorder;
var mic;
var textFin;
var txt;
var ASLMode = 0;

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
    await assemblyText();
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
  message.textContent = textFin["text"];
  onSTTComplete();
}

function updateEmbeds(){
  base = "<div style=\"float:left;padding:5px;\"> <video  width=\"320\" height=\"240\" autoplay=\"1\" loop=\"true\" src=\""; ;
  inner = "";
  arr = message.textContent.split(" ");
  for(const element of arr){
    inner = inner+base+getVideoUrl(element)+" title=\"" + element +"\"></video></div>"
  }
  ASLVideo.innerHTML = inner;
}

function getVideoUrl(name){
  str = name.replace(/[^\w\s]|_/g, "")
         .replace(/\s+/g, " ").toLowerCase();
  attempt = "";
  if(ASLMode == 0){
      attempt = "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/"+str+".mp4\"";
  }
  else if(ASLMode == 1){
      attempt = "https://media.signbsl.com/videos/asl/aslbricks/mp4/"+str+".mp4\"";
  }
  else if(ASLMode == 2){
      attempt = "https://media.signbsl.com/videos/asl/startasl/mp4/"+str+".mp4\"";
  }
  return attempt;
}

function switchInterpreter(){
  ASLMode = (ASLMode+1)%3;
  updateEmbeds();
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
  updateEmbeds();
}

const startButt = document.getElementById("startButton");
const stopButt = document.getElementById("stopButton");
const interpreterButton = document.getElementById("ASLmode");
const message = document.getElementById("message");
const status = document.getElementById("status");
const ASLVideo = document.getElementById("ASLVideo");

microphone();

startButt.onclick = startRec;
stopButt.onclick = stopRec;
interpreterButton.onclick = switchInterpreter;
