// ============================
// FIREBASE IMPORTS
// ============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ============================
// THREE JS IMPORTS
// ============================

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

// ============================
// FIREBASE CONFIG
// ============================

const firebaseConfig = {
  apiKey: "AIzaSyDYpNJwqoFQTqSYcpBSA_CoqydWmOmJ7gA",
  authDomain: "mission-expertise-archimede.firebaseapp.com",
  databaseURL: "https://mission-expertise-archimede-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mission-expertise-archimede",
  storageBucket: "mission-expertise-archimede.firebasestorage.app",
  messagingSenderId: "134132081055",
  appId: "1:134132081055:web:7dd963f770f2376b609daa"
};

// ============================
// INITIALISATION
// ============================

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let username = null;

// ============================
// LOGIN
// ============================

window.enterGame = function () {
  const input = document.getElementById("username");
  if (!input.value) {
    alert("Entrez un prénom");
    return;
  }

  username = input.value;

  document.getElementById("login-screen").style.display = "none";
  document.getElementById("selection-screen").style.display = "block";

  createBenchys();
};

// ============================
// CREATION BENCHYS 3D
// ============================

function createBenchys() {
  const container = document.getElementById("benchy-container");
  container.innerHTML = "";

  for (let i = 1; i <= 8; i++) {
    const card = document.createElement("div");
    card.className = "benchy-card";

    const canvas = document.createElement("canvas");
    card.appendChild(canvas);

    container.appendChild(card);

    create3DScene(canvas, i);

    card.addEventListener("click", () => chooseBenchy(i));
  }

  listenLocks();
}

// ============================
// SCENE 3D
// ============================

function create3DScene(canvas, index) {

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.set(0, 1, 3);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
  renderer.setSize(200, 200);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
  scene.add(light);

  const loader = new GLTFLoader();

  loader.load(`models/_3DBenchy${index}.glb`, function (gltf) {

    const model = gltf.scene;
    model.scale.set(0.6, 0.6, 0.6);
    scene.add(model);

    function animate() {
      requestAnimationFrame(animate);
      model.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    animate();
  });
}

// ============================
// SELECTION
// ============================

function chooseBenchy(id) {

  const lockRef = ref(db, "locked/benchy" + id);

  set(lockRef, username);

  const playerRef = ref(db, "players/" + username);
  set(playerRef, id);

  document.getElementById("status").innerText = "Votre choix est validé";
}

// ============================
// ECOUTE DES VERROUILLAGES
// ============================

function listenLocks() {

  const lockRef = ref(db, "locked");

  onValue(lockRef, (snapshot) => {

    const data = snapshot.val();
    const cards = document.querySelectorAll(".benchy-card");

    cards.forEach((card, index) => {

      const benchyID = index + 1;

      if (data && data["benchy" + benchyID]) {
        card.style.opacity = "0.3";
        card.style.pointerEvents = "none";
      }
    });
  });
}
