let data = null;

// ---------------------------------------------------------------------------------

export function init () {
    data = []
}

export function process (entry) {
    data.push(entry);
}

export function finish(object) {
    object.time_line = data;

    data = null;
}