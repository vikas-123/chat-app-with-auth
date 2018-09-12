if(process.env.NODE_ENV === 'production')
{
	module.exports= {mongoURI:
		'mongodb://vikas:ucmmr65u@ds221242.mlab.com:21242/vidjotproduct'

	}
}

else{

module.exports = {mongoURI:
'mongodb://localhost/asergis-db'}

}