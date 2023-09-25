import React from 'react';
import "../../styles/SearchData.css"

const Scroll = (props) => {
  return( 
    <div className='search-data'>
      {props.children}
    </div>	
  );
}

export default Scroll;