function updateClock() {
    var date = new Date();
    var hour = date.getHours() + ':' + date.getMinutes();
    $("#clock").html(hour);
}

$(document).ready(function () {
    setInterval('updateClock()', 1000);
});
