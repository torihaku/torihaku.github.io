$(document).ready(function() {

    $("#add-location").click(function() {
        console.log('mitä');
        $("#sijainti2-container").removeClass("translate-y-full");
    });
    $("#sijainti2-closebutton").click(function() {
        $("#sijainti2-container").addClass("translate-y-full");
    });
  
    $.getJSON('sijainnit.json', function(data) {
        if ($("#sijainti2").children().length === 0) {
            $("#sijainti2").empty();
        }
    
        $.each(data, function(region, details) {
            var card = $("<div>");
    
            var button = $("<div>")
                .addClass("p-3 bg-white rounded-t-xl rounded-b-xl dark:bg-gray-700 flex items-center justify-between border border-gray-200 dark:border-gray-600 cursor-pointer z-10")
                .click(function() {
                    $(this).toggleClass('rounded-b-xl');
                    subcategories.toggle();
                });
    
            var title = $("<h3>")
                .addClass("text-base flex-1 leading-tight")
                .text(region);
            button.append(title);
    
            var subcategories = $("<ul>").addClass("pl-4 space-y-3 hidden py-3 bg-white dark:bg-gray-800 border-x border-b border-gray-200 dark:border-gray-600 rounded-b-xl");
    
            var mainCheckboxId = "checkbox-main-" + region.replace(/\s+/g, "-").toLowerCase();
            var mainValue = details.location; 
            var mainCheckbox = $("<input>")
                .attr("type", "checkbox")
                .attr("id", mainCheckboxId)
                .attr("name", "sijainti")
                .attr("value", mainValue)
                .attr("data-level", 0) 
                .attr("data-name", region) 
                .addClass("location-checkbox mr-2 mt-1")
                .change(function() {
                    addSelectedCategoryLocation($(this));
                });
    
            var mainLabel = $("<label>")
                .attr("for", mainCheckboxId)
                .addClass("cursor-pointer font-bold")
                .text(region);
    
            var mainItem = $("<li>").addClass("text-base").append(mainCheckbox).append(mainLabel);
            subcategories.append(mainItem); 
    
            if (details.kunnat) {
                $.each(details.kunnat, function(municipality, municipalityDetails) {
                    var subItem = $("<li>").addClass("text-base ml-4"); 
                    var checkboxId = "checkbox-" + municipality.replace(/\s+/g, "-").toLowerCase();
                    var value = details.location + "." + municipalityDetails.location;
                    var checkbox = $("<input>")
                        .attr("type", "checkbox")
                        .attr("id", checkboxId)
                        .attr("name", "sijainti")
                        .attr("value", value)
                        .attr("data-level", 1)
                        .attr("data-name", municipality)
                        .addClass("location-checkbox mr-2 mt-1")
                        .change(function() {
                            addSelectedCategoryLocation($(this));
                        });
    
                    var label = $("<label>")
                        .attr("for", checkboxId)
                        .addClass("cursor-pointer")
                        .text(municipality);
    
                    subItem.append(checkbox).append(label);
    
                    subcategories.append(subItem);
                });
            }
    
            card.append(button).append(subcategories);
    
            $("#sijainti2").append(card);
        });
    });
    
    
    function addSelectedCategoryLocation(checkbox) {
        var container = $("#selected-locations");
        var noSelection = $("#no-location");
        var name = checkbox.siblings("label").text(); 
        var location = checkbox.val(); 
        var span = $('<span class="material-symbols-outlined text-gray-400 flex items-center !text-xs ml-1 translate-y-[2px]">close</span>');
        var selectedItem = $('<p class="selected-sijainti border border-gray-200 dark:border-gray-600 inline-block text-sm mr-2 mb-2 py-1 pr-2 leading-[1.5rem] pl-3 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-full cursor-pointer whitespace-nowrap">')
            .attr("data-location", location) 
            .text(name)
            .append(span);
    
        span.click(function() {
            $(this).parent().remove(); 
            checkbox.prop("checked", false); 
            toggleNoSelectionLocation(); 
        });
    
        if (container.find(`[data-location="${location}"]`).length > 0) {
            return;
        }

        container.append(selectedItem);
        
        toggleNoSelectionLocation();
    }
    
    

    function toggleNoSelectionLocation() {
        var noSelection = $("#no-location");
        if ($("#selected-locations .selected-sijainti").length > 0) {
            noSelection.hide(); 
        } else {
            noSelection.show(); 
        }
    }
    
    $("#sijainti2").off("change", "input[type='checkbox']").on("change", "input[type='checkbox']", function() {
        var checkbox = $(this);
        var location = checkbox.val();

        if (checkbox.is(":checked")) {
            if ($("#selected-locations").find(`[data-location="${location}"]`).length === 0) {
                addSelectedCategoryLocation(checkbox);
            }
        } else {
            $("#selected-locations .selected-sijainti").filter(function() {
                return $(this).data("location") === location;
            }).remove();
            toggleNoSelectionLocation();
        }
    });
    
});