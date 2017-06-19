describe('apiRequest can be anything!', function() {

	beforeEach(module('apiRequest'));

	it('should query API', 
		inject(function(apiRequest, $rootScope, $httpBackend) {
			console.log("API Request", apiRequest);
			$httpBackend.expect('GET', 'http://api.geonames.org/countryInfo?').respond(200);
			var status = false;
			apiRequest("AD").then(function() {
			var	status = true;
			});
			$rootScope.$digest();
			$httpBackend.flush();
			expect(status).toBe(true);
			$httpBackend.verifyNoOutstandingRequest();
		}));
});