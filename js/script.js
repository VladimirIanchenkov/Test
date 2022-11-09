const table = document.querySelector('.table');
const sorters = document.querySelector('.table__heading').querySelectorAll('input');

// Функия, создающая карточку клиента
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

const compareNames = (a, b) => {
  if (a.name > b.name) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }
  return 0;
}

const compareLinks = (a, b) => {
  if (a.email > b.email) {
    return 1;
  }
  if (a.email < b.email) {
    return -1;
  }
  return 0;
}

const compareAddresses = (a, b) => {
  if (a.address.city > b.address.city) {
    return 1;
  }
  if (a.address.city < b.address.city) {
    return -1;
  }
  return 0;
}

const comparePhones = (a, b) => {
  if (a.phone > b.phone) {
    return 1;
  }
  if (a.phone < b.phone) {
    return -1;
  }
  return 0;
}

const compareCompanies = (a, b) => {
  if (a.company.name > b.company.name) {
    return 1;
  }
  if (a.company.name < b.company.name) {
    return -1;
  }
  return 0;
}

const sortOptions = {
  'name' : compareNames,
  'email' : compareLinks,
  'address' : compareAddresses,
  'phone' : comparePhones,
  'company' : compareCompanies,
}

const createDefaultList = (cards) => {
  cards.forEach((card) => table.appendChild(createCustomCard(card)));
}

const createSortedList = (cards, sorter) => {
  document.querySelectorAll('.table__row').forEach((elem) => elem.parentNode.removeChild(elem));
  cards.slice().sort(sortOptions[sorter]).forEach((card) => table.appendChild(createCustomCard(card)));
}

const GET_DATA_SERVER_LINK = 'https://jsonplaceholder.typicode.com/users';

// Отрисовка ошибки загрузки данных с сервера
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
    // .catch(() => {
    //   onFail();
    // });
};

getData(
  (cards) => {
    createDefaultList(cards);
    sorters.forEach((el) => el.addEventListener('click', () => {
      console.log(el.id);
      createSortedList(cards, el.id);
    }));
  },
  () => {
    showServerAlert('Не удалось загрузить данные о пользователях с сервера. Попробуйте обновить страницу');
  },
)
