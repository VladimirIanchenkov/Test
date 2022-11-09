const GET_DATA_SERVER_LINK = 'https://jsonplaceholder.typicode.com/users';

const table = document.querySelector('.table');
const sorters = document.querySelector('.table__heading').querySelectorAll('input');
const nameFilter = document.querySelector('.users__form-filter');
const total = document.querySelector('.users__form-overall-number')

// Функция, создающая карточку клиента
const createCustomCard = (card) => {
  const cardItemTemplate = document.querySelector('#card').content.querySelector('.table__row');
  const cardItem = cardItemTemplate.cloneNode(true);
  cardItem.querySelector('.table__name').textContent = card.name;
  cardItem.querySelector('.table__link').textContent = card.email;
  cardItem.querySelector('.table__address').textContent = `${card.address.city}, ${card.address.street}, ${card.address.suite}, ${card.address.zipcode}`;
  cardItem.querySelector('.table__tel').textContent = card.phone;
  cardItem.querySelector('.table__company').textContent = card.company.name;
  return cardItem;
}

// Функция сравнения по имени
const compareNames = (a, b) => {
  if (a.name > b.name) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }
  return 0;
}

// Функция сравнения по e-mail
const compareLinks = (a, b) => {
  if (a.email > b.email) {
    return 1;
  }
  if (a.email < b.email) {
    return -1;
  }
  return 0;
}

// Функция сравнения по адресу
const compareAddresses = (a, b) => {
  if (a.address.city > b.address.city) {
    return 1;
  }
  if (a.address.city < b.address.city) {
    return -1;
  }
  if (a.address.street > b.address.street) {
    return 1;
  }
  if (a.address.street < b.address.street) {
    return -1;
  }
  if (a.address.suite > b.address.suite) {
    return 1;
  }
  if (a.address.suite < b.address.suite) {
    return -1;
  }
  if (a.address.zipcode > b.address.zipcode) {
    return 1;
  }
  if (a.address.zipcode < b.address.zipcode) {
    return -1;
  }
  return 0;
}

// Функция сравнения по телефону
const comparePhones = (a, b) => {
  if (a.phone > b.phone) {
    return 1;
  }
  if (a.phone < b.phone) {
    return -1;
  }
  return 0;
}

// Функция сравнения по компании
const compareCompanies = (a, b) => {
  if (a.company.name > b.company.name) {
    return 1;
  }
  if (a.company.name < b.company.name) {
    return -1;
  }
  return 0;
}

// Объект данных ключ-значение по сортировке
const sortOptions = {
  'name' : compareNames,
  'email' : compareLinks,
  'address' : compareAddresses,
  'phone' : comparePhones,
  'company' : compareCompanies,
}

// Функция сравнения значения инпута и значения имени из массива
const filterCards = (value) => {
  const nameValue = value.name.toLowerCase();
  const filterValue = nameFilter.value.toLowerCase();
  return nameValue.includes(filterValue);
}

// Функция удаления устаревших данных из таблицы
const formReset = () => {document.querySelectorAll('.table__row').forEach((elem) => elem.parentNode.removeChild(elem))};

// Функция отрисовки карточек клиентов по умолчанию
const createDefaultList = (cards) => {
  cards.forEach((card) => table.appendChild(createCustomCard(card)));
  total.textContent = cards.length;
}

// Функция сортировки, фильтрации и отрисовки сортированных карточек
const createSortedList = (cards, sorter) => {
  formReset();
  let array = cards.slice().filter(filterCards).sort(sortOptions[sorter]);
  array.forEach((card) => table.appendChild(createCustomCard(card)));
  total.textContent = array.length;
}

// Функция отрисовки ошибки загрузки данных с сервера
const showServerAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '20px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.color = '#ffffff';
  alertContainer.style.backgroundColor = '#ff5635';
  alertContainer.textContent = message;
  document.body.append(alertContainer);
};

// Функция загрузки данных с сервера
const getData = (onSuccess, onFail) => {
  fetch(GET_DATA_SERVER_LINK)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.status} ${response.statusText}`);
    })
    .then((cards) => {
      onSuccess(cards);
    })
    .catch(() => {
      onFail();
    });
};

getData(
  (cards) => {
    createDefaultList(cards);
    sorters.forEach((el) => el.addEventListener('click', () => {
      createSortedList(cards, el.id);
    }));
    nameFilter.addEventListener('keyup', () => {
      createSortedList(cards);
    });
  },
  () => {
    showServerAlert('Не удалось загрузить данные о пользователях с сервера. Попробуйте обновить страницу');
  },
)
