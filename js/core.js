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

window.app = angular.module('coreUi', [
    'chart.js',
    'ngRoute',
]);


/**
 * Configure the Routes
 */
/*for (i = 0; i < window.modules.length; i++) {
    $.getScript('controllers/' + modules[i] + '.js');
}*/

window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/logout/", {templateUrl: "views/logout.html", controller: "LogoutCtrl"})
}]);

window.app.controller('LogoutCtrl', function ($scope, $location, $http) {
    $.cookie("core_login", null);
    $.cookie("core_hash", null);
    $.cookie("core_token", null);
    document.location = "login.html";
});
