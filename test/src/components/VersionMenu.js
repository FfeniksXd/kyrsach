import React, { useState } from 'react';
import styles from '../styles/components/VersionMenu.module.css';

const VersionMenu = () => {
  const allVersions = ["1.21","1.20", "1.19", "1.18", "1.17", "1.16", "1.15", "1.14", "1.13","1.1"];
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVersions, setFilteredVersions] = useState(allVersions);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term === '') {
      setFilteredVersions(allVersions);
    } else {
      setFilteredVersions(
        allVersions.filter(version => 
          version.includes(term) || 
          version.replace('.', '').includes(term.replace('.', ''))
        )
      );
    }
  };

  return (
    <div className={styles['versions-menu']}>
      <h3>Версия карты</h3>
      <input 
        type="text" 
        className={styles['version-search']} 
        placeholder="Поиск версии..." 
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
          Версии не найдены
        </div>
      )}
    </div>
  );
};

export default VersionMenu;