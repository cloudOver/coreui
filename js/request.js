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
window.running_requests = 0;
window.request_id = 0;

function request(func, args, callback, quiet=false) {
    var msg = $('<div class="ui green button" style="display: none;"><i class="settings icon"></i>' + func + '</div>');
    $('#loader').append(msg);
    if (window.running_requests == 0) {
        window.running_requests++;
        $('#loaderMenu').slideToggle();
    }
    msg.slideToggle();

    $.ajax({
        type: "POST",
        url: window.coreUrl + func,
        data: $.toJSON(args),
        complete: function(xhr, status) {
            console.debug(xhr);
            if (status === "error" || !xhr.responseText) {
                if (quiet)
                    $('#requestLoader').modal('show');
                $('#requestLoaderContent').append('<div class="ui icon error message"><i class="warning circle icon"></i>Communication error</div>');
                return;
            }
            var response = $.parseJSON(xhr.responseText);

            if (response.status != "ok") {
                if (quiet)
                    $('#requestLoader').modal('show');
                $('#requestLoaderContent').append('<div class="ui icon warning message"><i class="warning circle icon"></i>' + response.status + '</div>');
                window.running_requests -= 1;
                msg.addClass('red');
                return;
            }

            callback(response.data);
            window.running_requests -= 1;
            msg.remove();
            if (window.running_requests <= 0) {
                $('#loaderMenu').slideToggle();
            }
        },
        dataType: "application/json"
    });
}
