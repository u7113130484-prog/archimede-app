import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

const firebaseConfig = {
  apiKey: "TA_CONFIG_ICI",
  authDomain: "TA_CONFIG_ICI",
  databaseURL: "TA_CONFIG_ICI",
  projectId: "TA_CONFIG_ICI",
  storageBucket: "TA_CONFIG_ICI",
  messagingSenderId: "TA_CONFIG_ICI",
  appId: "TA_CONFIG_ICI"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let username = null;

window.enterGame = function() {
  username = document.getElementById("username").value;
  if(!username) return alert("Entrez un prénom");

  document.getElementById("login-screen").style.display = "none";
  document.getElementById("selection-screen").style.display = "block";

  createBenchys();
};

function createBenchys() {
  const container = document.getElementById("benchy-container");

  for(let i=1;i<=8;i++) {

    const card = document.createElement("div");
    card.className = "benchy-card";

    const canvas = document.createElement("canvas");
    card.appendChild(canvas);

    container.appendChild(card);

    create3DScene(canvas, i);

    card.onclick = () => chooseBenchy(i);
  }

  listenLocks();
}

function create3DScene(canvas, index) {

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(200, 200);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
  scene.add(light);

  const loader = new GLTFLoader();

  loader.load(`models/_3DBenchy${index}.glb`, function(gltf) {
    const model = gltf.scene;
    model.scale.set(0.5,0.5,0.5);
    scene.add(model);

    function animate() {
      requestAnimationFrame(animate);
      model.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  });
}

function chooseBenchy(id) {

  const lockRef = ref(db, "locked/benchy"+id);
  set(lockRef, username);

  const playerRef = ref(db, "players/"+username);
  set(playerRef, id);

  document.getElementById("status").innerText = "Votre choix est validé";
}

function listenLocks() {
  const lockRef = ref(db, "locked");

  onValue(lockRef, (snapshot) => {
    const data = snapshot.val();
    const cards = document.querySelectorAll(".benchy-card");

    cards.forEach((card,index) => {
      const benchyID = index+1;

      if(data && data["benchy"+benchyID]) {
        card.style.opacity = "0.3";
        card.style.pointerEvents = "none";
      }
    });
  });
}
