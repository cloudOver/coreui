function request(func, args, callback) {
    $.ajax({
        type: "POST",
        url: window.coreUrl + func,
        data: $.toJSON(args),
        complete: function(xhr, status) {
            console.debug(xhr);
            if (status === "error" || !xhr.responseText) {
                alert("Communication problem");
                return;
            }
            var response = $.parseJSON(xhr.responseText);
            if (response.status != "ok") {
                alert("Error ocured: " + response.status);
                return;
            }
            callback(response.data);
        },
        dataType: "application/json"
    });
}
function makeTable(model) {
    var elementId = "#content";

    if (model.data.length == 0) {
        $(elementId).animate({opacity: 0}, 100, function() {
            $(elementId).empty().append("No results").animate({opacity: 1});
        });
        return;
    }

    html = "";
    html += "<div class=\"table-responsive\"><table id=\"generic_table\" class=\"table table-stripped table-hover\"><tr>";
    html += model.getHeader();
    $(elementId).append("</tr>");

    for (n = 0; n < model.data.length; n++) {
        html += model.getRow(n);
    }
    html += "</table><div id=\"tableController\"></div></div>";

    $(elementId).animate({opacity: 0}, 100, function() {
        $(elementId).empty().append(html).animate({opacity: 1}, 100);
        request("/api/api/list_api_modules/", {token: window.token}, function(r) {
            for (i = 0; i < r.length; i++) {
                $("#tableController").append($('<div>').load("actions/" + r[i] + ".html"));
            }
        });
    });
}

function refreshContent(func, timeout) {
    clearTimeout(window.refresh_timeout);
    window.refresh_timeout = setTimeout(func, 10000);
}

function fillSelect(model, parentForm, elementId) {
    $(parentForm).find(elementId).empty();
    for (i = 0; i < model.data.length; i++)
        $(parentForm).find(elementId).append(model.getRow(i));
}

function highlightMenu(buttonId) {
    $("#menu").find("a").each(function() {
        $(this).removeClass("list-group-item-warning");
    });
    $("#menu").find(buttonId).addClass("list-group-item-warning");
}