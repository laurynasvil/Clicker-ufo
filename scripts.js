window.addEventListener("load", function () {
    let settingsBtn = document.getElementById("settings-btn");
    let settingsMenu = document.getElementById("settings-menu");
    let volumeSlider = document.getElementById("volume-slider");
    let clickSound = document.getElementById("click-sound");
    let clickZone = document.querySelector(".click-zone");
    let scoreBlock = document.querySelector("#score");
    let levelBlock = document.querySelector("#level");
    let weaponList = document.querySelector("#weapon-list");
    let score = 0;
    let level = 1; 
    let maxLevel = 6; 
    let gameRunning = true;
    let ownedFactories = [];
    let weaponsPerLevel = {}; 

   
    const levelThresholds = [15000, 500000, 1000000, 2000000, 4000000, 6000000];

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
        if (level <= weapons.length) {
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

   
    function checkGameEnd() {
        if (score >= 7000000) {
            alert("Congratulations! You've reached 7,000,000 points and finished the game!");
            gameRunning = false; 
        }
    }

    clickZone.onclick = function () {
        if (!gameRunning) return;

        score += 1;
        scoreBlock.innerText = score;
        checkLevelUp();
        checkGameEnd();
        clickSound.currentTime = 0; 
        clickSound.play();
    };

   
    function moveClickZone() {
        if (!gameRunning) return;

        let gameArea = document.querySelector(".main-game");
        let maxWidth = gameArea.clientWidth - clickZone.offsetWidth;
        let maxHeight = gameArea.clientHeight - clickZone.offsetHeight;

        let randomX = Math.random() * maxWidth;
        let randomY = Math.random() * maxHeight;

        clickZone.style.left = randomX + "px";
        clickZone.style.top = randomY + "px";
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

            
            if (weaponsPerLevel[level] >= 20) {
                alert(`You can only have 20 weapons in Level ${level}.`);
                return;
            }

            if (level >= factory.requiredLevel) {
                if (score >= factory.costs) {
                    score -= factory.costs;
                    factory.count++;
                    weaponsPerLevel[level]++;
                    scoreBlock.innerText = score;
                    fc.querySelector(".count").innerText = `(${factory.count})`;
                } else {
                    alert("Not enough points to purchase this weapon!");
                }
            } else {
                alert(`You need to reach Level ${factory.requiredLevel} to purchase this weapon.`);
            }
        };
        ownedFactories.push(factory);
    });

    
    setInterval(function () {
        if (!gameRunning) return;

        score += ownedFactories
            .map(x => x.count * x.isAdding)
            .reduce((partial_sum, number) => partial_sum + number, 0);
        scoreBlock.innerText = score;
        checkGameEnd();
    }, 1000);

    initializeLevel();
    moveClickZone();
});
