window.app.controller('TokenListCtrl', function ($scope, $location, $http) {
    var model = 'userdata';
    $scope.obj_create = function() {
        $location.path("/account/token/create/");
        $scope.$apply();
    }
    request('/user/token/get_list/', {login: $.cookie("core_login"), pw_hash: $.cookie("core_hash")}, function(objs) {
        $scope.objs = objs;
        $scope.$apply();
    });
});

window.app.controller('TokenCreateCtrl', function ($scope, $location, $http) {
    var model = 'userdata';
    $scope.obj_create = function() {
        request('/user/token/create/', {login: $.cookie("core_login"), pw_hash: $.cookie("core_hash"), name: $scope.name}, function(resp) {
            $location.path("/account/token/");
            $scope.$apply();
        });
    }
});


window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/account/token/", {templateUrl: "views/account/token_list.html", controller: "TokenListCtrl"})
        .when("/account/token/create/", {templateUrl: "views/account/token_create.html", controller: "TokenCreateCtrl"})
}]);