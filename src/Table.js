import React, { useState } from "react";
import useTable from "./Pagination"; 
import Footer from "./Footer";


function Table({type, tableData, counter, headingColumns, rowsPerPage, breakOn = 'medium', givenClass, setRows, newPending}) {

   //PAGINATION 
    const [page, setPage] = useState(1);
    const {slice, range} = useTable(type === 'pending' ? tableData.filter((info) => info.status !== 'ongoing') : tableData, page, rowsPerPage);

    let tableClass = 'table-container__table';

    if(breakOn === 'small') {
        tableClass += ' table-container__table--break-sm';
    } else if(breakOn === 'medium') {
        tableClass += ' table-container_table--break-md';
    } else if(breakOn === 'large') {
        tableClass += ' table-container_table--break-lg';
    }

  const data = slice.map((row, index) => {
        
        let rowData = [];
        let i = 0;
        
        for(const key in row) {
            rowData.push({
                key: headingColumns[i],
                val: row[key]
            });
            i++;
        }

        if(type === 'ongoing') {
          
          return <tr key={row.id}>
            {rowData.map((data, index) => 
            <td key={index} data-heading={data.key} className={data.val + "table-cell"}>{index != 4 ? data.val : counter[index].duration }</td>)}
            </tr>      
        } else {

          if(row.status === 'ongoing') {
            return
          }

          return <tr key={row.id}>
            {rowData.map((data, index) => 
            <td key={index} data-heading={data.key} className={data.val + "table-cell"}>{data.val === -1 ? "0" : data.val}</td>)}
            </tr>
        }
    });

  if(type === "Evaluation") {
    return (
      <main>
      <div className="resource-card table-container full-width">
        <div className="table-header-cont">
        </div>
        <table className={tableClass}>
          <thead>
            <tr>
              {headingColumns.map((col,index) => (
                <th key={index} className="table-columns">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data}
          </tbody>
        </table>
      </div>
    </main>
    )
  }
  else {
    return (
      <main>
        <div className="resource-card table-container">
          <div className="table-header-cont">
            {/* {type === 'pending' && ( <span className="pending-dot"></span>)}
              {type === 'ongoing' && ( <span className="ongoing-dot"></span>)}
  
            <h1 className="table-header">{type}</h1> */}
          </div>
          <table className={tableClass}>
            <thead>
              <tr>
                {headingColumns.map((col,index) => (
                  <th key={index} className="table-columns">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data}
            </tbody>
          </table>
          <Footer range={range} slice={slice} setPage={setPage} page={page} footerClass={givenClass} />
        </div>
      </main>
    );
  }
}

export default Table;