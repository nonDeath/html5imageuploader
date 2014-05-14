
(function( $ ) {


    var methods = {
        init: function(options) {
            // Check for the various File API support.
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                // Great success! All the File APIs are supported.
            } else {
              alert('The File APIs are not fully supported in this browser.');
            }

            options = $.extend({}, $.fn.imageUpl.defaults, options);

            return this.each(function() {

                self = $(this);

                self.data("options", options);

                self.bind("change", eventsHandlers.change);

                if(!self.attr('type') || self.attr('type') != "file") {
                    throw "A input type file is required.";
                }
            });
        },
        upload: function() {
            helpers.upload(this);
        }
    };

    // private things
    var eventsHandlers = {
        change: function(event) {

            event.preventDefault();
            helpers.loadFiles(event.target);
        }
    };

    var helpers = {
        getOptions: function(curObj) {
            var options = null;
            curObj = $(curObj);
            options = curObj.data("options");

            return $.extend(
                options,
                {
                    dropZone: curObj.data("drop-zone"),
                    preview: curObj.data("preview")
                }
            );
        },
        loadFiles: function(curObj) {

            var files = curObj.files,
                $curObj = $(curObj),
                options = helpers.getOptions(curObj),
                url = window.URL || window.webkitURL,
                objUrl = url.createObjectURL || false,
                count = 0;

            for(var i = 0; i < files.length; i++) {
                if(this.isValidFile(files[i], options)) {

                    if(objUrl) {
                        this.loadFile(url.createObjectURL(files[i]), options, files[i]);
                    } else {
                        var reader = new FileReader();

                        reader.readAsDataURL(files[i]);
                        reader.addEventListener(
                            "onload",
                            function(e) {
                                this.loadFile(e.target.result, options, files[i]);
                            }
                        );
                    }

                    count++;
                }
            }

            return count;
        },
        loadFile: function(file, options, apiFile) {
            if(!this.isValidFile(file)) {
                return false;
            }
            var img = new Image(),
                self = this;
            img.src = file;

            img.onload = function(e) {
                var canvas = self.imageToCanvas(this, options);

                self.addToPreview(canvas.toDataURL(apiFile.type), options.preview, apiFile);
                options.fileLoaded(file, apiFile);
            };

        },
        imageToCanvas: function(img, options) {
            var dimensions = this.resize(img.width, img.height, options.maxWidth, options.maxHeight),
                c = document.createElement("canvas"),
                cx = c.getContext("2d");

            c.width = options.maxWidth;
            c.height = options.maxHeight;

            if(options.crop) {
                c.width = dimensions.w;
                c.height = dimensions.h;
                dimensions.x = 0;
                dimensions.y = 0;
            }

            cx.drawImage(img, dimensions.x, dimensions.y, dimensions.w, dimensions.h);

            return c;
        },
        addToPreview: function(url, destiny, apiFile) {

            if(!url) {
                return false;
            }
            var tbn = new Image();
            tbn.src = url;

            $("#" + destiny).children().replaceWith($(tbn).data("file-type", apiFile.type));
        },
        resize: function(imgW, imgH, tbnW, tbnH) {

            var w = 0, h = 0, x = 0, y = 0,
                wr = imgW / tbnW,
                hr = imgH / tbnH,
                maxR = Math.max(wr, hr);
            if(maxR > 1) {
                w = imgW / maxR;
                h = imgH / maxR;
            } else {
                w = imgW;
                h = imgH;
            }
            x = (tbnW - w ) / 2;
            y = (tbnH - h ) / 2;

            return { w:w, h:h, x:x, y:y };
        },
        isValidFile: function(file, options) {
            return true;
        },
        validate: function(validator) {

            if(!validator) {
                return true;
            }

            if(validator.validate()) {
                return true;
            }
            return false;
        },
        upload: function(obj) {

            var $obj = $(obj),
                options = this.getOptions(obj);

            if(!options.url) {
                return false;
            }

            if(!this.validate(options.validator)) {
                return false;
            }

            if(!!window.FormData) {

                var formData = null,
                    theJqImage = $("#" + $obj.data("preview") + " > img"),
                    form = $obj.parent("form");


                options.beforeSend();

                if(form.length > 0) {
                    $obj.val("");
                    formData = new FormData(form[0]);
                } else {
                    formData = new FormData();
                }

                formData.append($obj.attr("name"), theJqImage.attr("src"));
                formData.append("type", theJqImage.data("file-type"));

                var xhr = new XMLHttpRequest();
                xhr.open('POST', options.url);

                if($obj.data("progress")) {
                    var progress = $("#" + $obj.data("progress"));

                    xhr.upload.onprogress = function(event) {
                        if(event.lengthComputable) {
                            var complete = (event.loaded / event.total * 100 | 0);
                            progress.val(complete).html(complete);
                        }
                    };

                    xhr.onload = function(event) {
                        progress.val(100).html("100");
                        options.afterUpdate(this.responseText);
                    };
                }
                xhr.send(formData);

            } else {
                throw "FormData is not supported!";
            }
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
        url: null,
        maxFileSize: "2000",
        maxWidth: 800,
        maxHeight: 600,
        crop: true,
        acceptedTypes: [
            "image/jpeg",
            "image/png"
        ],
        fileLoaded: function(file, fileAPI) {},
        beforeSend: function() {},
        afterUpdate: function(data) {}
    };

})( jQuery );