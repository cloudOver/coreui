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


window.app.controller('ApiListCtrl', function ($scope, $location, $http) {
    var model = 'userdata';
    request('/api/api/list_functions/', {token: $.cookie("core_token")}, function(objs) {
        $scope.functions = objs;
        $scope.$apply();
    });
    request('/api/api/list_api_modules/', {token: $.cookie("core_token")}, function(objs) {
        $scope.modules = objs;
        $scope.$apply();
    });
});


window.app.controller('PasswordCtrl', function ($scope, $location, $http) {
    $scope.password_change = function() {
        if ($scope.password1 != $scope.password2) {
            $('#passwordvalidation').toggle();
            return;
        }
        var new_hash = $().crypt({method: "sha1", source: $scope.password1 + $.cookie("core_hash")});
        request('/user/user/change_password/', {login: $.cookie("core_login"),
            pw_hash: $.cookie("core_hash"),
            password_seed: $.cookie('core_hash'),
            password_hash: new_hash}, function (objs) {
            $.cookie("core_hash", new_hash);
            $('#passwordchanged').toggle();
        });
    }
});


window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/account/token/", {templateUrl: "views/account/token_list.html", controller: "TokenListCtrl"})
        .when("/account/token/create/", {templateUrl: "views/account/token_create.html", controller: "TokenCreateCtrl"})
        .when("/account/api/", {templateUrl: "views/account/api_list.html", controller: "ApiListCtrl"})
        .when("/account/password/", {templateUrl: "views/account/password.html", controller: "PasswordCtrl"})
}]);