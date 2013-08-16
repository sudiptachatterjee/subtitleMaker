var timerStarted = false;
var startTime = '';

// Returns an HH:MM:SS.SSS formatted timestamp that shows how far it has
// been since the first click
function getTimeFromStart() {
    var timeNow = moment();
    var timeSince = timeNow.diff(startTime);

    var ss = timeSince%1000;
    var x = parseInt(timeSince/1000);
    var s = x%60;
    x /= 60;
    var m = parseInt(x%60);
    x /= 60;
    var h = parseInt(x%24);
    var timeFromStart = h+':'+m+':'+s+'.'+ss;

    return timeFromStart;
}

$(document).ready(function () {

    function addToSubtitle (start, end, text) {
        var presentText = $("#sbv").html();
        newText = presentText + start + ',' + end + '\n' + text +'\n';
        $("#sbv").html(newText);
    }

    function removeTop() {
        // Removes the topmost line from the subtitle text and returns it
        var currentText = $("#subtitle").val();
        if (!currentText) {
            $("#add").addClass("disabled");
            $("#gap").addClass("disabled");

            return '';
        }

        currentText = currentText.split('\n');

        
        var topMostText = '';
        while (topMostText.length == 0) {
            topMostText = currentText.splice(0,1)[0];
        }
        $("#subtitle").val(currentText.join('\n'));

        return topMostText;
    }

    $("#addVideo").on('click',function() {
        var youSrc = $("#youtubeSrc").val();
        if (youSrc.length == 0) {
            alert("Blaargh! Post the link");
            return false;
        }

        // To prevent same-origin policy restrictions, 
        // change the watch link to say embed
        // http://stackoverflow.com/a/8521287/433252
        youSrc = youSrc.replace('watch?v=','embed/');

        $("#embedYoutube").attr('src',youSrc)
            .attr('width',"420")
            .attr('height',"275");

        $("#addVideo").addClass("disabled").removeClass("btn-info");
        $("#youtubeSrc").addClass("disabled");
        $("#add").addClass("btn-info").removeClass("disabled");
        $("#gap").addClass("btn-inverse").removeClass("disabled");
    });

    var lastTimeDiff = '00:00:00';
    $("#add").on('click', function() {
        if (timerStarted == false) {
            timerStarted = true;
            startTime = moment();
            $("#sbv").html("");
            return false;
        }

        timeDiffNow = getTimeFromStart();
        var currentText = removeTop();
        addToSubtitle(lastTimeDiff,timeDiffNow,currentText);
        lastTimeDiff = timeDiffNow;

        return false;
    });
});
