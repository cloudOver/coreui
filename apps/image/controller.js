window.app_coreui.component('imagedetails', {
    templateUrl: 'apps/image/components/details.html',
    controller: function($scope, $http, Api, $q) {
        $scope.vm = [];
        this.$onInit = function() {
            var id = this.id;
            Api.call('/api/image/get_by_id/', {image_id: id}, $http, $q).then(function (image) {
                $scope.image = image;
            });
        }
    },
    bindings: {
        id: '@',
    },
});

window.app_coreui.component('imagesummary', {
    templateUrl: 'apps/image/components/summary.html',
    controller: function($scope, $http, Api, $q) {
        this.$onInit = function() {
            Api.call('/api/image/get_list/', {}, $http, $q).then(function (images) {
                $scope.images = 0;
                $scope.size = 0;
                for (var image in images) {
                    $scope.images++;
                    $scope.size += image.size;
                }
            });
        }
    },
});

window.app_coreui.controller('ImageCtrl', function ($scope, $http, Api, $q, $route) {
    $scope.id = $route.current.params.id;
});

window.app_coreui.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/image/list/", {templateUrl: "apps/image/views/list.html"})
    $routeProvider.when("/image/:id/", {templateUrl: "apps/image/views/details.html", controller: 'ImageCtrl'})
}]);