module.exports.generateID = function generateID(key = "xxxxxxxxxxxxxxxxxxxx") {
    var d = new Date().getTime();
    if (Date.now) {
        d = Date.now(); //high-precision timer
    }
    var uuid = key.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}