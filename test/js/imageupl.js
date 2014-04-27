test("init test", function() {
    var imgUpl = $.fn.imageUpl("init");

    ok(typeof(imgUpl) === "object", "Pased! " + typeof(imgUpl) + " returned.");

});

test("default values setting test", function() {
    ok($.fn.imageUpl.defaults, "defaults set up correctly.");
    equal($.fn.imageUpl.defaults.maxFileSize, "2000", "defaults global options are set up.");
    $.fn.imageUpl.defaults.maxFileSize = "3000";
    equal($.fn.imageUpl.defaults.maxFileSize, "3000", "defaults global options can be changed.");
});