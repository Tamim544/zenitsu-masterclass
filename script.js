document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('scene-container');
    const awakeLayer = document.getElementById('awake-layer');
    const asleepLayer = document.getElementById('asleep-layer');
    const titleText = document.getElementById('title-text');
    const detailsPanel = document.getElementById('zenitsu-details');
    const dividerLine = document.getElementById('divider-line');
    const bgLayer = document.getElementById('bg-layer');
    const canvas = document.getElementById('lightning-canvas');
    const ctx = canvas.getContext('2d');
    
    // Audio (Optional if not present, wrap in try/catch or check if loaded)
    const thunderAudio = document.getElementById('thunder-audio');
    let thunderPlayed = false;

    // Resize canvas
    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // State
    let wipePercentage = 100; // 100 means fully awake (right side showing), 0 means fully asleep
    let isDragging = false;

    // Set initial clip path (showing full awake layer)
    updateClipPath(0);

    function updateClipPath(percent) {
        // Vertical wipe (percent 100 = full asleep, 0 = full awake)
        const xPos = percent; 
        
        // Awake layer visible on the right side
        awakeLayer.style.clipPath = `polygon(${xPos}% 0, 100% 0, 100% 100%, ${xPos}% 100%)`;
        
        // Asleep layer visible on the left side
        asleepLayer.style.clipPath = `polygon(0 0, ${xPos}% 0, ${xPos}% 100%, 0 100%)`;
        
        dividerLine.style.left = `${xPos}%`;

        // Update Title Opacity based on how much is revealed
        const revealAmount = percent;
        if (revealAmount > 50) {
            titleText.style.opacity = (revealAmount - 50) / 50;
        } else {
            titleText.style.opacity = 0;
        }

        // Play audio and show details if we pass a threshold
        if (revealAmount > 80) {
            detailsPanel.classList.add('show');
            if (!thunderPlayed) {
                thunderPlayed = true;
                if(thunderAudio.readyState >= 2) {
                    thunderAudio.volume = 0.5;
                    thunderAudio.play().catch(e => console.log("Audio play blocked"));
                }
            }
        } else if (revealAmount < 20) {
            detailsPanel.classList.remove('show');
            thunderPlayed = false;
        }
    }

    function handleMove(clientX) {
        const rect = container.getBoundingClientRect();
        let x = clientX - rect.left;
        let percent = (x / rect.width) * 100;
        
        // Clamp between 0 and 100
        percent = Math.max(0, Math.min(100, percent));
        wipePercentage = percent;
        updateClipPath(percent);
    }

    // Mouse / Touch Events
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        handleMove(e.clientX);
    });
    
    window.addEventListener('mouseup', () => {
        isDragging = false;
        // Optional: snap back or leave as is
    });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            handleMove(e.clientX);
        }
        // Parallax effect on background
        const xOffset = (e.clientX / window.innerWidth - 0.5) * 20;
        const yOffset = (e.clientY / window.innerHeight - 0.5) * 20;
        bgLayer.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(1.05)`;
    });

    // Touch support
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        handleMove(e.touches[0].clientX);
    }, {passive: true});

    window.addEventListener('touchend', () => {
        isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
        if (isDragging) {
            handleMove(e.touches[0].clientX);
        }
    }, {passive: true});

    // Lightning Generator
    let lightningBranches = [];

    function createLightning() {
        const revealAmount = wipePercentage;
        
        // Only draw lightning if we've revealed some of the asleep state
        if (revealAmount < 10) return;
        
        // The more revealed, the more lightning
        if (Math.random() > (revealAmount / 200)) return;

        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        
        lightningBranches.push({
            x: startX,
            y: startY,
            path: [{x: startX, y: startY}],
            life: 0,
            maxLife: Math.random() * 10 + 5,
            width: Math.random() * 3 + 1
        });
    }

    function drawLightning() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        createLightning();

        for (let i = lightningBranches.length - 1; i >= 0; i--) {
            const branch = lightningBranches[i];
            
            // Add new segment
            if (branch.life < branch.maxLife) {
                const lastPoint = branch.path[branch.path.length - 1];
                const newX = lastPoint.x + (Math.random() - 0.5) * 50;
                const newY = lastPoint.y + (Math.random() - 0.5) * 50;
                branch.path.push({x: newX, y: newY});
                branch.life++;
                
                // Sometimes branch out
                if (Math.random() > 0.8) {
                     lightningBranches.push({
                        x: newX,
                        y: newY,
                        path: [{x: newX, y: newY}],
                        life: branch.life,
                        maxLife: branch.maxLife,
                        width: branch.width * 0.7
                    });
                }
            }

            // Draw branch
            ctx.beginPath();
            ctx.moveTo(branch.path[0].x, branch.path[0].y);
            for (let j = 1; j < branch.path.length; j++) {
                ctx.lineTo(branch.path[j].x, branch.path[j].y);
            }
            
            // Lightning styling
            ctx.strokeStyle = `rgba(255, 255, 100, ${1 - branch.life / branch.maxLife})`;
            ctx.lineWidth = branch.width;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffcc00';
            ctx.stroke();

            // Remove dead branches
            if (branch.life >= branch.maxLife) {
                lightningBranches.splice(i, 1);
            }
        }

        requestAnimationFrame(drawLightning);
    }

    // Start lightning loop
    drawLightning();
});
