window.app = angular.module('coreUi', [
    'chart.js',
    'ngRoute',
]);


/**
 * Configure the Routes
 */
window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/", {templateUrl: "views/home.html", controller: "HomeCtrl"})
        .when("/api/vm/", {templateUrl: "views/api/vm_list.html", controller: "VmListCtrl"})
        .when("/api/vm/create/", {templateUrl: "views/api/vm_create.html", controller: "VmCreateCtrl"})
        .when("/api/vm/edit/:id/", {templateUrl: "views/api/vm_edit.html", controller: "VmEditCtrl"})
        .when("/logout/", {templateUrl: "views/logout.html", controller: "LogoutCtrl"})
        //.otherwise("/404", {templateUrl: "views/404.html", controller: "CoreCtrl"});
}]);


window.app.controller('CoreCtrl', function ($scope, $location, $http) {
    //viewController($scope, $location, $http);
});

window.app.controller('LogoutCtrl', function ($scope, $location, $http) {
    $.cookie("core_login", null);
    $.cookie("core_hash", null);
    $.cookie("core_token", null);
    document.location = "login.html";
});
