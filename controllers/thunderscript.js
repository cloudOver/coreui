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

window.app.controller('ThunderCallCtrl', function ($scope, $location, $route, $routeParams) {
    $scope.script = $route.current.params.script;
    $scope.token = "public";
    $scope.check = function() {
        $('#results').append('<div class="ui active centered inline loader"></div>');
        request('/api/thunder/variables/', {token: $.cookie("core_token"), script: $route.current.params.script, thunder_token: $scope.token}, function(r) {
            var results = $('#results');
            results.empty();
            var form = $('<div class="ui form">');
            for (var key in r['variables']) {
                if (r['variables'][key] === null) {
                    field = $('<div class="field">');
                    field.append('<label>' + key + '</label>');
                    field.append('<input type="text" name="variable_' + key + '" value="" placeholder="' + key + '"/>');
                    form.append(field);
                }
            }
            results.append(form);
        }, quiet=true);
    }

    $scope.execute = function() {
        var call_params = {};
        $("input[name^=variable_]").map(function (idx, el) {
            call_params[$(el).attr('name').substr(9, $(el).attr('name').length)] = $(el).val();
        });
        console.debug(call_params);
        request('/api/thunder/call/', {token: $.cookie("core_token"), script: $route.current.params.script, variables: call_params, thunder_token: $scope.token}, function(r) {});
        $location.path('/thunder/results/');
    }

    $scope.check();
});

window.app.controller('ThunderResultsCtrl', function ($scope, $location, $route, $routeParams) {
    $scope.objs = [];

    $scope.show_log = function(l) {
        console.debug(l);
        $('#call_log').empty();
        if (l.length > 0) {
            $('#call_log').append('<pre>' + l + '</pre>');
        } else {
            $('#call_log').append('<p>Log is not available for this call</p>');
        }
        $('#log').modal('show');
    };

    $scope.remove = function(id) {
        request('/api/thunder/delete/', {token: $.cookie("core_token"), call_id: id}, function(r) {
            location.reload();
        });
    };

    request('/api/thunder/get_list/', {token: $.cookie("core_token")}, function(r) {
        console.debug(r);
        $scope.objs = r;
        $scope.$apply();
    });
});

window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/thunder/call/:script", {templateUrl: "views/thunderscript/call.html", controller: "ThunderCallCtrl"})
        .when("/thunder/results/", {templateUrl: "views/thunderscript/results.html", controller: "ThunderResultsCtrl"})
}]);
