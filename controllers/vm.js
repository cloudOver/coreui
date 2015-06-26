function get_network_list($scope) {
    request('/api/network/get_list/', {token: $.cookie("core_token")}, function(networks) {
        $scope.networks = networks;
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
    request('/api/' + model + '/get_list/', {token: $.cookie("core_token")}, function(objs) {
        $scope.objs = objs;
        $scope.$apply();
    });
});


window.app.controller('VmTemplateCtrl', function ($scope, $location, $http) {
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
    $scope.nics =  [];
    $scope.networks = [];
    $scope.leases = [];
    $scope.storages = [];
    $scope.vnc = 0;

    $scope.template = {};
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
                console.log($scope.nics[i].lease.id)
                request('/api/lease/attach/', {token: $.cookie("core_token"), lease_id: $scope.nics[i].lease.id, vm_id: vm.id}, function(r) {});
            }
            for (i = 0; i < $scope.storages.length; i++) {
                request('/api/image/attach/', {token: $.cookie("core_token"), image_id: $scope.images[i].id, vm_id: vm.id}, function(r) {});
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
});


window.app.controller('VmEditCtrl', function ($scope, $location, $route, $routeParams) {
    $scope.vm = {};


    var core_model = 'vm';
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

    request('/api/vm/get_by_id/', {token: $.cookie('core_token'), vm_id: $route.current.params.id}, function(vm) {
        for (var i in vm) {
            $scope.vm[i] = vm[i];
        }
        $scope.$apply();
        console.log($scope);
    });
});


window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/api/vm/", {templateUrl: "views/api/vm_list.html", controller: "VmListCtrl"})
        .when("/api/vm/create/", {templateUrl: "views/api/vm_create.html", controller: "VmCreateCtrl"})
        .when("/api/vm/template/", {templateUrl: "views/api/vm_template.html", controller: "VmTemplateCtrl"})
        .when("/api/vm/:id/", {templateUrl: "views/api/vm_edit.html", controller: "VmEditCtrl"});
}]);