// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

const MouserKey = process.env.MOUSER_KEY;

// получаем данные свнешнего апи

const getMouserItems = (reqComp, startingRecord) => {
  return axios
    .post(
      `https://api.mouser.com/api/v1/search/keyword?apiKey=${MouserKey}`, {
        "SearchByKeywordRequest": {
          "keyword": reqComp,
          "searchOptions": 'InStock',
          "startingRecord": startingRecord,
        }
      }
    )
    .then(data => data.data)
    .catch(err => err);
}


axios.defaults.headers.post['Content-Type'] = 'application/json';

export default (req, res) => {
  res.statusCode = 200;
  const {
    query: {
      slug
    },
  } = req
  const reqComp = slug[1];
  const startingRecord =slug[0];

  const decodedReqComp = decodeURIComponent(reqComp);

  !!decodedReqComp && getMouserItems(decodedReqComp,startingRecord)
  .then(mouserResults => { console.log(mouserResults)
    // mouserResults.SearchResults.next = `/api/${startingRecord+50}/${reqComp}`;
    return res.json(mouserResults.SearchResults)})
  .catch(err => res.json(err))
}