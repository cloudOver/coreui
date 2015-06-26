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
    $scope.create = function() {
        request('/api/network/create/', {token: $.cookie("core_token"),
            name: $scope.name,
            isolated: $scope.isolated,
            mask: parseInt($scope.mask),
            address: null
        }, function(resp) {
            $location.path('/api/network/');
            $scope.$apply();
        });
    }
});


window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/api/network/", {templateUrl: "views/api/network_list.html", controller: "NetworkListCtrl"})
        .when("/api/network/create/", {templateUrl: "views/api/network_create.html", controller: "NetworkCreateCtrl"})
}]);