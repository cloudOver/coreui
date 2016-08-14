/*
Copyright (c) 2014-2016 cloudover.io ltd.

This file is part of cloudover.coreCluster project.

cloudover.coreCluster is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function get_image_types($scope) {
    request('/api/image/get_image_types/', {token: $.cookie("core_token")}, function(l) {
        $scope.types = l;
        $scope.$apply();
    });
}

function get_video_devices($scope) {
    request('/api/image/get_video_devices/', {token: $.cookie("core_token")}, function(l) {
        $scope.video_devices = l;
        $scope.$apply();
    });
}

function get_network_devices($scope) {
    request('/api/image/get_network_devices/', {token: $.cookie("core_token")}, function(l) {
        $scope.network_devices = l;
        $scope.$apply();
    });
}

function get_disk_controllers($scope) {
    request('/api/image/get_disk_controllers/', {token: $.cookie("core_token")}, function(l) {
        $scope.disk_controllers = l;
        $scope.$apply();
    });
}

function get_image_formats($scope) {
    request('/api/image/get_image_formats/', {token: $.cookie("core_token")}, function(l) {
        $scope.formats = l;
        $scope.$apply();
    });
}

function prepare_new($scope, $location, $http) {
    $scope.image = {};
    $scope.image['access'] = 'private';
    $scope.image['type'] = 'transient';
    $scope.image['video_device'] = 'cirrus';
    $scope.image['network_device'] = 'virtio';
    $scope.image['disk_controller'] = 'virtio';

    $("#type").prop('disabled', true);
    $("#video_device").prop('disabled', true);
    $("#network_device").prop('disabled', true);
    $("#disk_controller").prop('disabled', true);

    get_image_types($scope);
    get_network_devices($scope);
    get_video_devices($scope);
    get_disk_controllers($scope);
    get_image_formats($scope);
}


window.app.controller('ImageListCtrl', function ($scope, $location, $http) {
    var model = 'image';
    $scope.obj_edit = function(obj) {
        $location.path('/api/' + model + '/' + obj.id + '/');
        $scope.$apply();
    };
    $scope.obj_create = function() {
        $location.path('/api/' + model + '/create/');
        $scope.$apply();
    };
    $scope.obj_upload = function() {
        $location.path('/api/' + model + '/upload/');
        $scope.$apply();
    };

    function refreshList() {
        request('/api/' + model + '/get_list/', {token: $.cookie("core_token")}, function(objs) {
            $scope.objs = objs;
            $scope.$apply();
        }, quiet=true);
        clearTimeout(window.refresh);
        window.refresh = setTimeout(refreshList, 4000);
    }
    refreshList();
});


window.app.controller('ImageCreateCtrl', function ($scope, $location, $http) {
    clearTimeout(window.refresh);
    $scope.create = true;
    prepare_new($scope, $location, $http);

    $scope.imageNew = function() {
        request('/api/image/create/', {token: $.cookie("core_token"),
            name: $scope.image.name,
            description: $scope.image.description,
            size: parseInt($scope.image.size)*1024*1024*1024,
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
});


window.app.controller('ImageUploadCtrl', function ($scope, $location, $http) {
    clearTimeout(window.refresh);
    $scope.upload = true;
    prepare_new($scope, $location, $http);

    $scope.imageNew = function() {
        request('/api/image/create/', {token: $.cookie("core_token"),
            name: $scope.image.name,
            description: $scope.image.description,
            size: 1,
            disk_controller: $scope.image.disk_controller,
            image_type: $scope.image.type,
            format: $scope.image.format,
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
            request('/api/image/upload_url/', {token: $.cookie("core_token"),
                image_id: img.id,
                url: $scope.location
            }, function(r) {})
        });
    };

    $scope.checkFormat = function() {
        for (i = 0; i < $scope.formats.length; i++) {
            var pos = $scope.location.indexOf($scope.formats[i])
            if (pos > 0 && pos == $scope.location.length - $scope.formats[i].length) {
                $scope.image.format = $scope.formats[i];
            }
        }
    };
});


window.app.controller('ImageEditCtrl', function ($scope, $location, $route, $routeParams) {
    clearTimeout(window.refresh);
    $scope.image = {name: 'loading...'};

    var core_model = 'image';
    $scope.imageRemove = function() {
       request('/api/image/delete/', { token: $.cookie("core_token"), image_id: $scope.image.id }, function() {
           $location.path('/api/image/');
           $scope.$apply();
       }) ;
    };
    $scope.imageSave = function() {
        request('/api/' + core_model + '/describe/', {token: $.cookie('core_token')}, function(model) {
            for (i = 0; i < model.editable.length; i++) {
                var d = { token: $.cookie("core_token"), image_id: $scope.image.id };
                console.log(model.editable[i]);
                d[model.editable[i]] = $scope[core_model][model.editable[i]];
                request('/api/' + core_model + '/edit/', d, function (r) {});
            }
            $location.path('/api/image/');
            $scope.$apply();
        });
    };

    $scope.imageDetach = function(vm_id, image_id) {
        request('/api/image/detach/', {token: $.cookie("core_token"), image_id: image_id, vm_id: vm_id}, function(r) {
            $location.path('/api/image/');
            $scope.$apply();
        });
    };

    $scope.imageAttach = function(vm_id, image_id) {
        request('/api/image/attach/', {token: $.cookie("core_token"), image_id: image_id, vm_id: vm_id}, function(r) {
            $location.path('/api/image/');
            $scope.$apply();
        });
    };

    get_image_types($scope);
    get_network_devices($scope);
    get_video_devices($scope);
    get_disk_controllers($scope);
    get_image_formats($scope);

    request('/api/image/get_by_id/', {token: $.cookie('core_token'), image_id: $route.current.params.id}, function(img) {
        img.size = (img.size/1024/1024/1024).toFixed(2);
        $scope.image = img;
        $scope.$apply();

        console.log($scope);
        draw_task_graph('task_graph', img.tasks);
    });
});


window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/api/image/", {templateUrl: "views/api/image_list.html", controller: "ImageListCtrl"})
        .when("/api/image/create/", {templateUrl: "views/api/image_new.html", controller: "ImageCreateCtrl"})
        .when("/api/image/upload/", {templateUrl: "views/api/image_new.html", controller: "ImageUploadCtrl"})
        .when("/api/image/:id/", {templateUrl: "views/api/image_edit.html", controller: "ImageEditCtrl"});
}]);