import React from 'react';
import { useParams } from 'react-router-dom';
import "../../styles/Searchbar.css"

const CardDetail = ({ person }) => {
  const { id } = useParams();


  if (!person) {
    return <div>Loading...</div>;
  }


  const card = person.find((card) => card.id === id);

  if (!card) {
    return <div>

        <h1>Card not found</h1>
    </div>;
  }

  return (
    <>
    <div className='tc navbar'>
      <h2>{card.name}</h2>
    </div>
    <div>
      <p></p>
    </div>
    </>
  );
};

export default CardDetail;
