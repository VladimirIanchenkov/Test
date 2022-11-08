// const GET_DATA_SERVER_LINK = 'https://jsonplaceholder.typicode.com/users';

// const getData = (onSuccess, onFail) => {
//   fetch(GET_DATA_SERVER_LINK)
//     .then((response) => {
//       if (response.ok) {
//         return response.json();
//       }
//       throw new Error(`${response.status} ${response.statusText}`);
//     })
//     .then((cards) => {
//       onSuccess(cards);
//     })
//     .catch(() => {
//       onFail();
//     });
// };
const table = document.querySelector('.table');

const createCustomCard = (card) => {
  const cardItemTemplate = document.querySelector('#card').content.querySelector('.table__row');
  const cardItem = cardItemTemplate.cloneNode(true);
  cardItem.querySelector('.table__name').textContent = card.name;
  cardItem.querySelector('.table__link').textContent = card.email;
  cardItem.querySelector('.table__address').textContent = `${card.address.city}, ${card.address.street}, ${card.address.suite}, ${card.address.zipcode}`;
  cardItem.querySelector('.table__tel').textContent = card.phone;
  cardItem.querySelector('.table__company').textContent = card.company.name;

  table.appendChild(cardItem);
  console.log(table);
  return cardItem;
}

fetch('https://jsonplaceholder.typicode.com/users')
  .then((response) => response.json())
  .then((cards) => {
    cards.forEach((card) => createCustomCard(card));
    console.log(cards);
  }
);





