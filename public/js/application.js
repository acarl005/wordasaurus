angular.module('wordasaurus', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    // .when('/', {
    //   redirectTo: '/notes'
    // })

    .when('/', {
      templateUrl: 'partials/home/index.html',
    })

    .when('/my_pieces', {
      templateUrl: 'partials/users/index.html',
    })

    .when('/users/:id', {
      templateUrl: 'templates/pages/users/show.html',
      controller: 'UsersShowController'
    })

    .otherwise({redirectTo: '/'});
}])

.controller('HomeController', ['$scope', '$http', 'User' , 'Piece', function ($scope, $http, User, Piece) {
  var vm = this;
  var endpoint = 'http://words.bighugelabs.com/api/2/36312c87d8575d1476ece69c8dd8bdc1/'
  User.current().success(function(res) {
    $scope.user = res
    Piece.all($scope.user.id).success(function(res) {$scope.pieces = res});
  });
  $scope.getSyns = function(word) {
    if (!vm.syn_json[word]) {
      $http.get(endpoint+word+'/json').success(function(res) {vm.syn_json[word] = res});
    }
  };
  $scope.setActive = function(index, word) {
    vm.activeWord = word.toLowerCase().match(/[a-z]+/g)[0];
    vm.activeIndex = index;
    $scope.getSyns(vm.activeWord)
  };
  $scope.embedWord = function(word) {
    $('#show-piece span:nth-child(' + (vm.activeIndex+1) + ')').text(word+' ');
  };
  vm.syn_json = {}
  vm.activePiece = {};
  vm.activeWord = '';
}])

// .controller('HomeController', ['$scope', function ($scope) {
//   $scope.corn = 'wtf';
// }])

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
