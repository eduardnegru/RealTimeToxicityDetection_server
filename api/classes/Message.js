let mongoose = require('mongoose');

class Message
{
	constructor()
	{
		this.Messagemodel = mongoose.model('Message');
	}

	/**
	 * @param {integer} messageIsToxic = {0, 1}
	 * @throws Exception
	 */
	async get(messageIsToxic)
	{
		let strCondition = parseInt(messageIsToxic) === 1 ? "$gt" : "$lt";

		try
		{
			let arrMessages = await this.Messagemodel.find({
				"message_is_toxic": {
					[strCondition]: 0.5
				}
			})
			.sort({
				message_created_timestamp : -1
			});

			return arrMessages;
		}
		catch(error)
		{
			throw new Error(error.message);
		}
	}
}

exports.Message = Message;
