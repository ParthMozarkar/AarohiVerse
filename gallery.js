const galleryGrid = document.getElementById('gallery-grid');

// CONFIGURATION: Add your photos and quotes here
// Replace the 'src' with the path to your actual images (e.g., 'Assests/myphoto.jpg')
const photos = [
    {
        src: "Assests/photo1.jpg",
        quote: "Your Styling And Smartness Is What Makes You Cool ✨"
    },
    {
        src: "Assests/photo2.jpg",
        quote: "Always Be Happy and Keep Smiling Chotuu🌹"
    },
    {
        src: "Assests/photo3.jpg",
        quote: "Collect moments,make memories and enjoy life 📸"
    },
    {
        src: "Assests/photo4.jpg",
        quote: "“Keep Shining and Rocking Like This Always Piyu 💖"
    },
    {
        src: "Assests/photo5.jpg",
        quote: "Cutiepie Learning Things And Exploring 🌟"
    },
    {
        src: "Assests/photo6.jpg",
        quote: "Attitude Nahi Rukna Chaahiye Bhale Kitni Bhi Moti (Badi) Hojau” 💫"
    },
    {
        src: "Assests/photo7.jpg",
        quote: "Double Trouble! 👯‍♀️"
    },
    {
        src: "Assests/photo8.jpg",
        quote: "Holi Vibes with Bestie! 🎨🌈"
    },
    {
        src: "Assests/photo9.jpg",
        quote: "Daddy's Little Princess! 💖👨‍👧"
    }
];

// Function to render the gallery
function renderGallery() {
    galleryGrid.innerHTML = '';
    photos.forEach((photo, index) => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.id = `card-${index}`;
        card.innerHTML = `
            <div class="img-container" style="width: 100%; aspect-ratio: 1/1; overflow: hidden; border-radius: 10px; margin-bottom: 15px; background: #000;">
                <img src="${photo.src}" alt="Memory ${index + 1}" style="width: 100%; height: 100%; object-fit: cover; object-position: center 10%;">
            </div>
            <p class="quote" style="font-family: 'Dancing Script', cursive; font-size: 1.3rem; color: #e0e0e0;">${photo.quote}</p>
        `;
        galleryGrid.appendChild(card);
    });
}

async function startCinematicReveal() {
    const revealOverlay = document.getElementById('cinematic-reveal');
    const revealContent = revealOverlay.querySelector('.reveal-content');
    const revealImg = revealOverlay.querySelector('.reveal-img');
    const revealQuote = revealOverlay.querySelector('.reveal-quote');
    const backBtn = document.getElementById('back-btn');

    // Show the grid container but keep cards hidden
    galleryGrid.classList.add('visible');
    revealOverlay.classList.add('active');

    for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const card = document.getElementById(`card-${i}`);

        // 1. Prepare overlay
        revealImg.src = photo.src;
        revealQuote.textContent = photo.quote;

        // 2. Fade in full screen
        revealContent.classList.add('show');
        await new Promise(r => setTimeout(r, 8000)); // Show each photo for 8 seconds

        // 3. Fade out full screen
        revealContent.classList.remove('show');
        await new Promise(r => setTimeout(r, 1000)); // Short wait for fade-out

        // 4. Reveal in grid
        card.classList.add('revealed');
        await new Promise(r => setTimeout(r, 400)); // Small gap before next photo starts
    }

    // End reveal
    revealOverlay.classList.remove('active');
    backBtn.classList.add('show');
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderGallery();

    const overlay = document.getElementById('gift-overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            if (window.piyuMusic) window.piyuMusic.play();
            overlay.classList.add('open');
            setTimeout(() => {
                overlay.classList.add('hidden');
                startCinematicReveal();
            }, 1200);
        });
    }
});
