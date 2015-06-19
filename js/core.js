window.app = angular.module('coreUi', [
    'chart.js',
    'ngRoute',
]);


/**
 * Configure the Routes
 */
window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/", {templateUrl: "components/home.html", controller: "CoreCtrl"})
                  .when("/api/vm/", {templateUrl: "components/api/vm_list.html", controller: "CoreCtrl"})
                  .when("/api/vm/create/", {templateUrl: "components/api/vm_create.html", controller: "CoreCtrl"})
                  .when("/api/vm/edit/:vm_id/", {templateUrl: "components/api/vm_edit.html", controller: "CoreCtrl"})
                  .when("/api/image/", {templateUrl: "components/api/image.html", controller: "CoreCtrl"})
                  .when("/logout/", {templateUrl: "components/logout.html", controller: "LogoutCtrl"})
                  .otherwise("/404", {templateUrl: "components/404.html", controller: "CoreCtrl"});
}]);


window.app.controller('CoreCtrl', function ($scope, $location, $http) {
    window.core_login = $.cookie("core_login");
    window.core_hash = $.cookie("core_hash");
    window.core_token = $.cookie("core_token");
    if (!window.core_login || !window.core_hash || ! window.core_token) {
        document.location = "login.html";
    }

    viewController($scope, $location, $http);
});

window.app.controller('LogoutCtrl', function ($scope, $location, $http) {
    $.cookie("core_login", null);
    $.cookie("core_hash", null);
    $.cookie("core_token", null);
    document.location = "login.html";
});
