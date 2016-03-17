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
