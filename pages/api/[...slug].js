// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

const MouserKey = process.env.MOUSER_KEY;

// получаем данные с внешнего апи

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

//Для пагинации получаем начальную страницу и запрос
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
  .then(mouserResults => {
    return res.json(mouserResults)})
  .catch(err => res.json(err))
}