window.app_coreui = angular.module('coreui', [
    'ngRoute',
]);

window.app_coreui.provider('Api', function Api() {
    this._endpoint = '';
    this._login = '';
    this._password = '';
    this._seed = '';

    this.$get = function () {
        var that = this;
        return {
            call: function (method, params, $http, $q) {
                var deferred = $q.defer();
                params['token'] = that._token;

                $http.post(that._endpoint + '/' + method, params)
                .then(function successCallback(data, status, headers, config) {
                    deferred.resolve(data.data.data);
                }, function errorCallback(data, status, headers, config) {
                    deferred.reject(status);
                });
                return deferred.promise;
            },
            call_auth: function () {
                return 'Hello, ' + that._username;
            }
        };
    };

});

window.app_coreui.component('navbar', {
    templateUrl: 'apps/coreui/templates/navbar.html',
});

window.app_coreui.component('sidemenu', {
    templateUrl: 'apps/coreui/templates/sidemenu.html',
});

window.app_coreui.component('list', {
    templateUrl: 'apps/coreui/templates/list.html',
    controller: function($scope, $http, Api, $q) {
        this.$onInit = function() {
            $scope.headers = this.headers.split(",");

            var field_sets = this.fields.split(",");
            var fields = [];
            for (var field in field_sets) {
                fields.push(field_sets[field].split('+'));
            }
            $scope.fields = fields;

            var scope = $scope;
            Api.call('/api/' + this.component + '/get_list/', {}, $http, $q).then(function (items) {
                $scope.items = items;
            });
        }
    },
    bindings: {
        headers: '@',
        component: '@',
        fields: '@',
    },
});



//////////////////////////////////////////////
window.app_coreui.config(function (ApiProvider) {
    ApiProvider._endpoint = 'http://192.168.77.253:8000';
    ApiProvider._token = 'f7cef3fe19e94e76ae432010950fe56f-sha512-4bb4b4f075-c3e7e343e9eb5e624144a6134f0d14bb1cbbd200680c9d0131c6f14439b3a81be7d6b9706dc77181ec03db43337b46c8a6043f67a66e38ab17de34d1c93265f8';
    ApiProvider._login = 'xxx';
    ApiProvider._password = 'qqq';
});