// 퀘스트 1 · 미션 3 온도 — 별의 색과 표면 온도, 내용정리
(function () {
    const { svgEl, layout, text } = SimKit;

    // 표면 온도(K) → 별빛 색 (흑체 복사 색의 근사식)
    function tempColor(K) {
        const t = K / 100;
        let r, g, b;
        if (t <= 66) { r = 255; g = 99.47 * Math.log(t) - 161.12; }
        else { r = 329.7 * Math.pow(t - 60, -0.1332); g = 288.12 * Math.pow(t - 60, -0.0755); }
        if (t >= 66) b = 255; else if (t <= 19) b = 0; else b = 138.52 * Math.log(t - 10) - 305.04;
        const c = v => Math.round(Math.max(0, Math.min(255, v)));
        return `rgb(${c(r)}, ${c(g)}, ${c(b)})`;
    }
    function colorName(K) {
        if (K >= 10000) return '청백색';
        if (K >= 7500) return '흰색';
        if (K >= 6000) return '황백색';
        if (K >= 5000) return '노란색';
        if (K >= 3700) return '주황색';
        return '붉은색';
    }
    const EXAMPLES = [
        { name: '리겔', K: 12000 }, { name: '시리우스', K: 9900 }, { name: '태양', K: 5800 },
        { name: '알데바란', K: 3900 }, { name: '베텔게우스', K: 3500 }
    ];

    function starColor(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">별은 표면 온도에 따라 색이 달라요. 표면 온도를 바꾸며 별의 색이 어떻게 변하는지 관찰해 보세요.</p>');
        const { view, ctrl } = layout(body);
        const W = 640, H = 360, T0 = 2500, T1 = 30000, BX = 40, BW = 560, BY = 300;
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': '표면 온도에 따른 별의 색' }, view);
        const defs = svgEl('defs', {}, svg);
        const grad = svgEl('radialGradient', { id: 'starGlow' }, defs);
        const s0 = svgEl('stop', { offset: '0%' }, grad), s1 = svgEl('stop', { offset: '55%' }, grad), s2 = svgEl('stop', { offset: '100%', 'stop-opacity': 0 }, grad);
        svgEl('circle', { cx: 320, cy: 140, r: 130, fill: 'url(#starGlow)' }, svg);
        const core = svgEl('circle', { cx: 320, cy: 140, r: 62 }, svg);
        // 온도 띠 (로그 눈금)
        const xOf = K => BX + BW * (Math.log(K) - Math.log(T0)) / (Math.log(T1) - Math.log(T0));
        const lg = svgEl('linearGradient', { id: 'tband' }, defs);
        for (let i = 0; i <= 10; i++) {
            const K = Math.exp(Math.log(T0) + (Math.log(T1) - Math.log(T0)) * i / 10);
            svgEl('stop', { offset: `${i * 10}%`, 'stop-color': tempColor(K) }, lg);
        }
        svgEl('rect', { x: BX, y: BY, width: BW, height: 16, rx: 8, fill: 'url(#tband)' }, svg);
        [3000, 5000, 10000, 20000].forEach(K => text(svg, xOf(K), BY + 36, `${K.toLocaleString()} K`, { 'text-anchor': 'middle', 'font-size': 12 }));
        const marker = svgEl('polygon', { fill: '#eef1ff' }, svg);

        ctrl.innerHTML = `
            <div class="slider"><label for="tk">표면 온도 <output id="tk-out"></output></label>
                <input id="tk" type="range" min="${Math.log(T0)}" max="${Math.log(T1)}" step="0.005" value="${Math.log(5800)}"></div>
            <div class="readout">
                <div class="row"><span>별의 색</span><b id="tk-name"></b></div>
                <div class="row"><span>비슷한 별</span><b id="tk-ex"></b></div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap" id="tk-jump"></div>`;
        const slider = ctrl.querySelector('#tk');
        EXAMPLES.forEach(e => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'btn'; b.textContent = e.name;
            b.addEventListener('click', () => { slider.value = Math.log(e.K); draw(); });
            ctrl.querySelector('#tk-jump').appendChild(b);
        });
        function draw() {
            const K = Math.round(Math.exp(parseFloat(slider.value)) / 100) * 100;
            const c = tempColor(K);
            core.setAttribute('fill', c);
            s0.setAttribute('stop-color', '#ffffff'); s1.setAttribute('stop-color', c); s2.setAttribute('stop-color', c);
            const x = xOf(K);
            marker.setAttribute('points', `${x - 8},${BY - 14} ${x + 8},${BY - 14} ${x},${BY - 2}`);
            ctrl.querySelector('#tk-out').textContent = `약 ${K.toLocaleString()} K`;
            ctrl.querySelector('#tk-name').textContent = colorName(K);
            const near = EXAMPLES.reduce((a, b) => Math.abs(Math.log(b.K / K)) < Math.abs(Math.log(a.K / K)) ? b : a);
            ctrl.querySelector('#tk-ex').textContent = Math.abs(Math.log(near.K / K)) < 0.12 ? `${near.name} (약 ${near.K.toLocaleString()} K)` : '—';
        }
        slider.addEventListener('input', draw);
        draw();
        api.quiz(body, {
            q: '표면 온도가 가장 높은 별은 어떤 색으로 보일까요?',
            options: ['붉은색', '노란색', '청백색'], answer: 2,
            explain: '맞아요. 표면 온도가 높을수록 청백색, 낮을수록 붉은색을 띠어요.',
            hint: '온도를 가장 높게, 가장 낮게 바꿔 보며 색을 비교해 보세요.'
        });
    }

    function summary(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">별의 색을 보고 표면 온도가 높은 별부터 차례로 놓으세요. 모두 맞히면 실제 표면 온도가 나타나요.</p>');
        Activities.order(body, {
            topLabel: '표면 온도가 높다', bottomLabel: '표면 온도가 낮다',
            items: [
                { value: 'rigel', label: '청백색 별 — 리겔', extra: '약 12,000 K' },
                { value: 'sirius', label: '흰색 별 — 시리우스', extra: '약 9,900 K' },
                { value: 'sun', label: '노란색 별 — 태양', extra: '약 5,800 K' },
                { value: 'aldebaran', label: '주황색 별 — 알데바란', extra: '약 3,900 K' },
                { value: 'betelgeuse', label: '붉은색 별 — 베텔게우스', extra: '약 3,500 K' }
            ],
            onSolved: () => api.completeMission()
        });
    }

    SIMS['1_3'] = { steps: [
        { title: '별의 색과 표면 온도', short: '별의 색과 온도', build: starColor },
        { title: '내용정리', short: '내용정리', build: summary }
    ] };
})();
