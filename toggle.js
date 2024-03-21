$(document).ready(function() {
    // Klikkauskuuntelija nappulalle
    /*
    $("#button-sijainti").click(function(event) {
        // Estä tapahtuman leviäminen, jotta documentin klikkauskuuntelija ei välittömästi sulje dropdownia
        event.stopPropagation();
        // Togglettaa dropdownin näkyvyyden
        $("#dropdown-sijainti").toggle();
        $("#button-sijainti span").toggleClass('rotate-180');
        $("#dropdown-osasto").hide();
    });*/

    // Klikkauskuuntelija nappulalle
    $("#button-sijainti").click(function(event) {
        // Tarkista, tuleeko klikkaus suoraan #button-sijainti elementiltä tai sen lapselta, joka ei ole p-elementti
        if (!$(event.target).is("span") && !$(event.target).closest("span").length) {
            // Estä tapahtuman leviäminen, jotta documentin klikkauskuuntelija ei välittömästi sulje dropdownia
            event.stopPropagation();
            // Togglettaa dropdownin näkyvyyden
            $("#dropdown-sijainti").toggle();
            $("#button-sijainti span").toggleClass('rotate-180'); // Olettaen, että tämä pyörittää nuolta tai vastaavaa
            $("#dropdown-osasto").hide(); // Piilottaa toisen dropdownin, jos se on avoinna
        }
    });
    // Klikkauskuuntelija nappulalle
    $("#button-osasto").click(function(event) {
        // Tarkista, tuleeko klikkaus suoraan #button-osasto elementiltä tai sen lapselta, joka ei ole p-elementti
        if (!$(event.target).is("span") && !$(event.target).closest("span").length) {
            // Estä tapahtuman leviäminen, jotta documentin klikkauskuuntelija ei välittömästi sulje dropdownia
            event.stopPropagation();
            // Togglettaa dropdownin näkyvyyden
            $("#dropdown-osasto").toggle();
            $("#button-osasto span").toggleClass('rotate-180'); // Olettaen, että tämä pyörittää nuolta tai vastaavaa
            $("#dropdown-sijainti").hide(); // Piilottaa toisen dropdownin, jos se on avoinna
        }
    });

    // Klikkauskuuntelija dropdownille, estää dropdownin sulkemisen klikattaessa sitä itseään
    $("#dropdown-osasto").click(function(event) {
        event.stopPropagation();
    });

    // Klikkauskuuntelija dropdownille, estää dropdownin sulkemisen klikattaessa sitä itseään
    $("#dropdown-sijainti").click(function(event) {
        event.stopPropagation();
    });

    // Klikkauskuuntelija documentille, sulkee dropdownin, jos klikattu muualla kuin nappulassa tai dropdownissa
    $(document).click(function() {
        $("#dropdown-osasto").hide();
        $("#dropdown-sijainti").hide();
        $("#button-osasto span").removeClass('rotate-180');
        $("#button-sijainti span").removeClass('rotate-180');

    });

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
