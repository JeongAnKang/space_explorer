// 퀘스트 1 · 미션 1 거리 — s1 시차, s2 연주시차, 내용정리
(function () {
    const { svgEl, layout, text } = SimKit;

    // ---------- 단계 1: 시차 (각도기로 직접 재기) ----------
    function parallaxIntro(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">팔을 뻗어 연필을 세우고 한쪽 눈씩 번갈아 감아 보면, 연필심 끝이 뒤쪽 배경에 대해 움직여 보여요. 두 눈에서 연필심 끝을 바라본 <b class="key-pink">두 시선이 이루는 각</b>을 <b class="key-pink">시차</b>라고 해요. <b>각도기를 끌어</b> 중심을 연필심 끝에 맞추고, 필요하면 <b>노란 손잡이로 돌려서</b> 시차를 직접 재 보세요.</p>');
        const { view, ctrl } = layout(body);
        const W = 640, H = 570, BG = 48, EYE_Y = 520, LX = 290, RX = 350, PX = 320, R = 105;
        const depthOf = d => 110 + (d - 1) * 55;                               // 거리 1~5 → 눈에서 연필심 끝까지
        const trueAngle = d => 2 * Math.atan(((RX - LX) / 2) / depthOf(d)) * 180 / Math.PI;
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': '두 눈으로 연필심 끝을 볼 때의 시차와 각도기' }, view);

        // 배경 눈금판
        svgEl('rect', { x: 20, y: 14, width: W - 40, height: 52, rx: 8, fill: '#1d2758', stroke: '#2f3b78' }, svg);
        for (let i = 0; i <= 30; i++) {
            const x = 32 + i * ((W - 64) / 30);
            svgEl('line', { x1: x, y1: BG - (i % 5 ? 6 : 12), x2: x, y2: BG + 2, stroke: '#a9b1d9', 'stroke-width': 1.5 }, svg);
            if (i % 5 === 0) text(svg, x, 30, String(i), { 'text-anchor': 'middle' });
        }
        const tickAt = x => (x - 32) / ((W - 64) / 30);

        // 보조선: 눈 → 연필심 끝 → 배경
        const sightL = svgEl('line', { stroke: '#f5c451', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
        const sightR = svgEl('line', { stroke: '#8fb4ff', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
        const markL = svgEl('polygon', { fill: '#f5c451' }, svg);
        const markR = svgEl('polygon', { fill: '#8fb4ff' }, svg);

        // 연필 (위쪽 끝이 연필심)
        const pencil = svgEl('g', {}, svg);
        svgEl('polygon', { points: '-7,22 7,22 3,7 -3,7', fill: '#f0d2a0' }, pencil);       // 깎은 나무
        svgEl('polygon', { points: '-3,7 3,7 0,0', fill: '#4a4a55' }, pencil);              // 연필심
        svgEl('rect', { x: -7, y: 22, width: 14, height: 58, fill: '#f5c451' }, pencil);
        svgEl('rect', { x: -7, y: 80, width: 14, height: 8, fill: '#c0c4d8' }, pencil);
        svgEl('rect', { x: -7, y: 88, width: 14, height: 9, rx: 3, fill: '#ff9db0' }, pencil);
        const tipDot = svgEl('circle', { r: 3, fill: '#ffffff' }, svg);

        // 얼굴과 두 눈
        svgEl('ellipse', { cx: 320, cy: EYE_Y + 22, rx: 76, ry: 26, fill: '#1d2758', stroke: '#2f3b78' }, svg);
        const eyeL = svgEl('circle', { cx: LX, cy: EYE_Y, r: 9, fill: '#eef1ff' }, svg);
        const eyeR = svgEl('circle', { cx: RX, cy: EYE_Y, r: 9, fill: '#eef1ff' }, svg);

        // 각도기 (반원, 위로 열림 / 오른쪽 0° → 위 90° → 왼쪽 180°)
        // 두 시선은 연필심 끝에서 엇갈리므로, 위쪽(배경 쪽)에서 재도 같은 각(맞꼭지각)
        const prot = svgEl('g', { style: 'cursor:grab', tabindex: 0, role: 'button', 'aria-label': '각도기, 끌어서 옮기기' }, svg);
        svgEl('path', { d: `M${-R} 0 A${R} ${R} 0 0 1 ${R} 0 Z`, fill: 'rgba(143, 180, 255, .13)', stroke: '#8fb4ff', 'stroke-width': 1.5 }, prot);
        svgEl('path', { d: `M${-R * .45} 0 A${R * .45} ${R * .45} 0 0 1 ${R * .45} 0`, fill: 'none', stroke: '#8fb4ff', 'stroke-width': 1, opacity: .5 }, prot);
        for (let a = 0; a <= 180; a++) {
            const len = a % 10 === 0 ? 16 : a % 5 === 0 ? 10 : 5;
            const c = Math.cos(a * Math.PI / 180), sn = -Math.sin(a * Math.PI / 180);
            svgEl('line', { x1: R * c, y1: R * sn, x2: (R - len) * c, y2: (R - len) * sn, stroke: '#cfdcff', 'stroke-width': a % 10 === 0 ? 1.3 : .8 }, prot);
            if (a % 10 === 0) text(prot, (R - 28) * c, (R - 28) * sn + 4, String(a), { 'text-anchor': 'middle', fill: '#cfdcff', 'font-size': 10.5 });
        }
        svgEl('line', { x1: -10, y1: 0, x2: 10, y2: 0, stroke: '#ff7a8a', 'stroke-width': 1.5 }, prot);
        svgEl('line', { x1: 0, y1: -10, x2: 0, y2: 10, stroke: '#ff7a8a', 'stroke-width': 1.5 }, prot);
        // 회전 손잡이 (각도기 오른쪽 끝)
        const knob = svgEl('g', { style: 'cursor:alias', tabindex: 0, role: 'button', 'aria-label': '각도기 회전 손잡이. 좌우 화살표 키로 1도씩 돌리기' }, prot);
        svgEl('line', { x1: R, y1: 0, x2: R + 14, y2: 0, stroke: '#f5c451', 'stroke-width': 2 }, knob);
        svgEl('circle', { cx: R + 26, cy: 0, r: 24, fill: 'transparent' }, knob);
        svgEl('circle', { cx: R + 26, cy: 0, r: 12, fill: '#f5c451' }, knob);
        svgEl('path', { d: `M${R + 20} -4 A7 7 0 1 1 ${R + 21} 5`, fill: 'none', stroke: '#241a00', 'stroke-width': 2 }, knob);
        svgEl('path', { d: `M${R + 17} -8 L${R + 20} -3 L${R + 25} -6`, fill: 'none', stroke: '#241a00', 'stroke-width': 2 }, knob);
        const snapNote = text(svg, 24, 92, '', { fill: '#4fd1b5', 'font-weight': 700, 'pointer-events': 'none' });

        ctrl.innerHTML = `
            <div><div class="seg" role="group" aria-label="어느 눈으로 볼까요">
                <button type="button" data-eye="L" aria-pressed="false">왼쪽 눈</button>
                <button type="button" data-eye="R" aria-pressed="false">오른쪽 눈</button>
                <button type="button" data-eye="B" aria-pressed="true">두 눈 비교</button>
            </div></div>
            <div class="slider"><label for="pen-d">연필까지의 거리 <output id="pen-d-out"></output></label>
                <input id="pen-d" type="range" min="1" max="5" step="1" value="1"></div>
            <div class="readout">
                <div class="row"><span>왼쪽 눈으로 본 배경 눈금</span><b id="rL"></b></div>
                <div class="row"><span>오른쪽 눈으로 본 배경 눈금</span><b id="rR"></b></div>
            </div>
            <div class="readout">
                <label for="ang-in" style="color:var(--ink-dim);font-weight:600;font-size:15px">각도기로 잰 시차 (두 시선의 눈금 차이)</label>
                <div style="display:flex;gap:8px;align-items:center">
                    <input id="ang-in" type="number" inputmode="decimal" min="0" max="90" step="0.5" placeholder="예: 25" style="flex:1;min-width:0;min-height:48px;padding:0 12px;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-size:18px">
                    <span>°</span>
                    <button type="button" class="btn btn-primary" id="ang-rec">기록</button>
                </div>
                <div id="ang-msg" style="font-size:14px;color:var(--ink-dim);min-height:1.4em" aria-live="polite"></div>
            </div>
            <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
                <span style="color:var(--ink-dim);font-size:15px;font-weight:600">각도기 기울기 <b class="num" id="rot-out" style="color:var(--star)">0°</b></span>
                <button type="button" class="btn" id="rot-reset">바로 세우기</button>
            </div>
            <table class="data-table"><thead><tr><th>연필 거리</th><th>잰 시차</th><th>확인</th></tr></thead><tbody id="ang-rows"></tbody></table>`;

        let eye = 'B', snapped = false, pos = { x: 480, y: 480 }, rot = 0;
        const slider = ctrl.querySelector('#pen-d');
        const tipY = () => EYE_Y - depthOf(parseInt(slider.value, 10));
        const proj = (ex, ty) => ex + (PX - ex) * (EYE_Y - BG) / (EYE_Y - ty);
        const labelOf = d => `${d} (${d <= 2 ? '가까움' : d >= 4 ? '멂' : '중간'})`;

        function draw() {
            const d = parseInt(slider.value, 10), ty = tipY();
            pencil.setAttribute('transform', `translate(${PX} ${ty})`);
            tipDot.setAttribute('cx', PX); tipDot.setAttribute('cy', ty);
            const xl = proj(LX, ty), xr = proj(RX, ty);
            const show = (line, m, ex, xb, on) => {
                line.style.display = m.style.display = on ? '' : 'none';
                line.setAttribute('x1', ex); line.setAttribute('y1', EYE_Y); line.setAttribute('x2', xb); line.setAttribute('y2', BG);
                m.setAttribute('points', `${xb - 8},${BG + 18} ${xb + 8},${BG + 18} ${xb},${BG + 4}`);
            };
            show(sightL, markL, LX, xl, eye !== 'R');
            show(sightR, markR, RX, xr, eye !== 'L');
            eyeL.setAttribute('fill', eye === 'R' ? '#2f3b78' : '#eef1ff');
            eyeR.setAttribute('fill', eye === 'L' ? '#2f3b78' : '#eef1ff');
            if (snapped) pos = { x: PX, y: ty };
            prot.setAttribute('transform', `translate(${pos.x} ${pos.y}) rotate(${rot})`);
            ctrl.querySelector('#rot-out').textContent = `${Math.round(-rot)}°`;
            snapNote.textContent = snapped ? '중심을 연필심 끝에 맞췄어요' : '';
            ctrl.querySelector('#pen-d-out').textContent = labelOf(d);
            ctrl.querySelector('#rL').textContent = tickAt(xl).toFixed(1);
            ctrl.querySelector('#rR').textContent = tickAt(xr).toFixed(1);
        }

        // 각도기 끌기 (중심이 연필심 끝 가까이 오면 딱 붙음)
        let drag = null;
        prot.addEventListener('pointerdown', e => {
            const [x, y] = SimKit.point(svg, e, W, H);
            drag = { dx: x - pos.x, dy: y - pos.y }; snapped = false;
            prot.setPointerCapture(e.pointerId); prot.style.cursor = 'grabbing'; e.preventDefault();
        });
        prot.addEventListener('pointermove', e => {
            if (!drag) return;
            const [x, y] = SimKit.point(svg, e, W, H);
            pos = { x: Math.max(R * .3, Math.min(W - R * .3, x - drag.dx)), y: Math.max(R * .5, Math.min(H - 10, y - drag.dy)) };
            draw();
        });
        const drop = () => {
            if (!drag) return;
            drag = null; prot.style.cursor = 'grab';
            if (Math.hypot(pos.x - PX, pos.y - tipY()) < 22) snapped = true;
            draw();
        };
        prot.addEventListener('pointerup', drop);
        prot.addEventListener('pointercancel', drop);
        prot.addEventListener('keydown', e => {
            if (e.target === knob) return;
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); snapped = true; draw(); }
        });
        // 손잡이를 돌리면 각도기 중심을 기준으로 회전 (1도 단위)
        let turning = false;
        knob.addEventListener('pointerdown', e => {
            e.stopPropagation(); e.preventDefault();
            turning = true; knob.setPointerCapture(e.pointerId);
        });
        knob.addEventListener('pointermove', e => {
            if (!turning) return;
            const [x, y] = SimKit.point(svg, e, W, H);
            rot = Math.round(Math.atan2(y - pos.y, x - pos.x) * 180 / Math.PI);
            draw();
        });
        const stopTurn = () => { turning = false; };
        knob.addEventListener('pointerup', stopTurn);
        knob.addEventListener('pointercancel', stopTurn);
        knob.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); rot -= 1; draw(); }
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); rot += 1; draw(); }
        });
        ctrl.querySelector('#rot-reset').addEventListener('click', () => { rot = 0; draw(); });

        // 측정값 기록
        const records = {};
        const holder = document.createElement('div');
        function record() {
            const d = parseInt(slider.value, 10), v = parseFloat(ctrl.querySelector('#ang-in').value);
            const msg = ctrl.querySelector('#ang-msg');
            if (!snapped) { msg.textContent = '먼저 각도기의 중심을 연필심 끝에 맞춰 주세요.'; return; }
            if (!(v > 0)) { msg.textContent = '잰 각도를 숫자로 적어 주세요.'; return; }
            const t = trueAngle(d), ok = Math.abs(v - t) <= 2;
            records[d] = { v, ok, t };
            msg.textContent = ok ? `잘 쟀어요! 실제 시차는 약 ${t.toFixed(1)}°예요.` : '다시 재 보세요. 두 시선이 가리키는 눈금을 각각 읽고 큰 값에서 작은 값을 빼요.';
            ctrl.querySelector('#ang-rows').innerHTML = Object.keys(records).sort().map(k => {
                const r = records[k];
                return `<tr><td>${labelOf(+k)}</td><td class="num">${r.v}°</td><td style="color:${r.ok ? 'var(--done)' : 'var(--wrong)'}">${r.ok ? '정확' : '다시'}</td></tr>`;
            }).join('');
            if (Object.values(records).filter(r => r.ok).length >= 2) quizBox.hidden = false;
            else if (ok) msg.textContent += ' 연필 거리를 바꿔 한 번 더 재 보세요.';
        }
        ctrl.querySelector('#ang-rec').addEventListener('click', record);
        ctrl.querySelector('#ang-in').addEventListener('keydown', e => { if (e.key === 'Enter') record(); });

        ctrl.querySelectorAll('[data-eye]').forEach(b => b.addEventListener('click', () => {
            eye = b.dataset.eye;
            ctrl.querySelectorAll('[data-eye]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
            draw();
        }));
        slider.addEventListener('input', () => { ctrl.querySelector('#ang-in').value = ''; ctrl.querySelector('#ang-msg').textContent = ''; draw(); });
        draw();

        body.appendChild(holder);
        const quizBox = api.quiz(holder, {
            q: '연필을 눈에서 멀리 할수록 시차는 어떻게 될까요?',
            options: ['커진다', '작아진다', '변하지 않는다'], answer: 1,
            explain: '맞아요. 물체가 멀리 있을수록 시차가 작아져요. 그래서 시차를 재면 거리를 알 수 있어요.',
            hint: '기록한 표에서 가까울 때와 멀 때의 시차를 비교해 보세요.'
        });
        quizBox.hidden = true;
    }

    // ---------- 단계 2: 연주시차 ----------
    function annualParallax(body, api) {
        body.insertAdjacentHTML('beforeend', '<p class="lead">지구는 태양 주위를 공전하므로, 6개월 간격으로 같은 별을 관측하면 별이 먼 배경 별에 대해 움직여 보여요. 이때 생기는, 즉 <b class="key-pink">6개월 간격으로 관측한 시차의 절반</b>을 <b class="key-pink">연주시차</b>라고 해요. [공전 시작]을 눌러 지구가 공전하는 동안 가까운 별의 위치가 어떻게 달라 보이는지 관찰하고, [1월 위치]와 [7월 위치]를 눌러 비교해 보세요.</p>');
        const { view, ctrl } = layout(body);
        const W = 640, H = 430, SX = 320, SY = 360, RX = 150, RY = 46, BG = 40;
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': '지구 공전과 연주시차' }, view);
        // 먼 배경 별
        svgEl('rect', { x: 0, y: 0, width: W, height: 70, fill: '#101845' }, svg);
        let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
        for (let i = 0; i < 40; i++) svgEl('circle', { cx: rnd() * W, cy: 10 + rnd() * 50, r: rnd() * 1.6 + .5, fill: '#dfe6ff', opacity: .7 }, svg);
        const bgLabel = svgEl('text', { x: W - 12, y: 64, 'text-anchor': 'end', fill: '#6f78a8', 'font-size': 12 }, svg); bgLabel.textContent = '아주 먼 배경 별';
        svgEl('ellipse', { cx: SX, cy: SY, rx: RX, ry: RY, fill: 'none', stroke: '#2f3b78', 'stroke-width': 2, 'stroke-dasharray': '4 6' }, svg);
        svgEl('circle', { cx: SX, cy: SY, r: 16, fill: '#f5c451' }, svg);
        const sunT = svgEl('text', { x: SX, y: SY + 36, 'text-anchor': 'middle', fill: '#a9b1d9', 'font-size': 13 }, svg); sunT.textContent = '태양';
        const jan = svgEl('polyline', { fill: 'none', stroke: '#8fb4ff', 'stroke-width': 1.5, opacity: .7 }, svg);
        const jul = svgEl('polyline', { fill: 'none', stroke: '#8fb4ff', 'stroke-width': 1.5, opacity: .7 }, svg);
        const toSun = svgEl('line', { stroke: '#6f78a8', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' }, svg);
        const pArc = svgEl('path', { fill: 'none', stroke: '#4fd1b5', 'stroke-width': 3 }, svg);
        const pText = svgEl('text', { fill: '#4fd1b5', 'font-size': 14, 'font-weight': 700 }, svg);
        const janMark = svgEl('g', {}, svg), julMark = svgEl('g', {}, svg);
        [janMark, julMark].forEach((g, i) => {
            svgEl('circle', { r: 6, fill: 'none', stroke: '#8fb4ff', 'stroke-width': 2 }, g);
            const t = svgEl('text', { y: -12, 'text-anchor': 'middle', fill: '#8fb4ff', 'font-size': 12, 'font-weight': 700 }, g);
            t.textContent = i ? '7월에 보이는 위치' : '1월에 보이는 위치';
        });
        const cur = svgEl('polyline', { fill: 'none', stroke: '#f5c451', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
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
            <button type="button" class="btn btn-primary" id="orbit-btn" aria-pressed="false" style="width:100%">공전 시작</button>
            <div><div class="seg" role="group" aria-label="지구 위치">
                <button type="button" data-pos="180" aria-pressed="false">1월 위치</button>
                <button type="button" data-pos="0" aria-pressed="false">7월 위치</button>
            </div></div>
            <div class="readout">
                <div class="row"><span>① 6개월 간격 시차</span><b id="p2-out"></b></div>
                <div class="row"><span>② 연주시차 (① ÷ 2)</span><b id="p-out"></b></div>
                <div class="row"><span>③ 거리 (1 ÷ 연주시차)</span><b id="pc-out"></b></div>
            </div>`;
        const slider = ctrl.querySelector('#star-d');
        let ang = 200; // 지구 위치 (도). 180 = 1월(왼쪽), 0 = 7월(오른쪽)
        const ePos = a => [SX + RX * Math.cos(a * Math.PI / 180), SY - RY * Math.sin(a * Math.PI / 180)];
        // 배경 별에 비친 위치: 시선 방향에 수직인 지구의 위치(좌우)에만 따라 달라짐
        // → 6개월 간격인 1월(왼쪽 끝)과 7월(오른쪽 끝)에서 가장 크게 벌어짐
        const proj = (ex, sx, sy) => sx + (sx - ex) * (sy - BG) / (SY - sy);
        const sight = (el, ex, ey, sx, sy) => el.setAttribute('points', `${ex},${ey} ${sx},${sy} ${proj(ex, sx, sy)},${BG}`);
        const shown = { 180: false, 0: false }; // 1월·7월 버튼을 눌러야 선이 나타남
        function draw() {
            const d = parseFloat(slider.value);
            const sy = SY - (70 + d * 46), sx = SX;
            star.setAttribute('cx', sx); star.setAttribute('cy', sy);
            starT.setAttribute('x', sx + 14); starT.setAttribute('y', sy + 4);
            const [ex, ey] = ePos(ang);
            earth.setAttribute('transform', `translate(${ex} ${ey})`);
            const xb = proj(ex, sx, sy);
            sight(cur, ex, ey, sx, sy);
            apparent.setAttribute('cx', xb); apparent.setAttribute('cy', BG);
            const [jx, jy] = ePos(180), [ux, uy] = ePos(0);
            sight(jan, jx, jy, sx, sy); sight(jul, ux, uy, sx, sy);
            const xj = proj(jx, sx, sy), xu = proj(ux, sx, sy);
            janMark.setAttribute('transform', `translate(${Math.max(60, Math.min(W - 60, xj))} ${BG})`);
            julMark.setAttribute('transform', `translate(${Math.max(60, Math.min(W - 60, xu))} ${BG})`);
            // 두 표시가 가까우면 라벨을 양옆으로 벌림
            const close = Math.abs(xj - xu) < 190;
            janMark.querySelector('text').setAttribute('text-anchor', close ? 'start' : 'middle');
            janMark.querySelector('text').setAttribute('x', close ? -4 : 0);
            julMark.querySelector('text').setAttribute('text-anchor', close ? 'end' : 'middle');
            julMark.querySelector('text').setAttribute('x', close ? 4 : 0);
            janMark.style.display = shown[180] && (xj > -10 && xj < W + 10) ? '' : 'none';
            julMark.style.display = shown[0] && (xu > -10 && xu < W + 10) ? '' : 'none';
            jan.style.display = shown[180] ? '' : 'none';
            jul.style.display = shown[0] ? '' : 'none';
            pArc.style.display = pText.style.display = shown[180] ? '' : 'none';
            toSun.setAttribute('x1', sx); toSun.setAttribute('y1', sy); toSun.setAttribute('x2', SX); toSun.setAttribute('y2', SY);
            // 연주시차 각 p: 별에서 태양 방향과 1월 지구 방향 사이
            const r = 30, a1 = Math.atan2(SY - sy, SX - sx), a2 = Math.atan2(jy - sy, jx - sx);
            pArc.setAttribute('d', `M${sx + r * Math.cos(a1)} ${sy + r * Math.sin(a1)} A${r} ${r} 0 0 1 ${sx + r * Math.cos(a2)} ${sy + r * Math.sin(a2)}`);
            pText.setAttribute('x', sx - 52); pText.setAttribute('y', sy + 52); pText.textContent = 'p';
            const p = 1 / d;
            ctrl.querySelector('#star-d-out').textContent = `${d} pc`;
            ctrl.querySelector('#p-out').textContent = `${p.toFixed(2)}″`;
            ctrl.querySelector('#p2-out').textContent = `${(2 * p).toFixed(2)}″`;
            ctrl.querySelector('#pc-out').textContent = `${d} pc`;
        }
        // 자동 공전: 한 바퀴(12개월)에 12초, 반시계 방향
        const orbitBtn = ctrl.querySelector('#orbit-btn');
        let spinning = false, last = 0;
        function setSpin(on) {
            spinning = on;
            orbitBtn.textContent = on ? '지구 공전 멈추기' : '공전 시작';
            orbitBtn.setAttribute('aria-pressed', String(on));
            orbitBtn.classList.toggle('btn-primary', !on);
            if (on) {
                ctrl.querySelectorAll('[data-pos]').forEach(x => x.setAttribute('aria-pressed', 'false'));
                last = 0; requestAnimationFrame(tick);
            }
        }
        function tick(t) {
            if (!spinning) return;
            if (!svg.isConnected) { spinning = false; return; }
            if (last) ang = (ang + (t - last) * 0.03) % 360;
            last = t; draw();
            requestAnimationFrame(tick);
        }
        orbitBtn.addEventListener('click', () => setSpin(!spinning));
        // 지구 끌기
        let dragging = false;
        const pt = e => { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
        earth.addEventListener('pointerdown', e => { setSpin(false); dragging = true; earth.setPointerCapture(e.pointerId); e.preventDefault(); });
        earth.addEventListener('pointermove', e => {
            if (!dragging) return;
            const [x, y] = pt(e);
            ang = Math.atan2(-(y - SY) / RY, (x - SX) / RX) * 180 / Math.PI;
            draw();
        });
        earth.addEventListener('pointerup', () => { dragging = false; });
        ctrl.querySelectorAll('[data-pos]').forEach(b => b.addEventListener('click', () => {
            setSpin(false);
            ang = parseFloat(b.dataset.pos);
            shown[b.dataset.pos] = true;
            ctrl.querySelectorAll('[data-pos]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
            draw();
        }));
        slider.addEventListener('input', draw);
        draw();
        // 내용 정리: 핵심 용어를 카드로 채우기 + 탐구 질문 → 둘 다 마쳐야 다음 단계
        const done = { fill: false, quiz: false };
        const check = k => { done[k] = true; if (done.fill && done.quiz) api.done(); };
        const box = document.createElement('div');
        box.className = 'concept-box';
        box.innerHTML = `<p class="concept-lead">실제 연주시차는 1″(1/3600도)보다도 작아서 그림은 크게 과장했어요.</p>
            <p><b style="font-size:13px;letter-spacing:.08em;margin-right:8px">내용 정리</b> 카드를 끌어 빈칸에 놓거나, 카드를 누른 뒤 빈칸을 누르세요. 다 채우면 [확인]을 누르세요.</p>`;
        body.appendChild(box);
        Activities.fill(box, {
            lines: [
                '1. [[연주시차]]: 6개월 간격으로 관측한 별의 시차의 1/2',
                '2. 별의 연주시차는 너무 작아서 단위는 [[초(″)]](1/3600도)를 써요.',
                '3. 연주시차가 1″인 별까지의 거리를 [[1 pc(파섹)]]이라고 하며, 약 3.26광년이에요.',
                '4. 우주에서 거리를 나타내는 단위',
                '(1) [[1 천문단위(AU)]]: 지구에서 태양까지의 거리',
                '(2) [[1 광년]]: 빛이 1년 동안 이동하는 거리',
                '(3) [[1 pc(파섹)]]: 연주시차가 1″인 별까지의 거리 = 약 3.26광년'
            ],
            extras: ['도(°)', '시차'],
            onSolved: () => check('fill')
        });
        box.querySelectorAll('.fill-text p').forEach((el, i) => { if (i >= 4) el.style.paddingLeft = '1.6em'; });
        api.quiz(body, {
            keepStepOpen: true, onRight: () => check('quiz'),
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
