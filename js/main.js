var cubes = [];
var types = ["good", "bad", "system", "empty"];
var numberOfGoodBadItems = 0;
function markAs(c, type) {
    var el = $("#" + c.id);
    //console.log("marked as good: " + c.id);
    $.each(types, function (index, name) {
        el.removeClass(name);
    });
    el.addClass(types[type]);
    c.type = type;
}
function markAsGood(c) {
    markAs(c, 0);
}
function markAsEmpty(c) {
    markAs(c, 3);
}
function markAsSystem(c) {
    markAs(c, 2);
}
function markAsBad(c) {
    markAs(c, 1);
}

function randomizeBadQubes(badCubes, callback) {
    var chances = 2;
    var markIt = Math.floor(Math.random() * chances);
    var delay = 1;

    //some of the bad cubes can be marked as good
    for (var i = 0; i < badCubes; i++) {
        if (cubes[i].type === 1) {
            if (markIt > 0) {
                delayMarkAsGood(cubes[i], delay * i);
            }
        } else {
            markIt = Math.floor(Math.random() * chances);
        }
        if ((badCubes - 1) === i) {
            setTimeout(function () {
                showMsg("Analysis complete.");
                showMsg("Defragmenting...");
                callback.call();
            }, (delay * i + 100));
        }
    }
}

function delayMarkAsGood(cube, t) {
    setTimeout(function () {
        markAsGood(cube);
    }, t);
}
function delayMarkAsEmpty(cube, t) {
    setTimeout(function () {
        markAsEmpty(cube);
    }, t);
}
function delayMarkAsSystem(cube, t) {
    setTimeout(function () {
        markAsSystem(cube);
    }, t);
}
function delayMarkAsBad(cube, t) {
    setTimeout(function () {
        markAsBad(cube);
    }, t);
}


function showMsg(m) {

    var d = $("<div class='popupmsg' style='display:none;'></div>").appendTo($("#wrapper"));
    d.html(m);
    d.show("slow", function () {
        setTimeout(function () {
            d.hide("slow", function () {
                d.remove();
            });
        }, 3000);
    });
}

$(function () {
    showMsg("Initializing");
    var mainDiv = $('#main');
    var elem = mainDiv;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
    //7px cubes
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();
    var size = 4;
    var parts = Math.floor(screenWidth / size) * Math.floor(screenHeight / size);
    var sectorCounter = 0;
    var i = 0;
    var badCubes = 0;
    var systemCubes = 0;
    while (i < parts) {
        var classType = Math.floor(Math.random() * 3) + 1;
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

    showMsg("Analyzing...");

    setTimeout(function () {
        randomizeBadQubes(badCubes, moveBadItemsToEnd);
    }, 1000);


});

function defrag() {
    var buffer = 10;
    var delay = 2;
    var timer = 1;
    var source = [];
    var target = [];
    var complete = true;
    // we fill out the empty spaces
    for (var i = 0; i < numberOfGoodBadItems; i++) {
        if (cubes[i].type === 3) {
            target.push(cubes[i]);
        }
        if (target.length >= buffer) {
            break;
        }
    }
    for (var i = cubes.length - 1; i >= 0; i--) {
        if (cubes[i].type === 1) {
            source.push(cubes[i]);
        }
        if (source.length >= target.length) {
            break;
        }
    }
    for (var i = 0; i < source.length; i++) {
        delayMarkAsEmpty(source[i], timer * delay);
        delayMarkAsGood(target[i], timer * delay);
    }
    timer++;
    if (source.length > 0) {
        complete = false;
    }

    //then we move the error elements to the end
    if (complete) {
        source = [];
        target = [];
        for (var i = 0; i < cubes.length; i++) {
            if (cubes[i].type === 2) {//system
                target.push(cubes[i]);
            }
            if (target.length >= buffer) {
                break;
            }
        }
        for (var j = cubes.length - 1; j >= 0; j--) {
            if (cubes[j].type === 3) {//empty
                source.push(cubes[j]);
            }
            if (source.length >= target.length) {
                break;
            }
        }
        if (Math.abs(i - j) >= (buffer * 2)) {
            for (var k = 0; k < source.length; k++) {
                delayMarkAsSystem(source[k], timer * delay);
                delayMarkAsEmpty(target[k], timer * delay);
            }
            timer++;
            if (source.length > 0) {
                complete = false;
            }
        } else {
            complete = true;
        }
    }

    if (complete) {
        showMsg("Complete");
    } else {
        setTimeout(function () {
            defrag();
        }, timer++ * delay);
    }
}

function moveBadItemsToEnd() {
    if (numberOfGoodBadItems === 0) {
        $(cubes).each(function (index, el) {
            if (el.type === 0 || el.type === 1) {
                numberOfGoodBadItems++;
            }
        });
    }
    //first we move bad items to make space for good ones
    var source = [];
    var target = [];
    var complete = true;
    var timer = 1;
    var delay = 2;
    var buffer = 10;
    for (var i = 0; i < numberOfGoodBadItems; i++) {
        if (cubes[i].type === 1) {//bad
            target.push(cubes[i]);
        }
        if (target.length >= buffer) {
            break;
        }
    }
    for (var j = cubes.length - 1; j >= 0; j--) {
        if (cubes[j].type === 3) {//empty
            source.push(cubes[j]);
        }
        if (source.length >= target.length) {
            break;
        }
    }
    if (Math.abs(i - j) >= (buffer * 2)) {
        for (var k = 0; k < source.length; k++) {
            delayMarkAsBad(source[k], timer * delay);
            delayMarkAsEmpty(target[k], timer * delay);
        }
        timer++;
        if (source.length > 0) {
            complete = false;
        }
    } else {
        complete = true;
    }

    if (complete) {
        setTimeout(function () {
            defrag();
        }, timer++ * delay);
    } else {
        setTimeout(function () {
            moveBadItemsToEnd();
        }, timer++ * delay);
    }
}
