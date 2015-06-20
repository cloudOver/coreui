function viewController($scope, $location, $http) {
    var model = 'image';
    $scope.obj_edit = function(obj) {
        $location.path('/api/' + model + '/edit/' + obj.id + '/');
    };
    $scope.obj_create = function() {
        $location.path('/api/' + model + '/create/');
    };
    request('/api/' + model + '/get_list/', {token: $.cookie("core_token")}, function(objs) {
        $scope.objs = objs;
        $scope.$apply();
    });
}