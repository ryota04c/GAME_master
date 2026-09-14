import { gameCore } from "./core/gameCore.js";


// ====================
// 画面
// ====================

const screens = {
    gameSelect: document.getElementById("gameSelectScreen"),
    setting: document.getElementById("settingScreen"),
    preparing: document.getElementById("preparingScreen"),
    round: document.getElementById("roundScreen"),
    gameEnd: document.getElementById("gameEndScreen")
};
const playerCount = document.getElementById("playerCount");
const playerInputs = document.querySelectorAll(".playerInput");


// ====================
// 画面切り替え
// ====================

function showScreen(screen) {

    Object.values(screens).forEach(element => {
        element.classList.add("hidden");
    });

    screen.classList.remove("hidden");
}


// ====================
// NEW GAME
// ====================

document.getElementById("newGameButton").onclick = () => {

    gameCore.initialize(
        Number(playerCount.value)
    );

    updatePlayerInputs();

    showScreen(screens.setting);
};

function updatePlayerInputs() {

    const count = Number(playerCount.value);

    playerInputs.forEach((element, index) => {

        if (index < count) {
            element.style.display = "block";
        } else {
            element.style.display = "none";
        }

    });
}

playerCount.onchange = () => {

    updatePlayerInputs();

};

// ====================
// SETTING → PREPARING
// ====================

document.getElementById("toPreparingButton").onclick = () => {

    const players = gameCore.getState().players;

    players.forEach((player, index) => {

        const input = document.getElementById(
            `playerName${index + 1}`
        );

        player.name = input.value;

    });

    console.log(gameCore.getState());

    showScreen(screens.preparing);
};


// ====================
// GAME START
// ====================

document.getElementById("gameStartButton").onclick = () => {

    // Game Coreにゲーム開始を伝える
    gameCore.startGame();

    // ゲーム画面へ
    showScreen(screens.round);
};


// ====================
// GAME → GAME END
// ====================

document.getElementById("gameEndButton").onclick = () => {

    // Game Coreにゲーム終了を伝える
    gameCore.endGame();

    // 終了画面へ
    showScreen(screens.gameEnd);
};


// ====================
// GAME END → GAME SELECT
// ====================

document.getElementById("returnButton").onclick = () => {

    showScreen(screens.gameSelect);
};
