var app = angular.module('coreUi', [
    'ngRoute'
]);


app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/", {templateUrl: "components/login.html", controller: "LoginCtrl"})
                  .when("/login/", {templateUrl: "components/login.html", controller: "LoginCtrl"})
                  .when("/register/", {templateUrl: "components/register.html", controller: "LoginCtrl"})
}]);


app.controller('LoginCtrl', function ($scope, $location, $http) {
    console.log("Login controller reporting for duty.");
});
