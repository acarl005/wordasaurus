angular.module('wordasaurus', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'partials/home/index.html',
  })

  .when('/my_pieces', {
    templateUrl: 'partials/users/index.html',
  })

  .otherwise({redirectTo: '/'});
}]);

angular.module('wordasaurus')
.controller('HomeController', ['$scope', '$http', 'User' , 'Piece', function ($scope, $http, User, Piece) {
  User.current().success(function(res) {
    $scope.user = res;
    Piece.all($scope.user.id).success(function(res) {$scope.pieces = res});
  });
  $scope.createPiece = function(title, content) {
    debugger;
    Piece.create({
      title: title,
      content: content,
    }).success(function(payload) {
      $scope.pieces.push(payload);
      $scope.tab = 'button';
      $('#new-title').val('');
      $('#new-piece').val('');
    });
  };
  $scope.setActivePiece = function(piece) {
    $scope.activePiece = piece;
    $scope.syn_json = JSON.parse(piece.syn_json);
  };
  $scope.getSyns = function(word) {
    if (!$scope.syn_json[word]) {
      console.log('getting');
      $http.get('/synonyms/'+word).success(function(res) {
        $scope.syn_json[word] = res
        $scope.saveSyns();
      });
    }
  };
  $scope.setActiveWord = function(index, word) {
    $scope.activeWord = word.toLowerCase().match(/[a-z]+/g)[0];
    $scope.activeIndex = index;
    $scope.getSyns($scope.activeWord);
  };
  $scope.embedWord = function(word) {
    // var target = $('#show-piece span:nth-child(' + ($scope.activeIndex+1) + ')')
    // target.text(target.text().replace(/[a-z\s]+/i, word));
    var pieces = $scope.activePiece.content.split(' ');
    pieces[$scope.activeIndex] = pieces[$scope.activeIndex].replace(/[a-z]+/i, word);
    $scope.activePiece.content = pieces.join(' ');
  };
  $scope.saveSyns = function() {
    $http.post('/pieces/'+$scope.activePiece.id+'/syns', {syn_json: JSON.stringify($scope.syn_json)} )
  };
  $scope.savePiece = function() {
    $http.put('/pieces/'+$scope.activePiece.id, {content: $scope.stripSpan()} ).success(function() {
      alert('Saved!');
    });
  };
  $scope.stripSpan = function() {
    return ($('#show-piece').text().match(/\S+/gi) || []).join(' ')
  };
  $scope.refreshActiveFromSyn = function() {
    $scope.activePiece.content = $scope.stripSpan();
    $('#edit-piece').val($scope.activePiece.content);
  };
  $scope.refreshActiveFromEdit = function() {
    $scope.activePiece.content = $('#edit-piece').val();
  };
  $scope.deleteActive = function() {
    $http.delete('/pieces/'+$scope.activePiece.id).success(function(id) {
      $scope.syn_json = {};
      $scope.activePiece = {};
      $scope.activeWord = '';
      for (var i = 0; i < $scope.pieces.length; i++) {
        if ($scope.pieces[i].id == id) {
          $scope.pieces.splice(i,1);
        };
      };
    });
  };
  $scope.syn_json = {};
  $scope.activePiece = {};
  $scope.activeWord = '';
}])

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
      return $http.get('users/'+id);
    }
  };
}])

$(document).ready(function() {
  if (window.location.href.match(/session/)) {
    $('#sign-in').trigger('click');
  };
  if (window.location.href.match(/users/)) {
    document.getElementById('reg-but').click();
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
