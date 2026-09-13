export const gameState = {
    // 現在のゲーム状態
    state: "setting",

    // ゲーム情報
    game: {
        name: "",
        round: 0,
        maxRounds: Infinity
    },

    // プレイヤー
    players: [],

    // 現在のプレイヤー
    currentPlayer: null
};
