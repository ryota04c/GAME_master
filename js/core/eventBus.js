const events = {};


// イベントを登録する
export function on(eventName, callback) {

    if (!events[eventName]) {
        events[eventName] = [];
    }

    events[eventName].push(callback);
}


// イベントを発生させる
export function emit(eventName, data = null) {

    if (!events[eventName]) {
        return;
    }

    events[eventName].forEach(callback => {
        callback(data);
    });
}
