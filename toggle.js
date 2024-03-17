$(document).ready(function() {
    // Klikkauskuuntelija nappulalle
    $("#button-sijainti").click(function(event) {
        // Estä tapahtuman leviäminen, jotta documentin klikkauskuuntelija ei välittömästi sulje dropdownia
        event.stopPropagation();
        // Togglettaa dropdownin näkyvyyden
        $("#dropdown-sijainti").toggle();
        $("#button-sijainti span").toggleClass('rotate-180');
    });

    // Klikkauskuuntelija dropdownille, estää dropdownin sulkemisen klikattaessa sitä itseään
    $("#dropdown-sijainti").click(function(event) {
        event.stopPropagation();
    });

    // Klikkauskuuntelija documentille, sulkee dropdownin, jos klikattu muualla kuin nappulassa tai dropdownissa
    $(document).click(function() {
        $("#dropdown-sijainti").hide();
        $("#button-sijainti span").removeClass('rotate-180');

    });
});


$(document).ready(function() {
    // Klikkauskuuntelija nappulalle
    $("#button-osasto").click(function(event) {
        // Estä tapahtuman leviäminen, jotta documentin klikkauskuuntelija ei välittömästi sulje dropdownia
        event.stopPropagation();
        // Togglettaa dropdownin näkyvyyden
        $("#dropdown-osasto").toggle();
        $("#button-osasto span").toggleClass('rotate-180');
    });

    // Klikkauskuuntelija dropdownille, estää dropdownin sulkemisen klikattaessa sitä itseään
    $("#dropdown-osasto").click(function(event) {
        event.stopPropagation();
    });

    // Klikkauskuuntelija documentille, sulkee dropdownin, jos klikattu muualla kuin nappulassa tai dropdownissa
    $(document).click(function() {
        $("#dropdown-osasto").hide();
        $("#button-osasto span").removeClass('rotate-180');
    });
});

$(document).ready(function() {
    // Kuuntele klikkaustapahtumia #dropdown-osasto sisällä oleville span-elementeille
    $("#hakukentta span").click(function() {
        // Määritä tekstikenttä
        var textInput = $("#hakukentta input[type='text']");
        // Tyhjennä tekstikentän sisältö
        textInput.val('');
        // Aseta kohdistin (focus) tekstikenttään
        textInput.focus();
    });
});
