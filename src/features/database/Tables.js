import React from 'react';

import './databaseStyle.css';


const Tables = () => {
  return (
    <div className="table">
      <h3>Header only</h3>
      <svg width="200" height="40" viewBox="0 0 100 20" className='table'>
        <rect style={{x:"0px",y:"0px",width: "100%", height:"100%"}}  className="background"/>
        <rect style={{x:"2px",y:"2px",width: "96", height:"18"}}  className="header"/>
        <text x="5" y="14" width="100%" className="name">TableName</text>
      </svg>

      <h3>Table with columns</h3>
      <svg width="200" height="200" viewBox="0 0 100 100" className='table'>
        <rect style={{x:"0px",y:"0px",width: "100%", height:"100%"}}  className="background"/>
        <rect style={{x:"2px",y:"2px",width: "96", height:"18"}}  className="header"/>
        <rect style={{x:"2px",y:"18",width: "96", height:"80"}} className="body"/>
        <text x="5" y="14" width="100%" className="name">TableName</text>
        <text x="5" y="30" className="column">id_table</text>
        <text x="5" y="40" className="column">number</text>
        <text x="5" y="50" className="column">name</text>
        <text x="5" y="60" className="column">description</text>
        <text x="5" y="70" className="column">amount</text>
      </svg>


      <h3>Table with columns and PK/FK/BK</h3>
      <svg width="200" height="200" viewBox="0 0 100 100" className='table'>
        <rect style={{x:"0px",y:"0px",width: "100%", height:"100%"}}  className="background"/>
        <rect style={{x:"2px",y:"2px",width: "96", height:"18"}}  className="header"/>
        <rect style={{x:"2px",y:"18",width: "96", height:"80"}} className="body"/>
        <text x="5" y="14" width="100%" className="name">TableName</text>
        <text x="5" y="30" className="key">PK</text>
        <text x="20" y="30" className="column">id_table</text>
        <text x="5" y="40" className="key">BK</text>
        <text x="20" y="40" className="column">number</text>
        <text x="20" y="50" className="column">name</text>
        <text x="20" y="60" className="column">description</text>
        <text x="20" y="70" className="column">amount</text>
        <line x1="18" y1="18" x2="18" y2="98" className='separator'></line>
      </svg>

      <h3>With datatypes</h3>
      <svg width="200" height="200" viewBox="0 0 150 100" className='table'>
        <rect style={{x:"0px",y:"0px",width: "100%", height:"100%"}}  className="background"/>
        <rect style={{x:"2px",y:"2px",width: "146", height:"18"}}  className="header"/>
        <rect style={{x:"2px",y:"18",width: "146", height:"80"}} className="body"/>
        <text x="5" y="14" width="100%" className="name">TableName</text>
        <text x="4" y="30" className="key">PK</text>
        <text x="20" y="30" className="column">id_table</text>
        <text x="80" y="30" className="type">int</text>
        <text x="4" y="40" className="key">BK</text>
        <text x="20" y="40" className="column">number</text>
        <text x="80" y="40" className="type">char(40)</text>
        <text x="20" y="50" className="column">name</text>
        <text x="80" y="50" className="type">varchar(100)</text>
        <text x="20" y="60" className="column">description</text>
        <text x="80" y="60" className="type">varchar(max)</text>
        <text x="20" y="70" className="column">amount</text>
        <text x="80" y="70" className="type">number(16,4)</text>
        <line x1="18" y1="18" x2="18" y2="98" className='separator'></line>
        <line x1="76" y1="18" x2="76" y2="98" className='separator'></line>

      </svg>
      <h3>Overflow on number of columns</h3>
    </div>
  );
};

export default Tables;
