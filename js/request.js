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
var running_requests = 0;
function request(func, args, callback, quiet=false) {
    var msg = $('<div class="ui icon info message"><i class="right arrow icon"></i> Call' + func + '</div>');
    if (!quiet) {
        running_requests += 1;
        $('#requestLoader').modal('show');
    }

    if (window.debug)
        $('#requestLoaderContent').append(msg);

    $.ajax({
        type: "POST",
        url: window.coreUrl + func,
        data: $.toJSON(args),
        complete: function(xhr, status) {
            console.debug(xhr);
            if (status === "error" || !xhr.responseText) {
                $('#requestLoaderContent').append('<div class="ui icon error message"><i class="warning circle icon"></i>Communication error</div>');
                return;
            }
            var response = $.parseJSON(xhr.responseText);

            if (response.status != "ok") {
                $('#requestLoaderContent').append('<div class="ui icon warning message"><i class="warning circle icon"></i>' + response.status + '</div>');
                return;
            } else if (window.debug) {
                $('#requestLoaderContent').append('<div class="ui icon success message"><i class="checkmark icon"></i>' + response.status + '</div>');
            }

            callback(response.data);
            if (!window.debug)
                msg.remove();
            if (running_requests <= 0) {
                running_requests -= 1;
                $('#requestLoader').modal('hide');
            }
        },
        dataType: "application/json"
    });
}
