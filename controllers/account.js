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

window.app.controller('TokenListCtrl', function ($scope, $location, $http) {
    var model = 'userdata';
    $scope.obj_create = function() {
        $location.path("/account/token/create/");
        $scope.$apply();
    };
    $scope.obj_remove = function(id) {
        request('/user/token/delete/', {login: $.cookie("core_login"), pw_hash: $.cookie("core_hash"), token_id: id}, function(resp) {
            location.reload();
        });
    };
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