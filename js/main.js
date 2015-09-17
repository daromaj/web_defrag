$(function () {
    var mainDiv = $('#main');
    //7px cubes
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();
    var parts = Math.floor(screenWidth / 7) * Math.floor(screenHeight / 7);
    var sectorCounter = 0;
    var i = 0;
    var types = ["good", "bad", "system", "empty"];
    while (i < parts) {
        $(mainDiv).append("<span id='sector" + sectorCounter + "'></span");
        var sector = $("#sector" + sectorCounter);
        var classType = Math.floor(Math.random()*4);
        sector.addClass(types[classType]);
        var sectorSize = ((parts - i) > 10) ? Math.floor((Math.random() * 10) + 1) : (parts - i);
        for (var j = 0; j < sectorSize; j++) {
            sector.append("<span id='part" + (i + j) + "' class='cube'></span>");
        }
        i += sectorSize;
        sectorCounter++;
    }
})