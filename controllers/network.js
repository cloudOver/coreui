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
        request('/api/network/create/', {token: $.cookie("core_token"),
            name: $scope.name,
            isolated: $scope.isolated,
            mask: parseInt($scope.mask),
            address: null
        }, function(resp) {
            request('/api/network/edit/', {token: $.cookie("core_token"), network_id: resp.id, access: $scope.access}, function() {});
            request('/api/network/allocate/', {token: $.cookie("core_token"), network_id: resp.id}, function() {
                $location.path('/api/network/');
                $scope.$apply();
            });
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
});


window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/api/network/", {templateUrl: "views/api/network_list.html", controller: "NetworkListCtrl"})
        .when("/api/network/create/", {templateUrl: "views/api/network_create.html", controller: "NetworkCreateCtrl"})
        .when("/api/network/:id/", {templateUrl: "views/api/network_edit.html", controller: "NetworkEditCtrl"})
}]);