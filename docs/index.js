"use strict";

document.addEventListener("DOMContentLoaded", function() {

    // Documentation details
    var details = document.querySelectorAll('.details');
    Array.prototype.forEach.call(details, function(element) {
        element.style.display = 'none';

        element.addEventListener('click', function() {
            console.log('hello');
        })
    });
});