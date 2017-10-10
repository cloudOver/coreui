window.app_coreui = angular.module('coreui', [
    'ngRoute',
    'ngAnimate',
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
    templateUrl: 'apps/coreui/components/navbar.html',
});

window.app_coreui.component('sidemenu', {
    templateUrl: 'apps/coreui/components/sidemenu.html',
});

window.app_coreui.component('list', {
    templateUrl: 'apps/coreui/components/list.html',
    controller: function($scope, $http, Api, $q, $location) {
        $scope.items = null;
        this.$onInit = function() {
            $scope.headers = this.headers.split(",");

            var itemlink = this.itemlink
            $scope.click = function(id) {
                if (itemlink != null)
                    $location.path(itemlink + id);
            };

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
        };
    },
    bindings: {
        headers: '@',
        component: '@',
        fields: '@',
        header: '@',
        itemlink: '@',
    },
});

window.app_coreui.component('field', {
    templateUrl: 'apps/coreui/components/field.html',
    controller: function($scope, $http, Api, $q, $location) {
        this.$onInit = function() {
            $scope.id = this.id;
            $scope.objectselector = this.objectselector;
            $scope.field = this.field;
            $scope.value = this.value;
            $scope.description = this.description;
            $scope.name = this.name;
            $scope.component = this.component;
            $scope.options = this.options;
            $scope.editable = this.editable;

            var params = [];
            params[$scope.objectselector] = $scope.id;
            params[$scope.field] = $scope.value;

            $scope.edit = function() {
                Api.call('/api/' + $scope.component + '/edit/', params, $http, $q).then(function () {
                });
            };
        };
    },
    bindings: {
        id: '@',
        objectselector: '@',
        field: '@',
        value: '@',
        description: '@',
        name: '@',
        component: '@',
        options: '@',
        editable: '@',
    },
});

window.app_coreui.component('ask', {
    templateUrl: 'apps/coreui/components/ask.html',
    controller: function($scope, $http, Api, $q, $location) {
        this.$onInit = function() {
            $scope.question = this.question;
            $scope.text = this.text;
            $scope.landingurl = this.landingurl;
            $scope.action = this.action;
            $scope.objectselector = this.objectselector;
            $scope.id = this.id;

            $scope.click = function() {
                params = {};
                params[$scope.objectselector] = $scope.id;
                console.log(params);
                Api.call($scope.action, params, $http, $q).then(function (items) {
                    $location.path($scope.landingurl);
                });
            };
        };
    },
    bindings: {
        question: '@',
        id: '@',
        objectselector: '@',
        landingurl: '@',
        action: '@',
        text: '@',
    },
});

window.app_coreui.component('state', {
    templateUrl: 'apps/coreui/components/state.html',
    bindings: {
        state: '@',
    },
});

window.app_coreui.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when("/", {templateUrl: "apps/coreui/views/dashboard.html"})
}]);
