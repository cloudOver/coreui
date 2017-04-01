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
window.request_id = 0;

function request(func, args, callback, quiet=false) {
    var msg = $('<div class="ui green button" style="display: none;" id="msg' + window.request_id + '">');
    msg.append('<i class="settings icon"></i>' + func);
    msg.on('click', function() { this.remove(); });
    $('#loader').append(msg);
    msg.slideToggle();

//    if (args['token'] != undefined) {
//        args['token'] = $().crypt({method: "sha1", source: 'tokenseed' + args['token']});
//    }

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

            if (response.status == "token_not_found" || response.status == "missing_token") {
                document.location = "login.html";
            }
            if (response.status != "ok") {
                if (quiet)
                    $('#requestLoader').modal('show');
                $('#requestLoaderContent').append('<div class="ui icon warning message"><i class="warning circle icon"></i>' + response.status + '</div>');
                msg.removeClass('green');
                msg.addClass('orange');
                msg.empty();
                msg.append('<i class="remove icon"></i>' + func + ': <b>' + response.status + '</b>');

                return;
            }

            callback(response.data);
            msg.remove();
        },
        dataType: "application/json"
    });
}
