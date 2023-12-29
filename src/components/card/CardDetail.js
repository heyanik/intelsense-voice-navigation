import React from "react";
import { useParams } from "react-router-dom";
import "../../styles/Searchbar.css";
import { IoMdArrowRoundBack } from "react-icons/io";

const CardDetail = ({ person }) => {
  const { id } = useParams();

  if (!person) {
    return <div>Loading...</div>;
  }

  const card = person.find((card) => card.id === id);

  if (!card) {
    return (
      <div>
        <h1>Card not found</h1>
      </div>
    );
  }

  return (
    <>
      <div className="tc navbar">
        <a href="javascript:window.history.back();">
          <IoMdArrowRoundBack className="icon" />
        </a>
        <h2>{card.name}</h2>
      </div>
      <div className="page-img">
        <img src={card.imgPath} alt="imagePath" />
      </div>
    </>
  );
};

export default CardDetail;
