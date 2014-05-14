test("init test", function() {
    var imgUpl = $.fn.imageUpl("init");

    ok(typeof(imgUpl) === "object", "Pased! " + typeof(imgUpl) + " returned.");

    equal($("#img").imageUpl().attr("type"), "file", $("#img").imageUpl().attr("type") + " returned.");

    throws(
        // the callback
        function() {
            $(document.createElement("img")).imageUpl();
        },
        // test the message that will be returned.
        /file/,
        // the test case message.
        "Something bad was happened, a file input is required here."
    );

    ok(!$.fn.imageUpl.init, "No publics methods accesible in the plugin.");

    ok(!$(document.createElement("img")).imageUpl.init, "No publics methods callable with a element in the plugin.");
});

test("default values setting test", function() {
    ok($.fn.imageUpl.defaults, "defaults set up correctly.");
    equal($.fn.imageUpl.defaults.maxFileSize, "2000", "defaults global options are set up.");
    $.fn.imageUpl.defaults.maxFileSize = "3000";
    equal($.fn.imageUpl.defaults.maxFileSize, "3000", "defaults global options can be changed.");
});

test("Options setting test", function() {
    var imgUpl = $("#img").imageUpl();

    propEqual($("#img").data("options"), $.fn.imageUpl.defaults, "options are equals to defaults.");

    var expected = {
            url: null,
            maxFileSize: "3000",
            maxWidth: 640,
            maxHeight: 480,
            crop: true,
            acceptedTypes: [
                "image/jpeg",
                "image/gif"
            ],
            fileLoaded: function(file) {},
            afterUpdate: function() {},
            beforeSend: function() {}
        },
        file = $('<input type="file">'),
        imgUpl2 = file.imageUpl({
            maxFileSize: "3000",
            maxWidth: 640,
            maxHeight: 480,
            acceptedTypes: [
                "image/jpeg",
                "image/gif"
            ]
        });

    propEqual(file.data("options"), expected, "options are equals to settings.");
});