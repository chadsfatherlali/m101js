var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');

var db = MongoClient.connect('mongodb://localhost:27017/school', function(err, db) {
	if(err) throw err;
	
	var collection = db.collection('students');
	var query = {};
	
	collection.find(query).toArray(function(err, doc) {
		_.each(doc, function(doc) {
			var scores = doc.scores;
			
			doc.scores = deleteLowHomeworkScore(scores);
			
			collection.update({_id: doc._id}, doc, {}, function(err, result) {
				if(err) throw err;

				console.log(result);
			});
		});

		db.close();
	});
});

function deleteLowHomeworkScore(scores) {
	var newScores = [];
	var scoresBytype = _.groupBy(scores, 'type');
	var sortByHighScore = _.sortBy(scoresBytype.homework, 'score');
	
	sortByHighScore.splice(0, 1);

	_.each(scoresBytype.exam, function(exam) {
		newScores.push(exam);
	});

	_.each(scoresBytype.quiz, function(quiz) {
		newScores.push(quiz);
	});

	_.each(sortByHighScore, function(homework) {
		newScores.push(homework);
	});

	return newScores;
};


