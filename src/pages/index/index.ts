import angular from 'angular'

angular.module('app', [])
angular.module('app').controller('appCtrl', [
  '$scope',
  ($scope) => {
    $scope.number = 5
  }
])
