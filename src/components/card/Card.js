import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Cardstyle.css'

function Card({person}) {
  return(
    <div  className="dib br3 pa3 ma2 grow bw2 ">
       <Link to={`/${person.id}`} className='card-link'>
      <img className="br-100 h3 w3 dib" alt={person.name} src={process.env.PUBLIC_URL + person.imgPath} />
      <div>

        <h3>{person.name}</h3>
      </div>
      </Link>

     

    </div>
  );
}

export default Card;