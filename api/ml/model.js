const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

(async () => {
	try
	{
		const model = await tf.loadLayersModel('file://../../../Ml/ml/tensorjs/model.json');
		model.summary();
	}
	catch(error)
	{
		console.error(error);
	}
})();