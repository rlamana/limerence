function run(button) {
    button.start();

    (function run() {
        if(button.state !== 'progress')
            return;

        button.progress += 5;
        setTimeout(run, 200);
    })();
}
