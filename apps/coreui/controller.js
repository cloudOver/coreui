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

window.app_coreui.component('tasks', {
    templateUrl: 'apps/coreui/components/tasks.html',
    controller: function($scope, $http, Api, $q, $location) {
        $scope.cancel = function(id) {
            var params = {};
            params['task_id'] = id;
            Api.call('/api/task/cancel/', params, $http, $q).then(function () {
            });
        }
    },
    bindings: {
        tasklist: '=',
    },
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
            var that = this;
            setTimeout(function() {
                $scope.objectid = that.objectid;
                $scope.objectselector = that.objectselector;
                $scope.field = that.field;
                $scope.value = that.value;
                $scope.description = that.description;
                $scope.name = that.name;
                $scope.component = that.component;
                $scope.options = null;
                $scope.editable = that.editable;

                if (that.options != null) {
                    var options = $.parseJSON(that.options);
                    that.options = options;
                    $scope.options = options;
                }
                $scope.$apply();
            }, 1000);

            $scope.objectid = this.objectid;
            $scope.objectselector = this.objectselector;
            $scope.field = this.field;
            $scope.value = this.value;
            $scope.description = this.description;
            $scope.name = this.name;
            $scope.component = this.component;
            $scope.options = null;
            $scope.editable = this.editable;


            $scope.edit = function() {
                $('#modal-' + $scope.field).modal('open');
                if (that.options) {
                    $('#option-' + that.field + '-' + that.value).attr('checked', true);
                }
            };
            $scope.save = function() {
                var params = {};
                params[that.objectselector] = that.objectid;
                console.log(that.options);
                if (!that.options) {
                    console.log($('#inputvalue-' + that.field).attr('value'));
                    params[that.field] = $('#inputvalue-' + that.field).attr('value');
                } else {
                    params[that.field] = $('input[name=option-' + that.field + ']:checked', '#form-' + that.field).val();
                }
                that.value = params[that.field];
                $scope.value = params[that.field];

                console.log(params);
                Api.call('/api/' + $scope.component + '/edit/', params, $http, $q).then(function () {
                });
            };
        };
    },
    bindings: {
        objectid: '@',
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
