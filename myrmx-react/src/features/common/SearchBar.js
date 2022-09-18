import React from 'react';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/pro-solid-svg-icons';

const SearchBar = ({value, onSearch}) => {
  return (
    <div className="common-search-bar">
      <Form.Control
        className='search mrm-pl-2_5'
        placeholder='Search'
        value={value}
        onChange={onSearch}
      />
      <FontAwesomeIcon icon={faSearch} size="xs" className="search-icon" />
    </div>
  );
};

export default SearchBar;

SearchBar.propTypes = {};
SearchBar.defaultProps = {};
