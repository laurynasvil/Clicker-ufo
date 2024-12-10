window.addEventListener("load", function () {
    const settingsBtn = document.getElementById("settings-btn");
    const settingsMenu = document.getElementById("settings-menu");
    const volumeSlider = document.getElementById("volume-slider");
    const clickSound = document.getElementById("click-sound");
    const clickZone = document.querySelector(".main-game .click-zone");
    const scoreBlock = document.querySelector(".main-game .score");
    let score = 0;
    let ownedFactories = [];

    settingsBtn.addEventListener("click", function () {
        if (settingsMenu.classList.contains("hidden")) {
            settingsMenu.classList.remove("hidden");
            settingsMenu.style.display = "block";
        } else {
            settingsMenu.classList.add("hidden");
            settingsMenu.style.display = "none";
        }
    });
    
    volumeSlider.addEventListener("input", function () {
        clickSound.volume = volumeSlider.value; // Atitinka slankiklio reikšmę
    });
    clickZone.onclick = function () {
        score += 10;
        scoreBlock.innerText = score;

        clickSound.currentTime = 0; 
        clickSound.play();
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
