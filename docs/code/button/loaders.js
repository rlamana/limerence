function start(button) {
    button.progress = 5;
    (function run() {
        if(button.state === 'progress') {
            button.progress += 5;
            setTimeout(run, 200);
        }
    })();
}