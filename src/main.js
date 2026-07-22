import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('scene-container');
    const awakeLayer = document.getElementById('awake-layer');
    const asleepLayer = document.getElementById('asleep-layer');
    const dividerLine = document.getElementById('divider-line');
    const titleText = document.getElementById('title-text');
    const detailsPanel = document.getElementById('details-panel');
    const awakeDetails = document.getElementById('awake-details');
    const bgLayer = document.getElementById('bg-layer');
    
    // --- Smooth Scrolling (Lenis) ---
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const canvas = document.getElementById('lightning-canvas');
    const ctx = canvas.getContext('2d');
    
    const introOverlay = document.getElementById('intro-overlay');
    const swordAudio = document.getElementById('sword-audio');
    const thunderAudio = document.getElementById('thunder-audio');
    let thunderPlayed = false;

    // --- Preloader Logic ---
    const preloader = document.getElementById('preloader');
    const loadingText = document.getElementById('loading-text');
    const loadingBar = document.getElementById('loading-bar');
    
    const basePath = import.meta.env.BASE_URL;

    const assetsToLoad = [
        `${basePath}assets/zenitsu_bg.png`,
        `${basePath}assets/zenitsu_asleep_transparent.png`,
        `${basePath}assets/zenitsu_awake_transparent.png`
    ];
    let loadedCount = 0;
    
    assetsToLoad.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            loadedCount++;
            const p = Math.floor((loadedCount / assetsToLoad.length) * 100);
            loadingText.innerText = `${p}%`;
            loadingBar.style.width = `${p}%`;
            
            if (loadedCount === assetsToLoad.length) {
                setTimeout(() => {
                    preloader.style.opacity = 0;
                    preloader.style.visibility = 'hidden';
                }, 500); // give it a tiny delay at 100%
            }
        };
    });

    // --- Custom Cursor ---
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('cursor-follower');
    
    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0, ease: "none" });
        gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
    });

    // --- Intro Handling ---
    introOverlay.addEventListener('click', () => {
        introOverlay.style.opacity = 0;
        introOverlay.style.visibility = 'hidden';
        if(swordAudio.readyState >= 2 || swordAudio.networkState === 1) {
            swordAudio.volume = 0.5;
            swordAudio.play().catch(e => console.log(e));
        }
    });

    // --- Three.js Setup (3D Embers) ---
    const threeCanvas = document.getElementById('three-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 50;

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 150;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.6,
        color: 0xffcc00,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);



    // --- GSAP ScrollTrigger Animations ---
    // 3D Apple-Style Pinning of Hero Section
    gsap.set('#scene-container', { transformPerspective: 1000 });
    gsap.to('#scene-container', {
        rotationX: -15,
        scale: 0.9,
        opacity: 0.3,
        transformOrigin: "center top",
        scrollTrigger: {
            trigger: '#scene-container',
            start: "top top",
            end: "+=100%",
            scrub: true,
            pin: true,
            pinSpacing: false // Allows the next section to slide OVER it
        }
    });

    // Section 2 GSAP Scroll Animations
    const s2Img = document.querySelector('.s2-bg-img');
    const s2Title = document.querySelector('.s2-title');
    const s2Para = document.querySelector('.s2-para');
    const bgText = document.querySelector('.bg-text');

    // Fade image in
    gsap.to(s2Img, {
        opacity: 1,
        scrollTrigger: {
            trigger: '#section-2',
            start: "top 80%",
            end: "top 20%",
            scrub: 1
        }
    });

    // Parallax background text
    gsap.fromTo(bgText, 
        { y: 100 },
        { 
            y: -150, 
            scrollTrigger: {
                trigger: '#section-2',
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        }
    );

    // Staggered Content Entry
    gsap.fromTo([s2Title, s2Para], 
        { x: -100, opacity: 0 },
        {
            x: 0,
            opacity: 1,
            stagger: 0.2,
            ease: "back.out(1.7)",
            duration: 1,
            scrollTrigger: {
                trigger: '#section-2',
                start: "top 50%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Mouse Parallax for Section 2
    const section2 = document.getElementById('section-2');
    section2.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        gsap.to(s2Img, {
            x: -x * 2,
            y: -y * 2,
            duration: 1,
            ease: "power2.out"
        });
        
        gsap.to(bgText, {
            x: x * 1.5,
            y: y * 1.5,
            duration: 1,
            ease: "power2.out"
        });
    });

    window.addEventListener('resize', () => {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    window.dispatchEvent(new Event('resize'));

    // --- GSAP Physics State ---
    const proxy = { percent: 50, rx: 0, ry: 0 };
    let isDragging = false;

    function updateUI() {
        const p = proxy.percent;
        
        // CSS SVG-style masking
        awakeLayer.style.clipPath = `polygon(${p}% 0, 100% 0, 100% 100%, ${p}% 100%)`;
        asleepLayer.style.clipPath = `polygon(0 0, ${p}% 0, ${p}% 100%, 0 100%)`;
        dividerLine.style.left = `${p}%`;

        // Dynamic Lighting on Background
        if (p > 70 && Math.random() > 0.5) {
            bgLayer.style.background = `radial-gradient(circle at ${p}% 50%, rgba(255, 255, 100, 0.4) 0%, transparent 40%), url('${basePath}assets/zenitsu_bg.png') center/cover`;
        } else {
            bgLayer.style.background = `url('${basePath}assets/zenitsu_bg.png') center/cover`;
        }

        // Title Opacity
        if (p > 50) titleText.style.opacity = (p - 50) / 50;
        else titleText.style.opacity = 0;

        // Thunderclap Trigger & Chromatic Shake
        if (p > 80) {
            detailsPanel.classList.add('show');
            awakeDetails.classList.remove('show');
            if (!thunderPlayed) {
                thunderPlayed = true;
                container.classList.add('shake');
                setTimeout(() => container.classList.remove('shake'), 400); // 400ms CSS duration

                if(thunderAudio.readyState >= 2 || thunderAudio.networkState === 1) {
                    thunderAudio.volume = 0.7;
                    thunderAudio.play().catch(() => {});
                }
            }
        } else if (p < 20) {
            detailsPanel.classList.remove('show');
            awakeDetails.classList.add('show');
            thunderPlayed = false;
        } else {
            detailsPanel.classList.remove('show');
            awakeDetails.classList.remove('show');
            thunderPlayed = false;
        }

        // Apply 3D parallax rotation
        container.style.transform = `perspective(1500px) rotateX(${proxy.rx}deg) rotateY(${proxy.ry}deg)`;
    }

    // --- Interaction Events ---
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        follower.classList.add('drag-active');
        gsap.to(proxy, { percent: (e.clientX / window.innerWidth) * 100, duration: 0.8, ease: "power3.out", onUpdate: updateUI });
    });
    window.addEventListener('mouseup', () => {
        isDragging = false;
        follower.classList.remove('drag-active');
    });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            gsap.to(proxy, { percent: (e.clientX / window.innerWidth) * 100, duration: 0.4, ease: "power2.out", onUpdate: updateUI });
        }
        const targetRx = (e.clientY / window.innerHeight - 0.5) * -15;
        const targetRy = (e.clientX / window.innerWidth - 0.5) * 15;
        gsap.to(proxy, { rx: targetRx, ry: targetRy, duration: 1, ease: "power2.out", onUpdate: updateUI });
    });

    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        gsap.to(proxy, { percent: (e.touches[0].clientX / window.innerWidth) * 100, duration: 0.8, ease: "power3.out", onUpdate: updateUI });
    }, {passive: true});
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => {
        if (isDragging) {
            gsap.to(proxy, { percent: (e.touches[0].clientX / window.innerWidth) * 100, duration: 0.4, ease: "power2.out", onUpdate: updateUI });
        }
    }, {passive: true});

    // --- Canvas Lightning Logic ---
    let lightningBranches = [];
    function createLightning() {
        const revealAmount = proxy.percent;
        if (revealAmount < 50 || Math.random() > (revealAmount / 100) * 0.3) return;

        const startX = (revealAmount / 100) * canvas.width;
        lightningBranches.push({
            x: startX,
            y: Math.random() * canvas.height,
            length: 0,
            maxLength: Math.random() * 200 + 100,
            angle: (Math.random() - 0.5) * Math.PI,
            life: 1.0,
            branches: []
        });
    }

    function drawLightningBase() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        createLightning();

        for (let i = lightningBranches.length - 1; i >= 0; i--) {
            const b = lightningBranches[i];
            b.life -= 0.05;
            b.length += 20;

            if (b.life <= 0) {
                lightningBranches.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.moveTo(b.x, b.y);
            const endX = b.x + Math.cos(b.angle) * Math.min(b.length, b.maxLength);
            const endY = b.y + Math.sin(b.angle) * Math.min(b.length, b.maxLength);
            
            // Jagged effect
            let currX = b.x;
            let currY = b.y;
            for(let j=0; j<5; j++) {
                currX += (endX - b.x)/5 + (Math.random()-0.5)*20;
                currY += (endY - b.y)/5 + (Math.random()-0.5)*20;
                ctx.lineTo(currX, currY);
            }

            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            // Fast Glow Layer
            ctx.strokeStyle = `rgba(255, 255, 0, ${b.life * 0.3})`;
            ctx.lineWidth = 15;
            ctx.stroke();

            // Core Layer
            ctx.strokeStyle = `rgba(255, 255, 255, ${b.life})`;
            ctx.lineWidth = Math.random() * 3 + 1;
            ctx.stroke();
        }
    }

    // --- Main Animation Loop ---
    const clock = new THREE.Clock();
    const awakeColor = new THREE.Color(0x88bbff); // Blueish dust
    const asleepColor = new THREE.Color(0xffaa00); // Orange embers

    function animate() {
        requestAnimationFrame(animate);
        
        // 3D Particles Logic
        const elapsedTime = clock.getElapsedTime();
        particlesMesh.rotation.y = elapsedTime * 0.1;
        
        const p = proxy.percent;
        const isAsleep = p > 50;

        // Smoothly interpolate particle color based on state
        const targetColor = isAsleep ? asleepColor : awakeColor;
        particlesMaterial.color.lerp(targetColor, 0.05);
        
        // Dynamic float logic via attributes
        const positions = particlesGeometry.attributes.position.array;
        for(let i = 1; i < particlesCount * 3; i += 3) {
            if (isAsleep) {
                positions[i] += 0.3 + Math.random() * 0.2; // embers rise fast
                if(positions[i] > 100) positions[i] = -100;
            } else {
                positions[i] -= 0.05 + Math.random() * 0.05; // dust falls slowly
                if(positions[i] < -100) positions[i] = 100;
            }
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        // Camera reacts to mouse
        camera.position.x = proxy.ry * 0.3;
        camera.position.y = proxy.rx * 0.3;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
        
        // 2D Lightning
        drawLightningBase();
    }
    
    // Init
    updateUI();
    animate();
});
