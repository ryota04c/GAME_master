export function createPlayer(id) {

    return {
        id: id,
        name: "",
        seat: 0,
        score: 0,
        timer: null,
        status: "playing"
    };
}
