import axios from 'axios';

const API = 'https://cognitive-clipping-orchestrator.mybluemix.net';
/* http://mappings.dbpedia.org/server/ontology/classes/ */

export default (searchTerm, classType) => {
    let endpoint = `${API}/dbpedia/${searchTerm}`;

    if (classType)
        endpoint += `/${classType}`;

    return new Promise(function (resolve, reject) {
        axios.get(endpoint)
        .then(response => resolve(response.data))
        .catch(error => {
            console.error("LOOKUP_API", error);
            reject(error);
        });
    });
}