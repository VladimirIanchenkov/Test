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

//Функция сравнения по имени, e-mail, адресу, телефону, компании
function compareByField (sorter) {
  let field;

  if (sorter === 'name' || sorter === 'email' || sorter === 'phone') {
    switch (sorter) {
      case 'name':
        field = 'name';
        break;
      case 'email':
        field = 'email';
        break;
      case 'phone':
        field = 'phone';
        break;
    }
    return (a, b) => a[field] > b[field] ? 1 : -1;

  } else if (sorter === 'address') {
    field = 'address';
    return (a, b) => a[field].city + a[field].street + a[field].suite + a[field].zipcode > b[field].city + b[field].street + b[field].suite + b[field].zipcode ? 1 : -1;

  } else if (sorter === 'company') {
    field = 'company';
    return (a, b) => a[field].name > b[field].name ? 1 : -1;

  }
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
  const array = cards.slice().filter(filterCards).sort(compareByField(sorter));
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
