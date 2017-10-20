window.app_coreui.controller('VmCtrl', function ($scope, $location, $http, Api, $q, $route) {
    $scope.id = $route.current.params.id;
    $scope.create = function() {
        $location.path('/vm/create/');
    };
    $scope.templates = function() {
        $location.path('/vm/templates/');
    };
    Api.call('/api/vm/get_by_id/', {vm_id: $route.current.params.id}, $http, $q).then(function (image) {
        $scope.vm = vm;
    });
});

window.app_coreui.controller('TemplateCtrl', function ($scope, $location, $http, Api, $q, $route) {
    Api.call('/api/template/get_list/', {}, $http, $q).then(function (templates) {
        $scope.templates = templates;
        $scope.max_cpu = 0;
        $scope.max_memory = 0;
        $scope.max_hdd = 0;

        for (var i = 0 ; i < templates.length; i++) {
            if (templates[i].cpu > $scope.max_cpu)
                $scope.max_cpu = templates[i].cpu;
            if (templates[i].memory > $scope.max_memory)
                $scope.max_memory = templates[i].memory;
            if (templates[i].hdd > $scope.max_hdd)
                $scope.max_hdd = templates[i].hdd;
        }
    });
});

window.app_coreui.component('vmdetails', {
    templateUrl: 'apps/vm/components/details.html',
    controller: function($scope, $http, Api, $q) {
        $scope.vm = [];
        this.$onInit = function() {
            Api.call('/api/' + this.id + '/get_by_id/', {}, $http, $q).then(function (vm) {
                $scope.vm = vm;
            });
        }
    },
    bindings: {
        id: '@',
    },
});

window.app_coreui.component('vmsummary', {
    templateUrl: 'apps/vm/components/summary.html',
    controller: function($scope, $http, Api, $q) {
        this.$onInit = function() {
            Api.call('/api/vm/get_list/', {}, $http, $q).then(function (vms) {
                $scope.vms_running = 0;
                $scope.vms = 0;
                for (var vm in vms) {
                    $scope.vms++;
                    if (vm.state == 'running') {
                        $scope.vms_running++;
                    }
                }
            });
        }
    },
});

window.app_coreui.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/vm/list/", {templateUrl: "apps/vm/views/list.html", controller: 'VmCtrl'})
    $routeProvider.when("/vm/templates/", {templateUrl: "apps/vm/views/templates.html", controller: 'TemplateCtrl'})
    $routeProvider.when("/vm/:id/", {templateUrl: "apps/vm/views/details.html"})
}]);