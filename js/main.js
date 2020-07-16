'use strict';

(function () {

  var DEFAULT_FILTER_VALUE = 'any';
  var FilterPrice = {
    MIN: 10000,
    MAX: 50000
  };
  var PriceValue = {
    LOW: 'low',
    HIGH: 'high',
    MIDDLE: 'middle'
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

  var adForm = document.querySelector('.ad-form');
  /**
   * Вызывает функцию отправки данных на сервер
   * @param {Object} evt - событие submit
   */
  var onSubmitPress = function (evt) {
    window.backend.save(new FormData(adForm), function () {
      setActiveState(false);
      renderSuccessWindow();
    }, errorHandler);
    evt.preventDefault();
  };

  /**
   * Вызывает функцию сброса страницы в начальное состояние
   */
  var onResetPress = function () {
    setActiveState(false);
  };

  /**
   * Формирование и вывод сообщения об ошибке
   */
  var errorHandler = function () {
    renderErrorWindow();
  };

  /**
   * Закрытие окна успешной отправки или ошибки во время отправки данных
   * @param {boolean} flag - true - закрытие окна успешной отправки, false - закрытие окна с ошибкой
   */
  var closeEventPopup = function (flag) {
    if (flag) {
      document.querySelector('.success').remove();
      document.removeEventListener('keydown', onPopupDataEscPress);
    } else {
      document.querySelector('.error').remove();
      document.removeEventListener('keydown', onPopupDataEscPress);
    }
    document.removeEventListener('mousedown', onPopupMousePress);
  };

  /**
   * Проверка на клавишу ESC и запуск функции скрытия окна ошибки или окна успешной отправки
   * @param {Object} evt - нажатая клавиша
   */
  var onPopupDataEscPress = function (evt) {
    if (evt.key === 'Escape' && document.querySelector('.success') !== null) {
      evt.preventDefault();
      closeEventPopup(true);
    } else if (evt.key === 'Escape' && document.querySelector('.error') !== null) {
      closeEventPopup(false);
    }
  };

  /**
   * Проверка на левую кнопку мыши и запуск функции скрытия окна успешной отправки или ошибки
   * @param {Object} evt - нажатая кнопка мыши
   */
  var onPopupMousePress = function (evt) {
    if (evt.button === 0 && evt.target.classList.value !== 'success__message' && document.querySelector('.success') !== null) {
      closeEventPopup(true);
    } else if (evt.button === 0 && evt.target.classList.value !== 'error__message' && document.querySelector('.error') !== null) {
      closeEventPopup(false);
    }
  };

  /**
   * Вызов окна успешной отправки данных
   */
  var renderSuccessWindow = function () {
    var successWindowTemplate = document.querySelector('#success').content.querySelector('.success');
    var successWindowElement = successWindowTemplate.cloneNode(true);
    var main = document.querySelector('main');
    main.appendChild(successWindowElement);
    document.addEventListener('keydown', onPopupDataEscPress);
    document.addEventListener('mousedown', onPopupMousePress);
  };

  /**
   * Вызов окна ошибки отправки данных
   */
  var renderErrorWindow = function () {
    var errorWindowTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorWindowElement = errorWindowTemplate.cloneNode(true);
    var main = document.querySelector('main');
    main.appendChild(errorWindowElement);
    var errorButton = document.querySelector('.error__button');
    errorButton.addEventListener('mousedown', function (evt) {
      if (evt.button === 0) {
        document.querySelector('.error').remove();
        document.removeEventListener('mousedown', onPopupMousePress);
        document.removeEventListener('keydown', onPopupDataEscPress);
      }
    });
    document.addEventListener('keydown', onPopupDataEscPress);
    document.addEventListener('mousedown', onPopupMousePress);
  };

  /**
   * Получение дефолтных значений для сброса
   */
  var inputTimeIn = document.querySelector('#timein');
  var inputTimeOut = document.querySelector('#timeout');
  var inputCapacity = document.querySelector('#capacity');
  var inputRoomNumber = document.querySelector('#room_number');
  var inputRoomType = document.querySelector('#type');
  var mapPinMain = document.querySelector('.map__pin--main');
  var defaultMainPinPosition = mapPinMain.style.cssText;
  var defaultInputRoomType = inputRoomType.value;
  var defaultInputRoomNumber = inputRoomNumber.value;
  var defaultInputCapacity = inputCapacity.value;
  var defaultInputTimeIn = inputTimeIn.value;
  var defaultInputTimeOut = inputTimeOut.value;

  /**
   * Переключает страницу из неактивного состояния в активное и наоборот
   * @param  {boolean} flag - true - активировать страницу, false - деактивировать
   */
  var setActiveState = function (flag) {
    var map = document.querySelector('.map');
    var mapFilter = document.querySelectorAll('.map__filter');
    var mapFeatures = document.querySelector('.map__features');
    var adFormHeader = document.querySelector('.ad-form-header');
    var adFormElement = document.querySelectorAll('.ad-form__element');
    var inputAddress = document.querySelector('#address');

    if (flag) {
      /**
       * Заполнение DOM-элементами при успешном получении данных
       * @param  {Array} cards - массив, содержащий загруженные данные
       */
      var successHandler = function (cards) {
        var DEFAULT_PIN_NUMBERS = 5;
        window.map.pushCardsPins(cards.slice(0, DEFAULT_PIN_NUMBERS));

        /**
         * Вызов и удаление событий карточки и пинов
         */
        var popupEvents = function () {
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

        popupEvents();

        mapFilter.forEach(function (item) {
          item.removeAttribute('disabled');
        });

        /**
         * Фильтрация с повторным рендерингом карточек и пинов
         */
        var onInputChange = window.debounce(function () {
          var getCheckedFilters = function (items) {
            var filterType = true;
            var filterPrice = true;
            var filterRooms = true;
            var filterGuests = true;
            var filterFeatures = true;

            if (inputHousingType.value !== DEFAULT_FILTER_VALUE) {
              filterType = items.offer.type === inputHousingType.value;
            }

            if (inputHousingPrice.value !== DEFAULT_FILTER_VALUE) {
              var selectedPrice;
              if (items.offer.price <= FilterPrice.MAX && items.offer.price >= FilterPrice.MIN) {
                selectedPrice = PriceValue.MIDDLE;
              } else if (items.offer.price < FilterPrice.MIN) {
                selectedPrice = PriceValue.LOW;
              } else {
                selectedPrice = PriceValue.HIGH;
              }
              filterPrice = selectedPrice === inputHousingPrice.value;
            }

            if (inputHousingRooms.value !== DEFAULT_FILTER_VALUE) {
              filterRooms = items.offer.rooms.toString() === inputHousingRooms.value;
            }

            if (inputHousingGuests.value !== DEFAULT_FILTER_VALUE) {
              filterGuests = items.offer.guests.toString() === inputHousingGuests.value;
            }

            var checkedFeatures = inputHousingFeatures.querySelectorAll('input[name="features"]:checked');
            if (checkedFeatures.length) {
              checkedFeatures.forEach(function (item) {
                if (items.offer.features.indexOf(item.value) === -1) {
                  filterFeatures = false;
                }
              });
            }

            return filterType && filterPrice && filterRooms && filterGuests && filterFeatures;
          };
          window.map.pushCardsPins(cards.filter(getCheckedFilters).slice(0, DEFAULT_PIN_NUMBERS));
          popupEvents();
        });

        var inputFilters = document.querySelector('.map__filters');
        inputFilters.addEventListener('change', onInputChange);

        var inputHousingType = document.querySelector('#housing-type');
        var inputHousingPrice = document.querySelector('#housing-price');
        var inputHousingRooms = document.querySelector('#housing-rooms');
        var inputHousingGuests = document.querySelector('#housing-guests');
        var inputHousingFeatures = document.querySelector('#housing-features');
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

      adForm.addEventListener('submit', onSubmitPress);
      adForm.addEventListener('reset', onResetPress);
    } else {
      var inputTitle = document.querySelector('#title');
      var inputPrice = document.querySelector('#price');
      var inputDescription = document.querySelector('#description');
      var inputCheckbox = document.querySelectorAll('.feature__checkbox');
      inputCheckbox.forEach(function (item) {
        item.checked = false;
      });
      inputTitle.value = '';
      inputPrice.value = '';
      inputDescription.value = '';
      mapPinMain.style.cssText = defaultMainPinPosition;
      inputRoomType.value = defaultInputRoomType;
      inputRoomNumber.value = defaultInputRoomNumber;
      inputCapacity.value = defaultInputCapacity;
      inputTimeIn.value = defaultInputTimeIn;
      inputTimeOut.value = defaultInputTimeOut;
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
      adForm.removeEventListener('submit', onSubmitPress);
      adForm.removeEventListener('reset', onResetPress);
    }
  };

  setActiveState(false);
})();
