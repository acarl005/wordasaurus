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

.controller('UsersIndexController', ['$scope', 'User' , 'Piece', function ($scope, User, Piece) {
  User.current().success(function(res) {
    $scope.user = res
    Piece.all($scope.user.id).success(function(res) {$scope.pieces = res});
  });

}])

.controller('HomeController', ['$scope', function ($scope) {
  $scope.corn = 'wtf';
}])

.factory('Piece', ['$http', function NoteFactory($http) {
  return {
    all: function(user_id) {
      return $http.get('users/'+user_id+'/pieces')
    }
  };
}])

.factory('User', ['$http', function UserFactory($http) {
  return {
    current: function() {
      return $http.get('users/current');
    },
    find: function(id) {
      return $http.get('users/'+id)
    }
  };
}])
