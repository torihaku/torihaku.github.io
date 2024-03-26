$(document).ready(function() {
    $("#button-hae").click(function() {
        makeSearch();
    });
    $("#hakusana").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            makeSearch();
        }
    });

    function makeSearch() {
        var dealerSegments = [];
        var tradeTypes = [];
        var locations = [];
        var queryParams = [];

        // Kerätään valitut dealer_segments
        if ($("#yksityinen").is(":checked")) {
            dealerSegments.push("dealer_segment=1");
        }
        if ($("#yritys").is(":checked")) {
            dealerSegments.push("dealer_segment=3");
        }

        // Kerätään valitut trade_types
        if ($("#myydään").is(":checked")) {
            tradeTypes.push("trade_type=1");
        }
        if ($("#annetaan").is(":checked")) {
            tradeTypes.push("trade_type=2");
        }
        if ($("#ostetaan").is(":checked")) {
            tradeTypes.push("trade_type=3");
        }

        // Kerätään valitut location-arvot #dropdownContainer sisältä ja lisätään "location=" eteen
        $("#dropdownContainer input[type='checkbox']:checked").each(function() {
            locations.push("location=" + $(this).val());
        });
        
        // Kerää valitut sijainnit ja niiden nimet
        var selectedLocations = $("#dropdownContainer input[type='checkbox']:checked").map(function() {
            return $(this).data('name'); // Käytä data-name attribuuttia nimen saamiseen
        }).get().join(", ");

        // Yhdistetään kerätyt arvot queryParams-listaan
        queryParams = queryParams.concat(locations, dealerSegments, tradeTypes);

        // Kerätään kaikki valitut osastot #dropdownContainer-osasto sisältä
        $("#dropdownContainer-osasto input[type='checkbox']:checked").each(function() {
            var osastoValue = $(this).val();
            var dataLevel = $(this).data('level');
            var categoryType = ""; // Määritellään tyhjäksi, päivitetään alla
            
            // Päätetään, mitä prefixiä käytetään URLin parametrina
            if (osastoValue.startsWith("0.")) {
                categoryType = "category=" + dataLevel + ".";
            } else if (osastoValue.startsWith("1.")) {
                categoryType = "sub_category=" + dataLevel + ".";
            } else if (osastoValue.startsWith("2.")) {
                categoryType = "product_category=" + dataLevel + ".";
            }
            
            // Poista data-level ja pisteen määrittely osastoValuesta
            osastoValue = osastoValue.substring(2);
            
            // Lisätään lopullinen arvo queryParams listaan
            if (categoryType) {
                queryParams.push(categoryType + osastoValue);
            }
        });

        // Aloita URLin muodostus ja lisää queryParams
        var baseUrl = "https://beta.tori.fi/recommerce/forsale/search?";
        var hakusana = $("#hakusana").val();
        baseUrl += "q=" + encodeURIComponent(hakusana);

        if (queryParams.length > 0) {
            baseUrl += "&" + queryParams.join("&");
        }

        // Tallenna haku (muodosta ensin hakutiedot)
        var searchDetails = {
            hakusana: $("#hakusana").val(),
            osasto: $("#dropdownContainer-osasto input[type='checkbox']:checked").map(function() { return $(this).next('span').text(); }).get().join(", "),
            sijainti: selectedLocations,
            dealerSegments: dealerSegments, // Sisältää arvot muodossa dealer_segment=1 jne.
            tradeTypes: tradeTypes, // Sisältää arvot muodossa trade_type=1 jne.
            url: baseUrl
        };
    
        saveSearchToHistory(searchDetails);
        displaySearchHistory();

        // Ohjataan käyttäjä muodostettuun osoitteeseen
        window.location.href = baseUrl;
    }

    function saveSearchToHistory(searchDetails) {
        var dealerSegmentsText = searchDetails.dealerSegments.map(function(segment) {
            return segment === "dealer_segment=1" ? "Yksityinen" : segment === "dealer_segment=3" ? "Yritys" : "";
        }).filter(Boolean).join(", ");
    
        var tradeTypesText = searchDetails.tradeTypes.map(function(type) {
            switch(type) {
                case "trade_type=1": return "Myydään";
                case "trade_type=2": return "Annetaan";
                case "trade_type=3": return "Ostetaan";
                default: return "";
            }
        }).filter(Boolean).join(", ");
    
        var filteredDetails = {
            hakusana: searchDetails.hakusana || "",
            osasto: searchDetails.osasto || "",
            sijainti: searchDetails.sijainti || "",
            dealerSegments: dealerSegmentsText,
            tradeTypes: tradeTypesText,
            url: searchDetails.url
        };
    
        // Lue aiemmat haut localStorage:sta tai, jos ei olemassa, aloita tyhjällä listalla
        var searches = JSON.parse(localStorage.getItem("searchHistory") || "[]");
        // Lisää uusin haku listan alkuun
        searches.unshift(filteredDetails);
        // Rajaa lista 15 hakuun
        searches = searches.slice(0, 25);
        // Tallenna päivitetty lista takaisin localStorageen
        localStorage.setItem("searchHistory", JSON.stringify(searches));
    }
    
    function displaySearchHistory() {
        var searches = JSON.parse(localStorage.getItem("searchHistory") || "[]");
        var listElement = $("#search-history-list");
        listElement.empty(); // Tyhjennä lista
    
        if (searches.length != 0) {
            $("#hakuhistoria").removeClass("hidden");

        }

        searches.forEach(function(search, index) {
            var link = $('<a class="h-full w-full pr-4">').attr("href", search.url).attr("target", "_blank");

            if (search.hakusana) {
                link.append($('<span class="font-bold text-base leading-none">').text(search.hakusana), $("<br>"));
            }
            if (search.osasto && search.hakusana) {
                link.append($("<span>").text(`${search.osasto}`), $("<br>"));
            } else if (search.osasto) {
                link.append($('<span class="font-bold text-base leading-none">').text(`${search.osasto}`), $("<br>"));
            }
            if (search.sijainti) {
                link.append($("<span>").text(`${search.sijainti}`), $("<br>"));
            }
            if (search.dealerSegments) {
                link.append($("<span>").text(`Myyjä: ${search.dealerSegments}`), $("<br>"));
            }
            if (search.tradeTypes) {
                link.append($("<span>").text(`Tyyppi: ${search.tradeTypes}`), $("<br>"));
            }

            var deleteButton = $('<button class="absolute right-2 top-2"><span class="material-symbols-outlined text-gray-400 text-base">close</span></button>');
            deleteButton.on('click', function() {
                searches.splice(index, 1); // Poista kohde hakuhistoriasta
                localStorage.setItem("searchHistory", JSON.stringify(searches)); // Päivitä hakuhistoria localStorageen
                displaySearchHistory(); // Päivitä hakuhistorian näyttö
            });

            var listItem = $("<li>").addClass("relative text-sm px-3 py-3 shadow bg-white border border-gray-300 rounded-xl md:w-2/12 mr-4 w-48 flex-none overflow-hidden flex items-center snap-start dark:bg-gray-700 dark:border-gray-600 hyphens-auto").append(link).append(deleteButton);
            listElement.append(listItem);

        });
    }

    displaySearchHistory();
});
