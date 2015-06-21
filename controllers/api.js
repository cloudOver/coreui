function get_image_types($scope) {
    request('/api/image/get_image_types/', {token: $.cookie("core_token")}, function(types) {
        $scope.types = types;
        $scope.type = 'transient'
        $scope.$apply();
        $("#type").prop('disabled', false);
        $("#type").selectpicker();
    });
}

function get_video_devices($scope) {
    request('/api/image/get_video_devices/', {token: $.cookie("core_token")}, function(l) {
        $scope.video_devices = l;
        $scope.video_device = 'cirrus';
        $scope.$apply();
        $("#video_devices").prop('disabled', false);
        $("#video_device").selectpicker();
    });
}

function get_network_devices($scope) {
    request('/api/image/get_network_devices/', {token: $.cookie("core_token")}, function(l) {
        $scope.network_devices = l;
        $scope.network_device = 'virtio';
        $scope.$apply();
        $("#network_device").prop('disabled', false);
        $("#network_device").selectpicker();
    });
}

function get_disk_controllers($scope) {
    request('/api/image/get_disk_controllers/', {token: $.cookie("core_token")}, function(l) {
        $scope.disk_controllers = l;
        $scope.disk_controller = 'virtio';
        $scope.$apply();
        $("#disk_controller").prop('disabled', false);
        $("#disk_controller").selectpicker();
    });
}


window.app.controller('ImageListCtrl', function ($scope, $location, $http) {
    var model = 'image';
    $scope.obj_edit = function(obj) {
        $location.path('/api/' + model + '/edit/' + obj.id + '/');
    };
    $scope.obj_create = function() {
        $location.path('/api/' + model + '/create/');
    };
    request('/api/' + model + '/get_list/', {token: $.cookie("core_token")}, function(objs) {
        $scope.objs = objs;
        $scope.$apply();
    });
    alert('done');
});


window.app.controller('ImageCreateCtrl', function ($scope, $location, $http) {
    $scope.nics =  [];
    $scope.networks = [];
    $scope.leases = [];
    $scope.storages = [];
    $scope.vnc = 0;
    $("#access").selectpicker();

    /*$("#type").prop('disabled', true);
    $("#video_device").prop('disabled', true);
    $("#network_device").prop('disabled', true);
    $("#disk_controller").prop('disabled', true);*/

    $scope.imageCreate = function() {
        request('/api/image/create/', {token: $.cookie("core_token"),
            name: $scope.name,
            description: $scope.description
        }, function(img) {});
    };

    get_image_types($scope);
    get_network_devices($scope);
    get_video_devices($scope);
    get_disk_controllers($scope);
});


window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/api/image/", {templateUrl: "views/api/image_list.html", controller: "ImageListCtrl"})
        .when("/api/image/create/", {templateUrl: "views/api/image_create.html", controller: "ImageCreateCtrl"});
}]);