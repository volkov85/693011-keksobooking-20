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
var OfferType = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
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
var MapSize = {
  WIDTH_MIN: 0,
  WIDTH_MAX: 1200,
  HEIGHT_MIN: 130,
  HEIGHT_MAX: 630
};
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

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
 * @param  {Array} array - исходный массив
 * @return {string} - рандомный элемент из массива
 */
var getRandomElementFromArray = function (array) {
  return array[getRandomNumber(0, array.length - 1)];
};

/**
 * Перемешивание массива по алгоритму Фишера — Йетса
 * @param  {Array} array - исходный массив
 * @return {Array} array - перемешанный массив
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
 * @param  {Array} array - исходный массив
 * @return {Array} randomArray - перемешанный массив со случайной длиной
 */
var generateRandomArray = function (array) {
  var randomArray = shuffleArray(array.slice());
  randomArray.length = getRandomNumber(1, randomArray.length);
  return randomArray;
};

/**
 * Возвращает случайным образом - либо перемешанный массив, либо значение false
 * @param  {Array} array - исходный массив
 * @return {Array} generateRandomArray(array) - перемешанный массив со случайной длиной
 * @return {boolean} - false
 */
var generateRandomPhotoArray = function (array) {
  return Math.floor(Math.random() * 2) ? generateRandomArray(array) : false;
};

/**
 * Генерирует массив моков, каждый элемент которого состоит из объектов
 * @param  {number} adsAmount - желаемое количевто элементов массива
 * @return {Array} adverts - готовый массив с требуемой длиной
 */
var generateAdverts = function (adsAmount) {
  var adverts = [];
  for (var i = 0; i < adsAmount; i++) {
    var randomX = getRandomNumber(MapSize.WIDTH_MIN, MapSize.WIDTH_MAX - PIN_WIDTH);
    var randomY = getRandomNumber(MapSize.HEIGHT_MIN, MapSize.HEIGHT_MAX);
    adverts.push({
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: getRandomElementFromArray(OFFER_TITLE),
        address: randomX + ', ' + randomY,
        price: getRandomNumber(OFFER_PRICE_MIN, OFFER_PRICE_MAX),
        type: getRandomElementFromArray(Object.keys(OfferType)),
        rooms: getRandomNumber(OFFER_ROOMS_MIN, OFFER_ROOMS_MAX),
        guests: getRandomNumber(OFFER_GUESTS_MIN, OFFER_GUESTS_MAX),
        checkin: getRandomElementFromArray(OFFER_CHECKIN_OUT),
        checkout: getRandomElementFromArray(OFFER_CHECKIN_OUT),
        features: generateRandomArray(OFFER_FEATURES),
        description: getRandomElementFromArray(OFFER_DESCRIPTION),
        photos: generateRandomPhotoArray(OFFER_PHOTOS)
      },
      location: {
        x: randomX,
        y: randomY
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
 * Функция плюрализации для русского языка
 * @param {number} n - число, после которого нужно склонять существительное
 * @param {Array} forms - массив окончаний для склоняемого существительного
 * @return {string} - необходимое окончание для существительного
 */
function pluralizeRus(n, forms) {
  var ending = '';
  if (n % 10 === 1 && n % 100 !== 11) {
    ending = forms[0];
  } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
    ending = forms[1];
  } else {
    ending = forms[2];
  }
  return ending;
}

/**
 * Создание DOM элемента по шаблону #card на основе JS объекта
 * @param  {Array} card - массив объектов, содержащий сгенерированные данные для карточки
 * @return {Object} cardElement - клон элемента map__card с содержимым из массива card
 */
var renderCard = function (card) {
  var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');
  var cardElement = cardTemplate.cloneNode(true);

  var elemFeatures = cardElement.querySelectorAll('.popup__feature');
  card.offer.features.forEach(function (item) {
    for (var i = 0; i < elemFeatures.length; i++) {
      if (elemFeatures[i].classList.contains('popup__feature--' + item)) {
        elemFeatures[i].classList.toggle('holdIt');
      }
    }
  });
  elemFeatures.forEach(function (item) {
    if (!item.classList.contains('holdIt')) {
      item.remove();
    } else {
      item.classList.remove('holdIt');
    }
  });

  var elemPhoto = cardElement.querySelector('.popup__photo');
  var elemPhotos = cardElement.querySelector('.popup__photos');
  if (card.offer.photos) {
    if (card.offer.photos.length === 1) {
      elemPhoto.src = card.offer.photos[0];
    } else {
      elemPhoto.src = card.offer.photos[0];
      for (var i = 1; i < card.offer.photos.length; i++) {
        var clonePhoto = elemPhoto.cloneNode(true);
        clonePhoto.src = card.offer.photos[i];
        elemPhotos.appendChild(clonePhoto);
      }
    }
  } else {
    elemPhoto.remove();
  }

  cardElement.querySelector('.popup__avatar').src = card.author.avatar;
  cardElement.querySelector('.popup__title').textContent = card.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = '';
  cardElement.querySelector('.popup__text--price').insertAdjacentHTML('beforeend', card.offer.price + '&#x20bd;<span>/ночь</span>');
  cardElement.querySelector('.popup__type').textContent = OfferType[card.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнат' + pluralizeRus(card.offer.rooms, ['а', 'ы', '']) + ' для ' + card.offer.guests + ' гост' + pluralizeRus(card.offer.guests, ['я', 'ей', 'ей']);
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = card.offer.description;
  return cardElement;
};

/**
 * Создание DOM элемента по шаблону #pin на основе JS объекта
 * @param  {Array} card - массив объектов, содержащий сгенерированные данные для пина
 * @return {Object} cardElement - клон элемента map__pin с содержимым из массива card
 */
var renderPin = function (card) {
  var cardTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
  var cardElement = cardTemplate.cloneNode(true);
  cardElement.style = 'left: ' + (card.location.x + PIN_WIDTH / 2) + 'px; top: ' + (card.location.y + PIN_HEIGHT) + 'px;';
  cardElement.children[0].src = card.author.avatar;
  cardElement.children[0].alt = card.offer.title;
  return cardElement;
};

/**
 * Заполнение блока card DOM-элементами на основе массива JS-объектов
 * @param  {Array} advert - элемент массива объектов, содержащий сгенерированные данные для карточки
 */
var pushCard = function (advert) {
  var listElement = document.querySelector('.map');
  var filterElement = document.querySelector('.map__filters-container');
  listElement.insertBefore(renderCard(advert), filterElement);
};

/**
 * Заполнение блока pins DOM-элементами на основе массива JS-объектов
 * @param  {Array} adverts - массив объектов, содержащий сгенерированные данные для пина
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
