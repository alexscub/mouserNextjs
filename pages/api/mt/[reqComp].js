// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import { TmeApiClient } from 'tme-api-client';

const MouserKey = process.env.MOUSER_KEY;
const TMEPublicKey = process.env.TME_KEY;
const TMESecret = process.env.TME_SECRET;

// функция конструктор для создания обьекта с нужными ключами

function FormatedPartNumber(MouserPartNumber,ImagePath,ProductDetailUrl,
  ManufacturerPartNumber,Manufacturer,Description,Availability,PriceBreaks, Min, Mult) {
            this.MouserPartNumber = MouserPartNumber;
            this.ImagePath = ImagePath;
            this.ProductDetailUrl = ProductDetailUrl;
            this.ManufacturerPartNumber = ManufacturerPartNumber || MouserPartNumber;
            this.Manufacturer = Manufacturer;
            this.Description = Description;
            this.Availability = Availability;
            this.PriceBreaks = PriceBreaks;
            this.Min = Min;
            this.Mult = Mult;
  }

// получаем данные с первого апи
const getTMEItems = (reqComp) => {
  const client = new TmeApiClient(TMEPublicKey, TMESecret);
  return client.request('Products/Search', {
      "SearchPlain": reqComp,
      "SearchWithStock": true,
      "Language": "EN",
      "Country": "UA",
    })
    .then(data => {
      // получили список продуктов, но без цен и стока такое апи, ничего не поделать
      return data.data.Data.ProductList;
    })
    //Взять отсюда еще можно Producer, Photo, ProductInformationPage, Description, MinAmount, 
    //Multiples, делаем запрос за ценами
    .then(ProductList => {
      // если массив пустой возвращаем его (такие продукты не найдены)
      if( ProductList.length===0) {return []} else {
      const symbols = ProductList.map(el => el.Symbol)
      return client.request('Products/GetPricesAndStocks', {
          "SymbolList": symbols,
          "Country": "UA",
          "Currency": 'USD',
          "Language": "EN",
        })
        .then(data => {
          //получаем цены
          const priceStockList = data.data.Data.ProductList
          //добавляем в продукты прайс
          const resultedArr = ProductList.map(el => {
            const elPriceList = priceStockList.find(stock => el.Symbol === stock.Symbol);
            return {
              ...el,
              ...elPriceList
            }
          })
          // преобразуем ключи обьекта
          const result = resultedArr.map(el => {
            //преобразуем матрицу цен
            const PriceBreaks = el.PriceList.map(el => {
              const priceBreak = {}
              priceBreak.Quantity = el.Amount;
              priceBreak.Price = String(el.PriceValue);
              return priceBreak;
            })
            return new FormatedPartNumber(el.Symbol, el.Photo, el.ProductInformationPage, el.OriginalSymbol,
              el.Producer, el.Description, el.Amount, PriceBreaks,el.MinAmount, el.Multiples )
          })
          return result
        })
        .catch(err => err);}
    })
    .catch(err => err);
}

// получаем данные со второго апи, здесь проще

const getMouserItems = (reqComp) => {
  return axios
    .post(
      `https://api.mouser.com/api/v1/search/keyword?apiKey=${MouserKey}`, {
        "SearchByKeywordRequest": {
          "keyword": reqComp,
          "searchOptions": 'InStock'
        }
      }
    )
    .then(data => {
      return data.data.SearchResults.Parts
    })
    .catch(err => err);
}

axios.defaults.headers.post['Content-Type'] = 'application/json';
export default (req, res) => {
  res.statusCode = 200;
  const {
    query: {
      reqComp
    },
  } = req

  const decodedReqComp = decodeURIComponent(reqComp);

  decodedReqComp && getMouserItems(decodedReqComp).then(mouserProducts => {
    getTMEItems(decodedReqComp)
      .then(TMEProducts => [...mouserProducts, ...TMEProducts])
      //сортировку перенес на клиент
      // .then(AllProducts => AllProducts.sort(function (a, b) {
      //   let nameA = a.ManufacturerPartNumber,
      //     nameB = b.ManufacturerPartNumber
      //   if (nameA < nameB) //сортируем строки по возрастанию
      //     return -1
      //   if (nameA > nameB)
      //     return 1
      //   return 0 // Никакой сортировки
      // }))
      .then(data => res.json(data))
  }).catch(err => res.json(err))
}