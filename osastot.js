$(document).ready(function() {

    $("#add-section").click(function() {
        $("#osasto2-container").removeClass("translate-y-full md:h-[90vh] md:top-1/2 md:-translate-y-1/2"); 
        $("#osasto2-container").addClass("md:h-[90vh] md:top-1/2 md:-translate-y-1/2"); 
    });
    $("#osasto2-closebutton").click(function() {
        $("#osasto2-container").addClass("translate-y-full md:h-[90vh] md:top-1/2 md:-translate-y-1/2"); 
        $("#osasto2-container").removeClass("md:h-[90vh] md:top-1/2 md:-translate-y-1/2"); 
    });
        
  
    $.getJSON('osastot.json', function(data) {

        if ($("#osasto2").children().length === 0) {
            $("#osasto2").empty();
        }

        $.each(data, function(category, details) {
            var card = $("<div>");
        
            var button = $("<div>")
                .addClass("p-3 bg-white rounded-t-xl rounded-b-xl dark:bg-gray-700 flex items-center justify-between border border-gray-200 dark:border-gray-600 cursor-pointer z-10")
                .click(function() {
                    $(this).toggleClass('rounded-b-xl');
                    subcategories.toggle();
                });
        
            if (details.icon) {
                var iconWrapper = $("<div>")
                    .addClass("flex items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-100 rounded-full mr-3");
                var icon = $("<span>")
                    .addClass("material-symbols-outlined !text-3xl text-gray-700")
                    .text(details.icon);
                iconWrapper.append(icon);
                button.append(iconWrapper);
            }
        
            var title = $("<h3>")
                .addClass("text-base flex-1 leading-tight")
                .text(category);
            button.append(title);
        
            var subcategories = $("<ul>").addClass("pl-4 space-y-3 hidden py-3 bg-white dark:bg-gray-800 border-x border-b border-gray-200 dark:border-gray-600 rounded-b-xl");
        
            var mainCheckboxId = "checkbox-main-" + category.replace(/\s+/g, "-").toLowerCase();
            var mainValue = "1." + details.location; 
            var mainCheckbox = $("<input>")
                .attr("type", "checkbox")
                .attr("id", mainCheckboxId)
                .attr("name", "osasto")
                .attr("value", mainValue)
                .attr("data-level", 0) 
                .attr("data-name", category) 
                .addClass("location-checkbox mr-2 mt-1")
                .change(function(event) {
                    handleCheckboxChange($(this));
                });
            var mainLabel = $("<label>")
                .attr("for", mainCheckboxId)
                .addClass("cursor-pointer font-bold")
                .text(category);
        
            var mainItem = $("<li>").addClass("text-base").append(mainCheckbox).append(mainLabel);
            subcategories.append(mainItem); 
        
            if (details.kategoriat) {
                $.each(details.kategoriat, function(subcategory, subdetails) {
                    var subItem = $("<li>").addClass("text-base ml-4"); 
        
                    var checkboxId = "checkbox-" + subcategory.replace(/\s+/g, "-").toLowerCase();
        
                    var value = "1." + details.location + "." + subdetails.location; 
        
                    var checkbox = $("<input>")
                        .attr("type", "checkbox")
                        .attr("id", checkboxId)
                        .attr("name", "osasto")
                        .attr("value", value)
                        .attr("data-level", 1) 
                        .attr("data-name", subcategory) 
                        .addClass("location-checkbox mr-2 mt-1")
                        .change(function() {
                            handleCheckboxChange($(this));
                        });
        
                    var label = $("<label>")
                        .attr("for", checkboxId)
                        .addClass("cursor-pointer")
                        .text(subcategory);
        
                    subItem.append(checkbox).append(label);
        
                    subcategories.append(subItem);
                });
            }
        
            card.append(button).append(subcategories);
        
            $("#osasto2").append(card);
        });
        
    });


    function toggleNoSelection() {
        var noSelection = $("#no-selection");
        if ($("#selected-sections .selected-osasto").length > 0) {
            noSelection.addClass('hidden'); 
        } else {
            noSelection.removeClass('hidden'); 
        }
    }
    
    function handleCheckboxChange(checkbox) {
        var container = $("#selected-sections"); 
        var name = checkbox.siblings("label").text(); 
        var location = checkbox.val(); 
    
        if (checkbox.is(":checked")) {
            // Lisää uusi valinta
            if (container.find(`[data-location="${location}"]`).length === 0) {
                var span = $('<span class="material-symbols-outlined text-gray-400 flex items-center !text-xs ml-1 translate-y-[2px]">close</span>');
                var selectedItem = $('<p class="selected-osasto border border-gray-200 dark:border-gray-600 inline-block text-sm mr-2 mb-2 py-1 pr-2 leading-[1.5rem] pl-3 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-full cursor-pointer whitespace-nowrap">')
                    .attr("data-location", location) 
                    .text(name)
                    .append(span);
                
                // Klikkaamalla spania poistetaan valinta ja uncheckataan checkbox
                span.click(function(event) {
                    event.stopPropagation(); // Estä tapahtuman kuplaantuminen
                    selectedItem.remove(); 
                    checkbox.prop("checked", false).trigger("change"); // Poista valinta ja laukaise tapahtuma
                });
    
                container.append(selectedItem);
            }
        } else {
            // Poista valinta
            container.find(`[data-location="${location}"]`).remove();
        }
    
        toggleNoSelection(); 
    }
    
    $("#osasto2").on("change", "input[type='checkbox']", function() {
        handleCheckboxChange($(this));
    });
    
});