window.app_coreui.controller('ImageCtrl', function ($scope, $location, $http, Api, $q, $route) {
    $scope.id = $route.current.params.id;
    $scope.create = function() {
        $location.path('/image/create/');
    };
    $scope.upload = function() {
        $location.path('/image/upload/');
    };
    Api.call('/api/image/get_by_id/', {image_id: $route.current.params.id}, $http, $q).then(function (image) {
        $scope.image = image;
        $scope.image.size = ($scope.image.size/1024/1024/1024).toFixed(2);
    });
});

window.app_coreui.controller('ImageCreateCtrl', function ($scope, $location, $http, $q, Api) {
    $scope.image_types = [];
    $('select').material_select();
    console.log($scope.image_types);
    Api.call('/api/image/get_image_types/', {}, $http, $q).then(function (image_types) {
        $scope.image_types = image_types;
        console.log($scope.image_types);
    });

    $scope.create = function() {
        var params = {};
        params['name'] = $scope.name;
        params['description'] = $scope.description;
        params['size'] = $scope.size * 1024 * 1024;
        params['image_type'] = $('input[name=image_type]:checked').val();
        console.log(params);
        Api.call('/api/image/create/', params, $http, $q).then(function (image) {
            $location.path('/image/list/');
        });
    };
});

window.app_coreui.controller('ImageUploadCtrl', function ($scope, $location, $http, Api, $q, $route) {
    //
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
        Api.call('/api/image/get_network_devices/', {}, $http, $q).then(function (network_devices) {
            $scope.network_devices = network_devices;
        });
        Api.call('/api/image/get_video_devices/', {}, $http, $q).then(function (video_devices) {
            $scope.video_devices = video_devices;
        });
        Api.call('/api/image/get_image_formats/', {}, $http, $q).then(function (formats) {
            $scope.formats = formats;
        });
        Api.call('/api/image/get_image_types/', {}, $http, $q).then(function (types) {
            $scope.types = types;
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

window.app_coreui.component('imageadvanced', {
    templateUrl: 'apps/image/components/advanced.html',
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
                for (var i = 0; i < images.length; i++) {
                    $scope.images++;
                    $scope.size += images[i]['size'];
                }
                $scope.size = parseInt($scope.size*100/1024/1024/1024)/100;
            });
        }
    },
});

window.app_coreui.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/image/list/", {templateUrl: "apps/image/views/list.html", controller: 'ImageCtrl'})
    $routeProvider.when("/image/upload/", {templateUrl: "apps/image/views/upload.html", controller: 'ImageUploadCtrl'})
    $routeProvider.when("/image/create/", {templateUrl: "apps/image/views/create.html", controller: 'ImageCreateCtrl'})
    $routeProvider.when("/image/:id/", {templateUrl: "apps/image/views/details.html", controller: 'ImageCtrl'})
}]);