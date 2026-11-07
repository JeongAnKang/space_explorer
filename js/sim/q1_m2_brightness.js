// 퀘스트 1 · 미션 2 밝기 — s1 히파르코스 별의 밝기(등성), s2 겉보기 등급과 절대 등급, s3 밝기와 거리, 내용정리
(function () {
    const { svgEl, layout, text } = SimKit;

    // 등급(등성) → 그림 속 별의 밝기. 별의 크기는 모두 같고, 빛의 세기와 번짐만 달라짐
    // (등급이 1 작아질 때마다 한 단계씩 밝게. 맨눈으로 보는 별처럼 점으로 표현)
    const starLook = m => {
        const flux = Math.pow(2.512, -(m - 1));                      // 1등성(1등급)을 1로 한 실제 밝기 비
        return {
            r: 3,                                                    // 별 자체 크기는 고정
            core: Math.max(.1, Math.min(1, Math.pow(flux, .5))),      // 눈에 보이는 빛의 세기: 1, .63, .40, .25, .16, .10
            glow: Math.min(1.6, Math.pow(flux, .7)),                  // 주변으로 번지는 빛
            rays: flux >= .9                                         // 아주 밝은 별만 빛줄기
        };
    };
    function drawStar(parent, x, y, m, color = '#fff6dc') {
        const g = svgEl('g', { transform: `translate(${x} ${y})` }, parent);
        const { r, core, glow, rays } = starLook(m);
        svgEl('circle', { r: 16, fill: color, opacity: Math.min(1, glow) * .14 }, g);
        svgEl('circle', { r: 8, fill: color, opacity: Math.min(1, glow) * .32 }, g);
        if (rays) {
            const L = 8 + glow * 8;
            svgEl('path', { d: `M${-L} 0H${L}M0 ${-L}V${L}`, stroke: color, 'stroke-width': 1, opacity: .75 }, g);
        }
        svgEl('circle', { r, fill: color, opacity: core }, g);
        return g;
    }

    // ---------- 등급(등성) 사이의 밝기 차이 그림 ----------
    // 1~6을 밝은 순서로 늘어놓고, 이웃 사이 '약 2.5배', 양 끝 사이 '약 100배'를 화살표로 표시
    function brightnessLadder(unit) {
        const wrap = document.createElement('div');
        wrap.className = 'sim-view';
        const W = 900, H = 200, Y = 108, xs = [0, 1, 2, 3, 4, 5].map(i => 80 + i * 148);
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `1${unit}은 이웃한 ${unit}보다 약 2.5배, 6${unit}보다 약 100배 밝다` }, wrap);
        const defs = svgEl('defs', {}, svg);
        const marker = svgEl('marker', { id: `lad-arrow-${unit}`, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto' }, defs);
        svgEl('path', { d: 'M0 0L10 5L0 10z', fill: '#f5c451' }, marker);
        xs.forEach((x, i) => {
            const flux = Math.pow(2.512, -i);                 // 1을 기준으로 한 밝기
            const a = Math.pow(flux, .33);                     // 눈에 보이는 빛의 세기
            const g = svgEl('radialGradient', { id: `lad-g${unit}${i}` }, defs);
            svgEl('stop', { offset: '0%', 'stop-color': '#fffbe0', 'stop-opacity': a }, g);
            svgEl('stop', { offset: '35%', 'stop-color': '#f2dc4a', 'stop-opacity': a * .85 }, g);
            svgEl('stop', { offset: '100%', 'stop-color': '#f2dc4a', 'stop-opacity': 0 }, g);
            svgEl('circle', { cx: x, cy: Y, r: 54 - i * 5, fill: `url(#lad-g${unit}${i})` }, svg);
            text(svg, x, Y + 6, `${i + 1}${unit}`, { 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800,
                fill: i < 2 ? '#2a2100' : '#fff6cf', stroke: i < 2 ? 'none' : '#070a1d', 'stroke-width': 3, 'paint-order': 'stroke' });
            if (i < 5) {
                const x1 = xs[i + 1] - 34, x0 = x + 34;
                svgEl('line', { x1, y1: 40, x2: x0, y2: 40, stroke: '#f5c451', 'stroke-width': 3, 'marker-end': `url(#lad-arrow-${unit})` }, svg);
                text(svg, (x0 + x1) / 2, 28, '약 2.5배 밝음', { 'text-anchor': 'middle', fill: '#f5c451', 'font-size': 14, 'font-weight': 700 });
            }
        });
        svgEl('line', { x1: W - 92, y1: 182, x2: 78, y2: 182, stroke: '#f5c451', 'stroke-width': 3, 'marker-end': `url(#lad-arrow-${unit})` }, svg);
        text(svg, W / 2, 172, '약 100배 밝음', { 'text-anchor': 'middle', fill: '#f5c451', 'font-size': 16, 'font-weight': 800 });
        text(svg, 16, 188, '밝다', { fill: '#eef1ff', 'font-size': 17, 'font-weight': 800 });
        text(svg, W - 16, 188, '어둡다', { 'text-anchor': 'end', fill: '#eef1ff', 'font-size': 17, 'font-weight': 800 });
        return wrap;
    }

    // ---------- 단계 1: 히파르코스 별의 밝기 (등성) ----------
    function hipparchus(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">약 2,100년 전 그리스의 히파르코스는 맨눈에 보이는 별을 밝기에 따라 나누었어요. 밤하늘의 별을 <b>가장 밝은 별부터 차례로</b> 눌러 1등성부터 6등성까지 나누어 보세요. 별의 크기가 아니라 <b>빛의 밝기</b>를 비교해요.</p>');
        const { view, ctrl } = layout(body);
        const W = 640, H = 360;
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': '밝기가 다른 별 여섯 개' }, view);
        const spots = [[120, 250, 3], [470, 90, 1], [300, 160, 5], [540, 270, 2], [210, 70, 6], [380, 300, 4]];
        let next = 1;
        ctrl.innerHTML = `<div class="readout" id="hip-list"><div class="row"><span>다음에 누를 별</span><b id="hip-next">1등성</b></div></div>
            <p class="note" id="hip-fact" hidden>히파르코스는 <b class="key-gold">가장 밝은 별</b>을 <b class="key-gold">1등성</b>, 맨눈으로 <b class="key-gold">겨우 보이는 별</b>을 <b class="key-gold">6등성</b>으로 나누었어요. 오늘날 측정해 보니 <b class="key-gold">1등성은 6등성보다 약 100배</b> 밝았어요. 지금은 이를 바탕으로 별의 밝기를 '등급'으로 나타내며, <b class="key-gold">1등급 차이</b>는 <b class="key-gold">약 2.5배</b> 밝기 차이예요.</p>`;
        spots.forEach(([x, y, g]) => {
            const s = drawStar(svg, x, y, g);
            const hit = svgEl('circle', { cx: 0, cy: 0, r: 30, fill: 'transparent', style: 'cursor:pointer' }, s);
            hit.addEventListener('click', () => {
                if (s.dataset.done) return;
                if (g !== next) { toast('남은 별 중에 더 밝은 별이 있어요.'); return; }
                s.dataset.done = '1';
                text(svg, x, y + 34, `${g}등성`, { 'text-anchor': 'middle', fill: '#f5c451', 'font-size': 15, 'font-weight': 700 });
                next++;
                ctrl.querySelector('#hip-next').textContent = next <= 6 ? `${next}등성` : '모두 완료';
                if (next > 6) {
                    ctrl.querySelector('#hip-fact').hidden = false;
                    ladder.hidden = false;
                    quizBox.hidden = false;
                }
            });
        });
        const ladder = brightnessLadder('등성');
        ladder.hidden = true;
        body.appendChild(ladder);
        const holder = document.createElement('div'); body.appendChild(holder);
        const quizBox = api.quiz(holder, {
            q: '1등성은 6등성보다 약 몇 배 밝을까요?',
            options: ['약 6배', '약 2.5배', '약 100배'], answer: 2,
            explain: '맞아요. 1등성은 6등성보다 약 100배 밝아요. 숫자가 작을수록 밝은 별이에요.',
            hint: '아래 그림에서 1등성과 6등성 사이의 화살표를 살펴보세요.'
        });
        quizBox.hidden = true;
    }

    // ---------- 단계 2: 겉보기 등급과 절대 등급 ----------
    const STARS = { A: { d: 10, M: 2.0, color: '#fff6dc' }, B: { d: 40, M: 0.0, color: '#cfe0ff' }, C: { d: 2.5, M: 5.0, color: '#ffd9a8' } };
    const mag = (M, d) => M + 5 * Math.log10(d / 10);

    function apparentAbsolute(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">우리 눈에 보이는 밝기는 별까지의 거리에 따라 달라요. 지구에서 보이는 밝기를 <b>겉보기 등급</b>, 모든 별을 <b>10 pc</b> 거리에 두었다고 가정한 밝기를 <b>절대 등급</b>이라고 해요. 별을 골라 10 pc 위치로 옮겨 보세요.</p>');
        const { view, ctrl } = layout(body);
        const W = 640, H = 300, X0 = 60, PX = 13.5, AY = 220;
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': '별까지의 거리와 밝기' }, view);
        // 지구에서 본 모습
        svgEl('rect', { x: 20, y: 16, width: 200, height: 120, rx: 10, fill: '#070a1d', stroke: '#2f3b78' }, svg);
        text(svg, 30, 36, '지구에서 본 모습');
        const skyStar = svgEl('g', {}, svg);
        // 거리 축
        svgEl('line', { x1: X0, y1: AY, x2: X0 + 40 * PX, y2: AY, stroke: '#2f3b78', 'stroke-width': 2 }, svg);
        [0, 10, 20, 30, 40].forEach(v => {
            svgEl('line', { x1: X0 + v * PX, y1: AY - 6, x2: X0 + v * PX, y2: AY + 6, stroke: '#6f78a8' }, svg);
            text(svg, X0 + v * PX, AY + 26, `${v} pc`, { 'text-anchor': 'middle' });
        });
        svgEl('line', { x1: X0 + 10 * PX, y1: 150, x2: X0 + 10 * PX, y2: AY + 6, stroke: '#4fd1b5', 'stroke-dasharray': '5 5', 'stroke-width': 2 }, svg);
        text(svg, X0 + 10 * PX + 8, 162, '10 pc (절대 등급 기준)', { fill: '#4fd1b5' });
        svgEl('circle', { cx: X0, cy: AY, r: 10, fill: '#4f8dff' }, svg);
        text(svg, X0, AY + 50, '지구', { 'text-anchor': 'middle' });
        const onAxis = svgEl('g', {}, svg);

        ctrl.innerHTML = `
            <div><div class="seg" role="group" aria-label="별 고르기">
                <button type="button" data-s="A" aria-pressed="true">별 A</button>
                <button type="button" data-s="B" aria-pressed="false">별 B</button>
                <button type="button" data-s="C" aria-pressed="false">별 C</button>
            </div></div>
            <div class="slider"><label for="mv-d">별까지의 거리 <output id="mv-d-out"></output></label>
                <input id="mv-d" type="range" min="2.5" max="40" step="0.5" value="10"></div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
                <button type="button" class="btn" id="to-real">실제 거리로</button>
                <button type="button" class="btn" id="to-10">10 pc로 옮기기</button>
            </div>
            <div class="readout"><div class="row"><span>지금 보이는 등급</span><b id="mv-m"></b></div></div>
            <table class="data-table"><tr><th>별</th><th>실제 거리</th><th>겉보기 등급</th><th>절대 등급</th></tr>
                <tr><td>A</td><td>10 pc</td><td id="tA-m">?</td><td id="tA-M">?</td></tr>
                <tr><td>B</td><td>40 pc</td><td id="tB-m">?</td><td id="tB-M">?</td></tr>
                <tr><td>C</td><td>2.5 pc</td><td id="tC-m">?</td><td id="tC-M">?</td></tr></table>`;
        const slider = ctrl.querySelector('#mv-d');
        let sel = 'A';
        function draw() {
            const s = STARS[sel], d = parseFloat(slider.value), m = mag(s.M, d);
            onAxis.innerHTML = ''; skyStar.innerHTML = '';
            drawStar(onAxis, X0 + d * PX, AY - 40, 2, s.color);
            text(onAxis, X0 + d * PX, AY - 70, `별 ${sel}`, { 'text-anchor': 'middle', fill: '#eef1ff', 'font-weight': 700 });
            drawStar(skyStar, 120, 84, m, s.color);
            ctrl.querySelector('#mv-d-out').textContent = `${d} pc`;
            ctrl.querySelector('#mv-m').textContent = `${m.toFixed(1)}등급`;
            if (Math.abs(d - s.d) < 0.01) ctrl.querySelector(`#t${sel}-m`).textContent = m.toFixed(1);
            if (Math.abs(d - 10) < 0.01) ctrl.querySelector(`#t${sel}-M`).textContent = s.M.toFixed(1);
        }
        ctrl.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => {
            sel = b.dataset.s;
            ctrl.querySelectorAll('[data-s]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
            slider.value = STARS[sel].d; draw();
        }));
        ctrl.querySelector('#to-real').addEventListener('click', () => { slider.value = STARS[sel].d; draw(); });
        ctrl.querySelector('#to-10').addEventListener('click', () => { slider.value = 10; draw(); });
        slider.addEventListener('input', draw);
        draw();
        api.quiz(body, {
            q: '세 별 중 실제로 가장 밝은(빛을 가장 많이 내는) 별은 어느 것일까요?',
            options: ['별 A', '별 B', '별 C'], answer: 1,
            explain: '맞아요. 별 B는 멀리 있어서 어둡게 보이지만 절대 등급이 0.0으로 가장 작아요. 실제 밝기는 절대 등급으로 비교해요.',
            hint: '세 별을 모두 10 pc로 옮겨 절대 등급을 비교해 보세요. 등급의 숫자가 작을수록 밝아요.'
        });
    }

    // ---------- 단계 3: 밝기와 거리 ----------
    function brightnessDistance(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">광원에서 나온 빛은 멀어질수록 더 넓은 면적으로 퍼져요. 거리를 바꾸며 빛이 비추는 칸 수와 한 칸의 밝기를 비교해 보세요.</p>');
        const { view, ctrl } = layout(body);
        const W = 640, H = 340, LX = 60, LY = 170, U = 150, CELL = 30;
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': '거리에 따라 퍼지는 빛' }, view);
        const scene = svgEl('g', {}, svg);
        ctrl.innerHTML = `
            <div class="slider"><label for="bd-r">광원까지의 거리 <output id="bd-r-out"></output></label>
                <input id="bd-r" type="range" min="1" max="3" step="1" value="1"></div>
            <div class="readout">
                <div class="row"><span>빛이 비추는 칸 수</span><b id="bd-n"></b></div>
                <div class="row"><span>한 칸의 밝기</span><b id="bd-b"></b></div>
            </div>
            <p class="note">별의 밝기는 거리의 제곱에 반비례해요. 밝기 ∝ 1 / 거리²</p>`;
        const slider = ctrl.querySelector('#bd-r');
        function draw() {
            const r = parseInt(slider.value, 10);
            scene.innerHTML = '';
            const x = LX + r * U, side = r * CELL, top = LY - side / 2;
            svgEl('polygon', { points: `${LX},${LY} ${x},${top} ${x},${top + side}`, fill: '#f5c451', opacity: .18 }, scene);
            svgEl('line', { x1: LX, y1: LY, x2: x, y2: top, stroke: '#f5c451', 'stroke-dasharray': '4 4' }, scene);
            svgEl('line', { x1: LX, y1: LY, x2: x, y2: top + side, stroke: '#f5c451', 'stroke-dasharray': '4 4' }, scene);
            const shade = 1 / (r * r);
            for (let i = 0; i < r; i++) for (let j = 0; j < r; j++) {
                svgEl('rect', { x: x + i * CELL * .5, y: top + j * CELL, width: CELL * .5, height: CELL, fill: '#f5c451', opacity: .15 + .85 * shade, stroke: '#070a1d' }, scene);
            }
            svgEl('circle', { cx: LX, cy: LY, r: 14, fill: '#fff1c2' }, scene);
            text(scene, LX, LY + 34, '광원', { 'text-anchor': 'middle' });
            [1, 2, 3].forEach(k => text(scene, LX + k * U, H - 18, `거리 ${k}`, { 'text-anchor': 'middle', fill: k === r ? '#f5c451' : '#6f78a8' }));
            ctrl.querySelector('#bd-r-out').textContent = `${r}`;
            ctrl.querySelector('#bd-n').textContent = `${r * r}칸`;
            ctrl.querySelector('#bd-b').textContent = r === 1 ? '1' : `1/${r * r}`;
        }
        slider.addEventListener('input', draw);
        draw();
        api.quiz(body, {
            q: '같은 별이 지금보다 3배 먼 곳에 있다면 밝기는 어떻게 될까요?',
            options: ['1/3로 어두워진다', '1/9로 어두워진다', '3배 밝아진다'], answer: 1,
            explain: '맞아요. 거리가 3배가 되면 빛이 9배 넓게 퍼지므로 밝기는 1/9이 돼요.',
            hint: '거리 3일 때 빛이 비추는 칸 수를 세어 보세요.'
        });
    }

    // ---------- 내용정리 ----------
    function summary(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">카드를 빈칸에 놓고 [확인]을 누르세요.</p>');
        Activities.fill(body, {
            lines: [
                '히파르코스는 맨눈에 보이는 별을 밝기에 따라 1등성부터 [[6등성]]까지 나누었다.',
                '등급의 숫자가 작을수록 [[밝은]] 별이며, 1등급 별은 6등급 별보다 약 [[100배]] 밝다.',
                '별을 [[10 pc]] 거리에 두었다고 가정했을 때의 등급을 절대 등급이라고 한다.',
                '별의 실제 밝기를 비교할 때는 [[절대 등급]]을 사용한다.',
                '별의 밝기는 거리의 제곱에 [[반비례]]한다.'
            ],
            extras: ['7등성', '어두운', '10배', '1 pc', '겉보기 등급', '비례'],
            onSolved: () => api.completeMission()
        });
    }

    SIMS['1_2'] = { steps: [
        { title: '히파르코스 별의 밝기', short: '히파르코스 별의 밝기', build: hipparchus },
        { title: '겉보기 등급과 절대 등급', short: '겉보기·절대 등급', build: apparentAbsolute },
        { title: '밝기와 거리', short: '밝기와 거리', build: brightnessDistance },
        { title: '내용정리', short: '내용정리', build: summary }
    ] };
})();
