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
  $scope.setActivePiece = function(piece) {
    vm.activePiece = piece
    debugger;
    $http.get('/pieces/'+vm.activePiece.id+'/syns').success(function(res) {
      vm.syn_json = res;
    });
  }
  $scope.getSyns = function(word) {
    console.log(vm.syn_json[word])
    if (!vm.syn_json[word]) {
      $http.get(endpoint+word+'/json').success(function(res) {
        vm.syn_json[word] = res
        $scope.saveSyns();
      });
    }
  };
  $scope.setActiveWord = function(index, word) {
    vm.activeWord = word.toLowerCase().match(/[a-z]+/g)[0];
    vm.activeIndex = index;
    $scope.getSyns(vm.activeWord)
  };
  $scope.embedWord = function(word) {
    var target = $('#show-piece span:nth-child(' + (vm.activeIndex+1) + ')')
    target.text(target.text().replace(/[a-z]+/i, word));
    // $('#edit-piece').val($scope.stripSpan());
    // $('#edit-piece').text() = $scope.stripSpan();
  };
  $scope.saveSyns = function() {
    $http.post('/pieces/'+vm.activePiece.id+'/syns', {syn_json: JSON.stringify(vm.syn_json)} )
  };
  $scope.savePiece = function() {
    $http.put('/pieces/'+vm.activePiece.id, {content: $scope.stripSpan()} ).success(function() {
      alert('Saved!');
    });
  }
  $scope.stripSpan = function() {
    return ($('#show-piece').text().match(/\S+/gi) || []).join(' ')
  }
  $scope.refreshActiveFromSyn = function() {
    vm.activePiece.content = $scope.stripSpan();
    $('#edit-piece').val(vm.activePiece.content);
  }
  $scope.refreshActiveFromEdit = function() {
    vm.activePiece.content = $('#edit-piece').val();
  }
  vm.syn_json = {};
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
