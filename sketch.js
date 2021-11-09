let mic, recorder, soundFile;
let retakeBtn;
let saveBtn;
let state = 0;
let l;
let size = 0.2;
let msg = "stanby";
function setup() {
  createCanvas(windowWidth, windowHeight / 2);
  background(0);
  fill(0);
  l = width * 0.4;
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  recorder = new p5.SoundRecorder();
  console.log(recorder);
  recorder.setInput(mic);
  soundFile = new p5.SoundFile();
  textAlign(CENTER, CENTER);
}

function draw() {
  let vol = mic.getLevel();
  let spectrum = fft.analyze();
  background(0);

  if (state == 0) {
    msg = "stanby";
    fill(255, 0, 0, 80);
    noStroke();
    ellipse(width * 0.5, height * 0.5, width * 0.4, width * 0.4);
    size = 0.1;
    TheWave(spectrum);
  } else if (state == 1) {
    fill(255, 0, 0);
    noStroke();
    ellipse(width * 0.5 + vol * 20, height * 0.5, width * 0.4, width * 0.4);
    ellipse(width * 0.5, height * 0.5 + vol * 20, width * 0.4, width * 0.4);
    ellipse(width * 0.5 - vol * 20, height * 0.5, width * 0.4, width * 0.4);
    ellipse(width * 0.5, height * 0.5 - vol * 20, width * 0.4, width * 0.4);
    ellipse(width * 0.5, height * 0.5, width * 0.4, width * 0.4);
    l = width * 0.4 + vol * 20;
    TheWave(spectrum);
    msg = "recording...";
  } else if (state == 2) { 
    if (!soundFile._playing) {
      soundFile.play();
      let waveFFT = new p5.FFT();
      waveFFT.setInput(soundFile);
      let spectrum = waveFFT.analyze();
    } else {
      msg = "playing";
    }
    
    Btn("save", 100, height - 50);
    fill(0, 125, 0, 80);
    ellipse(width * 0.5 + vol * 20, height * 0.5, width * 0.4, width * 0.4);
    ellipse(width * 0.5, height * 0.5 + vol * 20, width * 0.4, width * 0.4);
    ellipse(width * 0.5 - vol * 20, height * 0.5, width * 0.4, width * 0.4);
    ellipse(width * 0.5, height * 0.5 - vol * 20, width * 0.4, width * 0.4);
    ellipse(width * 0.5, height * 0.5, width * 0.4, width * 0.4);
    TheWave(spectrum);
    msg = "isPlaying.";
  } else if (state == 3) {
    msg = "saveing";
    state = 0;
  }
  stroke(255);
  text(msg, width * 0.5, height * 0.5);

  

}

function Btn(_text, _x, _y) {
  ellipse(_x, _y, 50, 50);
  text(_text, _x, _y);
}

function saveWav() {
  saveSound(soundFile, "mySound.wav"); // save file
  state++;
}

function retake() {
  soundFile.stop();
  soundFile = new p5.SoundFile();
  state = 0;
}

function mousePressed() {
  if (width * 0.3 < mouseX && width * 0.7 > mouseX) {
    if (state === 0 && mic.enabled) {
      userStartAudio();
      recorder.record(soundFile);

      background(255, 0, 0);
      text("Recording now!", 20, 20);
      state++;
    } else if (state === 1) {
      recorder.stop();
      background(0, 255, 0);
      text("Recording stopped.", 20, 20);
      state++;
    } else if(state === 2){
      retake();
    }
  }

  if (mouseX > 0 && mouseX < width * 0.3) {
    if (state == 2) {
      saveWav();
    }
  }
}

function TheWave(spectrum) {
  noFill();
  push();
  translate(width * 0.5, height * 0.5);
  rotate(frameCount * 0.001);

  let z = (frameCount % 500) / 500;
  for (let i = 0; i < 6; i++) {
    let n = floor(random(1, 3)) * random([-1, 1]);
    let h = random(5, l / 6);
    h *= -sq(2 * z - 1) + 1;
    stroke(i * 100, 80);
    strokeWeight(i);
    makeWave(spectrum[i] / 100, spectrum[i] * size, spectrum[i] / 100);
  }
  pop();
}

function makeWave(n, h, sp) {
  push();
  let t = (TWO_PI * (frameCount % 500)) / 500;
  beginShape();
  for (let x = -l / 2; x < l / 2; x++) {
    let z = map(x, -l / 2, l / 2, 0, 1);
    let alpha = -sq(2 * z - 1) + 1;
    let off = sin((n * TWO_PI * (x + l / 2)) / l + sp * t) * h * alpha;
    curveVertex(x, off);
  }
  endShape();
  pop();
}
