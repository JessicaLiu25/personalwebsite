document.addEventListener('DOMContentLoaded', function() {
    console.log("Aurora Portfolio v3.0 Final Loaded");

    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shrink');
            } else {
                header.classList.remove('shrink');
            }
        });
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    const sketchItems = document.querySelectorAll('.portrait-item');
    const sketchImages = Array.from(sketchItems).map(item => {
        const img = item.querySelector('img');
        return {
            src: img.getAttribute('data-large') || img.src,
            alt: img.getAttribute('alt') || "Sketch"
        };
    });

    const adCards = document.querySelectorAll('.card');
    const adImages = Array.from(adCards).map(card => {
        const img = card.querySelector('img');
        const title = card.querySelector('.card-title');
        return {
            src: img.src, 
            alt: title ? title.textContent : "Advertising"
        };
    });

    const movieCards = document.querySelectorAll('.movie-card');
    const movieImages = Array.from(movieCards).map(card => {
        const img = card.querySelector('img');
        const title = card.querySelector('.movie-title-row h3');
        
        let largeSrc = img.src;
        const onclickAttr = card.getAttribute('onclick');
        
        if (onclickAttr) {
            const match = onclickAttr.match(/openLightbox\(['"]([^'"]+)['"]/);
            if (match && match[1]) {
                largeSrc = match[1];
            }
        }

        return {
            src: largeSrc,
            alt: title ? title.textContent : "Poster"
        };
    });

    let currentGallery = []; 
    let currentIndex = 0;

    function updateLightboxContent(index) {
        if (!currentGallery.length || index < 0 || index >= currentGallery.length) return;
        
        const data = currentGallery[index];
        
        lightboxImg.style.opacity = 0;
        
        setTimeout(() => {
            lightboxImg.src = data.src;
            if(lightboxCaption) lightboxCaption.textContent = data.alt;
            lightboxImg.style.opacity = 1;
            updateArrows(index);
        }, 200);
    }

    function updateArrows(index) {
        if (!prevBtn || !nextBtn) return;
        
        if (index === 0) prevBtn.classList.add('disabled');
        else prevBtn.classList.remove('disabled');

        if (index === currentGallery.length - 1) nextBtn.classList.add('disabled');
        else nextBtn.classList.remove('disabled');
    }

    function openLightbox(galleryData, index) {
        if (!lightbox || !lightboxImg) return;
        currentGallery = galleryData;
        currentIndex = index;
        
        updateLightboxContent(currentIndex);
        
        lightbox.classList.add('active');
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightboxFunc() {
        if(!lightbox) return;
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightboxImg.src = ''; 
        }, 300);
        document.body.style.overflow = '';
    }

    function changeSlide(direction) {
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < currentGallery.length) {
            currentIndex = newIndex;
            updateLightboxContent(currentIndex);
        }
    }

    sketchItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(sketchImages, index);
        });
    });

    adCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            openLightbox(adImages, index);
        });
    });

    movieCards.forEach((card, index) => {
        card.removeAttribute('onclick'); 
        
        card.addEventListener('click', () => {
            openLightbox(movieImages, index);
        });
    });

    if(prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            changeSlide(-1);
        });
    }
    if(nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            changeSlide(1);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightboxFunc();
        });
    }
    
    if(lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightboxFunc();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightboxFunc();
        if (e.key === 'ArrowLeft') changeSlide(-1);
        if (e.key === 'ArrowRight') changeSlide(1);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const archLightbox = document.getElementById('arch-lightbox');
    const archImg = document.getElementById('arch-lightbox-img');
    const archViewport = document.getElementById('arch-viewport');
    const archCaption = document.getElementById('arch-lightbox-caption');
    const archCloseBtn = document.querySelector('#arch-lightbox .lightbox-close');
    const archPrevBtn = document.querySelector('#arch-lightbox .lightbox-prev');
    const archNextBtn = document.querySelector('#arch-lightbox .lightbox-next');

    const archSeriesData = [
        { 
            src: './images/archi_big.jpg', 
            caption: 'Architecture Detail (Original Size)' 
        }
    ];

    let archIndex = 0;
    let currentScale = 1;
    let translateX = 0, translateY = 0;
    let isDragging = false;
    let startX, startY;
    let imgWidth, imgHeight;
    let viewportW, viewportH;

    window.openArchSeries = function(index) {
        if (!archLightbox || !archImg || !archViewport) {
            console.error("找不到灯箱元素");
            return;
        }
        
        archIndex = index;
        archLightbox.classList.add('active');
        archLightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        loadArchImage(archIndex);
    };

    function loadArchImage(index) {
        const data = archSeriesData[index];
        if (!data) return;

        archImg.style.transition = 'none';
        archImg.style.opacity = '0';
        archImg.style.transform = 'translate(0,0) scale(1)';
        
        archImg.src = data.src;
        if (archCaption) archCaption.textContent = data.caption || "";
        updateArchArrows();

        const initProcess = () => {
            void archImg.offsetWidth; 

            imgWidth = archImg.naturalWidth;
            imgHeight = archImg.naturalHeight;
            viewportW = archViewport.clientWidth;
            viewportH = archViewport.clientHeight;

            if (imgWidth === 0 || imgHeight === 0) {
                console.warn("图片尺寸仍为 0，稍后重试...");
                setTimeout(initProcess, 50);
                return;
            }

            translateX = (viewportW - imgWidth) / 2;
            translateY = (viewportH - imgHeight) / 2;

            console.log(`图片尺寸：${imgWidth}x${imgHeight}, 视口：${viewportW}x${viewportH}, 偏移：${translateX}, ${translateY}`);

            archImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
            
            requestAnimationFrame(() => {
                archImg.style.transition = 'opacity 0.3s ease';
                archImg.style.opacity = '1';
                updateArchCursor();
            });
        };

        if (archImg.complete) {
            initProcess();
        } else {
            archImg.onload = initProcess;
        }
    }

    if (archViewport) {
        archViewport.addEventListener('mousedown', (e) => {
            isDragging = false;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            
            archViewport.classList.add('grabbing');
            archImg.style.transition = 'none';
            e.preventDefault();
        });
    }

    window.addEventListener('mousemove', (e) => {
        if (archImg && archImg.style.transition === 'none' && (e.buttons === 1)) {
            isDragging = true;
            e.preventDefault();
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            archImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
            updateArchCursor();
        }
    });

    window.addEventListener('mouseup', () => {
        if (archViewport) archViewport.classList.remove('grabbing');
        setTimeout(() => {
            if (archLightbox && archLightbox.classList.contains('active') && archImg) {
                archImg.style.transition = 'transform 0.1s ease-out';
            }
        }, 50);
    });

    function updateArchCursor() {
        if (!archViewport || !imgWidth) return;
        if (imgWidth > viewportW || imgHeight > viewportH) {
            archViewport.style.cursor = 'grab';
        } else {
            archViewport.style.cursor = 'default';
        }
        if (archViewport.classList.contains('grabbing')) {
            archViewport.style.cursor = 'grabbing';
        }
    }

    function updateArchArrows() {
        if (!archPrevBtn || !archNextBtn) return;
        if (archSeriesData.length <= 1) {
            archPrevBtn.style.display = 'none';
            archNextBtn.style.display = 'none';
            return;
        }
        if (archIndex === 0) archPrevBtn.classList.add('disabled');
        else archPrevBtn.classList.remove('disabled');
        if (archIndex === archSeriesData.length - 1) archNextBtn.classList.add('disabled');
        else archNextBtn.classList.remove('disabled');
    }

    function changeArchSlide(direction) {
        const newIndex = archIndex + direction;
        if (newIndex >= 0 && newIndex < archSeriesData.length) {
            archIndex = newIndex;
            if(archImg) archImg.style.opacity = '0';
            setTimeout(() => loadArchImage(archIndex), 200);
        }
    }

    if (archPrevBtn) archPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); changeArchSlide(-1); });
    if (archNextBtn) archNextBtn.addEventListener('click', (e) => { e.stopPropagation(); changeArchSlide(1); });

    function closeArchLightboxFunc() {
        if(!archLightbox) return;
        archLightbox.classList.remove('active');
        setTimeout(() => {
            archLightbox.style.display = 'none';
            if(archImg) archImg.src = '';
        }, 300);
        document.body.style.overflow = '';
    }

    if (archCloseBtn) archCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); closeArchLightboxFunc(); });
    
    if (archLightbox) {
        archLightbox.addEventListener('click', (e) => {
            if (e.target === archLightbox || e.target === archViewport) {
                if(!isDragging) closeArchLightboxFunc();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!archLightbox || !archLightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeArchLightboxFunc();
        if (e.key === 'ArrowLeft') changeArchSlide(-1);
        if (e.key === 'ArrowRight') changeArchSlide(1);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section');
    const headerOffset = 100; 

    function updateActiveLink() {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - headerOffset) && window.scrollY < (sectionTop + sectionHeight - headerOffset)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (!currentSectionId && window.scrollY < 100) {
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
});