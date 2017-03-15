var scotchTodo = angular.module('dukpt', []);

function mainController($scope, $http) {
// 	$scope.formData = {};
	
// 	$scope.todos = [];

    $scope.cardData = {};
    
    $scope.fullCardResponse = {};


	$scope.submit = function() {
		console.log($scope.cardData);
		$http.post('/v1/carddata', $scope.cardData)
			.success(function(data) {
				// $scope.formData = {}; // clear the form so our user is ready to enter another
				console.log(data);
				$scope.cardData = data;
				$scope.fullCardResponse = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	}

}