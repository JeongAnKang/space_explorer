// 퀘스트 1 · 미션 1 거리 — s1 시차, s2 연주시차, 내용정리
(function () {
    const { svgEl, layout } = SimKit;

    // ---------- 단계 1: 시차 ----------
    function parallaxIntro(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">팔을 뻗어 연필을 세우고 한쪽 눈씩 번갈아 감아 보면, 연필이 뒤쪽 배경에 대해 움직여 보여요. 관측 위치에 따라 물체의 위치가 달라 보이는 각을 <b>시차</b>라고 해요.</p>');
        const { view, ctrl } = layout(body);
        const W = 640, H = 380, BG = 48, EYE_Y = 340, LX = 296, RX = 344, PX = 320;
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': '두 눈으로 연필을 볼 때의 시차' }, view);
        // 배경 눈금판
        svgEl('rect', { x: 20, y: 14, width: W - 40, height: 52, rx: 8, fill: '#1d2758', stroke: '#2f3b78' }, svg);
        for (let i = 0; i <= 30; i++) {
            const x = 32 + i * ((W - 64) / 30);
            svgEl('line', { x1: x, y1: BG - (i % 5 ? 6 : 12), x2: x, y2: BG + 2, stroke: '#a9b1d9', 'stroke-width': 1.5 }, svg);
            if (i % 5 === 0) { const t = svgEl('text', { x, y: 30, 'text-anchor': 'middle', fill: '#a9b1d9', 'font-size': 13 }, svg); t.textContent = i; }
        }
        const tickAt = x => (x - 32) / ((W - 64) / 30);
        const sight = svgEl('line', { stroke: '#f5c451', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
        const sight2 = svgEl('line', { stroke: '#8fb4ff', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
        const mark = svgEl('polygon', { fill: '#f5c451' }, svg);
        const mark2 = svgEl('polygon', { fill: '#8fb4ff' }, svg);
        const pencil = svgEl('g', {}, svg);
        svgEl('rect', { x: -6, y: -34, width: 12, height: 60, rx: 2, fill: '#f5c451' }, pencil);
        svgEl('polygon', { points: '-6,-34 6,-34 0,-48', fill: '#ffe2a8' }, pencil);
        // 얼굴과 두 눈
        svgEl('ellipse', { cx: 320, cy: EYE_Y + 22, rx: 70, ry: 30, fill: '#1d2758', stroke: '#2f3b78' }, svg);
        const eyeL = svgEl('circle', { cx: LX, cy: EYE_Y, r: 9, fill: '#eef1ff' }, svg);
        const eyeR = svgEl('circle', { cx: RX, cy: EYE_Y, r: 9, fill: '#eef1ff' }, svg);

        ctrl.innerHTML = `
            <div><div class="seg" role="group" aria-label="어느 눈으로 볼까요">
                <button type="button" data-eye="L" aria-pressed="true">왼쪽 눈</button>
                <button type="button" data-eye="R" aria-pressed="false">오른쪽 눈</button>
                <button type="button" data-eye="B" aria-pressed="false">두 눈 비교</button>
            </div></div>
            <div class="slider"><label for="pen-d">연필까지의 거리 <output id="pen-d-out"></output></label>
                <input id="pen-d" type="range" min="1" max="5" step="0.1" value="1.5"></div>
            <div class="readout">
                <div class="row"><span>왼쪽 눈으로 본 눈금</span><b id="rL"></b></div>
                <div class="row"><span>오른쪽 눈으로 본 눈금</span><b id="rR"></b></div>
                <div class="row"><span>눈금 차이 (시차)</span><b id="rD"></b></div>
            </div>`;
        let eye = 'L';
        const slider = ctrl.querySelector('#pen-d');
        const proj = (ex, py) => ex + (PX - ex) * (EYE_Y - BG) / (EYE_Y - py);
        function draw() {
            const d = parseFloat(slider.value);
            const py = EYE_Y - (40 + d * 46);
            pencil.setAttribute('transform', `translate(${PX} ${py})`);
            const xl = proj(LX, py), xr = proj(RX, py);
            const show = (line, m, ex, xb, on) => {
                line.style.display = m.style.display = on ? '' : 'none';
                line.setAttribute('x1', ex); line.setAttribute('y1', EYE_Y); line.setAttribute('x2', xb); line.setAttribute('y2', BG);
                m.setAttribute('points', `${xb - 8},${BG + 18} ${xb + 8},${BG + 18} ${xb},${BG + 4}`);
            };
            show(sight, mark, LX, xl, eye !== 'R');
            show(sight2, mark2, RX, xr, eye !== 'L');
            eyeL.setAttribute('fill', eye === 'R' ? '#2f3b78' : '#eef1ff');
            eyeR.setAttribute('fill', eye === 'L' ? '#2f3b78' : '#eef1ff');
            ctrl.querySelector('#pen-d-out').textContent = d <= 2 ? '가까움' : d >= 4 ? '멂' : '중간';
            ctrl.querySelector('#rL').textContent = tickAt(xl).toFixed(1);
            ctrl.querySelector('#rR').textContent = tickAt(xr).toFixed(1);
            ctrl.querySelector('#rD').textContent = Math.abs(tickAt(xl) - tickAt(xr)).toFixed(1) + ' 칸';
        }
        ctrl.querySelectorAll('[data-eye]').forEach(b => b.addEventListener('click', () => {
            eye = b.dataset.eye;
            ctrl.querySelectorAll('[data-eye]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
            draw();
        }));
        slider.addEventListener('input', draw);
        draw();
        api.quiz(body, {
            q: '연필을 눈에서 멀리 할수록 시차는 어떻게 될까요?',
            options: ['커진다', '작아진다', '변하지 않는다'], answer: 1,
            explain: '맞아요. 물체가 멀리 있을수록 시차가 작아져요. 그래서 시차를 재면 거리를 알 수 있어요.',
            hint: '슬라이더로 연필을 멀리 옮기면서 \'눈금 차이\'가 어떻게 변하는지 보세요.'
        });
    }

    // ---------- 단계 2: 연주시차 ----------
    function annualParallax(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">지구는 태양 주위를 공전하므로, 6개월 간격으로 같은 별을 관측하면 별이 먼 배경 별에 대해 움직여 보여요. 이때 생기는 시차의 <b>절반</b>을 <b>연주시차</b>라고 해요. 지구를 끌어서 궤도를 따라 옮겨 보세요.</p>');
        const { view, ctrl } = layout(body);
        const W = 640, H = 430, SX = 320, SY = 360, RX = 150, RY = 46, BG = 40;
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': '지구 공전과 연주시차' }, view);
        // 먼 배경 별
        svgEl('rect', { x: 0, y: 0, width: W, height: 70, fill: '#101845' }, svg);
        let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
        for (let i = 0; i < 40; i++) svgEl('circle', { cx: rnd() * W, cy: 10 + rnd() * 50, r: rnd() * 1.6 + .5, fill: '#dfe6ff', opacity: .7 }, svg);
        const bgLabel = svgEl('text', { x: W - 12, y: 16, 'text-anchor': 'end', fill: '#6f78a8', 'font-size': 12 }, svg); bgLabel.textContent = '아주 먼 배경 별';
        svgEl('ellipse', { cx: SX, cy: SY, rx: RX, ry: RY, fill: 'none', stroke: '#2f3b78', 'stroke-width': 2, 'stroke-dasharray': '4 6' }, svg);
        svgEl('circle', { cx: SX, cy: SY, r: 16, fill: '#f5c451' }, svg);
        const sunT = svgEl('text', { x: SX, y: SY + 36, 'text-anchor': 'middle', fill: '#a9b1d9', 'font-size': 13 }, svg); sunT.textContent = '태양';
        const jan = svgEl('line', { stroke: '#8fb4ff', 'stroke-width': 1.5, opacity: .7 }, svg);
        const jul = svgEl('line', { stroke: '#8fb4ff', 'stroke-width': 1.5, opacity: .7 }, svg);
        const toSun = svgEl('line', { stroke: '#6f78a8', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' }, svg);
        const pArc = svgEl('path', { fill: 'none', stroke: '#4fd1b5', 'stroke-width': 3 }, svg);
        const pText = svgEl('text', { fill: '#4fd1b5', 'font-size': 14, 'font-weight': 700 }, svg);
        const janMark = svgEl('g', {}, svg), julMark = svgEl('g', {}, svg);
        [janMark, julMark].forEach((g, i) => {
            svgEl('circle', { r: 6, fill: 'none', stroke: '#8fb4ff', 'stroke-width': 2 }, g);
            const t = svgEl('text', { y: 24, 'text-anchor': 'middle', fill: '#8fb4ff', 'font-size': 12, 'font-weight': 700 }, g);
            t.textContent = i ? '7월에 보이는 위치' : '1월에 보이는 위치';
        });
        const cur = svgEl('line', { stroke: '#f5c451', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
        const apparent = svgEl('circle', { r: 7, fill: '#f5c451', stroke: '#fff', 'stroke-width': 2 }, svg);
        const star = svgEl('circle', { r: 9, fill: '#ffd0a0' }, svg);
        const starT = svgEl('text', { 'text-anchor': 'start', fill: '#eef1ff', 'font-size': 13 }, svg); starT.textContent = '가까운 별';
        const earth = svgEl('g', { style: 'cursor:grab' }, svg);
        svgEl('circle', { r: 22, fill: 'transparent' }, earth);
        svgEl('circle', { r: 11, fill: '#4f8dff', stroke: '#bcd2ff', 'stroke-width': 2 }, earth);
        const janT = svgEl('text', { x: SX - RX - 8, y: SY + 5, 'text-anchor': 'end', fill: '#8fb4ff', 'font-size': 13 }, svg); janT.textContent = '1월';
        const julT = svgEl('text', { x: SX + RX + 8, y: SY + 5, fill: '#8fb4ff', 'font-size': 13 }, svg); julT.textContent = '7월';

        ctrl.innerHTML = `
            <div class="slider"><label for="star-d">별까지의 거리 <output id="star-d-out"></output></label>
                <input id="star-d" type="range" min="1" max="5" step="0.5" value="1"></div>
            <div><div class="seg" role="group" aria-label="지구 위치">
                <button type="button" data-pos="180" aria-pressed="false">1월 위치</button>
                <button type="button" data-pos="0" aria-pressed="false">7월 위치</button>
            </div></div>
            <div class="readout">
                <div class="row"><span>연주시차</span><b id="p-out"></b></div>
                <div class="row"><span>6개월 간격 시차 (연주시차 × 2)</span><b id="p2-out"></b></div>
                <div class="row"><span>거리 (광년)</span><b id="ly-out"></b></div>
            </div>
            <p class="note">실제 연주시차는 1″(1/3600도)보다도 작아서 그림은 크게 과장했어요. 연주시차가 1″인 별까지의 거리를 1 pc(파섹)이라고 하며, 약 3.26광년이에요.</p>`;
        const slider = ctrl.querySelector('#star-d');
        let ang = 200; // 지구 위치 (도). 180 = 1월(왼쪽), 0 = 7월(오른쪽)
        const ePos = a => [SX + RX * Math.cos(a * Math.PI / 180), SY - RY * Math.sin(a * Math.PI / 180)];
        const proj = (ex, ey, sx, sy) => ex + (sx - ex) * (ey - BG) / (ey - sy);
        function draw() {
            const d = parseFloat(slider.value);
            const sy = SY - (70 + d * 46), sx = SX;
            star.setAttribute('cx', sx); star.setAttribute('cy', sy);
            starT.setAttribute('x', sx + 14); starT.setAttribute('y', sy + 4);
            const [ex, ey] = ePos(ang);
            earth.setAttribute('transform', `translate(${ex} ${ey})`);
            const xb = proj(ex, ey, sx, sy);
            cur.setAttribute('x1', ex); cur.setAttribute('y1', ey); cur.setAttribute('x2', xb); cur.setAttribute('y2', BG);
            apparent.setAttribute('cx', xb); apparent.setAttribute('cy', BG);
            const [jx, jy] = ePos(180), [ux, uy] = ePos(0);
            jan.setAttribute('x1', jx); jan.setAttribute('y1', jy); jan.setAttribute('x2', proj(jx, jy, sx, sy)); jan.setAttribute('y2', BG);
            jul.setAttribute('x1', ux); jul.setAttribute('y1', uy); jul.setAttribute('x2', proj(ux, uy, sx, sy)); jul.setAttribute('y2', BG);
            const xj = proj(jx, jy, sx, sy), xu = proj(ux, uy, sx, sy);
            janMark.setAttribute('transform', `translate(${Math.max(60, Math.min(W - 60, xj))} ${BG})`);
            julMark.setAttribute('transform', `translate(${Math.max(60, Math.min(W - 60, xu))} ${BG})`);
            janMark.style.display = (xj > -10 && xj < W + 10) ? '' : 'none';
            julMark.style.display = (xu > -10 && xu < W + 10) ? '' : 'none';
            toSun.setAttribute('x1', sx); toSun.setAttribute('y1', sy); toSun.setAttribute('x2', SX); toSun.setAttribute('y2', SY);
            // 연주시차 각 p: 별에서 태양 방향과 1월 지구 방향 사이
            const r = 30, a1 = Math.atan2(SY - sy, SX - sx), a2 = Math.atan2(jy - sy, jx - sx);
            pArc.setAttribute('d', `M${sx + r * Math.cos(a1)} ${sy + r * Math.sin(a1)} A${r} ${r} 0 0 1 ${sx + r * Math.cos(a2)} ${sy + r * Math.sin(a2)}`);
            pText.setAttribute('x', sx - 52); pText.setAttribute('y', sy + 52); pText.textContent = 'p';
            const p = 1 / d;
            ctrl.querySelector('#star-d-out').textContent = `${d} pc`;
            ctrl.querySelector('#p-out').textContent = `${p.toFixed(2)}″`;
            ctrl.querySelector('#p2-out').textContent = `${(2 * p).toFixed(2)}″`;
            ctrl.querySelector('#ly-out').textContent = `약 ${(d * 3.26).toFixed(1)}`;
        }
        // 지구 끌기
        let dragging = false;
        const pt = e => { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
        earth.addEventListener('pointerdown', e => { dragging = true; earth.setPointerCapture(e.pointerId); e.preventDefault(); });
        earth.addEventListener('pointermove', e => {
            if (!dragging) return;
            const [x, y] = pt(e);
            ang = Math.atan2(-(y - SY) / RY, (x - SX) / RX) * 180 / Math.PI;
            draw();
        });
        earth.addEventListener('pointerup', () => { dragging = false; });
        ctrl.querySelectorAll('[data-pos]').forEach(b => b.addEventListener('click', () => {
            ang = parseFloat(b.dataset.pos);
            ctrl.querySelectorAll('[data-pos]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
            draw();
        }));
        slider.addEventListener('input', draw);
        draw();
        api.quiz(body, {
            q: '별까지의 거리가 2배가 되면 연주시차는 어떻게 될까요?',
            options: ['2배', '1/2배', '4배', '변하지 않는다'], answer: 1,
            explain: '맞아요. 연주시차는 별까지의 거리에 반비례해요. 거리(pc) = 1 ÷ 연주시차(″)',
            hint: '거리를 1 pc에서 2 pc로 바꾸고 연주시차 값을 비교해 보세요.'
        });
    }

    // ---------- 내용정리 ----------
    function summary(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">카드를 끌어 빈칸에 놓거나, 카드를 누른 뒤 빈칸을 누르세요. 다 채우면 [확인]을 누르세요.</p>');
        Activities.fill(body, {
            lines: [
                '관측 위치에 따라 물체의 위치가 달라 보이는 각을 [[시차]]라고 한다.',
                '6개월 간격으로 측정한 별의 시차의 [[1/2]]을 연주시차라고 한다.',
                '별까지의 거리가 멀수록 연주시차는 [[작다]].',
                '연주시차는 별까지의 거리에 [[반비례]]한다.',
                '연주시차가 1″인 별까지의 거리를 [[1 pc]]라고 한다.'
            ],
            extras: ['2배', '크다', '비례', '1광년'],
            onSolved: () => api.completeMission()
        });
    }

    SIMS['1_1'] = { steps: [
        { title: '시차 — 두 눈으로 연필 보기', short: '시차', build: parallaxIntro },
        { title: '연주시차 — 지구 공전으로 별까지 거리 재기', short: '연주시차', build: annualParallax },
        { title: '내용정리', short: '내용정리', build: summary }
    ] };
})();
