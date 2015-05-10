angular.module('wordasaurus', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    // .when('/', {
    //   redirectTo: '/notes'
    // })

    .when('/', {
      templateUrl: 'partials/home/index.html',
      controller: 'UsersIndexController'
    })

    .when('/users', {
      templateUrl: 'partials/home/stuff.html',
      controller: 'UsersIndexController'
    })

    .when('/users/:id', {
      templateUrl: 'templates/pages/users/show.html',
      controller: 'UsersShowController'
    })

    .otherwise({redirectTo: '/'});
}])

.controller('HomeController', ['$scope', function ($scope) {
  $scope.corn = 'wtf';
}])

.controller('UsersIndexController', ['$scope', function ($scope) {
  $scope.corn = 'wtf';
}])
