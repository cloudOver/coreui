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
    $routeProvider.when("/vm/list/", {templateUrl: "apps/vm/views/list.html"})
    $routeProvider.when("/vm/:id/", {templateUrl: "apps/vm/views/details.html"})
}]);