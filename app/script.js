angular.module('myApp', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'home.html',
            controller: 'HomeCtrl',

        }).when('/countries', {
            templateUrl: 'countries.html',
            controller: 'CountriesCtrl',

        }).when('/countries/:countryCode', {
            templateUrl: 'countrycode.html',
            controller: 'CountryCodeCtrl',

        })
    }])

.controller('HomeCtrl', [function() {

}])

.controller('CountriesCtrl', ['$scope', '$location', 'countries', function($scope, $location, countries) {
    countries()
        .then(function(countriesXhr) {
            $scope.countries = countriesXhr.geonames;
            
        });

    $scope.countryDetail = function(countryCode) {
        $location.path('/countries/' + countryCode);
    }
}])

.controller('CountryCodeCtrl', ['$http', '$routeParams', 'NEIGHBOURS_URL', 'NEIGHBOURS_JSON', '$scope', 'countries',
    function($http, $routeParams, NEIGHBOURS_URL, NEIGHBOURS_JSON, $scope, countries) {
        // want info now!! Don't use $q
        var countryCode = $routeParams.countryCode;
        /// Call 1
        $http.get(NEIGHBOURS_URL + NEIGHBOURS_JSON + '&country=' + countryCode, { cache: true })
        .then(function(response) {
            $scope.neighbour = response.data.geonames;
            $scope.count = $scope.neighbour.length;
           
        });

        // /// call 2

        countries()
        .then(function(countriesXhr) {
        	
        	var geonames = countriesXhr.geonames;
        	for (var i = 0; i < geonames.length; i++) {
        		console.log(geonames[i]);

        		if (geonames[i].countryCode == countryCode) {

        			$scope.country = geonames[i];
        			break
        		}
        	}
        })
    }
])

.constant('API_URL', 'http://api.geonames.org/countryInfo?')
    .constant('COUNTRIES_JSON_FILE', 'username=verben&type=json')
    .constant('NEIGHBOURS_URL', 'http://api.geonames.org/neighbours?')
    .constant('NEIGHBOURS_JSON', 'username=verben&type=json')

.factory('apiRequest', ['$http', '$q', 'API_URL', function($http, $q, API_URL) {
        return function(params) {
            var reqParams = angular.extend({}, params, { API_URL });
            return $http.get(API_URL, { params: reqParams })
                .then(function(response) {
                    return $q.when(response.data);
                });
        };

    }])
    .factory('countries', ['$http', '$q', 'COUNTRIES_JSON_FILE', 'API_URL', function($http, $q, COUNTRIES_JSON_FILE, API_URL) {
        return function() {
            return $http.get(API_URL + COUNTRIES_JSON_FILE, { cache: true })
                .then(function(response) {
                    return $q.when(response.data);
                })
        }
    }])
    // GOOD attempt
    // .factory('neighbours', ['$http', '$q', 'NEIGHBOURS_URL', 'NEIGHBOURS_JSON', function($http, $q, NEIGHBOURS_URL, NEIGHBOURS_JSON) {
    //     return function() {
    //         return $http.get(NEIGHBOURS_URL + NEIGHBOURS_JSON, { cache: true })
    //             .then(function(response) {
    //                 return $q.when(response.data);
    //             });
    //     }
    // }])
