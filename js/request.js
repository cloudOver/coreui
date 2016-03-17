/*
Copyright (c) 2014-2016 cloudover.io ltd.

This file is part of cloudover.coreCluster project.

cloudover.coreCluster is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
