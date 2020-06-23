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
  PALACE: 'Дворец',
  FLAT: 'Квартира',
  HOUSE: 'Дом',
  BUNGALO: 'Бунгало'
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
// var PinSize = {
//   WIDTH: 50,
//   HEIGHT: 70
// };
var MainPinSize = {
  WIDTH: 65,
  HEIGHT: 65,
  TRIANGLE_HEIGHT: 22
};
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
    var randomX = getRandomNumber(MapSize.WIDTH_MIN, MapSize.WIDTH_MAX);
    var randomY = getRandomNumber(MapSize.HEIGHT_MIN, MapSize.HEIGHT_MAX);
    adverts.push({
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: getRandomElementFromArray(OFFER_TITLE),
        address: randomX + ', ' + randomY,
        price: getRandomNumber(OFFER_PRICE_MIN, OFFER_PRICE_MAX),
        type: getRandomElementFromArray(toString(Object.keys(OfferType)).toLowerCase()),
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
 * Акивирует страницу при клике левой кнопкой мыши
 * @param {Object} evt - Событие при клике мыши
 */
var onMousePressActivate = function (evt) {
  if (evt.button === 0) {
    setActiveState(true);
  }
};

/**
 * Акивирует страницу при нажатии клавиши Enter
 * @param {Object} evt - Событие при нажатии клавиши
 */
var onKeyPressActivate = function (evt) {
  if (evt.key === 'Enter') {
    setActiveState(true);
  }
};

/**
 * Синхронизация значений полей комнат и гостей
 * @param {Object} node - параметр либо node.value для стартовой синхронизации, либо node.target.value при изменении значения поля
 */
var checkValidation = function (node) {
  var inputCapacity = document.querySelector('#capacity');
  var capacity = document.querySelectorAll('#capacity > option');
  switch (node) {
    case '1':
      capacity.forEach(function (item) {
        if (item.value !== '1') {
          item.setAttribute('disabled', true);
        } else {
          item.removeAttribute('disabled');
          inputCapacity.value = '1';
        }
      });
      break;
    case '2':
      capacity.forEach(function (item) {
        if (item.value !== '1' && item.value !== '2') {
          item.setAttribute('disabled', true);
        } else {
          item.removeAttribute('disabled');
          inputCapacity.value = '2';
        }
      });
      break;
    case '3':
      capacity.forEach(function (item) {
        if (item.value === '0') {
          item.setAttribute('disabled', true);
        } else {
          item.removeAttribute('disabled');
          inputCapacity.value = '3';
        }
      });
      break;
    case '100':
      capacity.forEach(function (item) {
        if (item.value !== '0') {
          item.setAttribute('disabled', true);
        } else {
          item.removeAttribute('disabled');
          inputCapacity.value = '0';
        }
      });
      break;
  }
};

/**
 * Запускает валидацию либо при активации страницы, либо при изменении поля
 * @param {Object} node - поле, которое нужно валидировать
 * @param {boolean} submit - флаг для валидации либо при активации страницы, либо при изменении поля
 */
var setValidation = function (node, submit) {
  if (!submit) {
    checkValidation(node.target.value);
  } else {
    checkValidation(node.value);
  }
};

/**
 * Переключает страницу из неактивного состояния в активное и наоборот
 * @param  {boolean} flag - true - активировать страницу, false - деактивировать
 */
var setActiveState = function (flag) {
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var mapFilter = document.querySelectorAll('.map__filter');
  var mapFeatures = document.querySelector('.map__features');
  var adFormHeader = document.querySelector('.ad-form-header');
  var adFormElement = document.querySelectorAll('.ad-form__element');
  var adverts = generateAdverts(ADVERTS_AMOUNT);
  var mapPinMain = document.querySelector('.map__pin--main');
  var inputAddress = document.querySelector('#address');
  var activeX = Math.round(Number(mapPinMain.style.left.slice(0, mapPinMain.style.left.length - 2)) + MainPinSize.WIDTH / 2);
  var activeY = Math.round(Number(mapPinMain.style.top.slice(0, mapPinMain.style.top.length - 2)) + MainPinSize.TRIANGLE_HEIGHT);
  var noneActiveY = Math.round(Number(mapPinMain.style.top.slice(0, mapPinMain.style.top.length - 2)) - MainPinSize.HEIGHT / 2);
  var inputRoomNumber = document.querySelector('#room_number');
  if (flag) {
    pushPins(adverts);
    setValidation(inputRoomNumber, true);
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    mapFeatures.removeAttribute('disabled');
    adFormHeader.removeAttribute('disabled');
    inputAddress.value = activeX + ', ' + activeY;
    mapFilter.forEach(function (item) {
      item.removeAttribute('disabled');
    });
    adFormElement.forEach(function (item) {
      item.removeAttribute('disabled');
    });
    inputAddress.setAttribute('disabled', true);
    mapPinMain.removeEventListener('mousedown', onMousePressActivate);
    mapPinMain.removeEventListener('keydown', onKeyPressActivate);
    inputRoomNumber.addEventListener('change', setValidation);
  } else {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    mapFeatures.setAttribute('disabled', true);
    adFormHeader.setAttribute('disabled', true);
    inputAddress.value = activeX + ', ' + noneActiveY;
    mapFilter.forEach(function (item) {
      item.setAttribute('disabled', true);
    });
    adFormElement.forEach(function (item) {
      item.setAttribute('disabled', true);
    });
    var pins = document.querySelectorAll('.map__pin--main ~ .map__pin');
    pins.forEach(function (item) {
      item.remove();
    });
    mapPinMain.addEventListener('mousedown', onMousePressActivate);
    mapPinMain.addEventListener('keydown', onKeyPressActivate);
    inputRoomNumber.removeEventListener('change', setValidation);
  }
};

// /**
//  * Функция плюрализации для русского языка
//  * @param {number} n - число, после которого нужно склонять существительное
//  * @param {Array} forms - массив окончаний для склоняемого существительного
//  * @return {string} - необходимое окончание для существительного
//  */
// function pluralizeRus(n, forms) {
//   var ending = '';
//   if (n % 10 === 1 && n % 100 !== 11) {
//     ending = forms[0];
//   } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
//     ending = forms[1];
//   } else {
//     ending = forms[2];
//   }
//   return ending;
// }

// /**
//  * Создание DOM элемента по шаблону #card на основе JS объекта
//  * @param  {Array} card - массив объектов, содержащий сгенерированные данные для карточки
//  * @return {Object} cardElement - клон элемента map__card с содержимым из массива card
//  */
// var renderCard = function (card) {
//   var cardTemplate = document.querySelector('#card')
//   .content
//   .querySelector('.map__card');
//   var cardElement = cardTemplate.cloneNode(true);

//   var elemFeatures = cardElement.querySelectorAll('.popup__feature');
//   card.offer.features.forEach(function (item) {
//     for (var i = 0; i < elemFeatures.length; i++) {
//       if (elemFeatures[i].classList.contains('popup__feature--' + item)) {
//         elemFeatures[i].classList.toggle('holdIt');
//       }
//     }
//   });
//   elemFeatures.forEach(function (item) {
//     if (!item.classList.contains('holdIt')) {
//       item.remove();
//     } else {
//       item.classList.remove('holdIt');
//     }
//   });

//   var elemPhoto = cardElement.querySelector('.popup__photo');
//   var elemPhotos = cardElement.querySelector('.popup__photos');
//   if (card.offer.photos) {
//     elemPhoto.src = card.offer.photos[0];
//     if (card.offer.photos.length !== 1) {
//       elemPhoto.src = card.offer.photos[0];
//       for (var i = 1; i < card.offer.photos.length; i++) {
//         var clonePhoto = elemPhoto.cloneNode(true);
//         clonePhoto.src = card.offer.photos[i];
//         elemPhotos.appendChild(clonePhoto);
//       }
//     }
//   } else {
//     elemPhoto.remove();
//   }

//   cardElement.querySelector('.popup__avatar').src = card.author.avatar;
//   cardElement.querySelector('.popup__title').textContent = card.offer.title;
//   cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
//   cardElement.querySelector('.popup__text--price').textContent = '';
//   cardElement.querySelector('.popup__text--price').insertAdjacentHTML('beforeend', card.offer.price + '&#x20bd;<span>/ночь</span>');
//   cardElement.querySelector('.popup__type').textContent = OfferType[card.offer.type];
//   cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнат' + pluralizeRus(card.offer.rooms, ['а', 'ы', '']) + ' для ' + card.offer.guests + ' гост' + pluralizeRus(card.offer.guests, ['я', 'ей', 'ей']);
//   cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
//   cardElement.querySelector('.popup__description').textContent = card.offer.description;
//   return cardElement;
// };

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
  cardElement.style = 'left: ' + card.location.x + 'px; top: ' + card.location.y + 'px;';
  cardElement.children[0].src = card.author.avatar;
  cardElement.children[0].alt = card.offer.title;
  return cardElement;
};

// /**
//  * Заполнение блока card DOM-элементами на основе массива JS-объектов
//  * @param  {Array} advert - элемент массива объектов, содержащий сгенерированные данные для карточки
//  */
// var pushCard = function (advert) {
//   var listElement = document.querySelector('.map');
//   var filterElement = document.querySelector('.map__filters-container');
//   listElement.insertBefore(renderCard(advert), filterElement);
// };

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

setActiveState(false);
// pushCard(adverts[0]);
