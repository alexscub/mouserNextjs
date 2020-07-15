import React from 'react'
import styles from './ResultTable.module.css';

// const calcUahPrice = (uspPrice) => Math.ceil(+/\d*\.?\d*$/.exec(uspPrice)*4300)/100;
const calcUahPrice = (uspPrice) => Math.ceil(+(uspPrice.replace("$", "").replace(",", ""))*4300)/100;
const ResultTable = ({items}) => {
  const addDefaultSrc = ev => {
    // eslint-disable-next-line no-param-reassign
    ev.target.src = '/noimage.png';
  };
    return (
      <table className={styles.transactionsHistory}>
      <thead>
        <tr>
          <th>Image</th>
          <th>PartNumber</th>
          <th>Manufacturer</th>
          <th>Description</th>
          <th>Availability</th>
          <th>Quantity</th>
          <th>Prices</th>
          <th>Prices UAH</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.MouserPartNumber}>
            <td><img onError={addDefaultSrc} src={item.ImagePath || '/noimage.png'} width="120px"/></td>
            <td><a href={item.ProductDetailUrl} target="blank">{item.ManufacturerPartNumber}</a></td>
            <td>{item.Manufacturer}</td>
            <td>{item.Description}</td>
            <td>{item.Availability}</td>
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