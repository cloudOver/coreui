window.app.controller('CoreVpnListCtrl', function ($scope, $location, $http) {
    var model = 'vpn';
    $scope.obj_edit = function(obj) {
        $location.path('/corevpn/' + model + '/' + obj.id + '/');
        $scope.$apply();
    };
    $scope.obj_create = function() {
        $location.path('/corevpn/' + model + '/create/');
        $scope.$apply();
    };
    request('/api/' + model + '/get_list/', {token: $.cookie("core_token")}, function(objs) {
        $scope.objs = objs;
        $scope.$apply();
    });
});


window.app.controller('CoreVpnCreateCtrl', function ($scope, $location, $http) {
    $scope.script = '';
    $scope.name = '';
    $scope.create = function() {
        request('/vpn/network/create/', {token: $.cookie("core_token"),
            name: $scope.name,

        }, function(resp) {
            $location.path('/coretalk/userdata/');
            $scope.$apply();
        });
    };
});


window.app.controller('UserdataEditCtrl', function ($scope, $location, $http, $route) {
    request('/api/userdata/get_by_id/', {token: $.cookie('core_token'), userdata_id: $route.current.params.id}, function(r) {
        $scope.script = r;
        $scope.$apply();
    });
    request('/api/userdata/get_list/', {token: $.cookie('core_token')}, function(r) {
        $scope.scripts = r;
        $scope.$apply();
    });
    request('/api/vm/get_list/', {token: $.cookie('core_token')}, function(r) {
        $scope.vms = r;
        $scope.$apply();
    });

    $scope.attach = function() {
        request('/api/userdata/attach/', {token: $.cookie("core_token"),
            vm_id: $scope.vm.id,
            userdata_id: $route.current.params.id
        }, function(resp) {
            $location.path('/coretalk/userdata/');
            $scope.$apply();
        });
    };
    $scope.remove = function() {
        request('/api/userdata/delete/', {token: $.cookie("core_token"), userdata_id: $route.current.params.id}, function() {
            $location.path("/coretalk/userdata/");
            $scope.$apply();
        });
    };
    $scope.save = function() {
        request('/api/userdata/edit/', {token: $.cookie("core_token"),
            userdata_id: $route.current.params.id,
            name: $scope.script.name,
            data: $scope.script.data
        }, function() {
            $location.path("/coretalk/userdata/");
            $scope.$apply();
        });
    }
});

window.app.controller('SshkeyCreateCtrl', function ($scope, $location, $http) {
    $scope.script = '';
    $scope.name = '';
    $scope.create = function() {
        request('/api/sshkey/create/', {token: $.cookie("core_token"),
            name: $scope.name,
            public_key: $scope.data
        }, function(resp) {
            $location.path('/coretalk/sshkey/');
            $scope.$apply();
        });
    };
});

window.app.controller('SshkeyListCtrl', function ($scope, $location, $http) {
    var model = 'sshkey';
    $scope.obj_edit = function(obj) {
        $location.path('/coretalk/' + model + '/' + obj.id + '/');
        $scope.$apply();
    };
    $scope.obj_create = function() {
        $location.path('/coretalk/' + model + '/create/');
        $scope.$apply();
    };
    request('/api/' + model + '/get_list/', {token: $.cookie("core_token")}, function(objs) {
        $scope.objs = objs;
        $scope.$apply();
    });
});

window.app.controller('SshkeyEditCtrl', function ($scope, $location, $http, $route) {
    request('/api/sshkey/get_by_id/', {token: $.cookie('core_token'), key_id: $route.current.params.id}, function(r) {
        $scope.sshkey = r;
        $scope.$apply();
    });
    request('/api/vm/get_list/', {token: $.cookie('core_token')}, function(r) {
        $scope.vms = r;
        $scope.$apply();
    });

    $scope.attach = function() {
        request('/api/sshkey/attach/', {token: $.cookie("core_token"),
            vm_id: $scope.vm.id,
            key_id: $route.current.params.id
        }, function(resp) {
            $location.path('/coretalk/sshkey/');
            $scope.$apply();
        });
    };
    $scope.remove = function() {
        request('/api/sshkey/delete/', {token: $.cookie("core_token"), key_id: $route.current.params.id}, function() {
            $location.path("/coretalk/sshkey/");
            $scope.$apply();
        });
    };
    $scope.save = function() {
        request('/api/sshkey/edit/', {token: $.cookie("core_token"),
            key_id: $route.current.params.id,
            name: $scope.script.name,
            data: $scope.script.data
        }, function() {
            $location.path("/coretalk/sshkey/");
            $scope.$apply();
        });
    }
});


window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/corevpn/", {templateUrl: "views/corevpn/vpn_list.html", controller: "CoreVpnListCtrl"})
        .when("/corevpn/create/", {templateUrl: "views/coretalk/userdata_create.html", controller: "UserdataCreateCtrl"})
        .when("/corevpn/:id/", {templateUrl: "views/coretalk/userdata_edit.html", controller: "UserdataEditCtrl"})
}]);
