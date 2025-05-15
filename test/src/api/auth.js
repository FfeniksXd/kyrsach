export const authUser = async (login, password) => {
  // В реальном проекте здесь будет запрос к вашему бэкенду
  const validCredentials = {
    login: 'admin',
    password: 'SaveCraft123' // В реальном проекте используйте хеширование!
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(login === validCredentials.login && password === validCredentials.password);
    }, 500);
  });
};