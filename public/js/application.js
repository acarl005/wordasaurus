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

    .when('/my_pieces', {
      templateUrl: 'partials/users/index.html',
      controller: 'UsersIndexController'
    })

    .when('/users/:id', {
      templateUrl: 'templates/pages/users/show.html',
      controller: 'UsersShowController'
    })

    .otherwise({redirectTo: '/'});
}])

.controller('HomeController', ['$scope', 'Piece', function ($scope, Piece) {
  $scope.pieces = Piece.all();
  $scope.corn = 'wtf';
}])

.controller('UsersIndexController', ['$scope', function ($scope) {
  $scope.corn = 'wtf';
}])

.factory('Piece', ['$http', function NoteFactory($http) {
  return {
    all: function(user_id) {
      return $http({method: 'GET', url: 'users/'+user_id+'/pieces'})
    }
  };
}])

.factory('User', ['$http', function UserFactory($http) {
  return {
    current: function() {
      return $http({method: 'GET', url: 'users/current'})
    },
    find: function(id) {
      return $http({method: 'GET', url: 'users/'+id })
    }
  };
}])
