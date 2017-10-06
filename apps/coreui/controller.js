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
            call: function (method, params, $http) {
                params['token'] = that._token;

                var res = $http.post(that._endpoint + '/' + method, params);
                return res;
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
    controller: function($scope, $http, Api) {
        console.log(this.method);
        this.$onInit = function(){
            $scope.list = Api.call(this.method, {}, $http);
        }
    },
    bindings: {
        method: '@',
    },
});


//////////////////////////////////////////////
window.app_coreui.config(function (ApiProvider) {
    ApiProvider._endpoint = 'http://192.168.77.253:8000';
    ApiProvider._token = 'abdce';
    ApiProvider._login = 'xxx';
    ApiProvider._password = 'qqq';
});