const request = require('request')
const Gpio = require('onoff').Gpio

slack_status = function (num) {
	var result = {
		"status_text": "riding a train",
		"status_emoji": ":mountain_railway:"
	}
	
	switch (num) {
		// At home
		case 0:
			result.status_text = "At home"
			result.status_emoji = ":house:"
			break
		
		// In lab
		case 1:
			result.status_text = "In lab"
			result.status_emoji = ":memo:"
			break

		// In campus
		case 2:
			result.status_text = "In campus"
			result.status_emoji = ":office:"

			break
		// Going out
		case 3:
			result.status_text = "Going out"
			result.status_emoji = ":runner:"

			break
		default:
				
	}
	
	return result
}

set_status = function (num, user_id, callback) {
	token = process.env.SLACK_API_TOKEN
	url = "https://slack.com/api/users.profile.set?token=" + token + "&user=" + user_id + "&profile=" + JSON.stringify(slack_status(num))

	var options = {
		uri: url
	}

	request.post(options, function(err, res){
		//console.log(res.body)
		callback(res.body)
	});
}


const user_id = process.env.SLACK_USER_ID

var btn_0 = new Gpio(7, 'in', 'both')
var flag_0 = 0
btn_0.watch (function(err, value) {
	if (value == 1 && flag_0 == 0) {
		flag_0 = 1
		console.log('Push btn 0')
		set_status(0, user_id, function(res) {
			//console.log(res)	
		});
	} else if (value == 0) {
		flag_0 = 0
	}
});

var btn_1 = new Gpio(17, 'in', 'both')
var flag_1 = 0
btn_1.watch (function(err, value) {
	if (value == 1 && flag_1 == 0) {
		flag_1 = 1
		console.log('Push btn 1')
		set_status(1, user_id, function(res) {
			//console.log(res)	
		});
	} else if (value == 0) {
		flag_1 = 0
	}
});

var btn_2 = new Gpio(27, 'in', 'both')
var flag_2 = 0
btn_2.watch (function(err, value) {
	if (value == 1 && flag_2 == 0) {
		flag_2 = 1
		console.log('Push btn 2')
		set_status(2, user_id, function(res) {
			//console.log(res)	
		});
	} else if (value == 0) {
		flag_2 = 0
	}
});

var btn_3 = new Gpio(22, 'in', 'both')
var flag_3 = 0
btn_3.watch (function(err, value) {
	if (value == 1 && flag_3 == 0) {
		flag_3 = 1
		set_status(3, user_id, function(res) {
			//console.log(res)	
		});
	} else if (value == 0) {
		flag_3 = 0
	}
});

process.on('SIGINT', function () {
	btn_0.unexport();
	btn_1.unexport();
	btn_2.unexport();
	btn_3.unexport();
});
