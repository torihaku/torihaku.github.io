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
                    const labelClass = 'px-2 py-1 flex' + (level === 1 ? ' pl-6' : '')  + (level === 2 ? ' pl-12' : '');
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
        updateSelectedSijainnitDisplay();
    });

    function updateSelectedSijainnitDisplay() {
        // Tyhjennä nykyiset valinnat .label-divistä
        $('#button-sijainti .label').empty();

        // Lisää jokainen valittu sijainti omaksi p-elementikseen
        $('#dropdownContainer input[type="checkbox"]:checked').each(function() {
            var name = $(this).data('name');
            var value = $(this).val();
            var span = $('<span class="material-symbols-outlined text-gray-400 flex items-center text-xs ml-1">close</span>');
            var p = $('<p class="selected-sijainti text-sm mr-2 py-1 px-2 bg-gray-100 dark:bg-gray-600 rounded-full cursor-pointer whitespace-nowrap flex items-center">').text(name).append(span);
            
            // Lisää klikkaustapahtuma spanille poistoa varten
            span.on('click', function(event) {
                event.stopPropagation(); // Estä tapahtuman leviäminen, jottei se sulje dropdownia
                // Uncheckaa vastaava checkbox
                $('input[type="checkbox"][value="' + value + '"]').prop('checked', false);
                // Poista koko p-elementti
                p.remove();
                // Päivitä näyttö, jos kaikki valinnat poistetaan
                if ($('#button-sijainti .label').children().length === 0) {
                    $('#button-sijainti .label').text('Valitse sijainti');
                }
            });

            $('#button-sijainti .label').append(p);
        });

        // Jos ei valintoja, aseta oletusteksti .label-diviin
        if ($('#button-sijainti .label').children().length === 0) {
            $('#button-sijainti .label').text('Valitse sijainti');
        }
    }

    // Hakutoiminnallisuus
    $("#searchInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
    
        // Piilota ensin kaikki labelit
        $("#dropdownContainer label").hide();
    
        $("#dropdownContainer label").each(function() {
            var label = $(this);
            var labelText = label.text().toLowerCase();
            var dataLevel = label.find('input[type="checkbox"]').data('level');
    
            // Kun vastaavuus löytyy...
            if (labelText.indexOf(value) > -1) {
                // Näytä kaikki data-level="1" elementit, jos niiden vanhempi vastaa hakua
                if (dataLevel === 0) {
                    label.show(); // Näytä vanhempi
                    showChildren(label); // Näytä kaikki sen lapsielementit
                } 
                // Jos data-level="1" elementti vastaa suoraan, näytä se ja sen vanhempi
                else if (dataLevel === 1) {
                    label.show(); // Näytä lapsielementti
                    // Etsi ja näytä myös sen vanhempi
                    showParent(label);
                }
            }
        });
    
        // Funktio lapsielementtien näyttämiseen
        function showChildren(parentLabel) {
            parentLabel.nextAll().each(function() {
                if ($(this).find('input[type="checkbox"]').data('level') === 1) {
                    $(this).show(); // Näytä lapsielementti
                } else if ($(this).find('input[type="checkbox"]').data('level') === 0) {
                    return false; // Keskeytä, kun seuraava vanhempi löytyy
                }
            });
        }
    
        // Funktio vanhemman näyttämiseen
        function showParent(childLabel) {
            childLabel.prevAll().each(function() {
                if ($(this).find('input[type="checkbox"]').data('level') === 0) {
                    $(this).show(); // Näytä vanhempi
                    return false; // Keskeytä, kun vanhempi löytyy
                }
            });
        }
    });
    

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
                    const labelClass = 'px-2 py-1 flex items-start' + (level === 1 ? ' pl-6' : '') + (level === 2 ? ' pl-12 hidden' : '');
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

    // Kuuntele kaikkien checkboxien valintatapahtumaa #dropdownContainer sisällä
    $('#dropdownContainer-osasto').on('change', 'input[type="checkbox"]', function() {
        // Päivitä valittujen osastojen näyttöä
        updateSelectedOsastotDisplay();
    });

    function updateSelectedOsastotDisplay() {
        // Tyhjennä nykyiset valinnat .label-divistä
        $('#button-osasto .label').empty();

        // Lisää jokainen valittu osasto omaksi p-elementikseen
        $('#dropdownContainer-osasto input[type="checkbox"]:checked').each(function() {
            var name = $(this).data('name');
            var value = $(this).val();
            var span = $('<span class="material-symbols-outlined text-gray-400 flex items-center text-xs ml-1">close</span>');
            var p = $('<p class="selected-osasto text-sm mr-2 py-1 px-2 bg-gray-100 dark:bg-gray-600 rounded-full cursor-pointer whitespace-nowrap flex items-center">').text(name).append(span);
            
            // Lisää klikkaustapahtuma p-elementille poistoa varten
            span.on('click', function() {
                // Uncheckaa vastaava checkbox
                $('input[type="checkbox"][value="' + value + '"]').prop('checked', false);
                // Poista koko p-elementti
                p.remove();
                // Päivitä näyttö, jos kaikki valinnat poistetaan
                if ($('#button-osasto .label').children().length === 0) {
                    $('#button-osasto .label').text('Valitse osasto');
                }
            });

            $('#button-osasto .label').append(p);
        });

        // Jos ei valintoja, aseta oletusteksti .label-diviin
        if ($('#button-osasto .label').children().length === 0) {
            $('#button-osasto .label').text('Valitse osasto');
        }
    }

    // Hakutoiminnallisuus
    /*
    $("#searchInput-osasto").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#dropdownContainer-osasto label").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
    */

    // Hakutoiminnallisuus
    $("#searchInput-osasto").on("keyup", function() {
        var value = $(this).val().toLowerCase();
    
        // Piilota ensin kaikki labelit
        $("#dropdownContainer-osasto label").hide();
    
        $("#dropdownContainer-osasto label").each(function() {
            var label = $(this);
            var labelText = label.text().toLowerCase();
            var dataLevel = label.find('input[type="checkbox"]').data('level');
    
            // Kun vastaavuus löytyy...
            if (labelText.indexOf(value) > -1) {
                // Näytä kaikki data-level="1" elementit, jos niiden vanhempi vastaa hakua
                if (dataLevel === 0) {
                    label.show(); // Näytä vanhempi
                    showChildren(label); // Näytä kaikki sen lapsielementit
                } 
                // Jos data-level="1" elementti vastaa suoraan, näytä se ja sen vanhempi
                else if (dataLevel === 1) {
                    label.show(); // Näytä lapsielementti
                    // Etsi ja näytä myös sen vanhempi
                    showParent(label);
                }
            }
        });
    
        // Funktio lapsielementtien näyttämiseen
        function showChildren(parentLabel) {
            parentLabel.nextAll().each(function() {
                if ($(this).find('input[type="checkbox"]').data('level') === 1) {
                    $(this).show(); // Näytä lapsielementti
                } else if ($(this).find('input[type="checkbox"]').data('level') === 0) {
                    return false; // Keskeytä, kun seuraava vanhempi löytyy
                }
            });
        }
    
        // Funktio vanhemman näyttämiseen
        function showParent(childLabel) {
            childLabel.prevAll().each(function() {
                if ($(this).find('input[type="checkbox"]').data('level') === 0) {
                    $(this).show(); // Näytä vanhempi
                    return false; // Keskeytä, kun vanhempi löytyy
                }
            });
        }
    });

    // Avaa modaalikko
    $("#open-modal").click(function() {
        $("#modal").removeClass("hidden");
        $("body").addClass("overflow-hidden");
    });
    
    // Sulje modaalikko
    $("#close-modal, #modal").click(function(event) {
        // Estä modaalikon sisällä olevien elementtien klikkaamisesta aiheutuva sulkeminen
        if (event.target !== this) {
            return;
        }
        $("#modal").addClass("hidden");
        $("body").removeClass("overflow-hidden");
    });

    // Asetetaan oletusteema latauksen yhteydessä
    const currentTheme = localStorage.getItem('torihakutheme') ? localStorage.getItem('torihakutheme') : null;
    if (currentTheme) {
        document.documentElement.classList.add(currentTheme);
        if (currentTheme === 'dark') {
            $('#themeToggle span').text('light_mode');
        } else {
            $('#themeToggle span').text('dark_mode');
        }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        $('#themeToggle span').text('light_mode');
    }

    // Käsittele teemanvaihto
    $('#themeToggle button').click(function() {
        var isDarkMode = document.documentElement.classList.contains('dark');

        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('torihakutheme', 'light');
            $('#themeToggle span').text('dark_mode');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('torihakutheme', 'dark');
            $('#themeToggle span').text('light_mode');
        }
    });
});
