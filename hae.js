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
        var locationNames = [];
        var categories = [];
        var categoryNames = [];
        var queryParams = [];
        var hakusana = $("#hakusana").val().trim();
    
        if ($("#yksityinen").is(":checked")) {
            dealerSegments.push("dealer_segment=1");
        }
        if ($("#yritys").is(":checked")) {
            dealerSegments.push("dealer_segment=3");
        }
        if ($("#myydään").is(":checked")) {
            tradeTypes.push("trade_type=1");
        }
        if ($("#annetaan").is(":checked")) {
            tradeTypes.push("trade_type=2");
        }
        if ($("#ostetaan").is(":checked")) {
            tradeTypes.push("trade_type=3");
        }
    
        $("#sijainti2 input[type='checkbox']:checked").each(function() {
            var locationValue = $(this).val();
            var locationName = $(this).data('name'); 
            var level = $(this).data('level'); 
        
            if (level === 0) {
                if (!locationValue.startsWith("0.")) {
                    locationValue = "0." + locationValue.replace(/^1\./, "");
                }
            } else {
                if (!locationValue.startsWith("1.")) {
                    locationValue = "1." + locationValue;
                }
            }
        
            locations.push(locationValue);
            locationNames.push(locationName);
        });
    
        $("#osasto2 input[type='checkbox']:checked").each(function() {
            var osastoValue = $(this).val();
            var osastoName = $(this).data('name'); 
            var level = $(this).data('level'); 
        
            if (level === 0) {
                osastoValue = osastoValue.replace(/^1\./, "0.");
                queryParams.push("category=" + osastoValue);
            } else if (level === 1) {
                queryParams.push("sub_category=" + osastoValue);
            }
            
            categories.push(osastoValue);
            categoryNames.push(osastoName);
        });
        
        var baseUrl = "https://www.tori.fi/recommerce/forsale/search?";
        if (hakusana) {
            baseUrl += "q=" + encodeURIComponent(hakusana);
        }
    
        var orderedParams = [];
        orderedParams = orderedParams.concat(dealerSegments);
        orderedParams = orderedParams.concat(locations.map(loc => "location=" + loc));
        orderedParams = orderedParams.concat(queryParams); 
        orderedParams = orderedParams.concat(tradeTypes);

        orderedParams.forEach(param => {
            baseUrl += `&${param}`;
        });

        saveSearchToHistory({
            hakusana: hakusana,
            osasto: categoryNames.join(", "), 
            osastoKoodit: categories.join(", "), 
            sijainti: locationNames.join(", "), 
            sijaintiKoodit: locations.join(", "), 
            dealerSegments: dealerSegments,
            tradeTypes: tradeTypes,
            url: baseUrl
        });

        displaySearchHistory();
    
        // Avaa URL
        console.log(baseUrl);
        window.open(baseUrl, '_blank');
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
            osastoKoodit: searchDetails.osastoKoodit || "",
            sijainti: searchDetails.sijainti || "",
            sijaintiKoodit: searchDetails.sijaintiKoodit || "",
            dealerSegments: dealerSegmentsText,
            tradeTypes: tradeTypesText,
            url: searchDetails.url
        };
    
        var searches = JSON.parse(localStorage.getItem("searchHistory") || "[]");
        searches.unshift(filteredDetails);
        searches = searches.slice(0, 25);
        localStorage.setItem("searchHistory", JSON.stringify(searches));
    }
    
    function displaySearchHistory() {
        var searches = JSON.parse(localStorage.getItem("searchHistory") || "[]");
        var listElement = $("#search-history-list");
        listElement.empty();
    
        if (searches.length != 0) {
            $("#hakuhistoria").removeClass("hidden");
        }
    
        const uniqueUrls = new Set();
        const uniqueSearches = searches.filter(search => {
            const isUnique = !uniqueUrls.has(search.url);
            uniqueUrls.add(search.url);
            return isUnique;
        });
    
        uniqueSearches.forEach(function(search, index) {
            var link = $('<a class="h-full w-full pr-5">').attr("href", search.url).attr("target", "_blank");
    
            if (search.hakusana) {
                link.append($('<span class="font-bold !text-base leading-none">').text(search.hakusana), $("<br>"));
            }
            if (search.osasto) {
                link.append($('<span>').text(`${search.osasto}`), $("<br>"));
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
    
            var deleteButton = $('<button class="absolute right-2 top-2"><span class="material-symbols-outlined text-gray-400 !text-base">close</span></button>');
            deleteButton.on('click', function() {
                searches.splice(index, 1);
                localStorage.setItem("searchHistory", JSON.stringify(searches));
                displaySearchHistory();
            });
    
            var listItem = $("<li>").addClass("relative text-sm px-3 py-3 shadow bg-white border border-gray-200 rounded-xl md:w-2/12 mr-4 w-48 flex-none overflow-hidden flex items-center snap-start dark:bg-gray-700 dark:border-gray-600 hyphens-auto").append(link).append(deleteButton);
            listElement.append(listItem);
        });
    }
    
    displaySearchHistory();
});
