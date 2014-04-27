
(function( $ ) {
    var img = null;
    var canvas = null;

    var methods = {
        init: function(options) {
            options = $.extend({}, $.fn.imageUpl.defaults, options);

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

                $this.hide();

                var dropbox = $($this.data('drop-zone'));

                dropbox.bind(
                    "dragenter",
                    function(event) {
                        event.stopPropagation();
                        event.preventDefault();
                    },
                    false);

                dropbox.bind(
                    "dragover",
                    function(event) {
                        event.stopPropagation();
                        event.preventDefault();
                    },
                    false);

                dropbox.bind(
                    "drop",
                    function(event) {
                        event.stopPropagation();
                        event.preventDefault();
                    },
                    false);


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
        maxHeght: 600
    };

})( jQuery );