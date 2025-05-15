import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faTrash, faPlus, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import VersionMenu from '../components/VersionMenu';
import MapCard from '../components/MapCard';
import styles from '../styles/pages/HomePage.module.css';

const HomePage = () => {
  // Состояния для авторизации
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Состояние для карт и поиска
  const [maps, setMaps] = useState([
    { id: 1, title: "Adventure Time", author: "Notch", image: "/img/map/1.jpg" },
    { id: 2, title: "SkyBlock Extreme", author: "MinecraftTeam", image: "/img/map/2.jpg" },
    { id: 3, title: "Parkour Master", author: "JumpKing", image: "/img/map/3.jpg" },
    { id: 4, title: "Survival Island", author: "SurvivalPro", image: "/img/map/4.jpg" },
    { id: 5, title: "Zombie Apocalypse", author: "HorrorMaster", image: "/img/map/5.jpg" },
    { id: 6, title: "Puzzle Dungeon", author: "PuzzleCreator", image: "/img/map/6.jpg" }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMapId, setEditingMapId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  // Фильтрация карт
  const filteredMaps = maps.filter(map =>
    map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    map.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Проверка авторизации при загрузке
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Обработчики авторизации
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginInput === 'admin' && passwordInput === 'admin123') {
      setIsAuthenticated(true);
      setShowAuthModal(false);
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      setAuthError('Неверный логин или пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  // Управление картами
  const handleDelete = (id) => {
    setMaps(maps.filter(map => map.id !== id));
  };

  const handleAddMap = () => {
    const newId = maps.length > 0 ? Math.max(...maps.map(m => m.id)) + 1 : 1;
    const newMap = {
      id: newId,
      title: `Новая карта ${newId}`,
      author: "Администратор",
      image: "/img/map/default.jpg"
    };
    setMaps([...maps, newMap]);
  };

  // Редактирование карт
  const startEditing = (map) => {
    setEditingMapId(map.id);
    setEditedTitle(map.title);
  };

  const cancelEditing = () => {
    setEditingMapId(null);
    setEditedTitle('');
  };

  const saveEditing = (id) => {
    setMaps(maps.map(map => 
      map.id === id ? { ...map, title: editedTitle } : map
    ));
    setEditingMapId(null);
    setEditedTitle('');
  };

  return (
    <div className={styles['page-layout']}>
      {/* Левая колонка */}
      <div className={styles['left-sidebar']}>
        <Header />
        <VersionMenu />
      </div>

      {/* Центральная колонка */}
      <div className={styles['center-content']}>
        {/* Поисковая строка */}
        <div className={styles['search-container']}>
          <div className={styles['search-bar']}>
            <FontAwesomeIcon icon={faSearch} className={styles['search-icon']} />
            <input
              type="text"
              placeholder="Поиск карт..."
              className={styles['search-input']}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Карты */}
        <div className={styles['maps-container']}>
          {filteredMaps.length > 0 ? (
            <div className={styles['maps-grid']}>
              {filteredMaps.map(map => (
                <div key={map.id} className={styles['map-wrapper']}>
                  {editingMapId === map.id ? (
                    <div className={styles['edit-container']}>
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className={styles['edit-input']}
                      />
                      <div className={styles['edit-controls']}>
                        <button 
                          onClick={() => saveEditing(map.id)}
                          className={styles['save-btn']}
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button 
                          onClick={cancelEditing}
                          className={styles['cancel-btn']}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <MapCard
                      title={map.title}
                      author={map.author}
                      image={map.image}
                    />
                  )}
                  
                  {isAuthenticated && (
                    <div className={styles['map-controls']}>
                      {editingMapId !== map.id && (
                        <button 
                          className={styles['edit-btn']}
                          onClick={() => startEditing(map)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      )}
                      <button 
                        className={styles['delete-btn']}
                        onClick={() => handleDelete(map.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles['no-results']}>
              Карты не найдены
              {searchTerm && ` по запросу: "${searchTerm}"`}
            </div>
          )}
        </div>
      </div>

      {/* Правая колонка */}
      <div className={styles['right-sidebar']}>
        {isAuthenticated ? (
          <div className={styles['auth-controls']}>
            <button 
              className={styles['auth-button']}
              onClick={handleLogout}
            >
              Выйти
            </button>
            <button 
              className={styles['add-button']}
              onClick={handleAddMap}
            >
              <FontAwesomeIcon icon={faPlus} /> Добавить
            </button>
          </div>
        ) : (
          <button 
            className={styles['auth-button']}
            onClick={() => setShowAuthModal(true)}
          >
            Авторизация
          </button>
        )}
      </div>

      {/* Модальное окно авторизации */}
      {showAuthModal && (
        <div className={styles['auth-modal-overlay']}>
          <div className={styles['auth-modal']}>
            <button 
              className={styles['close-btn']}
              onClick={() => {
                setShowAuthModal(false);
                setAuthError('');
              }}
            >
              ×
            </button>
            <h2>Авторизация</h2>
            {authError && <p className={styles['auth-error']}>{authError}</p>}
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Логин"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Пароль"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
              <button type="submit">Войти</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;