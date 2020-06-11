'use strict';

var ADVERTS_AMOUNT = 8;
var OFFER_TITLE = [
  'Уютная квартира',
  'Крутые апартаменты',
  'Королевский замок',
  'Скромная однушка',
  'Бюджетная двушка'
];
var OFFER_PRICE_MIN = 100;
var OFFER_PRICE_MAX = 10000;
var OFFER_TYPE = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var OFFER_ROOMS_MIN = 1;
var OFFER_ROOMS_MAX = 10;
var OFFER_GUESTS_MIN = 1;
var OFFER_GUESTS_MAX = 10;
var OFFER_CHECKIN_OUT = [
  '12:00',
  '13:00',
  '14:00'
];
var OFFER_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var OFFER_DESCRIPTION = [
  'Лучший вариант только для Вас',
  'Самый бюджетный выбор из всего, что есть на рынке',
  'В этом дворце Вы будете чувствовать себя королём',
  'Уютное жильё для тебя и кота'
];
var OFFER_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var MAP_WIDTH_MIN = 0;
var MAP_WIDTH_MAX = 1200;
var MAP_HEIGHT_MIN = 130;
var MAP_HEIGHT_MAX = 630;

/**
 * Генерирует рандомное число в диапазоне (Максимум и минимум включаются)
 * @param  {number} min - от какого числа
 * @param  {number} max - до какого числа
 * @return {number} - рандомное число из диапазона
 */
var getRandomNumber = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Берет случайный элемент из массива
 * @param  {array} array - исходный массив
 * @return {string} - рандомный элемент из массива
 */
var getRandomElementFromArray = function (array) {
  return array[getRandomNumber(0, array.length - 1)];
};

/**
 * Перемешивание массива по алгоритму Фишера — Йетса
 * @param  {array} array - исходный массив
 * @return {array} array - перемешанный массив
 */
var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = array[i];
    array[i] = array[j];
    array[j] = t;
  }
  return array;
};

/**
 * Перемешивает и меняет длину массива случайным образом
 * @param  {array} array - исходный массив
 * @return {array} randomArray - перемешанный массив со случайной длиной
 */
var generateRandomArray = function (array) {
  var randomArray = shuffleArray(array.slice());
  randomArray.length = getRandomNumber(1, randomArray.length);
  return randomArray;
};

/**
 * Возвращает случайным образом - либо перемешанный массив, либо пустую строку
 * @param  {array} array - исходный массив
 * @return {array} generateRandomArray(array) - перемешанный массив со случайной длиной
 * @return {string} - пустая строка
 */
var generateRandomPhotoArray = function (array) {
  return Math.floor(Math.random() * 2) > 0 ? generateRandomArray(array) : ' ';
};

/**
 * Генерирует массив моков, каждый элемент которого состоит из объектов
 * @param  {number} adsAmount - желаемое количевто элементов массива
 * @return {array} adverts - готовый массив с требуемой длиной
 */
var generateAdverts = function (adsAmount) {
  var adverts = [];
  for (var i = 0; i < adsAmount; i++) {
    adverts.push({
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: getRandomElementFromArray(OFFER_TITLE),
        address: getRandomNumber(MAP_WIDTH_MIN, MAP_WIDTH_MAX) + ', ' + getRandomNumber(MAP_HEIGHT_MIN, MAP_HEIGHT_MAX),
        price: getRandomNumber(OFFER_PRICE_MIN, OFFER_PRICE_MAX),
        type: getRandomElementFromArray(OFFER_TYPE),
        rooms: getRandomNumber(OFFER_ROOMS_MIN, OFFER_ROOMS_MAX),
        guests: getRandomNumber(OFFER_GUESTS_MIN, OFFER_GUESTS_MAX),
        checkin: getRandomElementFromArray(OFFER_CHECKIN_OUT),
        checkout: getRandomElementFromArray(OFFER_CHECKIN_OUT),
        features: generateRandomArray(OFFER_FEATURES),
        description: getRandomElementFromArray(OFFER_DESCRIPTION),
        photos: generateRandomPhotoArray(OFFER_PHOTOS)
      },
      location: {
        x: getRandomNumber(MAP_WIDTH_MIN, MAP_WIDTH_MAX),
        y: getRandomNumber(MAP_HEIGHT_MIN, MAP_HEIGHT_MAX)
      }
    });
  }
  return adverts;
};

/**
 * Переключает карту из неактивного состояния в активное и наоборот
 * @param  {boolean} flag - true - активировать карту, false - деактивировать
 */
var mapVisibility = function (flag) {
  var MAP = document.querySelector('.map');
  if (flag) {
    MAP.classList.add('map--faded');
  } else {
    MAP.classList.remove('map--faded');
  }
};

/**
 * Создание DOM элемента по шаблону #card на основе JS объекта
 * @param  {array} card - массив объектов, содержащий сгенерированные данные для карточки
 * @return {object} cardElement - клон элемента map__card с содержимым из массива card
 */
var renderCard = function (card) {
  var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');
  var cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__avatar').src = card.author.avatar;
  cardElement.querySelector('.popup__title').textContent = card.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = card.offer.price;
  cardElement.querySelector('.popup__text--price').insertAdjacentHTML('beforeend', '&#x20bd;<span>/ночь</span>');
  cardElement.querySelector('.popup__type').textContent = card.offer.type;
  cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = card.offer.description;
  return cardElement;
};

/**
 * Создание DOM элемента по шаблону #pin на основе JS объекта
 * @param  {array} card - массив объектов, содержащий сгенерированные данные для пина
 * @return {object} cardElement - клон элемента map__pin с содержимым из массива card
 */
var renderPin = function (card) {
  var cardTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
  var cardElement = cardTemplate.cloneNode(true);
  cardElement.style = 'left: ' + card.location.x + 'px; top: ' + card.location.y + 'px;';
  cardElement.children[0].src = card.author.avatar;
  cardElement.children[0].alt = card.offer.title;
  return cardElement;
};

/**
 * Заполнение блока card DOM-элементами на основе массива JS-объектов
 * @param  {array} adverts - массив объектов, содержащий сгенерированные данные для карточки
 */
var pushCard = function (adverts) {
  var fragment = document.createDocumentFragment();
  var listElement = document.querySelector('.map__pins');
  fragment.appendChild(renderCard(adverts));
  listElement.appendChild(fragment);
};

/**
 * Заполнение блока pins DOM-элементами на основе массива JS-объектов
 * @param  {array} adverts - массив объектов, содержащий сгенерированные данные для пина
 */
var pushPins = function (adverts) {
  var fragment = document.createDocumentFragment();
  var listElement = document.querySelector('.map__pins');
  adverts.forEach(function (card) {
    fragment.appendChild(renderPin(card));
  });
  listElement.appendChild(fragment);
};

var adverts = generateAdverts(ADVERTS_AMOUNT);
mapVisibility(true);
pushCard(adverts[0]);
pushPins(adverts);
