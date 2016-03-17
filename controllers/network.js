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

window.app.controller('NetworkListCtrl', function ($scope, $location, $http) {
    var model = 'network';
    $scope.obj_edit = function(obj) {
        $location.path('/api/' + model + '/' + obj.id + '/');
        $scope.$apply();
    };
    $scope.obj_create = function() {
        $location.path('/api/' + model + '/create/');
        $scope.$apply();
    };
    request('/api/' + model + '/get_list/', {token: $.cookie("core_token")}, function(objs) {
        $scope.objs = objs;
        $scope.$apply();
    });
});

window.app.controller('NetworkCreateCtrl', function ($scope, $location, $http) {
    $scope.access = 'private';
    $scope.mask = 24;

    $scope.create = function() {
        var network_mode = $scope.mode;
        var network_isolated = false;
        var network_address = $scope.address;

        if ($scope.mode == 'routed_public') {
            network_mode = 'routed';
            network_isolated = false;
            network_address = null;
        } else if ($scope.mode == 'routed_isolated') {
            network_mode = 'routed';
            network_isolated = true;
            network_address = null;
        } else {
            network_mode = $scope.mode;
            network_isolated = false;
        }

        request('/api/network/create/', {token: $.cookie("core_token"),
            name: $scope.name,
            isolated: network_isolated,
            mode: network_mode,
            mask: parseInt($scope.mask),
            address: network_address,
        }, function(resp) {
            request('/api/network/edit/', {token: $.cookie("core_token"), network_id: resp.id, access: $scope.access}, function() {});
            if (network_mode == 'isolated') {
                $location.path('/api/network/');
                $scope.$apply();
            } else {
                request('/api/network/allocate/', {token: $.cookie("core_token"), network_id: resp.id}, function() {
                    $location.path('/api/network/');
                    $scope.$apply();
                });
            }
        });
    };
});

window.app.controller('NetworkEditCtrl', function ($scope, $location, $http, $route) {
    $scope.networkRemove = function() {
        request('/api/network/delete/', {token: $.cookie("core_token"), network_id: $route.current.params.id}, function(resp) {
            $location.path("/api/network/");
            $scope.$apply();
        });
    }
    request('/api/network/get_by_id/', {token: $.cookie("core_token"), network_id: $route.current.params.id}, function(resp) {
        $scope.network = resp;

        if ($.inArray('coredhcp', window.modules) >= 0 && $scope.network) {
            $("#dhcp").toggle();
        }

        $scope.$apply();
    });
    request('/api/lease/get_list/', {token: $.cookie("core_token"), network_id: $route.current.params.id}, function(resp) {
        $scope.leases = resp;
        $scope.$apply();
    });


    var core_model = 'network';
    $scope.networkSave = function() {
        request('/api/' + core_model + '/describe/', {token: $.cookie('core_token')}, function(model) {
            for (i = 0; i < model.editable.length; i++) {
                var d = { token: $.cookie("core_token"), network_id: $scope.network.id };
                console.log(model.editable[i]);
                d[model.editable[i]] = $scope[core_model][model.editable[i]];
                request('/api/' + core_model + '/edit/', d, function (r) {});
            }
            $location.path('/api/network/');
            $scope.$apply();
        });
    };

    $scope.networkCreateLease = function() {
        request('/api/lease/create/', {token: $.cookie('core_token'),
                                       network_id: $scope.network.id,
                                       address: $scope.address}, function (r) {
            //$location.path('/api/network/');
            $scope.leases.push({address: $scope.address, vm_id: null});
            $scope.$apply();
        });
    };

    $scope.dhcpStart = function() {
        request('/api/dhcp/start/', {token: $.cookie('core_token'),
                                     network_id: $scope.network.id,
                                     gateway_ip: $scope.network.data.gateway}, function (r) {
            $location.path('/api/network/');
            $scope.$apply();
        });
    }

    $scope.dhcpStop = function() {
        request('/api/dhcp/stop/', {token: $.cookie('core_token'),
                                    network_id: $scope.network.id}, function (r) {
            $location.path('/api/network/');
            $scope.$apply();
        });
    }
});


window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/api/network/", {templateUrl: "views/api/network_list.html", controller: "NetworkListCtrl"})
        .when("/api/network/create/", {templateUrl: "views/api/network_create.html", controller: "NetworkCreateCtrl"})
        .when("/api/network/:id/", {templateUrl: "views/api/network_edit.html", controller: "NetworkEditCtrl"})
}]);
