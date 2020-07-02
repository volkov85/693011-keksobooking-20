'use strict';

window.data = (function () {
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

  return {
    /**
     * Генерирует массив моков, каждый элемент которого состоит из объектов
     * @param  {number} adsAmount - желаемое количевто элементов массива
     * @return {Array} adverts - готовый массив с требуемой длиной
     */
    generateAdverts: function (adsAmount) {
      var ads = [];
      for (var i = 0; i < adsAmount; i++) {
        var randomX = getRandomNumber(MapSize.WIDTH_MIN, MapSize.WIDTH_MAX);
        var randomY = getRandomNumber(MapSize.HEIGHT_MIN, MapSize.HEIGHT_MAX);
        ads.push({
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
          },
          index: i
        });
      }
      return ads;
    }
  };
})();
