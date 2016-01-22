window.app.controller('UserdataListCtrl', function ($scope, $location, $http) {
    var model = 'userdata';
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

window.app.controller('UserdataWizardCtrl', function ($scope, $location, $http) {
    $scope.packages = [];
    $scope.cacerts = [];
    $scope.users = [];
    $scope.name = '';

    $scope.addCacert = function() {
        $scope.cacerts.push({id: cacerts.length, value: ''});
    };

    $scope.addPackage = function() {
        $scope.packages.push({id: packages.length, value: ''});
    };

    $scope.addUser = function() {
        $scope.users.push({ssh_keys: []});
    };

    $scope.addKey = function(user) {
        user.ssh_keys.push({id: user.ssh_keys.length, value: ''});
    };

    $scope.saveUserdata = function() {
        d = {};
        d['users'] = [];
        for (i = 0; i < $scope.users.length; i++) {
            user = {};
            user['name'] = $scope.users[i].name;
            user['name'] = $scope.users[i].password;
            user['name'] = $scope.users[i].primary_group;
            user['name'] = $scope.users[i].groups;
            user['name'] = $scope.users[i].system;
            user['name'] = $scope.users[i].lock_password;
            keys = [];
            for (j = 0; j < user.keys.length; j++) {
                keys.push(user.keys[j].value);
            }
            user['keys'] = keys;
            d['users'].push(user);
        }

        $console.log(d);
    };
});


window.app.controller('UserdataCreateCtrl', function ($scope, $location, $http) {
    $scope.script = '';
    $scope.name = '';
    $scope.create = function() {
        request('/api/userdata/create/', {token: $.cookie("core_token"),
            name: $scope.name,
            data: $scope.script
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
    $routeProvider.when("/coretalk/userdata/", {templateUrl: "views/coretalk/userdata_list.html", controller: "UserdataListCtrl"})
        .when("/coretalk/userdata/wizard/", {templateUrl: "views/coretalk/userdata_wizard.html", controller: "UserdataWizardCtrl"})
        .when("/coretalk/userdata/create/", {templateUrl: "views/coretalk/userdata_create.html", controller: "UserdataCreateCtrl"})
        .when("/coretalk/userdata/:id/", {templateUrl: "views/coretalk/userdata_edit.html", controller: "UserdataEditCtrl"})
        .when("/coretalk/sshkey/", {templateUrl: "views/coretalk/sshkey_list.html", controller: "SshkeyListCtrl"})
        .when("/coretalk/sshkey/create/", {templateUrl: "views/coretalk/sshkey_create.html", controller: "SshkeyCreateCtrl"})
        .when("/coretalk/sshkey/:id/", {templateUrl: "views/coretalk/sshkey_edit.html", controller: "SshkeyEditCtrl"})
}]);
