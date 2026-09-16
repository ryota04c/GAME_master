export const gameState = {
    // 現在のゲーム状態
    state: "setting",

    // ゲーム情報
    game: {
        name: "",
        round: 0,
        maxRounds: Infinity,
        modules: {
            turn: false,
            timer: false,
            score: false,
            random: false,
            private: false,
            round: false,
            transition: false
        }
    },

    // プレイヤー
    players: [],

    // 現在のプレイヤー
    currentPlayer: null
};
