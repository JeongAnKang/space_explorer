// 퀘스트 1 · 미션 3 온도 — s1 오리온자리 별의 색 관측, s2 별의 색과 표면 온도, 내용정리
(function () {
    const { svgEl, layout, text } = SimKit;

    // 표면 온도(K) → 별빛 색 (수업용으로 채도를 높인 색: 적색 → 주황 → 황색 → 백색 → 청색)
    // 기준 온도 사이는 온도의 로그 값으로 부드럽게 섞음
    const COLOR_STOPS = [
        [2500, [255, 30, 10]], [3500, [255, 55, 25]], [4300, [255, 135, 20]], [5500, [255, 214, 10]],
        [6800, [255, 241, 150]], [8700, [255, 255, 255]], [12000, [170, 205, 255]], [18000, [95, 150, 255]], [30000, [45, 100, 255]]
    ];
    function tempColor(K) {
        const lk = Math.log(K);
        let i = COLOR_STOPS.findIndex(([k]) => k >= K);
        if (i <= 0) i = i === 0 ? 1 : COLOR_STOPS.length - 1;
        const [k0, c0] = COLOR_STOPS[i - 1], [k1, c1] = COLOR_STOPS[i];
        const t = Math.max(0, Math.min(1, (lk - Math.log(k0)) / (Math.log(k1) - Math.log(k0))));
        const c = c0.map((v, j) => Math.round(v + (c1[j] - v) * t));
        return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    }
    function colorName(K) {
        if (K >= 20000) return '청색';
        if (K >= 10000) return '청백색';
        if (K >= 7500) return '백색';
        if (K >= 6000) return '황백색';
        if (K >= 5000) return '황색';
        if (K >= 3700) return '주황색';
        return '붉은색';
    }
    const EXAMPLES = [
        { name: '리겔', K: 12000 }, { name: '시리우스', K: 9900 }, { name: '태양', K: 5800 },
        { name: '알데바란', K: 3900 }, { name: '베텔게우스', K: 3500 }
    ];

    // ---------- 단계 1: 오리온자리 별의 색 관측 ----------
    // 실제 위치(적경·적위)를 바탕으로 그린 오리온자리. 밤하늘처럼 동쪽이 왼쪽
    const ORION = [
        { id: 'betelgeuse', name: '베텔게우스', ra: 88.8, dec: 7.4, mag: 0.5, color: '#ff7a45', colorName: '붉은색', key: true },
        { id: 'rigel', name: '리겔', ra: 78.6, dec: -8.2, mag: 0.1, color: '#a8c8ff', colorName: '청백색', key: true },
        { id: 'bellatrix', name: '벨라트릭스', ra: 81.3, dec: 6.3, mag: 1.6, color: '#bcd0ff', colorName: '청백색' },
        { id: 'saiph', name: '사이프', ra: 86.9, dec: -9.7, mag: 2.1, color: '#bcd0ff', colorName: '청백색' },
        { id: 'alnitak', name: '알니탁', ra: 85.2, dec: -1.9, mag: 1.8, color: '#bcd0ff', colorName: '청백색' },
        { id: 'alnilam', name: '알닐람', ra: 84.05, dec: -1.2, mag: 1.7, color: '#bcd0ff', colorName: '청백색' },
        { id: 'mintaka', name: '민타카', ra: 83.0, dec: -0.3, mag: 2.2, color: '#bcd0ff', colorName: '청백색' },
        { id: 'meissa', name: '메이사', ra: 83.8, dec: 9.9, mag: 3.4, color: '#c8d6ff', colorName: '청백색' }
    ];
    const ORION_LINES = [['meissa', 'betelgeuse'], ['meissa', 'bellatrix'], ['betelgeuse', 'bellatrix'], ['betelgeuse', 'alnitak'], ['bellatrix', 'mintaka'],
        ['mintaka', 'alnilam'], ['alnilam', 'alnitak'], ['alnitak', 'saiph'], ['mintaka', 'rigel']];

    function orion(body, api) {
        body.insertAdjacentHTML('beforeend', `<p class="lead">겨울철 남쪽 하늘에서 그림과 같은 별자리를 본 적이 있나요? <b>[별자리 선 보기]</b>를 눌러 보세요.</p>
            <div><button type="button" class="btn btn-primary" id="or-lines" aria-pressed="false">별자리 선 보기</button></div>
            <p class="lead" id="or-guide" hidden><b>오리온자리</b>를 관측해 보세요. 왼쪽 위의 <b class="key-gold">베텔게우스</b>와 오른쪽 아래의 <b class="key-gold">리겔</b>은 둘 다 아주 밝은 별이지만 <b>색이 서로 달라요</b>. 별을 눌러 색을 확인해 보세요.</p>`);
        const { view, ctrl } = layout(body);
        const W = 640, H = 430;
        const K = 18, X = ra => 320 + (84.4 - ra) * K, Y = dec => 212 - dec * K;   // 가로·세로 같은 비율
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': '오리온자리: 붉은색 베텔게우스와 청백색 리겔' }, view);
        const defs = svgEl('defs', {}, svg);
        // 배경의 희미한 별
        let seed = 17; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
        for (let i = 0; i < 90; i++) svgEl('circle', { cx: rnd() * W, cy: rnd() * H, r: rnd() * 1.1 + .3, fill: '#dfe6ff', opacity: .25 + rnd() * .4 }, svg);
        const lines = svgEl('g', { stroke: '#8fb4ff', 'stroke-opacity': .45, 'stroke-width': 1.5, style: 'display:none' }, svg);
        const names = [];   // 별 이름표 (별자리 선을 보면 나타남)
        const pos = id => { const st = ORION.find(x => x.id === id); return [X(st.ra), Y(st.dec)]; };
        ORION_LINES.forEach(([a, b]) => { const p = pos(a), q = pos(b); svgEl('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1] }, lines); });
        const ring = svgEl('circle', { r: 26, fill: 'none', stroke: '#f5c451', 'stroke-width': 2, style: 'display:none' }, svg);
        ctrl.innerHTML = `
            <div class="readout">
                <div class="row"><span>별 이름</span><b id="or-name">별을 눌러 보세요</b></div>
                <div class="row"><span>보이는 색</span><b id="or-color">—</b></div>
            </div>
            <p class="note">별의 색이 다른 까닭은 다음 단계에서 알아봐요.</p>`;
        const seen = new Set();
        ORION.forEach(st => {
            // (이름표는 별자리 선을 보기 전까지 숨김)
            const x = X(st.ra), y = Y(st.dec), core = Math.max(2.2, 6.5 - st.mag * 1.3);
            const gid = `or-${st.id}`;
            const gr = svgEl('radialGradient', { id: gid }, defs);
            svgEl('stop', { offset: '0%', 'stop-color': st.color, 'stop-opacity': .75 }, gr);
            svgEl('stop', { offset: '100%', 'stop-color': st.color, 'stop-opacity': 0 }, gr);
            const g = svgEl('g', { style: 'cursor:pointer;outline:none', tabindex: 0, role: 'button', 'aria-label': st.name }, svg);
            svgEl('circle', { cx: x, cy: y, r: core * 4, fill: `url(#${gid})` }, g);
            svgEl('circle', { cx: x, cy: y, r: core, fill: st.color }, g);
            svgEl('circle', { cx: x, cy: y, r: 24, fill: 'transparent' }, g);
            if (st.key) names.push(text(svg, x + (st.id === 'rigel' ? 30 : -28), y + (st.id === 'rigel' ? 6 : -20), st.name, { 'text-anchor': st.id === 'rigel' ? 'start' : 'end', fill: st.color, 'font-weight': 800, 'font-size': 15 }));
            const show = () => {
                ring.style.display = ''; ring.setAttribute('cx', x); ring.setAttribute('cy', y);
                ctrl.querySelector('#or-name').textContent = revealed ? st.name : '별자리 선을 먼저 보세요';
                const c = ctrl.querySelector('#or-color');
                c.textContent = st.colorName; c.style.color = st.color;
                seen.add(st.id);
            };
            g.addEventListener('click', show);
            g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(); } });
        });
        names.forEach(t => { t.style.display = 'none'; });   // 처음에는 별 이름을 숨김
        // [별자리 선 보기] → 선·이름표·관측 안내·탐구 질문이 나타남 (다시 누르면 선만 숨김)
        let revealed = false;
        const linesBtn = body.querySelector('#or-lines');
        linesBtn.addEventListener('click', () => {
            const on = linesBtn.getAttribute('aria-pressed') !== 'true';
            linesBtn.setAttribute('aria-pressed', String(on));
            linesBtn.textContent = on ? '별자리 선 숨기기' : '별자리 선 보기';
            linesBtn.classList.toggle('btn-primary', !on);
            lines.style.display = on ? '' : 'none';
            if (on && !revealed) {
                revealed = true;
                names.forEach(t => { t.style.display = ''; });
                body.querySelector('#or-guide').hidden = false;
                qz.hidden = false;
                ctrl.querySelector('#or-name').textContent = '별을 눌러 보세요';
            }
        });
        // 탐구 질문: 두 별의 색을 드롭다운에서 고르기
        const COLORS = ['붉은색', '주황색', '황색', '황백색', '백색', '청백색', '청색'];
        const opts = `<option value="">색 고르기</option>` + COLORS.map(c => `<option value="${c}">${c}</option>`).join('');
        const qz = document.createElement('div');
        qz.className = 'quiz';
        qz.innerHTML = `<div class="q"><span class="q-label">탐구 질문</span>오리온자리의 베텔게우스와 리겔은 각각 어떤 색으로 보이나요?</div>
            <div class="pick-row">
                <label for="pick-bet">베텔게우스</label><select id="pick-bet" class="pick">${opts}</select>
                <label for="pick-rig">리겔</label><select id="pick-rig" class="pick">${opts}</select>
                <button type="button" class="btn btn-primary" id="pick-check">확인</button>
            </div>
            <div class="feedback" aria-live="polite"></div>`;
        qz.hidden = true;
        body.appendChild(qz);
        const fb = qz.querySelector('.feedback');
        qz.querySelector('#pick-check').addEventListener('click', () => {
            const bet = qz.querySelector('#pick-bet'), rig = qz.querySelector('#pick-rig');
            if (!bet.value || !rig.value) { fb.className = 'feedback'; fb.textContent = '두 별의 색을 모두 골라 주세요.'; return; }
            const okB = bet.value === '붉은색', okR = rig.value === '청백색';
            bet.classList.toggle('right', okB); bet.classList.toggle('wrong', !okB);
            rig.classList.toggle('right', okR); rig.classList.toggle('wrong', !okR);
            if (okB && okR) {
                fb.className = 'feedback ok';
                fb.textContent = '맞아요. 베텔게우스는 붉은색, 리겔은 청백색으로 보여요. 별마다 색이 다른 까닭을 다음 단계에서 알아봐요.';
                api.done();
            } else {
                fb.className = 'feedback';
                fb.textContent = '빨간 테두리의 답을 다시 생각해 보세요. 그림에서 별을 눌러 색을 확인할 수 있어요.';
            }
        });
    }

    // ---------- 단계 2: 별의 색과 표면 온도 ----------
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
            options: ['붉은색', '황색', '청백색'], answer: 2,
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
                { value: 'sirius', label: '백색 별 — 시리우스', extra: '약 9,900 K' },
                { value: 'sun', label: '황색 별 — 태양', extra: '약 5,800 K' },
                { value: 'aldebaran', label: '주황색 별 — 알데바란', extra: '약 3,900 K' },
                { value: 'betelgeuse', label: '붉은색 별 — 베텔게우스', extra: '약 3,500 K' }
            ],
            onSolved: () => api.completeMission()
        });
    }

    SIMS['1_3'] = { steps: [
        { title: '오리온자리 별의 색 관측', short: '오리온자리 관측', build: orion },
        { title: '별의 색과 표면 온도', short: '별의 색과 표면 온도', build: starColor },
        { title: '내용정리', short: '내용정리', build: summary }
    ] };
})();
