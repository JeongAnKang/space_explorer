// 퀘스트 1 · 미션 2 밝기 — s1 히파르코스 별의 밝기(등성), s2 밝기와 거리, s3 겉보기 등급과 절대 등급, 내용정리
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
            <p class="note" id="hip-fact" hidden>히파르코스는 <b class="key-gold">가장 밝은 별</b>을 <b class="key-gold">1등성</b>, 맨눈으로 <b class="key-gold">겨우 보이는 별</b>을 <b class="key-gold">6등성</b>으로 나누었어요. 오늘날 측정해 보니 <b class="key-gold">1등성은 6등성보다 약 100배</b> 밝았어요. 지금은 이를 바탕으로 별의 밝기를 '등급'으로 나타내며, <b class="key-gold">1등급 차이</b>는 <b class="key-gold">약 2.5배</b> 밝기 차이예요. <b class="key-gold">숫자가 작을수록 밝은 별</b>이에요.</p>`;
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
        // 광원을 가운데 두고 빛이 구면으로 퍼지는 모습을 아래쪽 반구(그릇 모양)로 표현
        // 위에서 비스듬히 내려다본 모습: 반구 안쪽 바닥에 빛 다발이 닿는 넓이 = d × d 칸, 한 칸의 밝기 = 1/d²
        const W = 640, H = 290, CX = 290, CY = 70, U = 60, TAN = .25;
        const SIN = .3;                                            // 시점: 낮을수록 광원이 있는 단면(입구 타원)이 납작하게 보임
        const COS = Math.sqrt(1 - SIN * SIN);                      // 구의 바깥 윤곽은 항상 원(반지름 R)
        const CELL = 2 * U * TAN;                                   // 한 칸의 크기는 거리와 상관없이 같음
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': '광원에서 반구 모양으로 퍼지는 빛과 거리에 따라 넓어지는 면적' }, view);
        const defs = svgEl('defs', {}, svg);
        const src = svgEl('radialGradient', { id: 'bdSrc' }, defs);
        svgEl('stop', { offset: '0%', 'stop-color': '#fffbe6' }, src);
        svgEl('stop', { offset: '30%', 'stop-color': '#f5c451', 'stop-opacity': .9 }, src);
        svgEl('stop', { offset: '100%', 'stop-color': '#f5c451', 'stop-opacity': 0 }, src);
        const bowlG = svgEl('radialGradient', { id: 'bdBowl', cx: '42%', cy: '28%', r: '75%' }, defs);
        svgEl('stop', { offset: '0%', 'stop-color': '#f5c451', 'stop-opacity': .2 }, bowlG);
        svgEl('stop', { offset: '60%', 'stop-color': '#f5c451', 'stop-opacity': .07 }, bowlG);
        svgEl('stop', { offset: '100%', 'stop-color': '#f5c451', 'stop-opacity': .02 }, bowlG);
        const scene = svgEl('g', {}, svg);
        // 3차원 점(x: 좌우, y: 위아래(아래가 -), z: 앞뒤) → 화면
        const P = (x, y, z) => [CX + x, CY - y * COS + z * SIN];

        ctrl.innerHTML = `
            <div><div class="seg" role="group" aria-label="광원까지의 거리">
                <button type="button" data-r="1" aria-pressed="true">거리 1</button>
                <button type="button" data-r="2" aria-pressed="false">거리 2</button>
                <button type="button" data-r="3" aria-pressed="false">거리 3</button>
            </div></div>
            <div class="readout">
                <div class="row"><span>빛이 비추는 칸 수</span><b id="bd-n"></b></div>
                <div class="row"><span>한 칸의 밝기</span><b id="bd-b"></b></div>
            </div>
            <p class="note">별의 밝기는 거리의 제곱에 반비례해요. <b class="key-gold" style="white-space:nowrap">밝기 ∝ 1 / 거리²</b></p>`;
        let r = 1;
        function draw() {
            scene.innerHTML = '';
            const ry = k => U * k * SIN;                            // 반구 입구(적도) 타원의 세로 반지름
            // 큰 반구부터 그림 (지금 거리의 반구만 또렷하게)
            [3, 2, 1].forEach(k => {
                const on = k === r, R = U * k;
                // 그릇 안쪽 면 (아래쪽 반원 + 뒤쪽 입구)
                svgEl('path', { d: `M${CX - R} ${CY} A${R} ${R} 0 0 0 ${CX + R} ${CY} A${R} ${ry(k)} 0 0 0 ${CX - R} ${CY} Z`,
                    fill: on ? 'url(#bdBowl)' : 'none' }, scene);
                // 뒤쪽 입구 테두리 (실선)
                svgEl('path', { d: `M${CX - R} ${CY} A${R} ${ry(k)} 0 0 1 ${CX + R} ${CY}`, fill: 'none', stroke: '#f5c451',
                    'stroke-width': on ? 2 : 1, 'stroke-opacity': on ? .85 : .25 }, scene);
                // 그릇 바깥선 (아래쪽 반원)
                svgEl('path', { d: `M${CX - R} ${CY} A${R} ${R} 0 0 0 ${CX + R} ${CY}`, fill: 'none', stroke: '#f5c451',
                    'stroke-width': on ? 2.5 : 1, 'stroke-opacity': on ? .95 : .3, 'stroke-dasharray': on ? '' : '5 6' }, scene);
                // 앞쪽 입구 테두리
                svgEl('path', { d: `M${CX + R} ${CY} A${R} ${ry(k)} 0 0 1 ${CX - R} ${CY}`, fill: 'none', stroke: '#f5c451',
                    'stroke-width': on ? 2 : 1, 'stroke-opacity': on ? .85 : .25 }, scene);
                // 구의 둥근 느낌: 위도선(가로 고리) 두 줄. 앞쪽은 실선, 뒤쪽은 점선
                if (on) [30, 60].forEach(deg => {
                    const t = deg * Math.PI / 180, rr = R * Math.cos(t), yc = CY + R * Math.sin(t) * COS, rv = rr * SIN;
                    svgEl('path', { d: `M${CX - rr} ${yc} A${rr} ${rv} 0 0 1 ${CX + rr} ${yc}`, fill: 'none', stroke: '#f5c451', 'stroke-opacity': .22, 'stroke-dasharray': '3 5' }, scene);
                    svgEl('path', { d: `M${CX + rr} ${yc} A${rr} ${rv} 0 0 1 ${CX - rr} ${yc}`, fill: 'none', stroke: '#f5c451', 'stroke-opacity': .4 }, scene);
                });
                const lab = text(scene, CX + R * .8 + 10, CY + R * .6 + 4, `거리 ${k}`, { fill: on ? '#f5c451' : '#6f78a8', 'font-weight': on ? 800 : 600, style: 'cursor:pointer' });
                lab.addEventListener('click', () => select(k));
            });
            // 바닥에 닿는 사각형의 네 모서리 (거리 k의 반구 바닥, 넓이 k×k 칸)
            const floorY = k => -U * k + (CELL * k / 2) * SIN / COS;   // 사각형이 반구 안쪽 바닥에 놓이도록 살짝 올림
            const corners = k => { const h = CELL * k / 2, y = floorY(k); return [P(-h, y, -h), P(h, y, -h), P(h, y, h), P(-h, y, h)]; };
            // 다른 거리의 사각형은 흐린 윤곽
            [1, 2, 3].forEach(k => {
                if (k === r) return;
                svgEl('polygon', { points: corners(k).map(p => p.join(',')).join(' '), fill: 'none', stroke: '#6f78a8', 'stroke-dasharray': '3 4' }, scene);
            });
            // 같은 빛 다발: 광원에서 지금 거리의 바닥까지 퍼지는 사각뿔
            const beam = corners(r);
            svgEl('polygon', { points: [[CX, CY], beam[0], beam[1]].map(p => p.join(',')).join(' '), fill: '#f5c451', opacity: .06 }, scene);
            svgEl('polygon', { points: [[CX, CY], beam[3], beam[2]].map(p => p.join(',')).join(' '), fill: '#f5c451', opacity: .1 }, scene);
            beam.forEach(p => svgEl('line', { x1: CX, y1: CY, x2: p[0], y2: p[1], stroke: '#f5c451', 'stroke-dasharray': '4 4', opacity: .65 }, scene));
            // 지금 거리의 바닥에 닿은 사각형: r × r 칸, 한 칸 밝기 1/r²
            const shade = 1 / (r * r), h = CELL * r / 2, yb = floorY(r);
            for (let i = 0; i < r; i++) for (let j = 0; j < r; j++) {
                const x0 = -h + i * CELL, z0 = -h + j * CELL;
                const q = [P(x0, yb, z0), P(x0 + CELL, yb, z0), P(x0 + CELL, yb, z0 + CELL), P(x0, yb, z0 + CELL)];
                svgEl('polygon', { points: q.map(p => p.join(',')).join(' '), fill: '#ffe27a', 'fill-opacity': .18 + .82 * shade, stroke: '#070a1d', 'stroke-width': 1.5 }, scene);
            }
            const cur = corners(r);
            svgEl('polygon', { points: cur.map(p => p.join(',')).join(' '), fill: 'none', stroke: '#f5c451', 'stroke-width': 2 }, scene);
            text(scene, cur[1][0] + 8, cur[1][1] - 6, `${r * r}칸`, { fill: '#f5c451', 'font-weight': 800, 'font-size': 15 });
            // 광원 (반구의 중심)
            svgEl('circle', { cx: CX, cy: CY, r: 30, fill: 'url(#bdSrc)' }, scene);
            svgEl('circle', { cx: CX, cy: CY, r: 7, fill: '#fffbe6' }, scene);
            text(scene, CX, CY - 22, '광원', { 'text-anchor': 'middle', fill: '#eef1ff', 'font-weight': 700 });
            ctrl.querySelector('#bd-n').textContent = `${r * r}칸`;
            ctrl.querySelector('#bd-b').textContent = r === 1 ? '1' : `1/${r * r}`;
            ctrl.querySelectorAll('[data-r]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.r === r)));
        }
        function select(k) { r = k; draw(); }
        ctrl.querySelectorAll('[data-r]').forEach(b => b.addEventListener('click', () => select(+b.dataset.r)));
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
                '별의 밝기는 거리의 제곱에 [[반비례]]한다.',
                '등급의 숫자가 작을수록 [[밝은]] 별이며, 1등급 별은 6등급 별보다 약 [[100배]] 밝다.',
                '별을 [[10 pc]] 거리에 두었다고 가정했을 때의 등급을 절대 등급이라고 한다.',
                '별의 실제 밝기를 비교할 때는 [[절대 등급]]을 사용한다.'
            ],
            extras: ['7등성', '어두운', '10배', '1 pc', '겉보기 등급', '비례'],
            onSolved: () => api.completeMission()
        });
    }

    SIMS['1_2'] = { steps: [
        { title: '히파르코스 별의 밝기', short: '히파르코스 별의 밝기', build: hipparchus },
        { title: '밝기와 거리', short: '밝기와 거리', build: brightnessDistance },
        { title: '겉보기 등급과 절대 등급', short: '겉보기·절대 등급', build: apparentAbsolute },
        { title: '내용정리', short: '내용정리', build: summary }
    ] };
})();
