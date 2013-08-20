var timerStarted = false;
var startTime = '';
var allSubtitlesArray = [];

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

    // Hide everything except the video div
    //$("#transcriptDiv").hide();
    $("#clickNextDiv").hide();
    $("#videoDiv").show();

    // Make them add the video first
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

        $("#addVideo").hide();
        $("#youtubeSrc").hide();
        $("#transcriptDiv").show();
    });


    var transcript = [];
    $("#addTranscript").on('click', function() {
        var rawText = $("#transcriptText").val();
        if  (rawText.length == 0) {
            alert("Blaargh! Add the transcript first");
            return false;
        }

        // Parse and load the text
        var allLines = rawText.split('\n');
        $.each(allLines, function(idx, line) {
            if (!line || /^\s*$/.test(line))
                dummy=1;
            else
                transcript.push(line);
        });

        $("#transcriptDiv").hide();
        $("#clickNextDiv").show();
    });

    function addToSubtitle (start, end, text) {
        var presentText = $("#sbv").html();
        newText = presentText + start + ',' + end + '\n' + text +'\n';
        $("#sbv").html(newText);
    }

    function removeTop() {
        // Removes the topmost line from the transcript text and returns it
        if (transcript.length == 0) {
            console.log("Nothing in transcript");
            $("#textStart").addClass("disabled");
            $("#gap").addClass("disabled");
            return '';
        }

        console.log("Transcript before");
        console.log(transcript.length);
        var topMostText = transcript.splice(0,1);
        $("#nextDialogue").html(topMostText);
        console.log("Transcript after");
        console.log(transcript.length);

        return topMostText;
    }

    var lastTimeDiff = '00:00:00';
    $("#startTimer").on('click', function() {
        timerStarted = true;
        startTime = moment();
        $("#sbv").html("");
        $("#textStart").removeClass("disabled");
        $("#gap").removeClass("disabled");
        $("#startTimer").hide();
        return false;
    });

    $("#textStart").on('click', function() {
        timeDiffNow = getTimeFromStart();
        var currentText = removeTop();
        addToSubtitle(lastTimeDiff,timeDiffNow,currentText);
        lastTimeDiff = timeDiffNow;

        return false;
    });
});
