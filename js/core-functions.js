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
                var message = $('<div class="alert alert-danger errormessage" style="display: none;">');
                var close = $('<button type="button" class="close" data-dismiss="alert">x</button>');
                message.append(close);
                message.append(response.status);
                message.appendTo($('body')).fadeIn(300).delay(5000).fadeOut(300);
                return;
            }
            callback(response.data);
        },
        dataType: "application/json"
    });
}
function makeTable(model, elementId) {
    if (model.data.length == 0) {
        $(elementId).animate({opacity: 0}, 100, function() {
            $(elementId).empty().append("No results").animate({opacity: 1});
        });
        return;
    }

    html = "";
    html += "<div class=\"table-responsive\"><table id=\"generic_table\" class=\"table table-condensed table-stripped table-hover\"><tr>";
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

function refreshContent(func) {
    clearTimeout(window.refresh_timeout);
    window.refresh_timeout = setTimeout(func, 10000);
}

function appendSelect(model, parentForm, elementId) {
    for (i = 0; i < model.data.length; i++)
        $(parentForm).find(elementId).append(model.getRow(i));

    $(parentForm).find(elementId).selectator();
}

function fillSelect(model, parentForm, elementId) {
    $(parentForm).find(elementId).empty();
    appendSelect(model, parentForm, elementId);
}

function highlightMenu(buttonId) {
    $("#menu").find("a").each(function() {
        $(this).removeClass("list-group-item-warning");
    });
    $("#menu").find(buttonId).addClass("list-group-item-warning");
}

function makeFieldEditable(item_id, model, field) {
    $("#item_" + item_id + "_" + field).editable(function(value, settings) {
        fields = {};
        fields['token'] = window.token;
        fields[model + "_id"] = item_id;
        fields[field] = value;
        request("/api/" + model + "/edit/", fields, function() {});
        return value;
    });
}

function makeFieldUneditable(item_id, field) {
    $("#item_" + item_id + "_" + field).editable('disable');
}