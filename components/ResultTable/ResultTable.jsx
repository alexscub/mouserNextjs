import React from 'react'
import styles from './ResultTable.module.css';
import ReactTooltip from "react-tooltip";


// const calcUahPrice = (uspPrice) => Math.ceil(+/\d*\.?\d*$/.exec(uspPrice)*4300)/100;
const calcUahPrice = (usdPrice) => Math.ceil(+(usdPrice.replace("$", "").replace(",", ""))*4300)/100;
const ResultTable = ({items}) => {
  const addDefaultSrc = ev => {
    // eslint-disable-next-line no-param-reassign
    ev.target.src = '/noimage.png';
  };
  // items.sort(function (a, b) {
  //   let nameA = a.ManufacturerPartNumber,
  //     nameB = b.ManufacturerPartNumber
  //   if (nameA < nameB) //сортируем строки по возрастанию
  //     return -1
  //   if (nameA > nameB)
  //     return 1
  //   return 0 // Никакой сортировки
  // })
    return (
      // <>
      // {items.map(item => ( <p>{item.MouserPartNumber} </p>))}
      // </>
      <table className={styles.transactionsHistory}>
      <thead>
        <tr>
          <th>Image</th>
          <th>PartNumber</th>
          <th>Manufacturer</th>
          <th>Availability</th>
          <th>Min/Mult</th>
          <th>Quantity</th>
          <th>Prices</th>
          <th>Prices UAH</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.MouserPartNumber}>
            <td><img onError={addDefaultSrc} src={item.ImagePath || '/noimage.png'} width="120px"/></td>
            <td><a data-tip={item.Description} href={item.ProductDetailUrl} target="blank">{item.ManufacturerPartNumber}</a>
            <ReactTooltip /></td>
            <td>{item.Manufacturer}</td>
            <td>{item.Availability}</td>
            <td>min{item.Min}/mult{item.Mult}</td>
            <td><ul>{item.PriceBreaks.map(el=><li key={item.MouserPartNumber+el.Quantity}>{el.Quantity}</li>)}</ul></td>
            <td><ul>{item.PriceBreaks.map(el=><li key={item.MouserPartNumber+el.Quantity+"USD"}>{el.Price}</li>)}</ul></td>
            <td><ul>{item.PriceBreaks.map(el=><li key={item.MouserPartNumber+el.Quantity+"UAH"} className={styles.mainPrice}>{calcUahPrice(el.Price)}</li>)}</ul></td>
          </tr>
          
        ))}
      </tbody>
    </table>
    )
}

export default ResultTable;