(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setup(svg) {
        const path = svg.querySelector('.flow-path');
        if (!path) return;

        let length = 0;
        let ticking = false;

        function measure() {
            length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = reduceMotion ? 0 : length;
        }

        function update() {
            if (reduceMotion || !length) return;

            const rect = svg.getBoundingClientRect();
            const viewport = window.innerHeight;
            const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (rect.height + viewport)));

            path.style.strokeDashoffset = length * (1 - progress);
        }

        function onScroll() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(function () {
                update();
                ticking = false;
            });
        }

        measure();
        update();

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', function () {
            measure();
            update();
        });
    }

    document.querySelectorAll('.flow-line').forEach(setup);
})();
