'use strict';

let HttpStatus = require('http-status-codes');
let fs = require('fs');
let redis = require('../../server');
let mysql = require('promise-mysql');

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

async function messages_get(socket, strTimestamp=null, nLastID, bIsToxic)
{
    let connection = await mysql.createConnection({
        host     : '127.0.0.1',
        user     : 'root',
        password : 'adrian',
        database : 'text_analytics'
    });

    if(strTimestamp)
    {
         let result = await connection.query("\
				SELECT \
					* \
				FROM `message` \
                WHERE \
                    `message_is_toxic` = " + bIsToxic + "\
                    AND\
                    `message_created_timestamp` >= " + "\"" + 0 + "\""
        );

        return result;
    }
    else 
    {
         let result = await connection.query("\
				SELECT \
					* \
				FROM `message` \
                WHERE \
                    `message_is_toxic` = " + bIsToxic + "\
                    AND\
					`message_id` > " + "\"" + nLastID + "\""
        );

        return result;
    }
    
    
}

exports.training_data_statistics = training_data_statistics;
exports.messages_get = messages_get;
