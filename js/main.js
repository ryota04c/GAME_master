const screens = {
    gameSelect: document.getElementById("gameSelectScreen"),
    setting: document.getElementById("settingScreen"),
    preparing: document.getElementById("preparingScreen"),
    round: document.getElementById("roundScreen"),
    gameEnd: document.getElementById("gameEndScreen")
};


// 画面を切り替える関数
function showScreen(screen) {

    Object.values(screens).forEach(element => {
        element.classList.add("hidden");
    });

    screen.classList.remove("hidden");
}


// NEW GAME
document.getElementById("newGameButton").onclick = () => {
    showScreen(screens.setting);
};


// SETTING → PREPARING
document.getElementById("toPreparingButton").onclick = () => {
    showScreen(screens.preparing);
};


// PREPARING → GAME
document.getElementById("gameStartButton").onclick = () => {
    showScreen(screens.round);
};


// GAME → GAME END
document.getElementById("gameEndButton").onclick = () => {
    showScreen(screens.gameEnd);
};


// GAME END → GAME SELECT
document.getElementById("returnButton").onclick = () => {
    showScreen(screens.gameSelect);
};
