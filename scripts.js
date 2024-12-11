window.addEventListener("load", function () {
    let settingsBtn = document.getElementById("settings-btn");
    let settingsMenu = document.getElementById("settings-menu");
    let volumeSlider = document.getElementById("volume-slider");
    let clickSound = document.getElementById("click-sound");
    let clickZone = document.querySelector(".click-zone");
    let scoreBlock = document.querySelector("#score");
    let levelBlock = document.querySelector("#level");
    let weaponList = document.querySelector("#weapon-list");

    if (!settingsBtn || !settingsMenu || !volumeSlider || !clickSound || !clickZone || !scoreBlock || !levelBlock || !weaponList) {
        console.error("Some required elements are missing from the HTML. Please check the structure.");
        return;
    }

    let score = 0;
    let level = 1;
    let maxLevel = 6;
    let gameRunning = true;
    let ownedFactories = [];
    let weaponsPerLevel = {};

    const levelThresholds = [15000, 300000, 500000, 1000000, 3000000];

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
        clickSound.volume = volumeSlider.value;
    });

    let weapons = [
        "Lazer Toy",
        "Photon Blaster",
        "Plasma Shredder",
        "Nebula Beam",
        "Starshot Rifle",
        "Quantum Raycaster"
    ];

    function unlockWeapon(level) {
        const existingWeapons = Array.from(weaponList.children).map(li => li.textContent);

        if (level <= weapons.length && !existingWeapons.includes(weapons[level - 1])) {
            let newWeapon = document.createElement("li");
            newWeapon.textContent = weapons[level - 1];
            weaponList.appendChild(newWeapon);
        }
    }

    function initializeLevel() {
        levelBlock.innerText = level;
        unlockWeapon(level);
        weaponsPerLevel[level] = 0;
    }

    function checkLevelUp() {
        if (level < maxLevel && score >= levelThresholds[level - 1]) {
            level++;
            levelBlock.innerText = level;
            unlockWeapon(level);
            weaponsPerLevel[level] = 0;
            alert(`Congratulations! You've reached Level ${level} and unlocked ${weapons[level - 1]}!`);
        }
    }

    clickZone.onclick = function () {
        if (!gameRunning) return;

        score += level;
        scoreBlock.innerText = score;
        checkLevelUp();
        clickSound.currentTime = 0;
        clickSound.play();
    };

    function moveClickZone() {
        if (!gameRunning) return;

        let maxWidth = 100 - (clickZone.offsetWidth / window.innerWidth) * 100;
        let maxHeight = 100 - (clickZone.offsetHeight / window.innerHeight) * 100;

        let randomX = Math.random() * maxWidth;
        let randomY = Math.random() * maxHeight;

        clickZone.style.left = `${randomX}%`;
        clickZone.style.top = `${randomY}%`;
    }
    setInterval(moveClickZone, 2000);

    document.querySelectorAll(".factory").forEach(function (fc, index) {
        let factory = {
            title: fc.querySelector(".title").innerText,
            costs: parseInt(fc.querySelector(".price").innerText),
            isAdding: parseInt(fc.querySelector(".adds").innerText),
            count: parseInt(fc.querySelector(".count").innerText.slice(1, -1)),
            button: fc.querySelector("button"),
            requiredLevel: index + 1
        };

        factory.button.onclick = function () {
            if (!gameRunning) return;

            if (level < factory.requiredLevel) {
                alert(`You need to reach Level ${factory.requiredLevel} to purchase this weapon.`);
                return;
            }

            if (!weaponsPerLevel[factory.requiredLevel]) {
                weaponsPerLevel[factory.requiredLevel] = 0;
            }

            if (weaponsPerLevel[factory.requiredLevel] >= 20) {
                alert(`You can only have 20 weapons in Level ${factory.requiredLevel}.`);
                return;
            }

            if (score < factory.costs) {
                alert("Not enough points to purchase this weapon!");
                return;
            }

            score -= factory.costs;
            factory.count++;
            weaponsPerLevel[factory.requiredLevel]++;
            scoreBlock.innerText = score;
            fc.querySelector(".count").innerText = `(${factory.count})`;

            factory.costs = Math.ceil(factory.costs * 1.1);
            fc.querySelector(".price").innerText = factory.costs;

        };
        ownedFactories.push(factory);
    });

    setInterval(function () {
        if (!gameRunning) return;

        score += ownedFactories
            .map(x => x.count * x.isAdding)
            .reduce((partial_sum, number) => partial_sum + number, 0);
        scoreBlock.innerText = score;
    }, 1000);

    initializeLevel();
    moveClickZone();

    let startTime = Date.now();
    let clickCount = 0;
    let timerInterval;

    const timerElement = document.createElement('div');
    timerElement.style.position = 'fixed';
    timerElement.style.bottom = '10px';
    timerElement.style.left = '50%';
    timerElement.style.transform = 'translateX(-50%)';
    timerElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    timerElement.style.color = 'white';
    timerElement.style.padding = '10px';
    timerElement.style.borderRadius = '5px';
    document.body.appendChild(timerElement);

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateTimer() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerElement.textContent = `Time: ${formatTime(elapsed)} | Clicks: ${clickCount}`;
    }

    if (clickZone) {
        clickZone.addEventListener('click', function () {
            clickCount++;
        });
    }

    timerInterval = setInterval(updateTimer, 1000);
});
