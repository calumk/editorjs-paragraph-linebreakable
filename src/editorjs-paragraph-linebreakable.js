/**
 * Build styles
 */
//  require('./index.css').toString();

 /**
  * Base ParagraphLineBreakable Block for the Editor.js.
  * Represents simple paragraphLineBreakable
  *
  * @author CK (team@codex.so)
  * @copyright Calumk123
  * @license The MIT License (MIT)
  */
 
 /**
  * @typedef {object} ParagraphLineBreakableConfig
  * @property {string} placeholder - placeholder for the empty paragraphLineBreakable
  * @property {boolean} preserveBlank - Whether or not to keep blank paragraphLineBreakables when saving editor data
  */
 
 /**
  * @typedef {Object} ParagraphLineBreakableData
  * @description Tool's input and output data format
  * @property {String} text — ParagraphLineBreakable's content. Can include HTML tags: <a><b><i>
  */


import style from './editorjs-paragraph-linebreakable.css'

import icon from './editorjs-paragraph-linebreakable.svg';


 class ParagraphLineBreakable {
   /**
    * Default placeholder for ParagraphLineBreakable Tool
    *
    * @return {string}
    * @constructor
    */
   static get DEFAULT_PLACEHOLDER() {
     return 'Hello :)';
   }

   static get enableLineBreaks() {
    return true;
  }
 
   /**
    * Render plugin`s main Element and fill it with saved data
    *
    * @param {object} params - constructor params
    * @param {ParagraphLineBreakableData} params.data - previously saved data
    * @param {ParagraphLineBreakableConfig} params.config - user config for Tool
    * @param {object} params.api - editor.js api
    * @param {boolean} readOnly - read only mode flag
    */
   constructor({data, config, api, readOnly}) {
     this.api = api;
     this.readOnly = readOnly;
 
     this._CSS = {
       block: this.api.styles.block,
       wrapper: 'ce-paragraphLineBreakable'
     };
 
     if (!this.readOnly) {
       this.onKeyUp = this.onKeyUp.bind(this);
     }
 
     /**
      * Placeholder for paragraphLineBreakable if it is first Block
      * @type {string}
      */
     this._placeholder = config.placeholder ? config.placeholder : ParagraphLineBreakable.DEFAULT_PLACEHOLDER;
     this._data = {};
     this._element = this.drawView();
     this._preserveBlank = config.preserveBlank !== undefined ? config.preserveBlank : false;
 
     this.data = data;
   }
 
   /**
    * Check if text content is empty and set empty string to inner html.
    * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
    *
    * @param {KeyboardEvent} e - key up event
    */
   onKeyUp(e) {
     if (e.code !== 'Backspace' && e.code !== 'Delete') {
       return;
     }
 
     const {textContent} = this._element;
 
     if (textContent === '') {
       this._element.innerHTML = '';
     }
   }
 
   /**
    * Create Tool's view
    * @return {HTMLElement}
    * @private
    */
   drawView() {
     let div = document.createElement('DIV');
 
     div.classList.add(this._CSS.wrapper, this._CSS.block);
     div.contentEditable = false;
     div.dataset.placeholder = this.api.i18n.t(this._placeholder);
 
     if (!this.readOnly) {
       div.contentEditable = true;
       div.addEventListener('keyup', this.onKeyUp);
     }
 
     return div;
   }
 
   /**
    * Return Tool's view
    *
    * @returns {HTMLDivElement}
    */
   render() {
     return this._element;
   }
 
   /**
    * Method that specified how to merge two Text blocks.
    * Called by Editor.js by backspace at the beginning of the Block
    * @param {ParagraphLineBreakableData} data
    * @public
    */
   merge(data) {
     let newData = {
       text : this.data.text + data.text
     };
 
     this.data = newData;
   }
 
   /**
    * Validate ParagraphLineBreakable block data:
    * - check for emptiness
    *
    * @param {ParagraphLineBreakableData} savedData — data received after saving
    * @returns {boolean} false if saved data is not correct, otherwise true
    * @public
    */
   validate(savedData) {
     if (savedData.text.trim() === '' && !this._preserveBlank) {
       return false;
     }
 
     return true;
   }
 
   /**
    * Extract Tool's data from the view
    * @param {HTMLDivElement} toolsContent - ParagraphLineBreakable tools rendered view
    * @returns {ParagraphLineBreakableData} - saved data
    * @public
    */
   save(toolsContent) {
     return {
       text: toolsContent.innerHTML
     };
   }
 
   /**
    * On paste callback fired from Editor.
    *
    * @param {PasteEvent} event - event with pasted data
    */
   onPaste(event) {
     const data = {
       text: event.detail.data.innerHTML
     };
 
     this.data = data;
   }
 
   /**
    * Enable Conversion Toolbar. ParagraphLineBreakable can be converted to/from other tools
    */
   static get conversionConfig() {
     return {
       export: 'text', // to convert ParagraphLineBreakable to other block, use 'text' property of saved data
       import: 'text' // to covert other block's exported string to ParagraphLineBreakable, fill 'text' property of tool data
     };
   }
 
   /**
    * Sanitizer rules
    */
   static get sanitize() {
     return {
       text: {
         br: true,
         div: true,
       }
     };
   }
 
   /**
    * Returns true to notify the core that read-only mode is supported
    *
    * @return {boolean}
    */
   static get isReadOnlySupported() {
     return true;
   }
 
   /**
    * Get current Tools`s data
    * @returns {ParagraphLineBreakableData} Current data
    * @private
    */
   get data() {
     let text = this._element.innerHTML;
 
     this._data.text = text;
 
     return this._data;
   }
 
   /**
    * Store data in plugin:
    * - at the this._data property
    * - at the HTML
    *
    * @param {ParagraphLineBreakableData} data — data to set
    * @private
    */
   set data(data) {
     this._data = data || {};
 
     this._element.innerHTML = this._data.text || '';
   }
 
   /**
    * Used by Editor paste handling API.
    * Provides configuration to handle P tags.
    *
    * @returns {{tags: string[]}}
    */
   static get pasteConfig() {
     return {
       tags: [ 'P' ]
     };
   }
 
   /**
    * Icon and title for displaying at the Toolbox
    *
    * @return {{icon: string, title: string}}
    */
   static get toolbox() {
     return {
       icon: icon,
       title: 'Paragraph'
     };
   }
 }
 
export { ParagraphLineBreakable as default }