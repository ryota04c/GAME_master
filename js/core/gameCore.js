import { gameState } from "./gameState.js";
import { createPlayer } from "./playerState.js";
import { on, emit } from "./eventBus.js";



export const gameCore = {

    // ゲームを初期化
    initialize(playerCount = 4) {
    
        gameState.state = "setting";
    
        gameState.game = {
            name: "",
            round: 0,
            maxRounds: Infinity
        };
    
        gameState.players = [];
    
        for (let i = 1; i <= playerCount; i++) {
    
            const player = createPlayer(`p${i}`);
    
            // 初期座席
            player.seat = i - 1;
    
            gameState.players.push(player);
        }
    
        gameState.currentPlayer = null;
    },
    //ゲーム開始
    startGame() {
    
        gameState.state = "round";
    
        gameState.game.round = 1;
    
        emit("GAME_START");
        emit("ROUND_START");
    },

    // ゲームを終了
    endGame() {

        gameState.state = "gameEnd";

        emit("GAME_END");
    },


    // 現在の状態を取得
    getState() {

        return gameState;
    }
};
