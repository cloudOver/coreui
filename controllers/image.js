function get_image_types($scope) {
    request('/api/image/get_image_types/', {token: $.cookie("core_token")}, function(l) {
        $scope.types = l;
        $scope.$apply();
        $("#type").prop('disabled', false);
    });
}

function get_video_devices($scope) {
    request('/api/image/get_video_devices/', {token: $.cookie("core_token")}, function(l) {
        $scope.video_devices = l;
        $scope.$apply();
        $("#video_device").prop('disabled', false);
    });
}

function get_network_devices($scope) {
    request('/api/image/get_network_devices/', {token: $.cookie("core_token")}, function(l) {
        $scope.network_devices = l;
        $scope.$apply();
        $("#network_device").prop('disabled', false);
    });
}

function get_disk_controllers($scope) {
    request('/api/image/get_disk_controllers/', {token: $.cookie("core_token")}, function(l) {
        $scope.disk_controllers = l;
        $scope.$apply();
        $("#disk_controller").prop('disabled', false);
    });
}


window.app.controller('ImageListCtrl', function ($scope, $location, $http) {
    var model = 'image';
    $scope.obj_edit = function(obj) {
        $location.path('/api/' + model + '/' + obj.id + '/');
        $location.$apply();
    };
    $scope.obj_create = function() {
        $location.path('/api/' + model + '/create/');
        $scope.$apply();
    };
    request('/api/' + model + '/get_list/', {token: $.cookie("core_token")}, function(objs) {
        $scope.objs = objs;
        $scope.$apply();
    });
});


window.app.controller('ImageCreateCtrl', function ($scope, $location, $http) {
    if (!$scope.hasOwnProperty('image')) {
        $scope.image = {};
        $scope.image['access'] = 'private';
        $scope.image['type'] = 'transient';
        $scope.image['video_device'] = 'cirrus';
        $scope.image['network_device'] = 'virtio';
        $scope.image['disk_controller'] = 'virtio';
    }

    $("#type").prop('disabled', true);
    $("#video_device").prop('disabled', true);
    $("#network_device").prop('disabled', true);
    $("#disk_controller").prop('disabled', true);

    $scope.imageCreate = function() {
        request('/api/image/create/', {token: $.cookie("core_token"),
            name: $scope.image.name,
            description: $scope.image.description,
            size: $scope.image.size,
            disk_controller: $scope.image.disk_controller,
            image_type: $scope.image.type,
            access: $scope.image.access
        }, function(img) {
            request('/api/image/edit/', {token: $.cookie("core_token"),
                image_id: img.id,
                video_device: $scope.image.video_device,
                network_device: $scope.image.network_device
            }, function(r){
                $location.path("/api/image/");
                $scope.$apply();
            });
        });
    };
    get_image_types($scope);
    get_network_devices($scope);
    get_video_devices($scope);
    get_disk_controllers($scope);
});


window.app.controller('ImageEditCtrl', function ($scope, $location, $route, $routeParams) {
    if (!$scope.hasOwnProperty('image'))
        $scope.image = {};

    $("#type").prop('disabled', true);
    $("#video_device").prop('disabled', true);
    $("#network_device").prop('disabled', true);
    $("#disk_controller").prop('disabled', true);
    $scope.imageSave = function() {

    };

    get_image_types($scope);
    get_network_devices($scope);
    get_video_devices($scope);
    get_disk_controllers($scope);

    request('/api/image/get_by_id/', {token: $.cookie('core_token'), image_id: $route.current.params.id}, function(img) {
        for (var i in img) {
            $scope.image[i] = img[i];
        }
        $scope.$apply();
        console.log($scope);
    });
});


window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/api/image/", {templateUrl: "views/api/image_list.html", controller: "ImageListCtrl"})
        .when("/api/image/create/", {templateUrl: "views/api/image_create.html", controller: "ImageCreateCtrl"})
        .when("/api/image/:id/", {templateUrl: "views/api/image_edit.html", controller: "ImageEditCtrl"});
}]);