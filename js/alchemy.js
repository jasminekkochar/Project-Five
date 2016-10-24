var dictionApp = {};

dictionApp.getAnalysis = function(){
	var alchemyURL= 'http://access.alchemyapi.com/calls/text/TextGetCombinedData';
	//'https://gateway-a.watsonplatform.net/calls/text/TextCombinedData';
	$('form').on('submit', function(e){
		e.preventDefault();
		var searchQuery = $('#saySomething').val();
		$.ajax({
			url: alchemyURL,
			method: 'GET',
			dataType: 'json',
			data: {
				text: searchQuery,
				apikey: "d522d110e3961fb8fcb4ab72419b090bc3012bae",
				outputMode:'json',
				extract: 'doc-emotion, doc-sentiment',
			},
			success: function(res){
				console.log(res);
				dictionApp.displayAnalysis(res)
			}
		});
	});
};

//when data comes back display it on page
dictionApp.displayAnalysis = function(res){
	var sentiment = res.docSentiment.type;
	if (sentiment == "positive") {
		$("main").toggleClass("positive");
		var ohSugar = $('<h2>').text("Sounds sunny!");
		$('.commentary').append(ohSugar);
	} else if (sentiment == "negative"){
		$("main").toggleClass("negative");
		var ohSugar = $('<h2>').text("Sounds serious! Is everything okay?");
		$('.commentary').append(ohSugar);
	} else if (sentiment == "neutral"){
		$("main").toggleClass("neutral");
		var ohSugar = $('<h2>').text("Those are words!");
		$('.commentary').append(ohSugar);
	}

	var anger = +(res.docEmotions.anger);
	var fear = +(res.docEmotions.fear);
	var disgust = +(res.docEmotions.disgust);
	var joy = +(res.docEmotions.joy);
	var sadness = +(res.docEmotions.sadness);

	var pieData = {
		labels: [
		"Anger",
		"Fear",
		"Disgust",
		"Joy",
		"Sadness"
		],
		datasets: [
		{
			data: [anger,fear,disgust,joy,sadness],
			backgroundColor: [
			"#DB3340",
			"#5C2D50",
			"#00A03E",
			"#E8B71A",
			"#28ABE3"
			]
		},
	]
};

var ctx= $('#sentimentMap');
var pieChart = new Chart (ctx, {
	type: 'doughnut',
	data: pieData,
});

document.getElementsByTagName('textarea')[0].onmouseup = function() {
  if (typeof window.getSelection === 'function') {
		var selObj = window.getSelection(); 
		var selectedText = selObj.toString();
		console.log(selectedText);
  }
  else if (document.selection) {   
    alert(document.selection.createRange().htmlText)  //IE6 7 8
  }
 	var urbURL= 'http://api.urbandictionary.com/v0/define?';
  		$.ajax({
  			url: urbURL,
  			method: 'GET',
  			dataType: 'json',
  			data: 'term=' + selectedText,
  		}).then(function(defObject){
  			dictionApp.displayDef(defObject.list);
  			// console.log(defObject);
  		});
  //when data comes back display it on page
  dictionApp.displayDef = function(something){
  	var topThree = something.slice(1,4);
  	topThree.forEach(function(definition, i){
  		var urbanDef = $('<p>').text(definition.definition);
  		$('#urbanDictionary').append(urbanDef);

  	});
  };

};


};



//Displays definition for word

dictionApp.init= function(){
	dictionApp.getAnalysis();
};


// DOCUMENT READY ---------------------------------------
$(function() {
	dictionApp.init();
});



// profanity check api:
// http://www.wdylike.appspot.com/?q=
