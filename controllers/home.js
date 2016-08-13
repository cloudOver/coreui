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
    request('/api/template/capabilities/', {token: $.cookie("core_token")}, function(caps) {
        request('/api/template/get_list/', {token: $.cookie("core_token")}, function(templ) {
            $scope.templates = [];
            for (i = 0; i < templ.length; i++) {
                $scope.templates.push({});
                $scope.templates[i].caps = caps[templ[i]["id"]];
                $scope.templates[i].id = templ[i]["id"];
                $scope.templates[i].name = templ[i]["name"];
            }
            $scope.$apply();
        });
    });

    request('/api/storage/capabilities/', {token: $.cookie("core_token")}, function(caps) {
        $scope.storage = (caps/1024).toFixed(2);
        $scope.$apply();
    });

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
    $.ajax({
        type: 'GET',
        url: 'http://cloudover.io/thunder/raw/',
        complete: function(xhr, status) {
            console.debug(xhr);
            var scripts = xhr.responseText.split("\n");
            var lookups = [];

            for (i = 0; i < scripts.length; i++) {
                lookups[i] = {
                    value: scripts[i],
                    data: scripts[i]
                };
            }
            console.debug(lookups);
            $( "#script_name" ).autocomplete({
                lookup: lookups,
                onSelect: function (script_name) {
                    request('/api/thunder/variables/', {token: $.cookie("core_token"), script: script_name['data']}, function(r) {
                        $('#script_variables').empty();
                        $('#script_variables').append('<br/>');
                        $.each(r['variables'], function(k, v) {
                            console.debug(k + ':' + v)
                            if (!v) {
                                grp = $('<div class="ui labeled fluid input" style="display: none;">');
                                grp.append($('<div class="ui green label">' + k + '</div>'))
                                grp.append($('<input type="text" placeholder="Not set" name="variable_' + k + '" />'));
                                $('#script_variables').append(grp);
                                $('#script_variables').append($('<br/>'));
                                grp.slideToggle();
                            }
                        });
                        $('#script_show_predefined_variables').slideToggle();
                        $.each(r['variables'], function(k, v) {
                            console.debug(k + ':' + v)
                            if (v) {
                                grp = $('<div class="ui labeled fluid input" style="display: none;">');
                                grp.append($('<div class="ui label">' + k + '</div>'))
                                input = $('<input type="text" name="variable_' + k + '" />');
                                input.attr('placeholder', v);
                                grp.append(input);
                                $('#script_predefined_variables').append(grp);
                                $('#script_predefined_variables').append($('<br/>'));
                                grp.slideToggle();
                            }
                        });
                    });
                }
            })
            $( "#script_name" ).autocomplete('widget').addClass('ui segment');
        }
    });

    $scope.script_call = function() {
        params = {}
        $("#script_variables input").each(function() {
            params[$(this).attr('name').replace('variable_', '')] = $(this).val();
        });
        $('#script_loading').modal('show');
        request('/api/thunder/call/', {token: $.cookie("core_token"), script: $('#script_name').val(), variables: params}, function(r) {
            $('#script_output').empty();
            $('#script_output').append(r['log'].replace(/>/g, '&lt;').replace(/>/g, '&gt;').replace(/(?:\r\n|\r|\n)/g, '<br />').replace());
            $('#script_loading').modal('hide').done(function() {
                $('#script_result').modal('show');
            });
        });
        console.debug(params);
    }
});

window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/", {templateUrl: "views/home.html", controller: "HomeCtrl"});
}]);
