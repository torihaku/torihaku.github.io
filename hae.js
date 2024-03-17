$(document).ready(function() {
    $("#button-hae").click(function() {
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

        // Etsi valittu radiobutton #dropdownContainer-osasto sisältä
        var selectedRadioButton = $("#dropdownContainer-osasto input[type='checkbox']:checked");
        if (selectedRadioButton.length > 0) {
            var categoryValue = selectedRadioButton.val(); // Valitun radiobuttonin arvo
            var dataLevel = selectedRadioButton.data('level'); // data-level attribuutin arvo
            var categoryType = ""; // Määritellään tyhjäksi, päivitetään alla
            
            // Päätetään, mitä prefixiä käytetään URLin parametrina
            if (categoryValue.startsWith("0.")) {
                categoryType = "category=" + dataLevel + ".";
            } else if (categoryValue.startsWith("1.")) {
                categoryType = "sub_category=" + dataLevel + ".";
            } else if (categoryValue.startsWith("2.")) {
                categoryType = "product_category=" + dataLevel + "."; // Lisätään data-level eteen
            }
            
            // Poista data-level ja pisteen määrittely categoryValuesta
            categoryValue = categoryValue.substring(2);
            
            // Lisätään lopullinen arvo queryParams listaan
            if (categoryType) {
                queryParams.push(categoryType + categoryValue);
            }
        }

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
    });

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
        searches = searches.slice(0, 15);
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

        searches.forEach(function(search) {
            var link = $("<a>").attr("href", search.url).attr("target", "_blank");

            if (search.hakusana) {
                link.append($('<span class="font-bold text-lg">').text(search.hakusana), $("<br>"));
            }
            if (search.osasto) {
                link.append($("<span>").text(`${search.osasto}`), $("<br>"));
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

            var listItem = $("<li>").addClass("text-sm px-3 py-2 shadow bg-white border border-gray-300 rounded-xl aspect-[5/4] md:w-2/12 mr-4 w-1/2 flex-none overflow-hidden").append(link);
            listElement.append(listItem);

        });
    }

    // Kutsu displaySearchHistory, kun sivu latautuu
    displaySearchHistory();
});
