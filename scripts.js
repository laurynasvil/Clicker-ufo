window.addEventListener("load", function () {
    let scoreBlock = document.querySelector(".main-game .score");
    let clickZone = document.querySelector(".main-game .click-zone");
    let score = 0;
    let ownedFactories = [];

    
    clickZone.onclick = function () {
        score += 10;
        scoreBlock.innerText = score;
    };

    
    function moveClickZone() {
        const gameArea = document.querySelector(".main-game");
        const maxWidth = gameArea.clientWidth - clickZone.offsetWidth;
        const maxHeight = gameArea.clientHeight - clickZone.offsetHeight;

       
        const randomX = Math.random() * maxWidth;
        const randomY = Math.random() * maxHeight;

        clickZone.style.left = randomX + "em";
        clickZone.style.top = randomY + "em";
    }

    
    setInterval(moveClickZone, 2000);

    
    document.querySelectorAll(".factory").forEach(function (fc) {
        let factory = {
            title: fc.querySelector(".title").innerText,
            costs: parseInt(fc.querySelector(".price").innerText),
            isAdding: parseInt(fc.querySelector(".adds").innerText),
            count: parseInt(fc.querySelector(".count").innerText.slice(1, -1)),
            button: fc.querySelector("button")
        };

        factory.button.onclick = function () {
            if (score >= factory.costs) {
                score -= factory.costs;
                factory.count++;
                scoreBlock.innerText = score;
                fc.querySelector('.count').innerText = '(' + factory.count + ')';
            }
        };
        ownedFactories.push(factory);
    });

    setInterval(function () {
        score += ownedFactories
            .map(x => x.count * x.isAdding)
            .reduce((partial_sum, number) => partial_sum + number, 0);
        scoreBlock.innerText = score;
    }, 1000);

    
    moveClickZone();
});
