Simple Color Picker jQuery Plugin
=================================

This plugin creates opens simple drop down color picker when the targeted element is clicked on. The color picker returns the chosen color to the user defined onChoose function. Hold tight, more details on that to come.

Requirements
------------

- jQuery v1.4.2+


How to Use
----------

Include these files in your project:
- jquery.simpleColorPicker.min.js
- jquery.simpleColorPicker.css

Call the simplColorPicker method on a targeted element: 

    $('.example').simpleColorPicker();


Options
-------

**colors (array)** _default: similar to Google's color palette_

An array of string hexadecimal color values to be put into the picker. Each color will be put into the title attribute of the swatch as a string. There is a built in sampling of colors that this option will over write.


**columns (int|string)** _default: 7_

The number of columns the picker should contain.


**hexInput (boolean)** _default: true_

Whether or not to allow a hexadecimal input field for assigning a custom color.


**pickerId (string)** _default: 'simple-picker'_

The ID to apply to the color picker.

**Example:**

    var options = {
        colors: ['#FFF', '#000'],
        columns: 2,
        hexInput: true,
        pickerId: 
    };
    
    var picker = $('.example').simpleColorPicker(options);


Callbacks
---------

**onChoose (function)**

This is the function that is executed when the color is chosen. 

The onChoose function receives four parameters: (color, event, target, picker)
- **color:** the color chosen
- **event:** the triggered event passed from jQuery
- **target:** the jQuery object of the element(s) targeted for the help tip
- **picker:** the jQuery object of the color picker


**onHide (function)**

This function is called when the picker is hidden.

The onHide function receives three parameters: (event, target, picker)
- **event:** the triggered event passed from jQuery
- **target:** the jQuery object of the element(s) targeted for the help tip
- **picker:** the jQuery object of the color picker


**onShow (function)**

This function is called when the picker is shown.

The onShow function receives three parameters: (event, target, picker)
- **event:** the triggered event passed from jQuery
- **target:** the jQuery object of the element(s) targeted for the help tip
- **picker:** the jQuery object of the color picker

**Example:**

    var onChooseCallback = function(color, event, target, picker) {
        //do something with the color
    };
    
    var onHideCallback = function(color, event, target, picker) {
        //do something when color picker is hidden
    };

    var onShowCallback = function(color, event, target, picker) {
        //do something when color picker is shown
    };
    
    var callbacks = {
        'onChoose': onChooseCallback,
        'onHide': onHideCallback,
        'onShow': onShowCallback
    };

    var picker = $('.example').simpleColorPicker(callbacks);
    