'use strict';

var ADVERTS_AMOUNT = 8;
var OFFER_TYPE = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var OFFER_CHECKIN = [
  '12:00',
  '13:00',
  '14:00'
];
var OFFER_CHECKOUT = [
  '12:00',
  '13:00',
  '14:00'
];
var FEATURES_OFFER = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var PHOTOS_OFFER = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var MAP = document.querySelector('.map');

var avatars = [];
var avatarsGenerate = function () {
  for (var i = 1; i <= ADVERTS_AMOUNT; i++) {
    avatars.push('img/avatars/user0' + i + '.png');
  }
};

avatarsGenerate();

// Рандом от 100 до 999 для координат
var locationGenerate = function () {
  return Math.floor(100 + (Math.random() * (899)));
};

// Рандом от 100 до 10000 для цены
var priceGenerate = function () {
  return Math.floor(100 + (Math.random() * (9900)));
};

// Рандом для массива типа недвижимости
var typeGenerate = function () {
  return OFFER_TYPE[Math.floor((Math.random() * OFFER_TYPE.length))];
};

// Рандом от 1 до 10 для комнат
var roomsGenerate = function () {
  return Math.floor(1 + (Math.random() * (9)));
};

// Рандом от 1 до 10 для количества гостей
var guestsGenerate = function () {
  return Math.floor(1 + (Math.random() * (9)));
};

// Рандом для массива времени прибытия checkin
var checkinGenerate = function () {
  return OFFER_CHECKIN[Math.floor((Math.random() * OFFER_CHECKIN.length))];
};

// Рандом для массива времени отбытия checkout
var checkoutGenerate = function () {
  return OFFER_CHECKOUT[Math.floor((Math.random() * OFFER_CHECKOUT.length))];
};

// Рандом для массива features
var featuresGenerate = function () {
  var rndFeatureOffer = [];
  rndFeatureOffer.length = Math.floor(Math.random() * (FEATURES_OFFER.length)) + 1;
  for (var i = 0; i < rndFeatureOffer.length; i++) {
    rndFeatureOffer[i] = FEATURES_OFFER[i];
  }
  return rndFeatureOffer;
};

// Рандом для массива photos
var photosGenerate = function () {
  var rndPhotosOffer = [];
  rndPhotosOffer.length = Math.floor(Math.random() * (PHOTOS_OFFER.length)) + 1;
  for (var i = 0; i < rndPhotosOffer.length; i++) {
    rndPhotosOffer[i] = PHOTOS_OFFER[i];
  }
  return rndPhotosOffer;
};

// Рандом для координаты x метки на карте
var xLocationGenerate = function () {
  return Math.floor((Math.random() * MAP.offsetWidth));
};

// Рандом для координаты y метки на карте
var yLocationGenerate = function () {
  return Math.floor((130 + Math.random() * 501));
};

var adverts = [];
var advertsGenerate = function () {
  for (var i = 0; i < ADVERTS_AMOUNT; i++) {
    adverts.push(
        {
          author: {
            avatar: avatars[i]
          },
          offer: {
            title: 'title' + i,
            address: locationGenerate() + ', ' + locationGenerate(),
            price: priceGenerate(),
            type: typeGenerate(),
            rooms: roomsGenerate(),
            guests: guestsGenerate(),
            checkin: checkinGenerate(),
            checkout: checkoutGenerate(),
            features: featuresGenerate(),
            description: 'description',
            photos: photosGenerate()
          },
          location: {
            x: xLocationGenerate(),
            y: yLocationGenerate()
          }
        }
    );
  }
};

advertsGenerate();

var mapVisibilityEnabled = function () {
  MAP.classList.remove('map--faded');
};

mapVisibilityEnabled();

var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');
var listElement = document.querySelector('.map__pins');

// Создание DOM элемента на основе JS объекта
var renderCard = function (card) {
  var cardElement = cardTemplate.cloneNode(true);

  cardTemplate.querySelector('.popup__title').textContent = card.offer.title;

  return cardElement;
};

// Заполнение блока DOM-элементами на основе массива JS-объектов
var fragment = document.createDocumentFragment();
adverts.forEach(function (card) {
  fragment.appendChild(renderCard(card));
});
listElement.appendChild(fragment);
