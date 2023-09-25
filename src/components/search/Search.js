import React, { useState, useEffect } from 'react';
import Scroll from '../logic/Scroll';
import SearchList from '../logic/SearchList';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdKeyboardVoice } from 'react-icons/md';
import "../../styles/Searchbar.css";
import Navbar from '../navbar/Navbar';

function Search({ details }) {
  const [searchField, setSearchField] = useState("");



  const handleChange = e => {
    setSearchField(e.target.value);
  };

  


  function searchList() {
    const filteredPersons = details.filter(
      person => {
        return (
          person
            .name
            .toLowerCase()
            .includes(searchField.toLowerCase())
        );
      }
    );
    return (
      <Scroll>
        <SearchList filteredPersons={filteredPersons} />
      </Scroll>
    );
  }

  return (
    <section>
      <Navbar />
      <div className="input-icons">
        <span className="icon1">
          <AiOutlineSearch />
        </span>
        <input
          className="input-field"
          type="search"
          placeholder="Search for offers and features"
          value={searchField}
          onChange={handleChange}
        />
        <span className="icon2">
          <button >
            <MdKeyboardVoice />
          </button>
        </span>
      </div>
      {searchList()}
    </section>
  );
}

export default Search;
