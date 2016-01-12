window.app.controller('HomeCtrl', function ($scope, $location, $http) {
    if (!$.cookie('core_token')) {
        document.location = 'login.html';
    }
    request('/api/template/capabilities/', {token: $.cookie("core_token")}, function(caps) {
        request('/api/template/get_list/', {token: $.cookie("core_token")}, function(templ) {
            $scope.templates = [];
            for (i = 0; i < templ.length; i++) {
                $scope.templates.push({});
                $scope.templates[i].caps = caps[templ[i]["id"]];
                $scope.templates[i].id = templ[i]["id"];
                $scope.templates[i].name = templ[i]["name"];
            }
            $scope.$apply();
        });
    });

    request('/api/storage/capabilities/', {token: $.cookie("core_token")}, function(caps) {
        $scope.storage = (caps/1024).toFixed(2);
        $scope.$apply();
    });

    request('/user/user/get_quota/', {login: $.cookie("core_login"), pw_hash: $.cookie("core_hash")}, function(r) {
        $scope = angular.element($("#view")).scope();
        $scope.$apply();

        var ctx = $("#memory").get(0).getContext("2d");
        var c = new Chart(ctx).Doughnut([
            {
                value: r['memory_used'],
                color: '#33ff88'
            },
            {
                value: r['memory_quota'] - r['memory_used'],
                color: '#dddddd'
            }
        ]);
        var ctx = $("#cpu").get(0).getContext("2d");
        var c = new Chart(ctx).Doughnut([
            {
                value: r['cpu_used'],
                color: '#ff6633'
            },
            {
                value: r['cpu_quota'] - r['cpu_used'],
                color: '#dddddd'
            }
        ]);
        var ctx = $("#storage").get(0).getContext("2d");
        var c = new Chart(ctx).Doughnut([
            {
                value: (r['storage_used']/1024/1024/1024).toFixed(2),
                color: '#ffbb33'
            },
            {
                value: (r['storage_quota']/1024/1024/1024 - r['storage_used']/1024/1024/1024).toFixed(2),
                color: '#dddddd'
            }
        ]);
    });
});

window.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/", {templateUrl: "views/home.html", controller: "HomeCtrl"});
}]);
