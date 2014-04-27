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




});

test("default values setting test", function() {
    ok($.fn.imageUpl.defaults, "defaults set up correctly.");
    equal($.fn.imageUpl.defaults.maxFileSize, "2000", "defaults global options are set up.");
    $.fn.imageUpl.defaults.maxFileSize = "3000";
    equal($.fn.imageUpl.defaults.maxFileSize, "3000", "defaults global options can be changed.");
});
