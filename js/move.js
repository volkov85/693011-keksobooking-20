'use strict';

window.move = (function () {
  return {
    mainPin: function () {
      var mapPinMain = document.querySelector('.map__pin--main');
      var inputAddress = document.querySelector('#address');
      mapPinMain.addEventListener('mousedown', function (evt) {
        evt.preventDefault();
        var startCoords = {
          x: evt.clientX,
          y: evt.clientY
        };

        /**
         * Измененяет местоположение пина при движении мышью с зажатой клавишей
         * @param {Object} moveEvt событие при движении мышью
         */
        var onMouseMove = function (moveEvt) {
          moveEvt.preventDefault();

          var shift = {
            x: startCoords.x - moveEvt.clientX,
            y: startCoords.y - moveEvt.clientY
          };

          startCoords = {
            x: moveEvt.clientX,
            y: moveEvt.clientY
          };

          mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
          mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';

          inputAddress.value = window.pin.getMainPinPositionX(mapPinMain) + ', ' + window.pin.getMainPinPositionY(mapPinMain);

        };

        /**
         * При отпускании клавиши мыши удаляет слушатели событий
         * @param {Object} upEvt событие при отпускании клавиши мыши
         */
        var onMouseUp = function (upEvt) {
          upEvt.preventDefault();
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    }
  };
})();
