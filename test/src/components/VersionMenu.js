import React, { useState } from 'react';
import styles from '../styles/components/VersionMenu.module.css';

const VersionMenu = () => {
  const AlDate = ["1950","1951", "1952", "1953", "1954", "1955", "1956", "1957", "1958","1959"];
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVersions, setFilteredDate] = useState(AlDate);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term === '') {
      setFilteredDate(AlDate);
    } else {
      setFilteredDate(
        AlDate.filter(date => 
          date.includes(term) || 
          date.replace('.', '').includes(term.replace('.', ''))
        )
      );
    }
  };

  return (
    <div className={styles['versions-menu']}>
      <h3>Года</h3>
      <input 
        type="text" 
        className={styles['version-search']} 
        placeholder="Поиск года..." 
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {filteredVersions.length > 0 ? (
        filteredVersions.map(version => (
          <button 
            key={version} 
            className={styles['version-button']}
          >
            {version}
          </button>
        ))
      ) : (
        <div className={styles['no-results']}>
          Год не найден
        </div>
      )}
    </div>
  );
};

export default VersionMenu;