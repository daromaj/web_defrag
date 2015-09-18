var cubes = [];
var types = ["good", "bad", "system", "empty"];
function markAsGood(c) {
    var el = $("#" + c.id);
    el.removeClass("bad");
    el.addClass("good");
    c.type = 0;
}
$(function () {
    var mainDiv = $('#main');
    //7px cubes
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();
    var parts = Math.floor(screenWidth / 7) * Math.floor(screenHeight / 7);
    var sectorCounter = 0;
    var i = 0;
    var badCubes = 0;
    var systemCubes = 0;
    var emptyCubes = 0;
    while (i < parts) {
//        $(mainDiv).append("<span id='sector" + sectorCounter + "'></span");
//        var sector = $("#sector" + sectorCounter);
        var classType = Math.floor(Math.random() * 3) + 1;
//        sector.addClass(types[classType]);
        var sectorSize = ((parts - i) > 10) ? Math.floor((Math.random() * 10) + 1) : (parts - i);
        for (var j = 0; j < sectorSize; j++) {
            var id = "part" + (i + j);
            mainDiv.append("<span id='" + id + "' class='cube " + types[classType] + "'></span>");
            switch (classType) {
                case 1:
                    badCubes++;
                    break;
                case 2:
                    systemCubes++;
                    break;
            }
            cubes.push({
                id: id,
                type: classType,
                index: (i + j)
            });
        }
        i += sectorSize;
        sectorCounter++;
    }
    //some of the bad cubes can be marked as good
    for (var i = 0; i < badCubes; i++) {
        if (cubes[i].type === 1) {
            setTimeout(function () {
                markAsGood(cubes[i]);
            }, 100 * i);
        }
    }
    //screen ready
    //simple find and replace
});

