'use strict';

var describeEditor = require('./commons').describeEditor;

var XMLEditor = require('app/editor/xml-editor');

var initialXML = require('app/tabs/bpmn/initial.bpmn'),
    otherXML = require('test/fixtures/other.bpmn');

var select = require('test/helper/vdom').select,
    render = require('test/helper/vdom').render;

function createEditor() {
  return new XMLEditor({});
}


describeEditor('XMLEditor', {
  createEditor: createEditor,
  initialXML: initialXML,
  otherXML: otherXML,
  globalUndo: true
});


describe('XMLEditor', function() {

  var editor;

  beforeEach(function() {
    editor = new XMLEditor({});
  });


  it('should initialize codemirror', function(done) {

    // given
    var $el = document.createElement('div');

    editor.once('shown', function() {

      // then
      // codemirror got initialized
      expect(editor.codemirror).to.exist;

      done();
    });

    // when
    editor.mountEditor($el);
  });


  describe('history', function() {

    function getXML(editor) {
      return editor.codemirror.getValue();
    }


    it('should append to history on new XML', function(done) {

      // given
      var newXML = otherXML;

      var $el = document.createElement('div');

      // when
      editor.once('shown', function() {

        editor.once('updated', function(context) {

          // when
          // shouldn't change beyond first import
          // (beginning of history)
          editor.triggerAction('undo');
          editor.triggerAction('undo');
          editor.triggerAction('undo');

          // then
          expect(getXML(editor)).to.equal(initialXML);

          // when
          editor.triggerAction('redo');

          // then
          expect(getXML(editor)).to.equal(newXML);

          done();
        });

        // updating to new file
        editor.setXML(newXML);
      });

      editor.setXML(initialXML);
      editor.mountEditor($el);
    });

  });


  describe('history warning overlay', function() {


    it('should show history warning overlay on dirty if not dismissed before', function() {

      // given
      editor.getCodeMirror().setValue('foo');
      editor.updateState();

      // when
      var tree = render(editor);

      // then
      expect(select('[ref=warnings-overlay]', tree)).to.exist;
    });


    it('should not show history warning overlay on dirty if dismissed before', function() {

      // given
      editor.showHistoryWarning = false;
      editor.getCodeMirror().setValue('foo');
      editor.updateState();

      // when
      var tree = render(editor);

      // then
      expect(select('[ref=warnings-overlay]', tree)).not.to.exist;
    });


    it('should close history warning overlay', function() {

      // given
      editor.getCodeMirror().setValue('foo');
      editor.updateState();
      render(editor);

      // when
      editor.hideHistoryWarning();
      var tree = render(editor);

      // then
      expect(select('[ref=warnings-overlay]', tree)).not.to.exist;
    });

  });

});
