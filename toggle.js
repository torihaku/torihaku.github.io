$(document).ready(function() {

    $("#button-sijainti").click(function(event) {
        event.stopPropagation();
        $("#dropdown-sijainti").toggle();
        $("#button-sijainti span").toggleClass('rotate-180');
        $("#dropdown-osasto").hide();
    });

    $("#button-osasto").click(function(event) {
        event.stopPropagation();
        $("#dropdown-osasto").toggle();
        $("#button-osasto span").toggleClass('rotate-180');
        $("#dropdown-sijainti").hide();
    });

    $("#dropdown-osasto").click(function(event) {
        event.stopPropagation();
    });

    $("#dropdown-sijainti").click(function(event) {
        event.stopPropagation();
    });

    $(document).click(function() {
        $("#dropdown-osasto").hide();
        $("#dropdown-sijainti").hide();
        $("#button-osasto span").removeClass('rotate-180');
        $("#button-sijainti span").removeClass('rotate-180');
    });

    $("#hakukentta span").click(function() {
        var textInput = $("#hakukentta input[type='text']");
        textInput.val('');
        textInput.focus();
    });
});
