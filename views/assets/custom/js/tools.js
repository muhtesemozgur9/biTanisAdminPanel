function generateId(key = undefined){
    var d = new Date().getTime();
    if (Date.now) {
        d = Date.now(); //high-precision timer
    }
    var uuid;
    if(key !== undefined){
        uuid = key.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }else{
        uuid = 'xxxxxxxxxxxxxxxxxxxxxxxx-yyxyx-xxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    return uuid;
}

function isoDateToHuman(isoDate) {

    const [date, time] = isoDate.split('T');
    const humanTime = time.split('.').slice(0, 1);

    return [date, humanTime].join(' ');
}

function addWaitProcess(){
    $('[data-tooltip="tooltip"]').tooltip("hide");
    $(".btn").addClass("disabled");
    $(".btn").attr("disabled","disabled");
    $("body").append("<div id=\"waitProcess\"></div>");
}

function removeWaitProcess(){
    $('[data-tooltip="tooltip"]').tooltip();
    $(".btn").removeClass("disabled");
    $(".btn").removeAttr("disabled");
    $("#waitProcess").remove();
}

