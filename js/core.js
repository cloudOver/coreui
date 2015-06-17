var app = angular.module('coreUi', [
    'chart.js',
    'ngRoute',
]);


/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/", {templateUrl: "components/home.html", controller: "CoreCtrl"})
                  .when("/api/vm/", {templateUrl: "components/api/vm.html", controller: "CoreCtrl"})
                  .when("/api/image/", {templateUrl: "components/api/image.html", controller: "CoreCtrl"})
                  .when("/logout/", {templateUrl: "components/logout.html", controller: "LogoutCtrl"})
                  .otherwise("/404", {templateUrl: "components/404.html", controller: "CoreCtrl"});
}]);


app.controller('CoreCtrl', function ($scope, $location, $http) {
    window.core_login = $.cookie("core_login");
    window.core_hash = $.cookie("core_hash");
    window.core_token = $.cookie("core_token");
    if (!window.core_login || !window.core_hash || ! window.core_token) {
        document.location = "login.html";
    }

    viewController($scope);
});

app.controller('LogoutCtrl', function ($scope, $location, $http) {
    $.cookie("core_login", null);
    $.cookie("core_hash", null);
    $.cookie("core_token", null);
    document.location = "login.html";
});
