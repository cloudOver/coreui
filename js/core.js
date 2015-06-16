var app = angular.module('coreUi', [
    'ngRoute'
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
    window.login = $.cookie("core_login");
    window.pw_hash = $.cookie("core_hash");
    window.token = $.cookie("core_token");
    $.cookie('core_login', null);
    if (!window.login || !window.pw_hash || ! window.token) {
        document.location = "login.html";
    }
});

app.controller('LogoutCtrl', function ($scope, $location, $http) {
    $.cookie("core_login", null);
    $.cookie("core_hash", null);
    $.cookie("core_token", null);
    document.location = "login.html";
});
