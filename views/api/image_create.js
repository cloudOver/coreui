window.app.controller('ImageCreateCtrl', function ($scope, $location, $http) {
    alert('asd');
    $scope.nics =  [];
    $scope.networks = [];
    $scope.leases = [];
    $scope.storages = [];
    $scope.vnc = 0;
    $("#type").selectpicker();
    $("#access").selectpicker();
    $("#video_device").selectpicker();
    $("#network_device").selectpicker();
    $("#disk_controller").selectpicker();

    $("#type").prop('disabled', true);
    $("#video_device").prop('disabled', true);
    $("#network_device").prop('disabled', true);
    $("#disk_controller").prop('disabled', true);

    $scope.imageCreate = function() {
        request('/api/image/create/', {token: $.cookie("core_token"),
            name: $scope.name,
            description: $scope.description,
        }, function(vm) {
            for (i = 0; i < $scope.nics.length; i++) {
                request('/api/lease/attach/', {token: $.cookie("core_token"), lease_id: $scope.nics[i].id, vm_id: vm.id}, function(r) {});
            }
            for (i = 0; i < $scope.storages.length; i++) {
                request('/api/image/attach/', {token: $.cookie("core_token"), image_id: $scope.images[i].id, vm_id: vm.id}, function(r) {});
            }
            if ($scope.vnc == 1) {
                request('/api/vm/console/', {token: $.cookie("core_token"), enable: 1, vm_id: vm.id}, function(r) {});
            }
            $location.path('/api/vm/');
            alert('ok');
        });
    };

    request('/api/image/get_image_types/', {token: $.cookie("core_token")}, function(types) {
        $scope.types = types;
        $scope.$apply();
        $("#type").prop('disabled', false);
    });

    request('/api/image/get_video_devices/', {token: $.cookie("core_token")}, function(l) {
        $scope.video_devices = l;
        $scope.$apply();
        $("#video_devices").prop('disabled', false);
    });

    request('/api/image/get_network_devices/', {token: $.cookie("core_token")}, function(l) {
        $scope.network_devices = l;
        $scope.$apply();
        $("#network_device").prop('disabled', false);
        $("#network_device").selectpicker();
    });

    request('/api/image/get_image_types/', {token: $.cookie("core_token")}, function(types) {
        $scope.types = types;
        $scope.$apply();
        $("#type").prop('disabled', false);
        $("#type").selectpicker();
    });
});

window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/", {templateUrl: "views/home.html", controller: "HomeCtrl"})
        .when("/api/image/", {templateUrl: "views/api/image_list.html", controller: "ImageListCtrl"})
        .when("/api/image/create/", {templateUrl: "views/api/image_create.html", controller: "ImageCreateCtrl"})
        .when("/api/image/edit/:id/", {templateUrl: "views/api/image_edit.html", controller: "ImageEditCtrl"});
}]);