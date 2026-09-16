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
const moduleInputs = {
    turn: document.getElementById("moduleTurn"),
    timer: document.getElementById("moduleTimer"),
    score: document.getElementById("moduleScore"),
    random: document.getElementById("moduleRandom"),
    private: document.getElementById("modulePrivate"),
    round: document.getElementById("moduleRound"),
    transition: document.getElementById("moduleTransition")
};


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

    const state = gameCore.getState();


    // ====================
    // プレイヤー名を保存
    // ====================

    state.players.forEach((player, index) => {

        const input = document.getElementById(
            `playerName${index + 1}`
        );

        player.name = input.value;
    });


    // ====================
    // モジュール設定を保存
    // ====================

    Object.keys(moduleInputs).forEach(moduleName => {

        state.game.modules[moduleName] =
            moduleInputs[moduleName].checked;
    });


    // ====================
    // PREPARING画面へ
    // ====================

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
    let draggedElement = null;
    let draggedStartSeat = null;
    let dropTarget = null;
    
    // ====================
    // ドラッグ開始
    // ====================
    
    seatBoard.addEventListener("pointerdown", event => {
    
        const seat =
            event.target.closest(".seat");
    
        if (!seat) {
            return;
        }
    
        draggedPlayer =
            seat.dataset.playerId;
    
        draggedElement = seat;
    
        // ドラッグ開始時の座席を保存
        const player =
            gameCore.getState().players.find(
                p => p.id === draggedPlayer
            );
    
        draggedStartSeat = player.seat;
    
        seat.classList.add("dragging");
    
        seat.setPointerCapture(event.pointerId);
    });
    
    
    // ====================
    // ドラッグ中
    // ====================
    
    seatBoard.addEventListener("pointermove", event => {
    
        if (!draggedElement) {
            return;
        }
    
        const rect =
            seatBoard.getBoundingClientRect();
    
        const x =
            event.clientX - rect.left;
    
        const y =
            event.clientY - rect.top;
    
    
        // ====================
        // ドラッグ中のプレイヤーを移動
        // ====================
    
        draggedElement.style.left =
            `${x}px`;
    
        draggedElement.style.top =
            `${y}px`;
    
    
        // ====================
        // 一番近い座席を探す
        // ====================
    
        let nearestSeat = null;
        let minDistance = Infinity;
    
        const seats =
            seatBoard.querySelectorAll(".seat");
    
        seats.forEach(seat => {
    
            // ドラッグしている自分自身は除外
            if (seat === draggedElement) {
                return;
            }
    
            const seatRect =
                seat.getBoundingClientRect();
    
            const centerX =
                seatRect.left +
                seatRect.width / 2 -
                rect.left;
    
            const centerY =
                seatRect.top +
                seatRect.height / 2 -
                rect.top;
    
            const dx =
                x - centerX;
    
            const dy =
                y - centerY;
    
            const distance =
                Math.sqrt(
                    dx * dx + dy * dy
                );
    
    
            if (distance < minDistance) {
    
                minDistance = distance;
                nearestSeat = seat;
            }
        });
    
    
        // ====================
        // 前の候補を解除
        // ====================
    
        if (dropTarget) {
    
            dropTarget.classList.remove(
                "drop-target"
            );
        }
    
    
        // ====================
        // 一定距離以内なら候補
        // ====================
    
        const dropDistance = 100;
    
        if (
            nearestSeat &&
            minDistance <= dropDistance
        ) {
    
            dropTarget = nearestSeat;
    
            dropTarget.classList.add(
                "drop-target"
            );
    
        } else {
    
            dropTarget = null;
        }
    });
        
    
    // ====================
    // ドラッグ終了
    // ====================
    
    seatBoard.addEventListener("pointerup", event => {
    
        if (!draggedElement) {
            return;
        }
    
        // ====================
        // 入れ替え先
        // ====================
    
        const targetSeat = dropTarget;
    
    
        // ====================
        // 自分自身なら何もしない
        // ====================
    
        if (
            targetSeat &&
            targetSeat !== draggedElement
        ) {
    
            const targetPlayerId =
                targetSeat.dataset.playerId;
    
            const players =
                gameCore.getState().players;
    
            const playerA =
                players.find(
                    p => p.id === draggedPlayer
                );
    
            const playerB =
                players.find(
                    p => p.id === targetPlayerId
                );
    
            if (playerA && playerB) {
    
                const temp =
                    playerA.seat;
    
                playerA.seat =
                    playerB.seat;
    
                playerB.seat =
                    temp;
            }
        }
    
    
        // ====================
        // 表示をリセット
        // ====================
    
        if (dropTarget) {
    
            dropTarget.classList.remove(
                "drop-target"
            );
        }
    
        draggedElement.style.left = "";
        draggedElement.style.top = "";
    
        draggedElement.classList.remove(
            "dragging"
        );
    
    
        // ====================
        // 状態をリセット
        // ====================
    
        draggedPlayer = null;
        draggedElement = null;
        draggedStartSeat = null;
        dropTarget = null;
    
    
        // ====================
        // 画面更新
        // ====================
    
        updatePreparingScreen();
    });
