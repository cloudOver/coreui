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

function get_network_list($scope) {
    request('/api/network/get_list/', {token: $.cookie("core_token")}, function(networks) {
        $scope.networks = networks;
        $scope.leases = [];
        $scope.$apply();
        for (i = 0; i < networks.length; i++) {
            request('/api/lease/get_list/', {token: $.cookie("core_token"), network_id: networks[i].id}, function(leases) {
                for (i = 0; i < leases.length; i++) {
                    $scope.leases.push(leases[i]);
                }
                $scope.$apply();
                $("#addNIC").prop('disabled', false);
            });
        }
        $scope.$apply();
    });
}

function get_template_list($scope) {
    request('/api/template/get_list/', {token: $.cookie("core_token")}, function(templates) {
        $scope.templates = templates;
        $scope.$apply();
        $("#template").prop('disabled', false);
    });
}

function get_image_list($scope) {
    request('/api/image/get_list/', {token: $.cookie("core_token")}, function(images) {
        $scope.images = images;
        $scope.$apply();
        $("#addStorage").prop('disabled', false);
        $("#baseImage").prop('disabled', false);
    });
}


window.app.controller('VmListCtrl', function ($scope, $location, $http) {
    var model = 'vm';
    $scope.obj_edit = function(obj) {
        $location.path('/api/' + model + '/' + obj.id + '/');
    };
    $scope.obj_create = function() {
        $location.path('/api/' + model + '/create/');
    };

    function refreshList() {
        request('/api/' + model + '/get_list/', {token: $.cookie("core_token")}, function(objs) {
            $scope.objs = objs;
            $scope.$apply();
        });

        clearTimeout(window.refresh);
        window.refresh = setTimeout(refreshList, 4000);
    }
    refreshList();
});


window.app.controller('VmTemplateCtrl', function ($scope, $location, $http) {
    clearTimeout(window.refresh);
    var model = 'template';
    $scope.obj_create = function() {
        $location.path('/api/' + model + '/create/');
    };
    $scope.getData = function(obj) {
        console.log(obj);
        return [{
                value: 10,
                color: '#33ff66'
            },
            {
                value: 20,
                color: '#dddddd'
            }
        ];
    };

    request('/api/' + model + '/get_list/', {token: $.cookie("core_token")}, function(objs) {
        $scope.max_cpu = 0;
        $scope.max_memory = 0;
        $scope.max_points = 0;
        for (i = 0; i < objs.length; i++) {
            if (objs[i].cpu > $scope.max_cpu)
                $scope.max_cpu = objs[i].cpu;
            if (objs[i].memory > $scope.max_memory)
                $scope.max_memory = objs[i].memory;
            if (objs[i].points > $scope.max_points)
                $scope.max_points = objs[i].points;
        }

        $scope.objs = objs;
        $scope.$apply();
    });
});


window.app.controller('VmCreateCtrl', function ($scope, $location, $http) {
    clearTimeout(window.refresh);
    $scope.nics =  [];
    $scope.networks = [];
    $scope.leases = [];
    $scope.storages = [];
    $scope.vnc = 0;

    $scope.template = null;
    $scope.base_image = {};

    $("#addStorage").prop('disabled', true);
    $("#addNIC").prop('disabled', true);
    $("#template").prop('disabled', true);
    $("#baseImage").prop('disabled', true);

    $scope.addNIC = function() {
        $scope.nics.push({});
    };


    $scope.removeNIC = function(nic) {
        var i = $scope.nics.indexOf(nic);
        $scope.nics.splice(i, 1);
    };


    $scope.addStorage = function() {
        $scope.storages.push({});
    };


    $scope.removeStorage = function(storage) {
        var i = $scope.storages.indexOf(storage);
        $scope.storages.splice(i, 1);
    };

    $scope.vmCreate = function() {
        request('/api/vm/create/', {token: $.cookie("core_token"),
            name: $scope.name,
            description: $scope.description,
            template_id: $scope.template.id,
            base_image_id: $scope.base_image.id
        }, function(vm) {
            for (i = 0; i < $scope.nics.length; i++) {
                console.log($scope.nics[i].lease.id);
                request('/api/lease/attach/', {token: $.cookie("core_token"), lease_id: $scope.nics[i].lease.id, vm_id: vm.id}, function(r) {});
            }
            for (i = 0; i < $scope.storages.length; i++) {
                request('/api/image/attach/', {token: $.cookie("core_token"), image_id: $scope.storages[i].image.id, vm_id: vm.id}, function(r) {});
            }
            if ($scope.vnc == 1) {
                request('/api/vm/console/', {token: $.cookie("core_token"), enable: 1, vm_id: vm.id}, function(r) {});
            }
            $location.path('/api/vm/');
            $scope.$apply();
        });
    };

    get_template_list($scope);
    get_image_list($scope);
    get_network_list($scope);
    $('.selectpicker').selectpicker();
});


window.app.controller('VmEditCtrl', function ($scope, $location, $route, $routeParams) {
    clearTimeout(window.refresh);
    $scope.vm = {};

    $scope.vmCleanup = function() {
        request('/api/vm/cleanup/', {token: $.cookie('core_token'), vm_id: $route.current.params.id}, function(){
            $location.path('/api/vm/');
            $scope.$apply();
        });
    };

    $scope.vmReset = function() {
        request('/api/vm/reset/', {token: $.cookie('core_token'), vm_id: $route.current.params.id}, function(){
            $location.path('/api/vm/');
            $scope.$apply();
        });
    };

    $scope.vmStart = function() {
        request('/api/vm/start/', {token: $.cookie('core_token'), vm_id: $route.current.params.id}, function(){
            $location.path('/api/vm/');
            $scope.$apply();
        });
    };

    $scope.vmPoweroff = function() {
        request('/api/vm/poweroff/', {token: $.cookie('core_token'), vm_id: $route.current.params.id}, function(){
            $location.path('/api/vm/');
            $scope.$apply();
        });
    };

    $scope.vmShutdown = function() {
        request('/api/vm/shutdown/', {token: $.cookie('core_token'), vm_id: $route.current.params.id}, function(){
            $location.path('/api/vm/');
            $scope.$apply();
        });
    };

    $scope.vmSaveImage = function() {
        request('/api/vm/save_image/', {token: $.cookie('core_token'), vm_id: $route.current.params.id}, function(){
            $location.path('/api/vm/');
            $scope.$apply();
        });
    };

    $scope.vmConsole = function(state) {
        request('/api/vm/console/', {token: $.cookie('core_token'), vm_id: $route.current.params.id, enable: state}, function(){
            $location.path('/api/vm/');
            $scope.$apply();
        });
    };

    $scope.networkAttach = function(lease) {
        request('/api/lease/attach/', {token: $.cookie("core_token"),
                                       lease_id: lease.id,
                                       vm_id: $scope.vm.id}, function(r) {
            location.reload();
        });
    }

    $scope.networkDetach = function(lease_id) {
        request('/api/lease/detach/', {token: $.cookie("core_token"),
                                       lease_id: lease_id}, function(r) {
            location.reload();
        });
    }

    $scope.imageAttach = function(image) {
        request('/api/image/attach/', {token: $.cookie("core_token"),
                                       image_id: image.id,
                                       vm_id: $scope.vm.id}, function(r) {
            location.reload();
        });
    }

    $scope.imageDetach = function(image_id) {
        request('/api/image/detach/', {token: $.cookie("core_token"),
                                       image_id: image_id,
                                       vm_id: $scope.vm.id}, function(r) {
            location.reload();
        });
    }

    var core_model = 'vm';
    $scope.vmSave = function() {
        request('/api/' + core_model + '/describe/', {token: $.cookie('core_token')}, function(model) {
            for (i = 0; i < model.editable.length; i++) {
                var d = { token: $.cookie("core_token"), vm_id: $scope.vm.id };
                console.log(model.editable[i]);
                d[model.editable[i]] = $scope[core_model][model.editable[i]];
                request('/api/' + core_model + '/edit/', d, function (r) {});
            }
            $location.path('/api/vm/');
            $scope.$apply();
        });
    };

    $scope.coreTalkAttach = function() {
        request('/api/userdata/attach/', {token: $.cookie("core_token"),
            vm_id: $scope.vm.id,
            userdata_id: $scope.userdata.id
        }, function() { location.reload(); });
    };

    request('/api/vm/get_by_id/', {token: $.cookie('core_token'), vm_id: $route.current.params.id}, function(vm) {
        for (var i in vm) {
            $scope.vm[i] = vm[i];
        }

        if ($.inArray('coretalk', window.modules) >= 0) {
            $("#coreTalkTab").toggle();
            request('/api/userdata/get_list/', {token: $.cookie("core_token")}, function(objs) {
                $scope.userdata_scripts = objs;
                $scope.$apply();
            });
        }

        $scope.webvnc_path = 'novnc/vnc.html#host=' + window.vncHost + '&port=' + window.vncPort + '&path=' + window.vncPath + $route.current.params.id + '&password=' + vm.vnc_password;

        $scope.$apply();
        console.log($scope);
        draw_task_graph('task_graph', vm.tasks);
    });

    get_image_list($scope);
    get_network_list($scope);
});


window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/api/vm/", {templateUrl: "views/api/vm_list.html", controller: "VmListCtrl"})
        .when("/api/vm/create/", {templateUrl: "views/api/vm_create.html", controller: "VmCreateCtrl"})
        .when("/api/vm/template/", {templateUrl: "views/api/vm_template.html", controller: "VmTemplateCtrl"})
        .when("/api/vm/:id/", {templateUrl: "views/api/vm_edit.html", controller: "VmEditCtrl"});
}]);
