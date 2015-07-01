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
    request('/coreTalk/' + model + '/get_list/', {token: $.cookie("core_token")}, function(objs) {
        $scope.objs = objs;
        $scope.$apply();
    });
});

window.app.controller('UserdataCreateCtrl', function ($scope, $location, $http) {
    $scope.script = '';
    $scope.name = '';
    $scope.create = function() {
        request('/coreTalk/userdata/create/', {token: $.cookie("core_token"),
            name: $scope.name,
            data: $scope.script
        }, function(resp) {
            $location.path('/coretalk/userdata/');
            $scope.$apply();
        });
    };
});

window.app.controller('UserdataEditCtrl', function ($scope, $location, $http, $route) {
    request('/coreTalk/userdata/get_by_id/', {token: $.cookie('core_token'), userdata_id: $route.current.params.id}, function(r) {
        $scope.script = r;
        $scope.$apply();
    });
    request('/coreTalk/userdata/get_list/', {token: $.cookie('core_token')}, function(r) {
        $scope.scripts = r;
        $scope.$apply();
    });
    request('/api/vm/get_list/', {token: $.cookie('core_token')}, function(r) {
        $scope.vms = r;
        $scope.$apply();
    });

    $scope.attach = function() {
        request('/coreTalk/userdata/attach/', {token: $.cookie("core_token"),
            vm_id: $scope.vm.id,
            userdata_id: $route.current.params.id
        }, function(resp) {
            $location.path('/coretalk/userdata/');
            $scope.$apply();
        });
    };
    $scope.remove = function() {
        request('/coreTalk/userdata/delete/', {token: $.cookie("core_token"), userdata_id: $route.current.params.id}, function() {
            $location.path("/coretalk/userdata/");
            $scope.$apply();
        });
    }
    $scope.save = function() {
        request('/coreTalk/userdata/edit/', {token: $.cookie("core_token"),
            userdata_id: $route.current.params.id,
            name: $scope.script.name,
            data: $scope.script.data
        }, function() {
            $location.path("/coretalk/userdata/");
            $scope.$apply();
        });
    }
});


window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/coretalk/userdata/", {templateUrl: "views/coretalk/userdata_list.html", controller: "UserdataListCtrl"})
        .when("/coretalk/userdata/create/", {templateUrl: "views/coretalk/userdata_create.html", controller: "UserdataCreateCtrl"})
        .when("/coretalk/userdata/:id/", {templateUrl: "views/coretalk/userdata_edit.html", controller: "UserdataEditCtrl"})
}]);