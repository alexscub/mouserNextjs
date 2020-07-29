import React, { useState } from 'react';
import styles from './SearchForm.module.css';

export default function SearchForm ({onSubmit}) {
  const [query, setQuery] = useState('');
  const handleChange = e => {
    const { value } = e.target;
    setQuery(value);
  };
  const handleSubmit = e => {
      e.preventDefault();
      onSubmit(query);
      setQuery('')
    };
    return (
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search components..."
          onChange={handleChange}
          value={query}
        />
      </form>
    );
  }