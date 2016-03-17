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

window.app.controller('CoreVpnListCtrl', function ($scope, $location, $http) {
    var model = 'vpn';
    $scope.obj_edit = function(obj) {
        $location.path('/corevpn/' + obj.id + '/');
        $scope.$apply();
    };
    $scope.obj_create = function() {
        $location.path('/corevpn/create/');
        $scope.$apply();
    };
    request('/api/' + model + '/get_list/', {token: $.cookie("core_token")}, function(objs) {
        $scope.objs = objs;
        $scope.$apply();
    });
});


window.app.controller('CoreVpnCreateCtrl', function ($scope, $location, $http) {
    $scope.name = '';
    request('/api/network/get_list/', {token: $.cookie("core_token")}, function(networks) {
        $scope.networks = networks;
        $scope.$apply();
    });

    $scope.create = function() {
        request('/api/vpn/create/', {token: $.cookie("core_token"),
            name: $scope.name,
            network_id: $scope.network.id,
        }, function(resp) {
            $location.path('/corevpn/');
            $scope.$apply();
        });
    };
});


window.app.controller('CoreVpnEditCtrl', function ($scope, $location, $http, $route) {
    request('/api/vpn/get_by_id/', {token: $.cookie('core_token'), vpn_id: $route.current.params.id}, function(r) {
        $scope.vpn = r;
        $scope.$apply();
    });

    request('/api/vpn/client_cert/', {token: $.cookie('core_token'), vpn_id: $route.current.params.id}, function(r) {
        $scope.credentials = r;
        $scope.$apply();
    });

    request('/api/vm/get_list/', {token: $.cookie('core_token')}, function(r) {
        $scope.vms = r;
        $scope.$apply();
    });

    $scope.remove = function() {
        request('/api/vpn/delete/', {token: $.cookie("core_token"), vpn_id: $route.current.params.id}, function() {
            $location.path("/corevpn/");
            $scope.$apply();
        });
    };
    $scope.save = function() {
        request('/api/vpn/edit/', {token: $.cookie("core_token"),
            vpn_id: $route.current.params.id,
            name: $scope.script.name
        }, function() {
            $location.path("/corevpn/");
            $scope.$apply();
        });
    }
});


window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/corevpn/", {templateUrl: "views/corevpn/vpn_list.html", controller: "CoreVpnListCtrl"})
        .when("/corevpn/create/", {templateUrl: "views/corevpn/vpn_create.html", controller: "CoreVpnCreateCtrl"})
        .when("/corevpn/:id/", {templateUrl: "views/corevpn/vpn_edit.html", controller: "CoreVpnEditCtrl"})
}]);
