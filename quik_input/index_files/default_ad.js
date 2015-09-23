function getHtml() {
    _Default.GetHtml(getHtml_ccallback);

}

function getHtml_ccallback(result) {
    if (result.error)
        return;
    if (result.value == null || result.value.length == 0)
        return;
    document.getElementById("content").innerHTML = result.value;
    dynamic_selection();
}
function dynamic_selection() {
    $("#featured > ul").tabs({ fx: { opacity: "toggle"} }).tabs("rotate", 5000, true);

    var $t = Math.round(Math.random());
    $("#upC").click(function () {
        $t++; if ($t >= 1) { $t = 1; $(this).addClass("disable"); };
        $("#rollContent").animate({ "top": -180 * $t });
        $("#downC").removeClass("disable");
        $("#numShow > em").text($t * 4 + "-" + ($t + 1) * 3);
    });
    $("#downC").click(function () {
        $t--; if ($t <= 0) { $t = 0; $(this).addClass("disable"); }
        $("#rollContent").animate({ "top": -180 * $t });
        $("#upC").removeClass("disable");
        $("#numShow>em").text($t * 2 + 1 + "-" + ($t + 1) * 3);
    });

    function ShowAD() {
        $t = Math.round(Math.random());
        $("#numShow>em").text($t * 3 + 1 + "-" + ($t + 1) * 3);
        if ($t == 0) { $("#downC").addClass("disable"); $("#upC").removeClass("disable"); }
        if ($t == 1) { $("#upC").addClass("disable"); $("#downC").removeClass("disable"); }
        $("#rollContent").animate({ "top": -180 * $t });
    }
    setInterval(ShowAD, 5000);
    ShowAD();
}