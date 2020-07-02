'use strict';

window.form = (function () {
  var OfferPrice = {
    PALACE: 10000,
    FLAT: 1000,
    HOUSE: 5000,
    BUNGALO: 0
  };
  var OFFER_CHECKIN_OUT = [
    '12:00',
    '13:00',
    '14:00'
  ];
  var Rooms = {
    ONE_ROOM: '1',
    TWO_RROMS: '2',
    THREE_ROOMS: '3',
    ONE_HUNDRET_ROOMS: '100'
  };
  var Capacity = {
    ONE_GUEST: '1',
    TWO_GUESTS: '2',
    THREE_GUESTS: '3',
    NO_GUESTS: '0'
  };

  /**
   * Синхронизация значений полей комнат и гостей
   * @param {Object} node - параметр либо node.value для стартовой синхронизации, либо node.target.value при изменении значения поля
   */
  var checkValidationRooms = function (node) {
    var inputCapacity = document.querySelector('#capacity');
    var capacity = document.querySelectorAll('#capacity > option');
    switch (node) {
      case Rooms.ONE_ROOM:
        capacity.forEach(function (item) {
          if (item.value !== Capacity.ONE_GUEST) {
            item.setAttribute('disabled', true);
          } else {
            item.removeAttribute('disabled');
            inputCapacity.value = Capacity.ONE_GUEST;
          }
        });
        break;
      case Rooms.TWO_RROMS:
        capacity.forEach(function (item) {
          if (item.value !== Capacity.ONE_GUEST && item.value !== Capacity.TWO_GUESTS) {
            item.setAttribute('disabled', true);
          } else {
            item.removeAttribute('disabled');
            inputCapacity.value = Capacity.TWO_GUESTS;
          }
        });
        break;
      case Rooms.THREE_ROOMS:
        capacity.forEach(function (item) {
          if (item.value === Capacity.NO_GUESTS) {
            item.setAttribute('disabled', true);
          } else {
            item.removeAttribute('disabled');
            inputCapacity.value = Capacity.THREE_GUESTS;
          }
        });
        break;
      case Rooms.ONE_HUNDRET_ROOMS:
        capacity.forEach(function (item) {
          if (item.value !== Capacity.NO_GUESTS) {
            item.setAttribute('disabled', true);
          } else {
            item.removeAttribute('disabled');
            inputCapacity.value = Capacity.NO_GUESTS;
          }
        });
    }
  };

  /**
   * Синхронизация значений полей типа жилья и цены
   * @param {Object} node - параметр либо node.value для стартовой синхронизации, либо node.target.value при изменении значения поля
   */
  var checkValidationPrice = function (node) {
    var inputPrice = document.querySelector('#price');
    Object.keys(OfferPrice).forEach(function (item) {
      if (item.toLowerCase() === node) {
        inputPrice.placeholder = OfferPrice[item];
        inputPrice.min = OfferPrice[item];
      }
    });
  };

  /**
   * Синхронизация значений полей время заезда и выезда
   * @param {Object} node - параметр либо node.value для стартовой синхронизации, либо node.target.value при изменении значения поля
   * @param {boolean} flag - флаг, отвечающий за изменение времени заезда, либо времени выезда
   */
  var checkValidationTime = function (node, flag) {
    var inputTimeOut = document.querySelector('#timeout');
    var inputTimeIn = document.querySelector('#timein');
    OFFER_CHECKIN_OUT.forEach(function (item) {
      if (item === node) {
        if (flag) {
          inputTimeOut.value = item;
        } else {
          inputTimeIn.value = item;
        }
      }
    });
  };

  return {
    /**
     * Запускает валидацию либо при активации страницы, либо при изменении поля
     * @param {Object} node - поле, которое нужно валидировать
     * @param {boolean} submit - флаг для валидации либо при активации страницы, либо при изменении поля
     */
    setValidation: function (node, submit) {
      if (!submit) {
        checkValidationRooms(node.target.value);
        checkValidationPrice(node.target.value);
        if (document.activeElement.id === 'timein') {
          checkValidationTime(node.target.value, true);
        } else {
          checkValidationTime(node.target.value, false);
        }
      } else {
        checkValidationRooms(node.value);
        checkValidationPrice(node.value);
        checkValidationTime(node.value, true);
      }
    }
  };
})();
