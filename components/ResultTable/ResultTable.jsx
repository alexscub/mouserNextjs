import React from 'react'
import styles from './ResultTable.module.css';

const ResultTable = ({items}) => {
    return (
        <div>
             <table className={styles.transactionsHistory}>
      <thead>
        <tr>
          <th>Image</th>
          <th>PartNumber</th>
          <th>Manufacturer</th>
          <th>Description</th>
          <th>Availability</th>
          <th>Prices</th>
          <th>Prices UAH</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.MouserPartNumber}>
            <td><img src={item.ImagePath}/></td>
            <td><a href={item.ProductDetailUrl} target="blank">{item.ManufacturerPartNumber}</a></td>
            <td>{item.Manufacturer}</td>
            <td>{item.Description}</td>
            <td>{item.Availability}</td>
            <td><ul>{item.PriceBreaks.map(el=><li key={item.MouserPartNumber+el.Quantity}>{el.Quantity}/{el.Price}</li>)}</ul></td>
            <td><ul>{item.PriceBreaks.map(el=><li key={item.MouserPartNumber+el.Quantity+1}>{el.Quantity}/{Math.ceil(+/\d*\.?\d*$/.exec(el.Price)*4300)/100}</li>)}</ul></td>
          </tr>
        ))}
      </tbody>
    </table>
        </div>
    )
}

export default ResultTable;