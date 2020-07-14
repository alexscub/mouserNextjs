// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/json';
export default (req, res) => {
  res.statusCode = 200;
  const {
    query: { reqComp },
  } = req
  axios
    .post(
      `https://api.mouser.com/api/v1/search/keyword?apiKey=75e8de15-dc41-4463-9677-597a017b1eb0`,
      {
        "SearchByKeywordRequest": {
          "keyword":  reqComp,
          "searchOptions": 'InStock'
        }
      }
    )
    .then(data => {
      res.json(data.data.SearchResults.Parts)})
    .catch(err=>console.log(err));
}
