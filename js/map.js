'use strict';

window.map = (function () {

  /**
   * Перемешивание массива по алгоритму Фишера — Йетса и уменьшение длины массива до 5 элементов
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
    if (array.length > 5) {
      array.length = 5;
    }
    return array;
  };

  /**
   * Возвращает массив с добавлением индексного объекта и подготавливает к выводу фотографий
   * @param {Array} array - исходный массив
   * @return {Array} array - дополненный массив
   */
  var extendArray = function (array) {
    shuffleArray(array);
    for (var i = 0; i < array.length; i++) {
      if (array[i].offer.photos.length === 0) {
        array[i].offer.photos = false;
      }
      array[i].index = i;
    }
    return array;
  };

  return {
    /**
     * Заполнение блоков DOM-элементами на основе массива JS-объектов
     * @param  {Array} advert - элемент массива объектов, содержащий полученные данные для карточек и пинов
     */
    pushCardsPins: function (advert) {
      var cardElements = document.querySelectorAll('.map__card.popup');
      if (cardElements.length > 0) {
        cardElements.forEach(function (item) {
          item.remove();
        });
      }
      var pinsElements = document.querySelectorAll('.map__pin--main ~ .map__pin');
      if (pinsElements.length > 0) {
        pinsElements.forEach(function (item) {
          item.remove();
        });
      }

      extendArray(advert);
      var fragmentCard = document.createDocumentFragment();
      var fragmentPin = document.createDocumentFragment();
      var filterElement = document.querySelector('.map__filters-container');
      var mainPin = document.querySelector('.map__pin--main');

      advert.forEach(function (card) {
        fragmentCard.appendChild(window.card.render(card));
        fragmentPin.appendChild(window.pin.render(card));
      });
      filterElement.before(fragmentCard);
      mainPin.after(fragmentPin);
    },
  };
})();
