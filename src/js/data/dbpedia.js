import axios from 'axios';

const LOOKUP_API = 'http://lookup.dbpedia.org/api/search/KeywordSearch'; //?QueryClass = person & QueryString=barack & MaxHits=1';

const DBPEDIA_SPARQL = 'http://dbpedia.org/sparql/?query=';
const DBPEDIA_QUERY = 'PREFIX dbo: <http://dbpedia.org/ontology/>SELECT *	WHERE {{<##URI##> dbo:thumbnail ?image} UNION {<##URI##> dbo:abstract ?description}}&format=json';


/* http://mappings.dbpedia.org/server/ontology/classes/
var ONTOLOGY_ENUM = {
	PERSON = 'person',
	ORGANISATION = 'organisation'
}; */

var getData = (searchQuery, classType) => {
	let endpoint = LOOKUP_API;
	if (classType)
		endpoint += '?QueryClass=' + classType;
	else endpoint += '?';

	endpoint += '&QueryString=' + searchQuery;
	endpoint += '&MaxHits=1';

	return new Promise(function (resolve, reject) {
		/**
		 * first get a valid URI for the searched Item (it can be a person, organization, etc)
		 * Second, with the valid/correct URI, search the sparql Dbpedia api for the image and complete description
		 */
		console.log("dbpedia lookup", endpoint);
		axios({
			method: 'get',
			url: endpoint
		}).then(response => {
			let finalResp = {
				uri : null,
				genericDescription : null,
				ptDescription : null,
				enDescription : null,
				imgURL : null
			};

			if (response.data.hasOwnProperty("results") && response.data.results.length) {

				finalResp.uri = response.data.results[0].uri;
				finalResp.genericDescription = response.data.results[0].description;

				endpoint = DBPEDIA_SPARQL + DBPEDIA_QUERY.replace(/##URI##/g, finalResp.uri);
				console.log("dbpedia sparql", endpoint);
				axios({
					method: 'get',
					url: endpoint
				}).then(sparqlResp => {
					if (sparqlResp.data.hasOwnProperty("results") && sparqlResp.data.results.hasOwnProperty("bindings") && sparqlResp.data.results.bindings.length)
						sparqlResp.data.results.bindings.forEach(binding => {
							if (binding.hasOwnProperty("image"))
								finalResp.imgURL = binding.image.value;

							// get the main en and pt descriptions
							if (binding.hasOwnProperty("description"))
								if (binding.description["xml:lang"] === 'pt')
									finalResp.ptDescription = binding.description.value;
								else if (binding.description["xml:lang"] === 'en')
									finalResp.enDescription = binding.description.value;

						});

					resolve(finalResp);
				}).catch(error => {
					console.error(error);
					reject(error);
				});
			} else // when data is not found
				resolve({});
		}).catch(error => {
			console.error("LOOKUP_API", error);
			reject(error);
		});
	});
}


export default {
	getData: getData
};