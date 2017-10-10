window.app_coreui.controller('ImageCtrl', function ($scope, $http, Api, $q, $route) {
    $scope.id = $route.current.params.id;
});

window.app_coreui.controller('ImageFetchCtrl', function($scope, $http, Api, $q) {
    $scope.vm = [];
    this.$onInit = function() {
        var id = this.id;
        Api.call('/api/image/get_by_id/', {image_id: id}, $http, $q).then(function (image) {
            $scope.image = image;
            $scope.image.size = ($scope.image.size/1024/1024/1024).toFixed(2);
        });
        Api.call('/api/image/get_disk_controllers/', {}, $http, $q).then(function (disk_controllers) {
            $scope.disk_controllers = disk_controllers;
        });
        Api.call('/api/image/get_network_devices/', {image_id: id}, $http, $q).then(function (network_devices) {
            $scope.network_devices = network_devices;
        });
        Api.call('/api/image/get_video_devices/', {image_id: id}, $http, $q).then(function (video_devices) {
            $scope.video_devices = video_devices;
        });
        Api.call('/api/image/get_image_formats/', {image_id: id}, $http, $q).then(function (formats) {
            $scope.formats = formats;
        });
        $scope.access = ['public', 'group', 'private'];
    }
});

window.app_coreui.component('imagedetails', {
    templateUrl: 'apps/image/components/details.html',
    controller: 'ImageFetchCtrl',
    bindings: {
        id: '@',
    },
});

window.app_coreui.component('imageusedby', {
    templateUrl: 'apps/image/components/usedby.html',
    controller: 'ImageFetchCtrl',
    bindings: {
        id: '@',
    },
});

window.app_coreui.component('imageparams', {
    templateUrl: 'apps/image/components/params.html',
    controller: 'ImageFetchCtrl',
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

window.app_coreui.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/image/list/", {templateUrl: "apps/image/views/list.html"})
    $routeProvider.when("/image/:id/", {templateUrl: "apps/image/views/details.html", controller: 'ImageCtrl'})
}]);