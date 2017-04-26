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

window.app.controller('HomeCtrl', function ($scope, $location, $http) {
    if (!$.cookie('core_token')) {
        document.location = 'login.html';
    }
    request('/api/template/capabilities/', {token: $.cookie('core_token')}, function(caps) {
        request('/api/template/get_list/', {token: $.cookie('core_token')}, function(templ) {
            $scope.templates = [];
            for (i = 0; i < templ.length; i++) {
                $scope.templates.push({});
                $scope.templates[i].caps = caps[templ[i]["id"]];
                $scope.templates[i].id = templ[i]["id"];
                $scope.templates[i].name = templ[i]["name"];
            }
            $scope.$apply();
        });
    }, quiet=true);

    request('/api/storage/capabilities/', {token: $.cookie('core_token')}, function(caps) {
        $scope.storage = (caps/1024).toFixed(2);
        $scope.$apply();
    }, quiet=true);

    request('/user/user/get_quota/', {login: $.cookie("core_login"), pw_hash: $.cookie("core_hash")}, function(r) {
        $scope = angular.element($("#view")).scope();
        $scope.$apply();

        var ctx = $("#memory").get(0).getContext("2d");
        var c = new Chart(ctx).Doughnut([
            {
                value: r['memory_used'],
                color: '#33ff88'
            },
            {
                value: r['memory_quota'] - r['memory_used'],
                color: '#dddddd'
            }
        ]);
        var ctx = $("#cpu").get(0).getContext("2d");
        var c = new Chart(ctx).Doughnut([
            {
                value: r['cpu_used'],
                color: '#ff6633'
            },
            {
                value: r['cpu_quota'] - r['cpu_used'],
                color: '#dddddd'
            }
        ]);
        var ctx = $("#storage").get(0).getContext("2d");
        var c = new Chart(ctx).Doughnut([
            {
                value: (r['storage_used']/1024/1024/1024).toFixed(2),
                color: '#ffbb33'
            },
            {
                value: (r['storage_quota']/1024/1024/1024 - r['storage_used']/1024/1024/1024).toFixed(2),
                color: '#dddddd'
            }
        ]);
    });

    // Thunder Script
    request('/api/api/list_api_modules/', {token: $.cookie("core_token")}, function(objs) {
        if (objs.indexOf('thunderscript.views.api') > 0) {
            $scope.thunder = true;

            $('#thunder_script_search').on('input', function() {
                if (this.value.length > 2)
                    $.ajax({
                        type: 'GET',
                        url: 'https://cloudover.io/thunder/raw-list/' + this.value + '/',
                        complete: function(xhr, status) {
                            var response = $.parseJSON(xhr.responseText);

                            $('#thunder_search_results').empty();
                            for (i = 0; i < response.length; i++) {
                                var column = $("<div class='column'>");
                                var card = $('<div class="ui fluid card" style="display: none">');
                                var content = $('<div class="content">');
                                content.append('<div class="ui header">' + response[i].uri);

                                var extra_content = $('<div class="extra content">');
                                var btn = $('<a href="#/thunder/call/' + response[i].uri + '" class="ui basic green small icon button"><i class="setting icon"></i> Execute</a>');

                                extra_content.append(btn);
                                card.append(content);
                                card.append(extra_content);
                                column.append(card);
                                $("#thunder_search_results").append(column);
                                card.slideToggle();
                            }
                        }
                    });
            });
        } else {
            $scope.thunder = false;
        }
    });
});

window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/", {templateUrl: "views/home.html", controller: "HomeCtrl"});
}]);
