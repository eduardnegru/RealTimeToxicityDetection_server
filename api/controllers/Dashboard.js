'use strict';

let HttpStatus = require('http-status-codes');
let fs = require('fs');
let Message = require("../classes/Message");

async function training_data_statistics(req, res)
{
	let objStatistics = {};
	const arrFileNames = [
		"1gram_not_toxic",
		"1gram_toxic",
		"2gram_not_toxic",
		"2gram_toxic",
		"3gram_not_toxic",
		"3gram_toxic",
		"4gram_not_toxic",
		"4gram_toxic",
		"toxicity_count"
	];


	for(let i=0; i < arrFileNames.length; i++) {

		fs.readFile(__dirname + "/../../training_statistics/" + arrFileNames[i] + ".json", "utf8", function (err, data) {
			if (err) throw err;
			objStatistics[arrFileNames[i]] = JSON.parse(data);


			if(i == arrFileNames.length - 1)
			{
				res.status(HttpStatus.OK).json({
					message: objStatistics
				});
			}
		});

	}
}

async function messages_get(req, res)
{
	try
	{
		let messages = new Message.Message();
		let objParams = req.query;
		let arrMessages = await messages.get(objParams["isToxic"]);
		res.status(HttpStatus.CREATED).send(arrMessages);
	}
	catch(error)
	{
		res.status(HttpStatus.INTERNAL_SERVER_ERROR);
		res.json({
			message : error.message
		});
	}
}

async function server_status_get(req, res)
{
	res.status(HttpStatus.OK);
	res.json("It works!");
}


exports.training_data_statistics = training_data_statistics;
exports.messages_get = messages_get;
exports.server_status_get = server_status_get;
