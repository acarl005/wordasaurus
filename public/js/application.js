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

    .otherwise({redirectTo: '/'});
}])

.controller('HomeController', ['$scope', '$http', 'User' , 'Piece', function ($scope, $http, User, Piece) {
  var vm = this;
  User.current().success(function(res) {
    $scope.user = res;
    Piece.all($scope.user.id).success(function(res) {$scope.pieces = res});
  });
  $scope.createPiece = function(title, content) {
    Piece.create({
      title: title,
      content: content,
    }).success(function(payload) {
      $scope.pieces.push(payload);
      vm.tab = 'button';
      $('#new-title').val('');
      $('#new-piece').val('');
    });
  };
  $scope.setActivePiece = function(piece) {
    vm.activePiece = piece;
    vm.syn_json = JSON.parse(piece.syn_json);
  };
  $scope.getSyns = function(word) {
    if (!vm.syn_json[word]) {
      console.log('getting');
      $http.get('/synonyms/'+word).success(function(res) {
        vm.syn_json[word] = res
        $scope.saveSyns();
      });
    }
  };
  $scope.setActiveWord = function(index, word) {
    vm.activeWord = word.toLowerCase().match(/[a-z]+/g)[0];
    vm.activeIndex = index;
    $scope.getSyns(vm.activeWord);
  };
  $scope.embedWord = function(word) {
    // var target = $('#show-piece span:nth-child(' + (vm.activeIndex+1) + ')')
    // target.text(target.text().replace(/[a-z\s]+/i, word));
    var pieces = vm.activePiece.content.split(' ');
    pieces[vm.activeIndex] = pieces[vm.activeIndex].replace(/[a-z]+/i, word);
    vm.activePiece.content = pieces.join(' ');
  };
  $scope.saveSyns = function() {
    $http.post('/pieces/'+vm.activePiece.id+'/syns', {syn_json: JSON.stringify(vm.syn_json)} )
  };
  $scope.savePiece = function() {
    $http.put('/pieces/'+vm.activePiece.id, {content: $scope.stripSpan()} ).success(function() {
      alert('Saved!');
    });
  };
  $scope.stripSpan = function() {
    return ($('#show-piece').text().match(/\S+/gi) || []).join(' ')
  };
  $scope.refreshActiveFromSyn = function() {
    vm.activePiece.content = $scope.stripSpan();
    $('#edit-piece').val(vm.activePiece.content);
  };
  $scope.refreshActiveFromEdit = function() {
    vm.activePiece.content = $('#edit-piece').val();
  };
  $scope.deleteActive = function() {
    $http.delete('/pieces/'+vm.activePiece.id).success(function(id) {
      vm.syn_json = {};
      vm.activePiece = {};
      vm.activeWord = '';
      for (var i = 0; i < $scope.pieces.length; i++) {
        if ($scope.pieces[i].id == id) {
          $scope.pieces.splice(i,1);
        };
      };
    });
  };
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
      return $http.get('users/'+user_id+'/pieces');
    },
    create: function(data) {
      return $http.post('/pieces', data);
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

$(document).ready(function() {
  if (window.location.href.match(/session/)) {
    $('#sign-in').trigger('click');
  };

  $(document).on('click', '.fancy span', function(e) {
    $('.fancy span').removeClass('grow');
    $(e.target).addClass('grow');
  });

  //registration form validation
  $(document).on('change', '.modal-body input', function() {
    if ($('#reg-password').val() === $('#conf-password').val() && $('#conf-password').val()) {
      $('.passw').parents('.form-group')
      .addClass('has-success')
      .removeClass('has-error');
      $('.modal-footer').find('.btn-primary').removeAttr('disabled');
    } else {
      $('.passw').parents('.form-group')
      .removeClass('has-success')
      .addClass('has-error');
      $('.modal-footer').find('.btn-primary').attr('disabled', 'disabled');
    };
  });
});
