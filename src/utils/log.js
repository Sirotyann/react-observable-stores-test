function log() {
    _log(arguments, '#999999');
}

const _log = (_arguments, color) => {
    const params = Array.prototype.slice.apply(_arguments);
    const message = params.shift();
    console.log.apply(null, [`%c ${message}`, `color: ${color};`, ...params]);
}

log.info = function() {
    _log(arguments, '#8ac6f9');
}

export default log;
