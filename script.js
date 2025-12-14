(function() {
    
            // Smooth scrolling for anchor links
            document.addEventListener('click', function (e) {
                var anchor = e.target.closest('a[href^="#"]');
                if (!anchor) return;
                var href = anchor.getAttribute('href');
                if (href === '#' || href === '') return;
                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // close nav on mobile after click
                    var nav = document.querySelector('nav');
                    if (nav && nav.classList.contains('open')) {
                        nav.classList.remove('open');
                        var toggle = document.querySelector('.nav-toggle');
                        if (toggle) toggle.setAttribute('aria-expanded', 'false');
                    }
                }
            }, false);

            // Reveal on scroll (simple version)
            function reveal() {
                var reveals = document.querySelectorAll('.gallery, .about, .services, .contact');
                reveals.forEach(function(section) {
                    var windowHeight = window.innerHeight;
                    var revealTop = section.getBoundingClientRect().top;
                    var revealPoint = 150;
                    if (revealTop < windowHeight - revealPoint) {
                        section.classList.add('reveal');
                    }
                });
            }
            window.addEventListener('scroll', reveal);
            window.addEventListener('load', reveal);

            // Mobile nav toggle
            var toggle = document.querySelector('.nav-toggle');
            var nav = document.querySelector('nav');
            if (toggle && nav) {
                toggle.addEventListener('click', function() {
                    var isOpen = nav.classList.toggle('open');
                    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                });
            }

            // Gallery filter
            var filterButtons = document.querySelectorAll('.filter-btn');
            var items = document.querySelectorAll('.gallery-grid .gallery-item');
            filterButtons.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    filterButtons.forEach(function(b){ b.classList.remove('active'); });
                    btn.classList.add('active');
                    var filter = btn.getAttribute('data-filter');
                    items.forEach(function(item) {
                        var img = item.querySelector('img');
                        var itemFilter = img && img.getAttribute('data-filter') ? img.getAttribute('data-filter') : 'all';
                        if (filter === 'all' || filter === itemFilter) {
                            item.style.display = '';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            });

            // Lightbox modal (dynamic)
            var currentIndex = -1;
            var galleryImgs = Array.prototype.slice.call(document.querySelectorAll('.gallery-grid img'));

            function createLightbox() {
                var overlay = document.createElement('div');
                overlay.id = 'lightbox-overlay';
                overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:2000;opacity:0;transition:opacity 200ms ease';
                overlay.innerHTML = '\n                    <button id="lightbox-close" aria-label="Close" style="position:absolute;top:20px;right:20px;font-size:28px;color:#fff;background:transparent;border:none;cursor:pointer">&times;</button>\n                    <img id="lightbox-img" src="" alt="" style="max-width:90%;max-height:80%;box-shadow:0 10px 30px rgba(0,0,0,0.6);border-radius:8px">\n                    <button id="lightbox-prev" aria-label="Previous" style="position:absolute;left:20px;font-size:28px;color:#fff;background:transparent;border:none;cursor:pointer">&#10094;</button>\n                    <button id="lightbox-next" aria-label="Next" style="position:absolute;right:20px;font-size:28px;color:#fff;background:transparent;border:none;cursor:pointer">&#10095;</button>\n                ';
                document.body.appendChild(overlay);
                // force reflow then show
                requestAnimationFrame(function(){ overlay.style.opacity = 1; });
                overlay.addEventListener('click', function(e){ if (e.target === overlay) closeLightbox(); });
                document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
                document.getElementById('lightbox-prev').addEventListener('click', showPrev);
                document.getElementById('lightbox-next').addEventListener('click', showNext);
                document.addEventListener('keydown', onKeyDown);
            }

            function openLightbox(index) {
                currentIndex = index;
                var existing = document.getElementById('lightbox-overlay');
                if (!existing) createLightbox();
                var overlay = document.getElementById('lightbox-overlay');
                var imgEl = document.getElementById('lightbox-img');
                imgEl.src = galleryImgs[currentIndex].src;
            }

            function closeLightbox() {
                var overlay = document.getElementById('lightbox-overlay');
                if (!overlay) return;
                overlay.style.opacity = 0;
                setTimeout(function(){ if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 250);
                document.removeEventListener('keydown', onKeyDown);
            }

            function showPrev(e) { e && e.stopPropagation(); if (currentIndex > 0) { currentIndex--; document.getElementById('lightbox-img').src = galleryImgs[currentIndex].src; } }
            function showNext(e) { e && e.stopPropagation(); if (currentIndex < galleryImgs.length - 1) { currentIndex++; document.getElementById('lightbox-img').src = galleryImgs[currentIndex].src; } }

            function onKeyDown(e) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }

            galleryImgs.forEach(function(img, idx){
                img.style.cursor = 'zoom-in';
                img.addEventListener('click', function(e){ openLightbox(idx); });
            });

            // Image error fallback - inline SVG placeholder
            var placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#ddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-family="Arial, Helvetica, sans-serif" font-size="20">Image not available</text></svg>');
            document.querySelectorAll('img').forEach(function(img){
                img.addEventListener('error', function(){
                    console.error('Image failed to load:', img.getAttribute('src') || img.src);
                    if (img.src !== placeholder) img.src = placeholder;
                    img.classList.add('img-broken');
                });
                // also mark successful loads for debugging
                img.addEventListener('load', function(){ img.classList.add('img-loaded'); });
            });

        })();