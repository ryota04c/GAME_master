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
const preparingPlayers =
    document.getElementById("preparingPlayers");
const seatBoard =
    document.getElementById("seatBoard");


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

    updatePreparingScreen();

    showScreen(screens.preparing);
};


//preparing生成
function updatePreparingScreen() {

    const state = gameCore.getState();

    // ====================
    // プレイヤー一覧
    // ====================

    preparingPlayers.innerHTML = "";

    state.players.forEach(player => {

        const element = document.createElement("div");

        element.className = "preparingPlayer";

        element.textContent =
            `${player.id} : ${player.name || "名前未入力"}`;

        preparingPlayers.appendChild(element);

    });


    // ====================
    // 座席
    // ====================
    
    seatBoard.innerHTML = "";
    
    state.players.forEach(player => {
    
        const element =
            document.createElement("div");
    
        element.className =
            `seat seat-${player.seat}`;
    
        element.textContent =
            player.name || player.id;
    
        // ドラッグ対象
        element.dataset.playerId = player.id;
    
        seatBoard.appendChild(element);

    });
}


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

//ドラッグ処理
    let draggedPlayer = null;
    // 座席を押した
    seatBoard.addEventListener("pointerdown", event => {
    
        const seat = event.target.closest(".seat");
    
        if (!seat) {
            return;
        }
    
        draggedPlayer =
            seat.dataset.playerId;
    
        seat.setPointerCapture(event.pointerId);
    
    });
    //指を離した
    seatBoard.addEventListener("pointerup", event => {
    
        if (!draggedPlayer) {
            return;
        }
    
        console.log(
            "ドラッグ終了:",
            draggedPlayer
        );
    
        draggedPlayer = null;
    
    });
