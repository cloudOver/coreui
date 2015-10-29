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
