
(function( $ ) {

    var methods = {
        options: null,
        init: function(options) {
            this.options = $.extend({}, $.fn.imageUpl.defaults, options);

            // Check for the various File API support.
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                // Great success! All the File APIs are supported.
            } else {
              alert('The File APIs are not fully supported in this browser.');
            }

            return this.each(function() {

                $this = $(this);



                if(!$this.attr('type') || $this.attr('type') != "file") {
                    throw "A input type file is required.";
                }


            });
        }
    };

    $.fn.imageUpl = function(method) {

        if(methods[method]) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if(typeof method === 'object' || ! method) {
            return methods.init.apply( this, arguments );
        }
        else {
            $.error('Method ' + method + ' does not exists in imageUpl.');
        }
    };

    $.fn.imageUpl.defaults = {
        maxFileSize: "2000",
        maxWidth: 800,
        maxHeight: 600,
        acceptedTypes: [
            "image/jpeg",
            "image/png",
            "image/gif"
        ],
        fileLoaded: function(file) {}
    };

})( jQuery );