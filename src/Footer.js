import React, { useEffect, useState } from "react";

function Footer ({ type, range, setPage, page, slice, footerClass, rowsPerPage, setRows, dataSize}) {

  function nextPage() {
    var currentPage = page;
    //Within range
    if(page < range.length) {
      setPage(currentPage += 1);
    }
  }

  function backPage() {
    var currentPage = page;
    //Within range
    if(page > 1) {
      setPage(currentPage -= 1);
    }
  }

    return (
      <div className={"table-container_table--break-md tableFooter " + footerClass}>
          {/**To be changed, just creating logic */}
          <div className="row">
            <div className="col-4 page-number">
              <span> PAGE {page} of {range.length}</span>
            </div>
            <div className="col-8 d-flex justify-content-end">
              <button className="navigation-btn-back margin-right-2" onClick={() => backPage()}>
                <div className="back-icon"/>BACK
              </button>
              <button className="navigation-btn-next" onClick={() => nextPage()}>
                 <div className="next-icon"/>NEXT
              </button>
            </div>
  
          </div>
      </div>
    );

};

export default Footer;