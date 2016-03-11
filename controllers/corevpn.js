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
    request('/api/vpn/get_by_id/', {token: $.cookie('core_token'), userdata_id: $route.current.params.id}, function(r) {
        $scope.script = r;
        $scope.$apply();
    });
    request('/api/userdata/get_list/', {token: $.cookie('core_token')}, function(r) {
        $scope.scripts = r;
        $scope.$apply();
    });
    request('/api/vm/get_list/', {token: $.cookie('core_token')}, function(r) {
        $scope.vms = r;
        $scope.$apply();
    });

    $scope.attach = function() {
        request('/api/userdata/attach/', {token: $.cookie("core_token"),
            vm_id: $scope.vm.id,
            userdata_id: $route.current.params.id
        }, function(resp) {
            $location.path('/coretalk/userdata/');
            $scope.$apply();
        });
    };
    $scope.remove = function() {
        request('/api/userdata/delete/', {token: $.cookie("core_token"), userdata_id: $route.current.params.id}, function() {
            $location.path("/coretalk/userdata/");
            $scope.$apply();
        });
    };
    $scope.save = function() {
        request('/api/userdata/edit/', {token: $.cookie("core_token"),
            userdata_id: $route.current.params.id,
            name: $scope.script.name,
            data: $scope.script.data
        }, function() {
            $location.path("/coretalk/userdata/");
            $scope.$apply();
        });
    }
});


window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/corevpn/", {templateUrl: "views/corevpn/vpn_list.html", controller: "CoreVpnListCtrl"})
        .when("/corevpn/create/", {templateUrl: "views/corevpn/vpn_create.html", controller: "CoreVpnCreateCtrl"})
        .when("/corevpn/:id/", {templateUrl: "views/coretalk/userdata_edit.html", controller: "CoreVpnEditCtrl"})
}]);
