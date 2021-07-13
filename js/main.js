import { Spark }        from "./spark.js";

/** ========================================================================
 * start the game when page is loaded
 */
window.onload = async function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    let lastUpdate = Math.round(performance.now());
    let loopID = 0;
    let frame = 0;
    const maxDeltaTime = 1000/20;

    // static initialization of any game global state
    Spark.init();

    // create game
    const game = new Spark();
    // -- load
    await game.load();
    // -- setup
    game.setup()
    // -- start main process loop
    window.requestAnimationFrame(loop);

    function getDeltaTime(hts) {
        const dt = Math.min(maxDeltaTime, hts - lastUpdate);
        lastUpdate = hts;
        return dt;
    }

    function loop(hts) {
        frame++;
        if (frame > Number.MAX_SAFE_INTEGER) frame = 0;
        // compute delta time
        let ctx = {
            deltaTime: getDeltaTime(Math.round(hts)),
            frame: frame,
        }
        game.update(ctx);
        game.render();
        // setup 
        loopID = window.requestAnimationFrame(loop);
    }

    window.Game = game;
}
