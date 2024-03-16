$(document).ready(function() {
    // Klikkauskuuntelija nappulalle
    $("#button-sijainti").click(function(event) {
        // Estä tapahtuman leviäminen, jotta documentin klikkauskuuntelija ei välittömästi sulje dropdownia
        event.stopPropagation();
        // Togglettaa dropdownin näkyvyyden
        $("#dropdown-sijainti").toggle();
    });

    // Klikkauskuuntelija dropdownille, estää dropdownin sulkemisen klikattaessa sitä itseään
    $("#dropdown-sijainti").click(function(event) {
        event.stopPropagation();
    });

    // Klikkauskuuntelija documentille, sulkee dropdownin, jos klikattu muualla kuin nappulassa tai dropdownissa
    $(document).click(function() {
        $("#dropdown-sijainti").hide();
    });
});


$(document).ready(function() {
    // Klikkauskuuntelija nappulalle
    $("#button-osasto").click(function(event) {
        // Estä tapahtuman leviäminen, jotta documentin klikkauskuuntelija ei välittömästi sulje dropdownia
        event.stopPropagation();
        // Togglettaa dropdownin näkyvyyden
        $("#dropdown-osasto").toggle();
    });

    // Klikkauskuuntelija dropdownille, estää dropdownin sulkemisen klikattaessa sitä itseään
    $("#dropdown-osasto").click(function(event) {
        event.stopPropagation();
    });

    // Klikkauskuuntelija documentille, sulkee dropdownin, jos klikattu muualla kuin nappulassa tai dropdownissa
    $(document).click(function() {
        $("#dropdown-osasto").hide();
    });
});

$(document).ready(function() {
    // Kuuntele klikkaustapahtumia #dropdown-osasto sisällä oleville span-elementeille
    $("#dropdown-osasto span").click(function() {
        // Määritä tekstikenttä
        var textInput = $("#dropdown-osasto input[type='text']");
        // Tyhjennä tekstikentän sisältö
        textInput.val('');
        // Aseta kohdistin (focus) tekstikenttään
        textInput.focus();
    });
});
