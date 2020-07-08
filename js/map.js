'use strict';

window.map = (function () {
  /**
   * Возвращает массив с добавлением индексного объекта и подготавливает к выводу фотографий
   * @param {Array} array - исходный массив
   * @return {Array} array - дополненный массив
   */
  var extendArray = function (array) {
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
     * Заполнение блока card DOM-элементами на основе массива JS-объектов
     * @param  {Array} advert - элемент массива объектов, содержащий сгенерированные данные для карточки
     */
    pushCard: function (advert) {
      extendArray(advert);
      var fragment = document.createDocumentFragment();
      var listElement = document.querySelector('.map');
      var filterElement = document.querySelector('.map__filters-container');
      advert.forEach(function (card) {
        fragment.appendChild(window.card.render(card));
      });
      listElement.insertBefore(fragment, filterElement);
    },

    /**
     * Заполнение блока pins DOM-элементами на основе массива JS-объектов
     * @param  {Array} ads - массив объектов, содержащий сгенерированные данные для пина
     */
    pushPins: function (ads) {
      extendArray(ads);
      var fragment = document.createDocumentFragment();
      var listElement = document.querySelector('.map__pins');
      ads.forEach(function (card) {
        fragment.appendChild(window.pin.render(card));
      });
      listElement.appendChild(fragment);
    }
  };
})();
