var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');

MongoClient.connect('mongodb://localhost:27017/weather', function(err, db) {
	if(err) throw err;
	
	var collection = db.collection('data');
	var options = {sort:[ ['State', 1], ['Time', 1], ['Day', -1], ['Temperature', -1] ]};
	var q = require('q');	

	collection.find({}, {}, options).toArray(function(err, doc) {
		if(err) throw err;

		var promise = [];
		var States = _.groupBy(doc, 'State');
	
		 _.each(States, function(State, index) {
			StateHighTemperature = _.max(State, function(state) {
				return state.Temperature;
			});

			StateHighTemperature.month_high = true;
			
			var operation = collection.update({_id: StateHighTemperature._id}, {'$set': {month_high: true}}, function(err, update) {
				if(err) throw err;
				
				console.log('cursor: ' + index + ' success: ' + update);
			});
		});
	});
});
