/**
 * jQuery plugin: simpleColorPicker
 *  this plugin creates a simple drop down color picker that the user can modify to their needs
 *  returns chosen color that user defines what to do with in onChoose
 *
 * @author johng
 * @version 1.0 - 10/3/12
 * @version 1.1 - 11/19/12 - added hex input
 *
 * @param options
 *  object of options that user can pass in to configure the display of the color picker
 *      colors: (array) colors to be put in the picker, colors are stored in the title attribute as string
 *      columns: (int||string) the number of columns of colors to create
 *      hexInput: (boolean) whether or not to show hexadecimal color input
 *      onChoose: (function) callback function executed when a color is chosen
 *          params passed in -> (color,event,[target element],[picker])
 *      onShow: (function) callback function executed when the picker is shown
 *          params passed in -> (event,[target element],[picker])
 *      onHide: (function) callback function executed when the picker is hidden
 *          params passed in -> (event,[target element],[picker])
 *      pickerId: (string) the id to apply to the color picker
 */

(function($){
    $.fn.simpleColorPicker = function(options){
        var self = this;
        
        //setup the default settings
        this.defaults = {
            colors:['#FFF','#CCC','#C0C0C0','#999','#666','#333','#000','#FCC','#F66','#F00','#C00','#900','#600','#300','#FC9','#F96','#F90','#F60','#C60','#930','#630','#FF9','#FF6','#FC6','#FC3','#C93','#963','#633','#FFC','#FF3','#FF0','#FC0','#990','#660','#330','#9F9','#6F9','#3F3','#3C0','#090','#060','#030','#9FF','#3FF','#6CC','#0CC','#399','#366','#033','#CFF','#6FF','#3CF','#36F','#33F','#009','#006','#CCF','#99F','#66C','#63F','#60C','#339','#309','#FCF','#F9F','#C6C','#C3C','#939','#636','#303'],
            columns: 7,
            hexInput: true,
            onChoose: null,
            onShow: null,
            onHide: null,
            pickerId: 'simple-picker'
        };

        //utilities
        this.isTouch = (/ipad|ipod|iphone|android/i).test(navigator.userAgent);                
        
        //events
        this.CLICK = self.isTouch ? 'touchend' : 'click';
        this.KEYUP = 'keyup';
                
        //extend the defaults to the options passed in
        this.options = $.extend({},this.defaults,options);
        
        //store and create the picker
        this.picker;
        this.hexRow;
        
        //store the element targeted
        this.element = null;
        this.elementInfo = {};
        this.prevElement = null;
        
        //creates the colors and rows inside the picker
        this.createPicker = function(){
            self.picker = $('<div></div>');
            self.picker.addClass('scp-color-picker');
            self.picker.attr('id',self.options.pickerId);
            
            //create the samples holder
            var samples = $('<div></div>');
            samples.addClass('scp-samples');
            samples.appendTo(self.picker);
            
            //create each color square
            var i = 0;
            while(i < self.options.colors.length){
                
                //create the row
                var sampleRow = $('<div></div>');
                sampleRow.addClass('scp-sample-row');
                
                for(var j = 0; j < self.options.columns; j++){
                    if(!self.options.colors[i]) break;
                    
                    //create the sample
                    var sample = $('<div></div>');
                    sample.addClass('scp-sample-color');
                    sample.attr('title',self.options.colors[i]);
                    sample.css('background-color',self.options.colors[i]);
                    sample.bind(self.CLICK,self.colorSelect);
                    
                    //append the sample to the row
                    sampleRow.append(sample);
                    i++;
                }
                
                //add the row to the picker
                samples.append(sampleRow);
            }
            
            //add the hex input
            if(self.options.hexInput){
                self.hexRow = $('<div></div>');
                self.hexRow.addClass('scp-hexrow');
                self.hexRow.bind(self.CLICK,function(event){
                    //stop the picker from closing when clicking on the row
                    event.preventDefault();
                    event.stopPropagation();
                });
                
                var hexRowLabel = $('<div></div>');
                hexRowLabel.addClass('scp-hexrow-label');
                hexRowLabel.text('#');
                hexRowLabel.appendTo(self.hexRow);
                
                var hexRowInput = $('<input />');
                hexRowInput.attr('type','text');
                hexRowInput.attr('maxlength',6);
                hexRowInput.val('000000');
                hexRowInput.addClass('scp-hexrow-input');
                hexRowInput.appendTo(self.hexRow);
                hexRowInput.bind(self.KEYUP,self.inputHex);
                hexRowInput.bind(self.CLICK,self.inputHex);
                
                var hexRowSample = $('<div></div>');
                hexRowSample.attr('title','#000');
                hexRowSample.addClass('scp-hexrow-sample');
                hexRowSample.bind(self.CLICK,self.colorSelect);
                hexRowSample.appendTo(self.hexRow);
                
                self.picker.append(self.hexRow);
            }
            
            //add the picker to the page
            self.picker.appendTo(document.body);            
        }
        
        //display the picker
        this.showPicker = function(event,targ){

            //stop the propagation
            event.stopPropagation();
            
            //show the picker
            if(self.element != targ){
                self.element = targ;

                //position the picker by the element
                self.positionPicker();

                self.picker.show();
            }
            else
                self.hidePicker(event);
                
            //user callback
            if(typeof self.options.onShow == 'function') self.options.onShow(event,$(self.element),self.picker);
        }
        
        //positions the picker according the the element
        this.positionPicker = function(){
            //get the current element info
            self.calcElementInfo();
            
            //position the picker to the lower left of the element
            self.picker.css({
                left: self.elementInfo.offset.left,
                top: self.elementInfo.offset.bottom
            });
        }
        
        //hide the picker
        this.hidePicker = function(event){
            //check that picker is visible before continuing
            if(!self.picker.is(':visible')) return;
            
            //stop the propagation
            event.stopPropagation();
            
            //remove the element
            self.prevElement = self.element;
            self.element = null;            
            
            //hide the picker
            self.picker.hide();
            
            //user callback
            if(typeof self.options.onHide == 'function') self.options.onHide(event,$(self.prevElement),self.picker);
        }
        
        //function called on color selection
        this.colorSelect = function(event){
            //stop the propagation
            event.stopPropagation();
            
            var color = $(this).attr('title');
            
            //hide the picker
            self.hidePicker(event);
            
            //run use method or just return color
            if(typeof self.options.onChoose == 'function') 
                self.options.onChoose(color,event,$(self.element),self.picker);
            else 
                return color;
        }
        
        //called on events bound to the hex input
        this.inputHex = function(event){
            var et;
            
            et = event.type;
            if(et == 'click'){
                event.preventDefault();
                event.stopPropagation();
            }
            
            if(et.match(/key/)){
                var kc, hrs, val;
                
                kc = event.keyCode;
                hrs = self.hexRow.find('.scp-hexrow-sample');
                switch(kc){
                    case 13:
                        event.preventDefault();
                        hrs.click();
                        break;
                    default:
                        val = self.hexRow.find('input').val();
                        hrs.css('background','#' + val);
                        hrs.attr('title','#' + val);
                        break;
                }
            }
        };
        
        //corrects all options to be used properly
        this.correctOptions = function(){
            //columns
            self.options.columns = parseInt(self.options.columns);
            if(self.options.colors.length < self.options.columns)
                self.options.columns = self.options.colors.length;
        }
        
        //sets the information needed for the element
        this.calcElementInfo = function(){
            self.elementInfo = {
                offset:{
                    top: $(self.element).offset().top,
                    right: $(self.element).offset().left + $(self.element).outerWidth(),
                    bottom: $(self.element).offset().top + $(self.element).outerHeight(),
                    left: $(self.element).offset().left
                }
            }
        }
        
        //hide the picker when clicking outside
        self.correctOptions();
        self.createPicker();
        $(document).bind(self.CLICK,self.hidePicker);
        
        return this.each(function(){
            $(this).click(function(event){
                self.showPicker(event,this);
            });
        });
    
    };
})(jQuery);