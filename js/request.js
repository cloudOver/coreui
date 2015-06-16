function request(func, args, callback) {
    var msginfo = $('<div class="alert alert-info errormessage" style="position: absolute; display: none;">');
    if (window.debug) {
        var close = $('<button type="button" class="close" data-dismiss="alert">x</button>');
        msginfo.append(close);
        msginfo.append(func);
        msginfo.appendTo($('body')).fadeIn(100);
    }

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
                msginfo.removeClass('alert-info');
                msginfo.addClass('alert-danger');

                var message = $('<div class="alert alert-danger errormessage" style="position: absolute; display: none;">');
                var close = $('<button type="button" class="close" data-dismiss="alert">x</button>');
                message.append(close);
                message.append(response.status);
                message.appendTo($('body')).fadeIn(300).delay(5000).fadeOut(300);
                return;
            } else if (window.debug) {
                msginfo.fadeOut();
            }

            callback(response.data);
        },
        dataType: "application/json"
    });
}
