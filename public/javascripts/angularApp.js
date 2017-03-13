var app = angular.module('flapperNews', ['ui.router']);
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
            url: '/home'
            , templateUrl: '/home.html'
            , controller: 'MainCtrl',
                    resolve: {
            postPromise: ['postservice', function(postservice){
              return postservice.getAll();
            }]
          }
        });
    $stateProvider.state('posts', {
            url: '/posts/{id}'
            , templateUrl: '/posts.html'
            , controller: 'PostsCtrl',
                    resolve: {
                post: ['$stateParams', 'postservice', function($stateParams, postservice) {
                    console.log("adsawd");
                  return postservice.get($stateParams.id);
                }]
              }
        });
     $stateProvider.state('login', {
          url: '/login',
          templateUrl: '/login.html',
          controller: 'AuthCtrl',
          onEnter: ['$state', 'auth', function($state, auth){
            if(auth.isLoggedIn()){
              $state.go('home');
            }
          }]
        });
 $stateProvider.state('register', {
          url: '/register',
          templateUrl: '/register.html',
          controller: 'AuthCtrl',
          onEnter: ['$state', 'auth', function($state, auth){
            if(auth.isLoggedIn()){
              $state.go('home');
            }
          }]
        });
        $urlRouterProvider.otherwise('home');
}]);

app.factory('auth', ['$http', '$window', function($http, $window){
   var auth = {};
    auth.saveToken = function (token){
  $window.localStorage['Jaideep-First-token'] = token;
};

auth.getToken = function (){
  return $window.localStorage['Jaideep-First-token'];
};
auth.isLoggedIn = function(){
  var token = auth.getToken();

  if(token){
    var payload = JSON.parse($window.atob(token.split('.')[1]));

    return payload.exp > Date.now() / 1000;
  } else {
    return false;
  }
};
    auth.currentUser = function(){
  if(auth.isLoggedIn()){
    var token = auth.getToken();
    var payload = JSON.parse($window.atob(token.split('.')[1]));

    return payload.username;
  }
};
    auth.register = function(user){
  return $http.post('/register', user).success(function(data){
    auth.saveToken(data.token);
  });
};
    auth.logIn=function(user){
        return $http.post('/login', user).success(function(data){
    auth.saveToken(data.token);
  });
    };
    auth.logOut = function(){
  $window.localStorage.removeItem('Jaideep-First-token');
};
  return auth;
}])
app.factory('postservice', ['$http', 'auth', function($http,auth) {
    var o = {
        posts: []
    };
     o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
        console.log(data);
    });
  };
    o.create = function(post) {
  return $http.post('/posts',  post,{headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
    o.posts.push(data);
  });
};
    o.upvote = function(post) {
  return $http.put('/posts/' + post._id + '/upvote', null, {headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
      post.upvotes += 1;
    });
};
    o.get = function(id) {
  return $http.get('/posts/' + id).then(function(res){
    return res.data;
  });
};
    o.addComment = function(id, comment) {
  return $http.post('/posts/' + id + '/comments', comment, {headers: {Authorization: 'Bearer '+auth.getToken()}});
};
    o.upvoteComment = function(post, comment) {
  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
  }).success(function(data){
      comment.upvotes += 1;
    });
};
    return o;
}]);
app.controller('MainCtrl', ['$scope', 'postservice','auth', function ($scope, postservice,auth) {
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.posts = postservice.posts;
 $scope.addPost = function(){
  if(!$scope.title || $scope.title === '') { return; }
  postservice.create({
    title: $scope.title,
    link: $scope.link,
  });
  $scope.title = '';
  $scope.link = '';
};
      $scope.incrementUpvotes = function(post) {
  postservice.upvote(post);
};
}]);
app.controller('PostsCtrl', ['$scope', '$stateParams', 'postservice','post','auth', function ($scope, $stateParams, postservice,post,auth) {
    
    $scope.post = post;
    $scope.isLoggedIn = auth.isLoggedIn;
        $scope.addComment = function(){
          if($scope.body === '') { return; }
          postservice.addComment(post._id, {
            body: $scope.body,
            author: 'user',
          }).success(function(comment) {
            $scope.post.comments.push(comment);
          });
          $scope.body = '';
        };
    
    $scope.incrementUpvotes = function(comment){
  postservice.upvoteComment(post, comment);
};
    
}]);

app.controller('AuthCtrl', ['$scope','$state','auth',function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}]);

app.controller('NavCtrl', ['$scope','auth',function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);