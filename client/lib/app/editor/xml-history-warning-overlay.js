'use strict';

var CloseHandle = require('base/components/misc/close-handle');

var ensureOpts = require('util/ensure-opts');


function HistoryWarningsOverlay(options) {

  ensureOpts([ 'onClose' ], options);

  if (!(this instanceof HistoryWarningsOverlay)) {
    return new HistoryWarningsOverlay(options);
  }

  this.render = function() {

    var dirty = options.dirty;

    // don't return anything if editor not dirty
    if (!dirty) {
      return;
    }

    var html = (
      <div className="warnings-overlay warnings" ref="warnings-overlay">
        <div className="alert">
          Your diagrams undo history will be lost due to xml changes.

          <CloseHandle onClick={ options.onClose } ref="warnings-hide-link" />
        </div>
      </div>);

    return html;
  };
}

module.exports = HistoryWarningsOverlay;
