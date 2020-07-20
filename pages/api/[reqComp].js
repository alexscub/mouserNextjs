// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

const MouserKey = process.env.MouserKey;
const TMEPublicKey = process.env.TMEPublicKey;
const TMESecret = process.env.TMESecret;

const  {
  TmeApiClient
} = require ('tme-api-client');

const getTMEItems = (reqComp) => {
  const client = new TmeApiClient(TMEPublicKey, TMESecret);
  return client.request('Products/Search', {
      "SearchPlain": reqComp,
      "SearchWithStock": true,
      "Language": "EN",
      "Country": "UA",
    })
    .then(data => {
      // res.json(data.data.Data.ProductList)
      return data.data.Data.ProductList;})
      //Взять отсюда еще можно Producer, Photo, ProductInformationPage, Description, MinAmount, 
      //Multiples,
      .then(ProductList=> {
        const symbols = ProductList.map(el=>el.Symbol) 
      // res.json(ProductList)
      return client.request('Products/GetPricesAndStocks', {"SymbolList": symbols,
      "Country": "UA",
      "Currency":'USD',
      "Language": "EN",
    })      
    .then(data=> {
      const priceStockList = data.data.Data.ProductList
      const resultedArr = ProductList.map(el=>{
        const elPriceList = priceStockList.find(stock=>el.Symbol===stock.Symbol);
        return {...el, ...elPriceList}
        })
        const result = resultedArr.map(el=>{
          const newEl = {}
          newEl.MouserPartNumber=el.Symbol;
          newEl.ImagePath=el.Photo;
          newEl.ProductDetailUrl=el.ProductInformationPage;
          newEl.ManufacturerPartNumber=el.OriginalSymbol;
          newEl.Manufacturer=el.Producer;
          newEl.Description=el.Description;
          newEl.Availability=el.Amount;
          newEl.PriceBreaks=el.PriceList.map(el=>{
            const priceBreak = {}
            priceBreak.Quantity = el.Amount;
            priceBreak.Price = String(el.PriceValue);
            return priceBreak;
          })
          return newEl
        })
      return result})
      .catch(err => err);
    })
    .catch(err => err);
}

const getMouserItems = (reqComp) => {
return axios
.post(
  `https://api.mouser.com/api/v1/search/keyword?apiKey=${MouserKey}`,
  {
    "SearchByKeywordRequest": {
      "keyword":  reqComp,
      "searchOptions": 'InStock'
    }
  }
)
.then(data => {
  return data.data.SearchResults.Parts})
.catch(err=> err);
}

axios.defaults.headers.post['Content-Type'] = 'application/json';
export default (req, res) => {
  res.statusCode = 200;
  const {
    query: {
      reqComp
    },
  } = req
  // reqComp && axios
  //   .post(
  //     `https://api.mouser.com/api/v1/search/keyword?apiKey=75e8de15-dc41-4463-9677-597a017b1eb0`,
  //     {
  //       "SearchByKeywordRequest": {
  //         "keyword":  reqComp,
  //         "searchOptions": 'InStock'
  //       }
  //     }
  //   )
  //   .then(data => {
  //     res.json(data.data.SearchResults.Parts)})
  //   .catch(err=>console.log(err));
  // getMouserItems(reqComp).then(data=>res.json(data)).catch(err=>res.json(err))
  // getTMEItems(reqComp).then(data=>res.json(data)).catch(err=>res.json(err))
  reqComp && getMouserItems(reqComp).then(mouserProducts=>{
    getTMEItems(reqComp)
    .then(TMEProducts => [...mouserProducts, ...TMEProducts])
    .then(AllProducts=> AllProducts.sort(function(a, b){
      let nameA=a.ManufacturerPartNumber, nameB=b.ManufacturerPartNumber
      if (nameA < nameB) //сортируем строки по возрастанию
        return -1
      if (nameA > nameB)
        return 1
      return 0 // Никакой сортировки
      }))
      .then(data=>res.json(data))
  }).catch(err=>res.json(err))

  // https://api.tme.eu/[prefix]/[action_name].[response_format]
  // const TMEPublicKey = 'b8008cca0cece8636c05ad865043e92b6fed7991da5f7'
  // const TMESecret = '6aadcca695acd0d2702a';

  // const client = new TmeApiClient(TMEPublicKey, TMESecret);

  // client.request('Products/Search', {
  //     "SearchPlain": reqComp,
  //     "SearchWithStock": true,
  //     "Language": "EN",
  //     "Country": "UA",
  //   })
  //   .then(data => {
  //     // res.json(data.data.Data.ProductList)
  //     const {ProductList} = data.data.Data;
  //     //Взять отсюда еще можно Producer, Photo, ProductInformationPage, Description, MinAmount, 
  //     //Multiples,
  //     const symbols = ProductList.map(el=>el.Symbol) 
  //     // res.json(ProductList)
  //     client.request('Products/GetPricesAndStocks', {"SymbolList": symbols,
  //     "Country": "UA",
  //     "Currency":'USD',
  //     "Language": "EN",
  //   })
  //   .then(data=> {
  //     const priceStockList = data.data.Data.ProductList
  //     const resultedArr = ProductList.map(el=>{
  //       const elPriceList = priceStockList.find(stock=>el.Symbol===stock.Symbol);
  //       return {...el, ...elPriceList}
  //       })
  //       const result = resultedArr.map(el=>{
  //         const newEl = {}
  //         newEl.MouserPartNumber=el.Symbol;
  //         newEl.ImagePath=el.Photo;
  //         newEl.ProductDetailUrl=el.ProductInformationPage;
  //         newEl.ManufacturerPartNumber=el.OriginalSymbol;
  //         newEl.Manufacturer=el.Producer;
  //         newEl.Description=el.Description;
  //         newEl.Availability=el.Amount;
  //         newEl.PriceBreaks=el.PriceList.map(el=>{
  //           const priceBreak = {}
  //           priceBreak.Quantity = el.Amount;
  //           priceBreak.Price = String(el.PriceValue);
  //           return priceBreak;
  //         })
  //         return newEl
  //       })
  //     res.json(result)})
  //     .catch(err => res.json(err));
  //   })
  //   .catch(err => res.json(err));
}