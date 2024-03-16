$(document).ready(function(){
    // Lataa JSON-data
    $.getJSON('sijainnit.json', function(data) {
        function parseData(obj, level = 0, parentLocations = '') {
            $.each(obj, function(key, value) {
                if (key === "kunnat" || key === "osat") {
                    // Käsitellään rekursiivisesti alakohteita, ei lisätä leveliä, mutta päivitetään parentLocations
                    parseData(value, level + 1, parentLocations);
                } else if (value.hasOwnProperty('location')) {
                    // Muodostetaan checkboxin arvo
                    const locationValue = level + '.' + (parentLocations ? parentLocations + '.' : '') + value.location;
                    
                    // Kohteen käsittely
                    const optionText = key;
                    const checkbox = $('<input>', {
                        type: 'checkbox',
                        class: 'location-checkbox mr-2',
                        value: locationValue, // Päivitetty arvo polulla
                        'data-level': level,
                        'data-name': optionText
                    });
                    const span = $('<span>').text(optionText);
                    // Päivitetään labelin luokka tason mukaan
                    const labelClass = 'px-2 py-1 flex' + (level === 1 ? ' pl-6' : '');
                    const label = $('<label>', {
                        class: labelClass
                    }).append(checkbox).append(span);

                    $('#dropdownContainer').append(label);
                }

                // Jos objekti sisältää muita kohteita
                if (typeof value === 'object' && key !== "kunnat" && key !== "osat") {
                    // Jos meillä on validi location, päivitä parentLocations seuraavaa tasoa varten
                    const newParentLocations = value.location ? (parentLocations ? parentLocations + '.' + value.location : value.location.toString()) : parentLocations;
                    parseData(value, level, newParentLocations);
                }
            });
        }

        // Käynnistä datan jäsentäminen
        parseData(data);
    });

    // Kuuntele kaikkien checkboxien valintatapahtumaa #dropdownContainer sisällä
    $('#dropdownContainer').on('change', 'input[type="checkbox"]', function() {
        // Kerää kaikkien valittujen checkboxien sijainnit
        var selectedLocations = $('#dropdownContainer input[type="checkbox"]:checked').map(function() {
            return $(this).data('name'); // Käytä data-name attribuuttia nimen saamiseen
        }).get();
        
        if (selectedLocations.length > 0) {
            // Jos yksi tai useampi valittu, yhdistä valittujen sijaintien nimet
            var locationsText = selectedLocations.join(", ");
            $('#button-sijainti').text(locationsText);
        } else {
            // Jos ei valintoja, aseta oletusteksti
            $('#button-sijainti').text('Valitse sijainti');
        }
    });


    // Hakutoiminnallisuus
    $("#searchInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#dropdownContainer label").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});

$(document).ready(function(){
    // Lataa JSON-data
    $.getJSON('osastot.json', function(data) {
        function parseData(obj, level = 0, parentLocations = '') {
            $.each(obj, function(key, value) {
                if (key === "kategoriat" || key === "alakategoriat") {
                    // Käsitellään rekursiivisesti alakohteita, ei lisätä leveliä, mutta päivitetään parentLocations
                    parseData(value, level + 1, parentLocations);
                } else if (value.hasOwnProperty('location')) {
                    // Muodostetaan checkboxin arvo
                    const locationValue = level + '.' + (parentLocations ? parentLocations + '.' : '') + value.location;
                    
                    // Kohteen käsittely
                    const optionText = key;
                    const checkbox = $('<input>', {
                        type: 'checkbox',
                        name: 'osasto',
                        class: 'location-checkbox mr-2 mt-1',
                        value: locationValue, // Päivitetty arvo polulla
                        'data-level': level,
                        'data-name': optionText
                    });
                    const span = $('<span>').text(optionText);
                    // Päivitetään labelin luokka tason mukaan
                    const labelClass = 'px-2 py-1 flex items-start' + (level === 1 ? ' pl-6' : '') + (level === 2 ? ' pl-12' : '');
                    const label = $('<label>', {
                        class: labelClass
                    }).append(checkbox).append(span);

                    $('#dropdownContainer-osasto').append(label);
                }

                // Jos objekti sisältää muita kohteita
                if (typeof value === 'object' && key !== "kategoriat" && key !== "alakategoriat") {
                    // Jos meillä on validi location, päivitä parentLocations seuraavaa tasoa varten
                    const newParentLocations = value.location ? (parentLocations ? parentLocations + '.' + value.location : value.location.toString()) : parentLocations;
                    parseData(value, level, newParentLocations);
                }
            });
        }

        // Käynnistä datan jäsentäminen
        parseData(data);
    });

    // Delegoi change-tapahtuman kuuntelu #dropdownContainer-osasto:lle, joka kohdistuu kaikkiin checkboxeihin sen sisällä
    $("#dropdownContainer-osasto").on("change", "input[type='checkbox'][name='osasto']", function() {
        // Tarkista, onko nykyinen checkbox valittu
        if ($(this).is(":checked")) {
            // Uncheckkaa kaikki muut checkboxit paitsi tämä
            $("input[type='checkbox'][name='osasto']").not(this).prop("checked", false);
        }
    });

    // Kuuntele kaikkien checkboxien valintatapahtumaa #dropdownContainer sisällä
    $('#dropdownContainer-osasto').on('change', 'input[type="checkbox"]', function() {
        // Tarkista, onko mikään checkbox valittu
        var selectedCheckbox = $('#dropdownContainer-osasto input[type="checkbox"]:checked');
        
        if (selectedCheckbox.length > 0) {
            // Jos valittu, päivitä #button-sijainti p-elementin teksti valitun sijainnin nimeksi
            var selectedLocationName = selectedCheckbox.data('name');
            $('#button-osasto p').text(selectedLocationName);
        } else {
            // Jos ei valintoja, aseta oletusteksti
            $('#button-osasto p').text('Valitse osasto');
        }
    });

    // Hakutoiminnallisuus
    $("#searchInput-osasto").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#dropdownContainer-osasto label").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // Avaa modaalikko
    $("#open-modal").click(function() {
        $("#modal").removeClass("hidden");
    });
    
    // Sulje modaalikko
    $("#close-modal, #modal").click(function(event) {
        // Estä modaalikon sisällä olevien elementtien klikkaamisesta aiheutuva sulkeminen
        if (event.target !== this) {
            return;
        }
        $("#modal").addClass("hidden");
    });
});