import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🔥 METS LA MEME CONFIG FIREBASE QUE DANS app.js
const firebaseConfig = {
  apiKey: "ICI",
  authDomain: "ICI",
  databaseURL: "ICI",
  projectId: "ICI",
  storageBucket: "ICI",
  messagingSenderId: "ICI",
  appId: "ICI"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const playerList = document.getElementById("player-list");

const playersRef = ref(db, "players");

onValue(playersRef, (snapshot) => {
  const data = snapshot.val();
  playerList.innerHTML = "";

  if(data) {
    Object.keys(data).forEach(player => {
      const div = document.createElement("div");
      div.innerText = player + " → Benchy " + (data[player] + 1);
      playerList.appendChild(div);
    });
  }
});

window.startExperiment = function() {
  const gameRef = ref(db, "game");
  update(gameRef, {
    phase: "experiment"
  });
};
