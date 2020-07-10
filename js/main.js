'use strict';

(function () {
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
    var mapPinMain = document.querySelector('.map__pin--main');
    var inputAddress = document.querySelector('#address');
    var inputRoomNumber = document.querySelector('#room_number');
    var inputRoomType = document.querySelector('#type');
    var inputTimeIn = document.querySelector('#timein');
    var inputTimeOut = document.querySelector('#timeout');
    if (flag) {
      /**
       * Заполнение DOM-элементами при успешном получении данных
       * @param  {Array} cards - массив, содержащий загруженные данные
       */
      var successHandler = function (cards) {
        window.map.pushPins(cards);
        window.map.pushCard(cards);

        var mapCards = document.querySelectorAll('.map__card');
        var popupClose = document.querySelectorAll('.popup__close');
        var pins = document.querySelectorAll('.map__pin--main ~ .map__pin');

        /**
         * Скрытие окна-попапа и удаление слушателя событий
         * @param {Object} items - коллекция всех карточек-попапов
         */
        var closePopup = function (items) {
          items.forEach(function (item) {
            if (item.style.visibility === 'visible') {
              item.style.visibility = 'hidden';
            }
          });
          document.removeEventListener('keydown', onPopupEscPress);
        };

        /**
         * Проверка на клавишу ESC и запуск функции скрытия окна
         * @param {Object} evt - нажатая клавиша
         */
        var onPopupEscPress = function (evt) {
          if (evt.key === 'Escape') {
            evt.preventDefault();
            closePopup(mapCards);
          }
        };

        /**
         * Поиск нужной карточки, открытие и запуск слушателя событий на ESC
         * @param {Object} items - коллекция всех карточек-попапов
         * @param {Object} evt - нажатый пин для сравнения индексов
         */
        var openPopup = function (items, evt) {
          items.forEach(function (item) {
            if (item.dataset.index === evt.target.dataset.index) {
              item.style.visibility = 'visible';
            } else {
              item.style.visibility = 'hidden';
            }
          });
          document.addEventListener('keydown', onPopupEscPress);
        };

        popupClose.forEach(function (popup) {
          popup.addEventListener('mousedown', function (evt) {
            if (evt.button === 0) {
              closePopup(mapCards);
            }
          });
          popup.addEventListener('keydown', function (evt) {
            if (evt.key === 'Enter') {
              closePopup(mapCards);
            }
          });
        });

        pins.forEach(function (pin) {
          pin.addEventListener('mousedown', function (evt) {
            if (evt.button === 0) {
              openPopup(mapCards, evt);
            }
          });
          pin.addEventListener('keydown', function (evt) {
            if (evt.key === 'Enter') {
              openPopup(mapCards, evt);
            }
          });
        });
      };

      /**
       * Формирование и вывод сообщения об ошибке
       * @param {string} errorMessage - строка сообщение об ошибке
       */
      var errorHandler = function (errorMessage) {
        var node = document.createElement('div');
        node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
        node.style.position = 'absolute';
        node.style.left = 0;
        node.style.right = 0;
        node.style.fontSize = '30px';

        node.textContent = errorMessage;
        document.body.insertAdjacentElement('afterbegin', node);
      };

      window.backend.load(successHandler, errorHandler);

      window.form.setValidation(inputRoomNumber, true);
      window.form.setValidation(inputRoomType, true);
      window.form.setValidation(inputTimeIn, true);

      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      mapFeatures.removeAttribute('disabled');
      adFormHeader.removeAttribute('disabled');
      inputAddress.value = window.pin.getMainPinPositionX(mapPinMain) + ', ' + window.pin.getMainPinPositionY(mapPinMain);
      mapFilter.forEach(function (item) {
        item.removeAttribute('disabled');
      });
      adFormElement.forEach(function (item) {
        item.removeAttribute('disabled');
      });
      inputAddress.setAttribute('readonly', true);
      mapPinMain.removeEventListener('mousedown', onMousePressActivate);
      mapPinMain.removeEventListener('keydown', onKeyPressActivate);
      inputRoomNumber.addEventListener('change', window.form.setValidation);
      inputRoomType.addEventListener('change', window.form.setValidation);
      inputTimeIn.addEventListener('change', window.form.setValidation);
      inputTimeOut.addEventListener('change', window.form.setValidation);
      window.move.mainPin();

      /**
       * Вызывает функцию отправки данных на сервер
       * @param {Object} evt - событие submit
       */
      var submitHandler = function (evt) {
        window.backend.save(new FormData(adForm), function () {
        }, errorHandler);
        evt.preventDefault();
      };

      adForm.addEventListener('submit', submitHandler);
    } else {
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      mapFeatures.setAttribute('disabled', true);
      adFormHeader.setAttribute('disabled', true);
      inputAddress.value = window.pin.getMainPinPositionX(mapPinMain) + ', ' + window.pin.getMainPinNoneAtiveY(mapPinMain);
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
      var cards = document.querySelectorAll('.map__card');
      cards.forEach(function (item) {
        item.remove();
      });
      mapPinMain.addEventListener('mousedown', onMousePressActivate);
      mapPinMain.addEventListener('keydown', onKeyPressActivate);
    }
  };

  setActiveState(false);
})();
