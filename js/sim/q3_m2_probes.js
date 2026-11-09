// 퀘스트 3 · 미션 2 우주 탐사선 — 스푸트니크 1호부터 2026년까지
// 카드 내용은 ERAS 안에서 고치면 돼요. 스텝 6(2026년)은 해마다 바뀌니 새 소식에 맞춰 고쳐 주세요.
(function () {
    const { svgEl, text } = SimKit;

    // ---------- 조작 활동 ----------

    // 스텝 1: 뉴턴의 대포 — 발사 속도에 따라 떨어짐 / 지구 궤도 / 지구 탈출
    function cannon(box, done) {
        box.insertAdjacentHTML('beforeend', `<h4 class="act-title">활동 · 뉴턴의 대포</h4>
            <p class="note">아주 높은 산(고도 400 km) 위에서 대포알을 옆으로 쏜다고 생각해 보세요. 속도를 바꿔 가며 쏘아서 <b>떨어짐, 지구 궤도, 지구 탈출</b>을 모두 찾아보세요.</p>`);
        const W = 640, H = 420, CX = 320, CY = 230, R_KM = 6371, GM = 398600, H0 = 400, S = 120 / R_KM;
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': '지구와 대포알이 날아간 길' }, box);
        svg.style.width = '100%'; svg.style.maxHeight = '420px'; svg.style.background = '#070a1d'; svg.style.borderRadius = '12px';
        svgEl('circle', { cx: CX, cy: CY, r: R_KM * S, fill: '#1a3f8f', stroke: '#7fb2ff', 'stroke-width': 2 }, svg);
        const top = CY - (R_KM + H0) * S;
        svgEl('path', { d: `M${CX - 16} ${CY - R_KM * S + 2} L${CX} ${top} L${CX + 16} ${CY - R_KM * S + 2} Z`, fill: '#6b5a44' }, svg);
        svgEl('rect', { x: CX - 4, y: top - 6, width: 18, height: 7, rx: 2, fill: '#dfe6ff' }, svg);
        const paths = svgEl('g', {}, svg);
        const ctrl = document.createElement('div'); ctrl.className = 'act-ctrl';
        ctrl.innerHTML = `<div class="slider"><label for="cn-v">발사 속도 <output id="cn-out">5.0 km/s</output></label>
                <input id="cn-v" type="range" min="1" max="12" step="0.1" value="5"></div>
            <button type="button" class="btn btn-primary" id="cn-fire">발사!</button>
            <div class="readout"><div class="row"><span>결과</span><b id="cn-res">-</b></div>
                <div class="row"><span>찾은 결과</span><b id="cn-found">0 / 3</b></div></div>
            <p class="note">교과서의 기준 속도는 지표면 가까이에서 잰 값이에요. 지구를 도는 데 약 7.9 km/s, 지구를 벗어나는 데 약 11.2 km/s가 필요해요. 높은 곳에서는 조금 더 작아요.</p>`;
        box.appendChild(ctrl);
        const slider = ctrl.querySelector('#cn-v');
        slider.addEventListener('input', () => { ctrl.querySelector('#cn-out').textContent = `${parseFloat(slider.value).toFixed(1)} km/s`; });
        const found = new Set();
        const COLORS = { fall: '#ff9d4f', orbit: '#4fd1b5', escape: '#ff4fa3' };
        const LABEL = { fall: '지구로 떨어짐', orbit: '지구 궤도를 돎', escape: '지구를 벗어남' };
        ctrl.querySelector('#cn-fire').addEventListener('click', () => {
            const v = parseFloat(slider.value);
            let x = 0, y = R_KM + H0, vx = v, vy = 0;
            const dt = 5, pts = [[x, y]];
            let res = 'orbit', ang = 0, prev = Math.atan2(y, x);
            const escape = v * v / 2 - GM / (R_KM + H0) >= 0;
            for (let i = 0; i < 40000; i++) {
                const r = Math.hypot(x, y), a = -GM / (r * r * r);
                vx += a * x * dt; vy += a * y * dt; x += vx * dt; y += vy * dt;
                if (i % 6 === 0) pts.push([x, y]);
                const rr = Math.hypot(x, y);
                if (rr < R_KM) { res = 'fall'; pts.push([x, y]); break; }
                if (escape && rr > 5 * R_KM) { res = 'escape'; break; }
                const th = Math.atan2(y, x); let d = th - prev; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; ang += d; prev = th;
                if (Math.abs(ang) > 2 * Math.PI) break;
            }
            if (escape && res !== 'fall') res = 'escape';
            const d = pts.map(([px, py], i) => `${i ? 'L' : 'M'}${(CX + px * S).toFixed(1)} ${(CY - py * S).toFixed(1)}`).join('');
            [...paths.children].forEach(p => p.setAttribute('opacity', .6));
            svgEl('path', { d, fill: 'none', stroke: COLORS[res], 'stroke-width': 2.4 }, paths);
            found.add(res);
            ctrl.querySelector('#cn-res').textContent = `${v.toFixed(1)} km/s → ${LABEL[res]}`;
            ctrl.querySelector('#cn-found').textContent = `${found.size} / 3`;
            if (found.size === 3) { done(); toast('세 가지 결과를 모두 찾았어요!'); }
        });
    }

    // 스텝 3: ISS 하루 — 약 90분에 한 바퀴
    function issDay(box, done) {
        box.insertAdjacentHTML('beforeend', `<h4 class="act-title">활동 · 국제 우주 정거장의 하루</h4>
            <p class="note">국제 우주 정거장은 고도 약 400 km에서 약 92분에 지구를 한 바퀴 돌아요. 시간을 24시간까지 움직여 몇 바퀴 도는지 세어 보세요.</p>`);
        const W = 640, H = 360, CX = 320, CY = 180;
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': '지구를 도는 국제 우주 정거장' }, box);
        svg.style.width = '100%'; svg.style.maxHeight = '360px'; svg.style.background = '#070a1d'; svg.style.borderRadius = '12px';
        svgEl('path', { d: `M${CX} ${CY - 110} A110 110 0 0 1 ${CX} ${CY + 110} Z`, fill: '#1a3f8f' }, svg);
        svgEl('path', { d: `M${CX} ${CY - 110} A110 110 0 0 0 ${CX} ${CY + 110} Z`, fill: '#0c1d48' }, svg);
        svgEl('circle', { cx: CX, cy: CY, r: 110, fill: 'none', stroke: '#7fb2ff', 'stroke-width': 2 }, svg);
        svgEl('circle', { cx: CX, cy: CY, r: 140, fill: 'none', stroke: '#6f78a8', 'stroke-dasharray': '4 6' }, svg);
        text(svg, W - 20, 30, '햇빛 →', { 'text-anchor': 'end', fill: '#f5c451', 'font-size': 14 });
        text(svg, CX + 60, CY + 4, '낮', { fill: '#dfe6ff', 'font-size': 14 });
        text(svg, CX - 72, CY + 4, '밤', { fill: '#6f78a8', 'font-size': 14 });
        const iss = svgEl('g', {}, svg);
        svgEl('rect', { x: -16, y: -2, width: 32, height: 4, fill: '#dfe6ff' }, iss);
        [-12, -6, 6, 12].forEach(x => svgEl('rect', { x: x - 2, y: -9, width: 4, height: 18, fill: '#f5c451' }, iss));
        const ctrl = document.createElement('div'); ctrl.className = 'act-ctrl';
        ctrl.innerHTML = `<div class="slider"><label for="iss-t">시간 <output id="iss-out">0시간</output></label>
                <input id="iss-t" type="range" min="0" max="24" step="0.25" value="0"></div>
            <div class="readout"><div class="row"><span>지구를 돈 횟수</span><b id="iss-n">0바퀴</b></div>
                <div class="row"><span>본 해돋이</span><b id="iss-sun">0번</b></div></div>`;
        box.appendChild(ctrl);
        const t = ctrl.querySelector('#iss-t');
        const P = 92;
        function draw() {
            const h = parseFloat(t.value), turns = h * 60 / P;
            const a = Math.PI / 2 + turns * 2 * Math.PI;   // 아래(해 질 녘)에서 출발 → 밤 → 위쪽에서 해돋이
            iss.setAttribute('transform', `translate(${CX + Math.cos(a) * 140} ${CY + Math.sin(a) * 140})`);
            ctrl.querySelector('#iss-out').textContent = `${h % 1 ? h.toFixed(2) : h}시간`;
            ctrl.querySelector('#iss-n').textContent = `${Math.floor(turns)}바퀴`;
            ctrl.querySelector('#iss-sun').textContent = `${Math.floor(turns + .5)}번`;
            if (h >= 24) done();
        }
        t.addEventListener('input', draw); draw();
    }

    // 스텝 5: 태양계 거리 자 — 로그 눈금, 빛이 닿는 시간
    function ruler(box, done) {
        box.insertAdjacentHTML('beforeend', `<h4 class="act-title">활동 · 태양계 거리 자</h4>
            <p class="note">눈금 한 칸마다 거리가 10배씩 커지는 자예요. 다섯 곳을 모두 눌러 지구에서 빛으로 얼마나 걸리는지 비교해 보세요.</p>`);
        const C = 299792; // km/s
        const OBJ = [
            { id: 'moon', n: '달', d: 384400, col: '#c9c9d4' },
            { id: 'sun', n: '태양', d: 1.496e8, col: '#f5c451' },
            { id: 'nep', n: '해왕성', d: 4.5e9, col: '#5b8cff' },
            { id: 'voy', n: '보이저 1호 (2026년 11월)', d: 2.59e10, col: '#ff4fa3' },
            { id: 'prox', n: '가장 가까운 별 (프록시마 센타우리)', d: 4.0e13, col: '#ff9d4f' }
        ];
        const W = 640, H = 170, L = 40, Rr = 600, lo = 5, hi = 14;
        const X = d => L + (Math.log10(d) - lo) / (hi - lo) * (Rr - L);
        const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': '로그 눈금 거리 자' }, box);
        svg.style.width = '100%'; svg.style.background = '#070a1d'; svg.style.borderRadius = '12px';
        svgEl('line', { x1: L, y1: 100, x2: Rr, y2: 100, stroke: '#6f78a8', 'stroke-width': 2 }, svg);
        for (let e = lo; e <= hi; e++) {
            svgEl('line', { x1: X(10 ** e), y1: 94, x2: X(10 ** e), y2: 106, stroke: '#6f78a8' }, svg);
            text(svg, X(10 ** e), 124, `10^${e}`, { 'text-anchor': 'middle', 'font-size': 11 });
        }
        text(svg, L, 148, '단위: km', { 'font-size': 11 });
        text(svg, X(1e5) - 14, 104, '지구', { 'text-anchor': 'end', fill: '#7fb2ff', 'font-size': 12 });
        const marks = svgEl('g', {}, svg);
        const ctrl = document.createElement('div'); ctrl.className = 'act-ctrl';
        ctrl.innerHTML = `<div class="seg" role="group" aria-label="거리를 볼 천체">${OBJ.map(o => `<button type="button" data-o="${o.id}" aria-pressed="false">${o.n.split(' (')[0]}</button>`).join('')}</div>
            <div class="readout"><div class="row"><span>천체</span><b id="ru-n">-</b></div>
                <div class="row"><span>거리</span><b id="ru-d">-</b></div>
                <div class="row"><span>빛이 닿는 시간</span><b id="ru-t">-</b></div></div>`;
        box.appendChild(ctrl);
        const fmtD = d => d >= 1e12 ? `약 ${(d / 1e12).toFixed(0)}조 km` : d >= 1e8 ? `약 ${(d / 1e8).toFixed(d >= 1e10 ? 0 : 1)}억 km` : `약 ${(d / 1e4).toFixed(0)}만 km`;
        const fmtT = s => s < 60 ? `약 ${s.toFixed(1)}초` : s < 3600 ? `약 ${(s / 60).toFixed(1)}분` : s < 86400 * 2 ? `약 ${(s / 3600).toFixed(1)}시간` : `약 ${(s / 86400 / 365.25).toFixed(1)}년`;
        const seen = new Set();
        ctrl.querySelectorAll('[data-o]').forEach(b => b.addEventListener('click', () => {
            const o = OBJ.find(x => x.id === b.dataset.o);
            ctrl.querySelectorAll('[data-o]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
            if (!seen.has(o.id)) {
                seen.add(o.id);
                svgEl('circle', { cx: X(o.d), cy: 100, r: 7, fill: o.col }, marks);
                text(marks, X(o.d), seen.size % 2 ? 80 : 66, o.n.split(' (')[0], { 'text-anchor': 'middle', fill: o.col, 'font-size': 12, 'font-weight': 700 });
            }
            ctrl.querySelector('#ru-n').textContent = o.n;
            ctrl.querySelector('#ru-d').textContent = fmtD(o.d);
            ctrl.querySelector('#ru-t').textContent = o.id === 'voy' ? '약 1일 (1광일)' : fmtT(o.d / C);
            if (seen.size === OBJ.length) done();
        }));
    }

    const classifyAct = (heading, note, cfg) => (box, done) => {
        box.insertAdjacentHTML('beforeend', `<h4 class="act-title">활동 · ${heading}</h4><p class="note">${note}</p>`);
        Activities.classify(box, { ...cfg, onSolved: done });
    };

    // ---------- 카드 ----------
    const ERAS = [
        {
            title: '우주 시대의 문을 열다', years: '1957 – 1972', short: '우주 시대',
            lead: '미국과 소련이 앞다투어 우주로 향하면서, 첫 인공위성에서 사람의 달 착륙까지 15년이 채 걸리지 않았어요.',
            items: [
                { y: '1957', n: '스푸트니크 1호', en: 'Sputnik 1 · 소련', h: '인류 최초의 인공위성',
                  t: '1957년 10월 4일 소련이 쏘아 올린 지름 58 cm의 공 모양 위성이에요. 약 96분마다 지구를 돌며 전파 신호를 보냈어요.',
                  c: '우주 시대가 시작되고, 미국과 소련의 우주 경쟁이 시작되었어요.',
                  img: { file: 'Sputnik asm.jpg', cap: '스푸트니크 1호 복제품' } },
                { y: '1958', n: '익스플로러 1호', en: 'Explorer 1 · 미국', h: '지구를 둘러싼 방사선 띠 발견',
                  t: '미국의 첫 인공위성이에요. 싣고 간 방사선 측정기로 지구를 둘러싼 방사선 띠(반 앨런대)를 발견했어요.',
                  c: '인공위성이 과학 관측 도구가 되었어요.',
                  img: { file: 'Explorer1.jpg', cap: '익스플로러 1호' } },
                { y: '1961', n: '보스토크 1호', en: 'Vostok 1 · 소련', h: '처음으로 사람이 우주에 가다',
                  t: '1961년 4월 12일 소련의 유리 가가린이 타고 지구를 한 바퀴(약 108분) 돈 뒤 돌아왔어요.',
                  c: '사람도 우주에서 살아 돌아올 수 있음을 보였어요.',
                  img: { file: 'Vostok1 descent module.jpg', cap: '보스토크 1호의 귀환 캡슐' } },
                { y: '1966', n: '루나 9호', en: 'Luna 9 · 소련', h: '달에 처음 부드럽게 내려앉다',
                  t: '무인 탐사선이 처음으로 달 표면에 부서지지 않고 내려앉아 사진을 보냈어요. 달 표면이 단단해 착륙할 수 있다는 것을 확인했어요.',
                  img: { file: 'First Photo from the Surface of the Moon.jpg', cap: '루나 9호가 보낸 달 표면 첫 사진' } },
                { y: '1969', n: '아폴로 11호', en: 'Apollo 11 · 미국', h: '사람이 처음으로 달에 내리다',
                  t: '1969년 7월 20일 우주인 2명이 달에 내려 약 2시간 반 동안 걸으며 실험을 하고, 달 암석 약 22 kg을 가져왔어요.',
                  c: '1972년까지 모두 12명이 달 위를 걸었어요.',
                  img: { file: 'Apollo 11 bootprint.jpg', cap: '아폴로 11호 우주인이 달에 남긴 발자국' } },
                { y: '1972', n: '아폴로 17호', en: 'Apollo 17 · 미국', h: '지금까지 마지막 유인 달 착륙',
                  t: '사람이 달에 내린 마지막 임무예요. 달로 가는 길에 찍은 둥근 지구 사진 "블루 마블"이 유명해요.',
                  c: '그 뒤 50년 넘게 사람은 지구 가까운 궤도에만 머물렀어요. (스텝 6의 아르테미스 II로 이어져요.)',
                  img: { file: 'The Earth seen from Apollo 17.jpg', cap: '아폴로 17호가 찍은 지구, 블루 마블' } }
            ],
            activity: cannon,
            quiz: { q: '인공위성이 지구로 떨어지지 않고 계속 지구를 도는 까닭은 무엇일까요?',
                options: ['우주에는 중력이 없어서', '매우 빠르게 옆으로 날아가, 떨어지는 만큼 지구 표면도 휘어져 멀어지기 때문에', '로켓 엔진을 계속 켜고 있어서'], answer: 1,
                explain: '맞아요. 인공위성은 계속 지구 쪽으로 떨어지고 있지만, 옆으로 매우 빠르게 움직이기 때문에 둥근 지구 표면에 닿지 않고 돌아요.',
                hint: '뉴턴의 대포에서 대포알이 궤도를 돌 때를 떠올려 보세요.' }
        },
        {
            title: '무인 탐사선, 행성으로', years: '1962 – 현재', short: '무인 탐사선',
            lead: '사람이 가기 어려운 곳에는 무인 탐사선이 갔어요. 곁을 지나가며 보던 탐사가 궤도를 돌고, 내려앉고, 돌아다니고, 흙을 가져오는 탐사로 발전했어요.',
            items: [
                { y: '1962', n: '마리너 2호', en: 'Mariner 2 · 미국', h: '다른 행성 근접 통과에 처음 성공',
                  t: '금성 곁을 지나가며 금성 표면이 매우 뜨겁다는 것을 처음 측정했어요.',
                  draw: 'probe', drawLabel: '근접 통과 탐사선', cap: '마리너 2호처럼 행성 곁을 지나가는 탐사선' },
                { y: '1965', n: '마리너 4호', en: 'Mariner 4 · 미국', h: '화성을 가까이에서 찍은 첫 사진',
                  t: '화성 곁을 지나며 사진 20여 장을 보내, 화성 표면에 운석 구덩이가 많다는 것을 보여 주었어요.',
                  img: { file: 'First close up image of another planet - Mars by Mariner 4.jpg', cap: '마리너 4호가 찍은 화성' } },
                { y: '1976', n: '바이킹 1호', en: 'Viking 1 · 미국', h: '화성에 내려앉아 6년 동안 관측',
                  t: '화성에 착륙해 표면 사진과 날씨 자료를 보냈고, 흙에서 생명의 흔적을 찾는 실험도 했어요.',
                  img: { file: 'PIA00563-Viking1-FirstColorImage-19760721.jpg', cap: '바이킹 1호가 보낸 화성 표면의 첫 컬러 사진' } },
                { y: '1995', n: '갈릴레오', en: 'Galileo · 미국', h: '목성 궤도를 돈 첫 탐사선',
                  t: '목성 궤도를 돌며 위성들을 조사하고, 목성 대기 속으로 탐사 장비를 떨어뜨려 직접 측정했어요. 위성 유로파의 얼음 밑에 바다가 있을 가능성을 찾았어요.',
                  img: { file: 'Artwork Galileo-Io-Jupiter.JPG', cap: '목성과 위성 이오 곁의 갈릴레오 (상상도)' } },
                { y: '2004–2017', n: '카시니-하위헌스', en: 'Cassini–Huygens · 미국·유럽', h: '토성을 13년 동안 조사',
                  t: '토성 궤도를 돌며 고리와 위성을 자세히 조사했어요. 함께 간 하위헌스는 2005년 위성 타이탄에 내려앉았어요.',
                  img: { file: 'Saturn during Equinox.jpg', cap: '카시니가 찍은 토성' } },
                { y: '2019', n: '창어 4호', en: "Chang'e 4 · 중국", h: '달의 뒷면에 처음 착륙',
                  t: '지구에서 보이지 않는 달의 뒷면에 처음 내려앉았어요. 뒷면에서는 지구와 직접 통신할 수 없어 중계 위성을 함께 썼어요.',
                  img: { file: 'Yutu-2 leaving Chang e-4-iau1901a.jpg', cap: '창어 4호에서 내려가는 로버 위투 2호' } },
                { y: '2020 · 2023', n: '하야부사2 · 오시리스-렉스', en: 'Hayabusa2 · 일본 / OSIRIS-REx · 미국', h: '소행성의 흙을 지구로 가져오다',
                  t: '하야부사2는 소행성 류구의 표본을 2020년에, 오시리스-렉스는 소행성 베누의 표본을 2023년에 지구로 가져왔어요.',
                  c: '태양계가 생길 무렵의 물질을 실험실에서 직접 분석할 수 있게 되었어요.',
                  img: { file: 'Bennu mosaic OSIRIS-REx (square).png', cap: '오시리스-렉스가 찍은 소행성 베누' } },
                { y: '2021', n: '퍼서비어런스', en: 'Perseverance · 미국', h: '화성에서 표본을 모으는 로버',
                  t: '화성의 옛 호수 자리를 돌아다니며 생명의 흔적이 남았을지 모를 암석 표본을 모으고 있어요. 함께 간 헬리콥터 인저뉴어티는 다른 행성에서 처음으로 동력 비행을 했어요.',
                  img: { file: 'Perseverance selfie, looking at WATSON (PIA24542).jpg', cap: '퍼서비어런스가 화성에서 찍은 자기 사진' } }
            ],
            activity: classifyAct('탐사 방식 나누기', '각 탐사선을 탐사 방식에 맞는 상자에 넣고 [확인]을 누르세요.', {
                bins: [{ id: 'fly', name: '근접 통과' }, { id: 'orb', name: '궤도선' }, { id: 'land', name: '착륙선 · 로버' }, { id: 'ret', name: '표본 귀환' }],
                items: [
                    { label: '마리너 2호', bin: 'fly' }, { label: '마리너 4호', bin: 'fly' },
                    { label: '갈릴레오', bin: 'orb' }, { label: '카시니', bin: 'orb' },
                    { label: '바이킹 1호', bin: 'land' }, { label: '창어 4호', bin: 'land' }, { label: '퍼서비어런스', bin: 'land' },
                    { label: '하야부사2', bin: 'ret' }, { label: '오시리스-렉스', bin: 'ret' }
                ]
            }),
            quiz: { q: '다른 천체의 흙을 지구의 실험실에서 직접 분석할 수 있는 탐사 방식은 무엇일까요?',
                options: ['근접 통과', '궤도선', '표본 귀환'], answer: 2,
                explain: '맞아요. 하야부사2와 오시리스-렉스처럼 표본을 가져오면 지구의 정밀한 장비로 직접 분석할 수 있어요.',
                hint: '하야부사2 · 오시리스-렉스 카드를 다시 읽어 보세요.' }
        },
        {
            title: '우주에 머물다', years: '1971 – 현재', short: '우주 정거장',
            lead: '잠깐 다녀오는 비행에서, 우주에 오래 머물며 실험하는 시대로 바뀌었어요. 우주왕복선은 다시 쓰는 우주선의 출발점이에요.',
            items: [
                { y: '1971', n: '살류트 1호', en: 'Salyut 1 · 소련', h: '첫 우주 정거장',
                  t: '소련이 올린 첫 우주 정거장이에요. 우주인들이 23일 동안 머물며 실험했어요.',
                  img: { file: 'Salyut 1 and Soyuz drawing.png', cap: '살류트 1호와 소유스 우주선 (그림)' } },
                { y: '1973', n: '스카이랩', en: 'Skylab · 미국', h: '미국의 첫 우주 정거장',
                  t: '우주인들이 머물며 태양을 관측하고 무중력 상태에서 여러 실험을 했어요.',
                  img: { file: 'Skylab (SL-4).jpg', cap: '지구 궤도의 스카이랩' } },
                { y: '1981–2011', n: '우주왕복선', en: 'Space Shuttle · 미국', h: '다시 쓰는 우주선',
                  t: '날개 달린 궤도선을 여러 번 다시 쓰며 30년 동안 135번 비행했어요. 허블 우주 망원경을 올리고 고쳤으며, 국제 우주 정거장을 지었어요.',
                  img: { file: 'STS-89 night launch II.jpg', cap: '우주왕복선의 야간 발사' } },
                { y: '1986–2001', n: '미르', en: 'Mir · 소련·러시아', h: '모듈을 이어 붙인 정거장',
                  t: '여러 모듈을 하나씩 이어 붙여 만들었어요. 한 우주인이 437일 동안 머문 기록은 지금도 가장 길어요.',
                  img: { file: 'Mir on 12 June 1998.jpg', cap: '1998년의 미르' } },
                { y: '1998–', n: '국제 우주 정거장 (ISS)', en: 'International Space Station', h: '여러 나라가 함께 만든 우주 실험실',
                  t: '고도 약 400 km에서 약 90분에 한 바퀴씩 지구를 돌아요. 2000년 11월부터 사람이 늘 머물고 있고, 2008년에는 한국 첫 우주인도 다녀갔어요.',
                  c: '2030년에 퇴역할 예정이에요.',
                  img: { file: 'International Space Station after undocking of STS-132.jpg', cap: '국제 우주 정거장' } },
                { y: '2021–', n: '톈궁', en: 'Tiangong · 중국', h: '중국의 우주 정거장',
                  t: '중국이 모듈을 이어 지은 우주 정거장으로, 우주인 3명이 늘 머물러요.',
                  img: { file: 'Tiangong Space Station Rendering 2022.10.jpg', cap: '톈궁 우주 정거장 (그림)' } }
            ],
            activity: issDay,
            quiz: { q: '국제 우주 정거장의 우주인은 하루에 해돋이를 몇 번쯤 볼까요?',
                options: ['1번', '약 16번', '약 90번'], answer: 1,
                explain: '맞아요. 약 90분마다 지구를 한 바퀴 돌기 때문에 하루(1440분)에 약 16번 해가 뜨고 져요.',
                hint: '활동에서 24시간 동안 돈 횟수를 확인해 보세요.' }
        },
        {
            title: '우주 망원경, 대기 밖의 눈', years: '1990 – 현재', short: '우주 망원경',
            lead: '대기는 X선, 자외선, 적외선 대부분을 막고 별빛을 흔들어요. 그래서 망원경을 우주로 올렸어요. (허블과 제임스 웹은 미션 1에서도 만났어요.)',
            items: [
                { y: '1990', n: '허블 우주 망원경', en: 'Hubble · 미국·유럽', h: '가시광선과 자외선의 눈',
                  t: '고도 약 540 km에서 2.4 m 거울로 관측해요. 우주왕복선 우주인들이 5번 찾아가 고치고 성능을 높였어요.',
                  img: { file: 'HST-SM4.jpeg', cap: '지구 궤도의 허블 우주 망원경' } },
                { y: '1999', n: '찬드라 X선 관측선', en: 'Chandra · 미국', h: 'X선으로 본 뜨거운 우주',
                  t: 'X선은 대기에 모두 흡수되어 땅에서는 볼 수 없어요. 찬드라는 블랙홀 주변처럼 아주 뜨거운 곳에서 나오는 X선을 관측해요.',
                  img: { file: 'STS-93 Deployment of Chandra (deploy3).jpg', cap: '우주왕복선에서 풀려나는 찬드라' } },
                { y: '2003', n: '스피처 우주 망원경', en: 'Spitzer · 미국', h: '적외선으로 먼지 속을 보다',
                  t: '적외선으로 먼지 구름 속에서 태어나는 별과 차가운 천체를 관측했어요(2020년 임무 종료).',
                  img: { file: "Great Observatories' Unique Views of the Milky Way.jpg", cap: '허블(가시광선)·스피처(적외선)·찬드라(X선)로 본 우리은하 중심' } },
                { y: '2009', n: '케플러 우주 망원경', en: 'Kepler · 미국', h: '외계 행성 사냥꾼',
                  t: '별 앞을 행성이 지나갈 때 별빛이 살짝 어두워지는 것을 찾아, 외계 행성 2,600여 개를 확인했어요.',
                  img: { file: 'Kepler Space Telescope spacecraft model 2.png', cap: '케플러 우주 망원경 (모형 그림)' } },
                { y: '2021', n: '제임스 웹 우주 망원경', en: 'James Webb · 미국·유럽·캐나다', h: '6.5 m 적외선의 눈',
                  t: '지구에서 약 150만 km 떨어진 곳에서 적외선으로 관측해요. 우주가 팽창하며 적외선 쪽으로 늘어난, 아주 먼 은하의 빛을 잡아요.',
                  img: { file: 'JWST spacecraft model 3.png', cap: '제임스 웹 우주 망원경 (모형 그림)' } }
            ],
            activity: classifyAct('대기의 창문', '빛의 종류를 땅에서 관측할 수 있는지에 따라 나누고 [확인]을 누르세요.', {
                bins: [{ id: 'ground', name: '땅에서도 관측할 수 있어요' }, { id: 'space', name: '우주로 나가야 해요' }],
                items: [
                    { label: '가시광선', bin: 'ground' }, { label: '전파', bin: 'ground' },
                    { label: 'X선', bin: 'space' }, { label: '감마선', bin: 'space' }, { label: '자외선 대부분', bin: 'space' }, { label: '적외선 대부분', bin: 'space' }
                ]
            }),
            quiz: { q: '찬드라 X선 관측선을 우주에 올린 가장 큰 까닭은 무엇일까요?',
                options: ['X선은 대기에 흡수되어 땅까지 오지 못해서', '우주가 땅보다 밝아서', '망원경이 너무 커서 땅에 둘 곳이 없어서'], answer: 0,
                explain: '맞아요. X선, 감마선, 대부분의 자외선과 적외선은 대기가 막기 때문에 우주에서 관측해야 해요.',
                hint: '활동에서 X선을 어느 상자에 넣었는지 떠올려 보세요.' }
        },
        {
            title: '가장 멀리, 가장 가까이', years: '1972 – 현재', short: '가장 멀리',
            lead: '기록을 세운 탐사선을 따라가며 태양계가 얼마나 큰지 느껴 봐요.',
            items: [
                { y: '1972', n: '파이오니어 10호', en: 'Pioneer 10 · 미국', h: '처음으로 소행성대를 지나다',
                  t: '소행성대를 처음 지나 1973년 목성을 가까이에서 관측했어요. 2003년 마지막 신호를 보낸 뒤에도 태양계 밖으로 날아가고 있어요.',
                  img: { file: 'Pioneer 10 or 11 in outer solar system.jpg', cap: '태양계 바깥을 나는 파이오니어 (상상도)' } },
                { y: '1977', n: '보이저 1호', en: 'Voyager 1 · 미국', h: '사람이 만든 것 중 가장 멀리',
                  t: '목성과 토성을 지나 2012년 태양의 영향권을 벗어나 성간 공간에 들어갔어요. 2026년 11월 18일, 빛으로 하루 걸리는 거리(1광일, 약 259억 km)에 닿아요.',
                  c: '1990년 아주 먼 곳에서 지구를 찍은 "창백한 푸른 점" 사진으로도 유명해요.',
                  img: { file: 'Voyager spacecraft model.png', cap: '보이저 탐사선 (모형 그림)' } },
                { y: '1977', n: '보이저 2호', en: 'Voyager 2 · 미국', h: '네 거대 행성을 모두 방문',
                  t: '목성·토성·천왕성(1986)·해왕성(1989)을 모두 방문한 유일한 탐사선이에요. 2018년 성간 공간에 들어갔어요.',
                  img: { file: 'Neptune - Voyager 2 (29347980845) flatten crop.jpg', cap: '보이저 2호가 찍은 해왕성' } },
                { y: '2006', n: '뉴호라이즌스', en: 'New Horizons · 미국', h: '명왕성을 처음 가까이에서 보다',
                  t: '9년 넘게 날아가 2015년 명왕성 곁을 지나며, 하트 모양의 얼음 평원 등 명왕성의 모습을 처음 자세히 찍었어요.',
                  img: { file: 'Pluto in True Color - High-Res.jpg', cap: '뉴호라이즌스가 찍은 명왕성' } },
                { y: '2018', n: '파커 태양 탐사선', en: 'Parker Solar Probe · 미국', h: '태양에 가장 가까이, 가장 빠르게',
                  t: '2024년 12월 24일 태양 표면에서 약 610만 km까지 다가가 시속 약 69만 km로 날았어요. 사람이 만든 것 중 가장 빠른 물체예요.',
                  img: { file: 'Parker Solar Probe.jpg', cap: '태양에 다가가는 파커 태양 탐사선 (상상도)' } }
            ],
            activity: ruler,
            quiz: { q: '2026년 11월, 지구에서 보이저 1호로 보낸 명령은 도착하는 데 얼마나 걸릴까요?',
                options: ['약 8분', '약 하루', '약 4년'], answer: 1,
                explain: '맞아요. 보이저 1호는 빛으로 하루 걸리는 거리(1광일)에 있어서, 명령을 보내고 답을 받기까지 약 이틀이 걸려요.',
                hint: '활동의 거리 자에서 보이저 1호를 눌러 보세요.' }
        },
        {
            title: '2026년, 지금 우주에서는', years: '2025 – 2026', short: '2026년 지금',
            lead: '사람이 다시 달로 향하고, 여러 나라가 달·수성·소행성을 탐사하고 있어요. (2026년 11월 10일 기준)',
            items: [
                { y: '2026.4', n: '아르테미스 II', en: 'Artemis II · 미국 등', h: '54년 만에 사람이 다시 달 근처로',
                  t: '4월 1일 발사된 오리온 우주선에 우주비행사 4명이 타고 달 뒤편을 돌아 4월 11일 돌아왔어요. 지구에서 406,771 km까지 가 사람이 가장 멀리 간 기록을 세웠어요.',
                  c: '1972년 아폴로 17호 이후 처음으로 사람이 달 근처까지 갔어요.',
                  img: { file: 'Earthset (art002e009288).jpg', cap: '아르테미스 II에서 본, 달 너머로 지는 지구' } },
                { y: '2022–', n: '다누리', en: 'KPLO · 한국', h: '우리나라 첫 달 궤도선',
                  t: '2022년 8월 발사되어 달 궤도를 돌며 관측하고 있어요. 임무가 2027년 12월까지 연장되었어요. (미션 3에서 자세히 알아봐요.)',
                  draw: 'moonorbit', drawLabel: '다누리', cap: '달 궤도를 도는 다누리' },
                { y: '2026.10', n: '누리호 5차 발사', en: 'Nuri · 한국', h: '위성 14기를 한 번에',
                  t: '10월 7일 발사에 성공해 초소형 군집위성 5기와 큐브위성 9기를 궤도에 올렸어요.',
                  img: { file: 'KSLV-II Nuri and the launchpad 01.jpg', cap: '발사대에 선 누리호' } },
                { y: '2026.8', n: '로먼 우주 망원경', en: 'Nancy Grace Roman · 미국', h: '허블보다 훨씬 넓게 보는 눈',
                  t: '8월 30일 발사되어 지구에서 약 150만 km 떨어진 곳으로 가고 있어요. 허블만큼 선명하면서 훨씬 넓은 하늘을 빠르게 찍어 암흑 에너지와 외계 행성을 조사해요.',
                  draw: 'satellite', drawLabel: '로먼 우주 망원경', cap: '로먼 우주 망원경' },
                { y: '2026.7', n: '톈원 2호', en: 'Tianwen-2 · 중국', h: '소행성 표본을 가지러',
                  t: '2025년 5월 발사되어 2026년 7월 소행성 카모오알레와에 도착했어요. 표본을 모아 2027년 지구로 돌려보낼 계획이에요.',
                  img: { file: 'Asteroid-2016HO3-20160427.jpg', cap: '지상 망원경으로 찍은 소행성 카모오알레와 (2016 HO3)' } },
                { y: '2026.11', n: '베피콜롬보', en: 'BepiColombo · 유럽·일본', h: '8년 만에 수성 궤도로',
                  t: '유럽과 일본이 2018년 함께 쏘아 올린 수성 탐사선이에요. 2026년 11월 21일 수성 궤도에 들어갈 예정이에요.',
                  img: { file: 'BepiColombo surveys Mercury’s rich geology ESA24324352.jpeg', cap: '베피콜롬보가 수성 곁을 지나며 찍은 사진' } },
                { y: '2026 말', n: '헤라', en: 'Hera · 유럽', h: '소행성 충돌 실험의 뒷조사',
                  t: '2022년 미국의 DART 우주선이 일부러 충돌해 궤도를 바꾼 소행성 디모르포스를 조사하러 2024년 떠났어요. 2026년 말 도착해 충돌 자국을 살펴봐요.',
                  c: '지구로 다가오는 소행성을 막는 기술을 확인하는 임무예요.',
                  draw: 'probe', drawLabel: '헤라', cap: '소행성으로 향하는 헤라' },
                { y: '연기', n: '창어 7호', en: "Chang'e 7 · 중국", h: '달 남극의 얼음을 찾아',
                  t: '달 남극의 그늘진 구덩이에서 물(얼음)의 흔적을 찾을 탐사선이에요. 2026년 발사할 예정이었지만 8월에 연기되었어요.',
                  draw: 'lander', drawLabel: '창어 7호', cap: '달 남극에 내려앉을 착륙선' },
                { y: '2030 예정', n: '국제 우주 정거장의 마무리', en: 'ISS', h: '30년 넘은 실험실의 퇴역',
                  t: '2030년 퇴역해 태평양의 외딴 바다로 떨어뜨릴 예정이에요. 그 뒤는 민간 기업의 우주 정거장과 중국의 톈궁이 이어 가요.',
                  img: { file: 'View of the ISS taken during Crew-2 flyaround (ISS066-E-081311).jpg', cap: '2021년의 국제 우주 정거장' } }
            ],
            activity: classifyAct('2026 탐사 지도', '지금 탐사선이 일하고 있는 곳에 카드를 넣고 [확인]을 누르세요.', {
                bins: [{ id: 'earth', name: '지구 근처' }, { id: 'moon', name: '달' }, { id: 'merc', name: '수성' }, { id: 'ast', name: '소행성' }],
                items: [
                    { label: '국제 우주 정거장', bin: 'earth' }, { label: '로먼 우주 망원경', bin: 'earth' }, { label: '누리호 5차 위성', bin: 'earth' },
                    { label: '아르테미스 II', bin: 'moon' }, { label: '다누리', bin: 'moon' }, { label: '창어 7호', bin: 'moon' },
                    { label: '베피콜롬보', bin: 'merc' },
                    { label: '톈원 2호', bin: 'ast' }, { label: '헤라', bin: 'ast' }
                ]
            }),
            quiz: { q: '2026년 아르테미스 II가 특별한 까닭은 무엇일까요?',
                options: ['처음으로 사람이 우주에 갔기 때문에', '1972년 이후 처음으로 사람이 달 근처까지 갔기 때문에', '처음으로 무인 탐사선이 달에 착륙했기 때문에'], answer: 1,
                explain: '맞아요. 아폴로 17호 이후 54년 만에 사람이 다시 달 근처까지 다녀왔어요.',
                hint: '아르테미스 II 카드와 스텝 1의 아폴로 17호 카드를 비교해 보세요.' }
        },
        { title: '내용정리', short: '내용정리', build: summary }
    ];

    function summary(body, api) {
        const solved = { cls: false, ord: false };
        const check = () => { if (solved.cls && solved.ord) api.completeMission(); };
        body.insertAdjacentHTML('beforeend', '<p class="lead">우주 탐사 장비를 종류별로 나누고, 큰 사건을 일어난 순서대로 놓아 보세요. 둘 다 맞히면 미션이 완료돼요.</p><h4 class="act-title">1. 탐사 장비 나누기</h4>');
        Activities.classify(body, {
            bins: [{ id: 'sat', name: '인공위성' }, { id: 'crew', name: '유인 우주선' }, { id: 'stn', name: '우주 정거장' }, { id: 'tel', name: '우주 망원경' }, { id: 'probe', name: '무인 탐사선' }],
            items: [
                { label: '스푸트니크 1호', bin: 'sat' }, { label: '익스플로러 1호', bin: 'sat' },
                { label: '보스토크 1호', bin: 'crew' }, { label: '아폴로 11호', bin: 'crew' },
                { label: '미르', bin: 'stn' }, { label: '국제 우주 정거장', bin: 'stn' },
                { label: '허블', bin: 'tel' }, { label: '제임스 웹', bin: 'tel' },
                { label: '보이저 1호', bin: 'probe' }, { label: '퍼서비어런스', bin: 'probe' }
            ],
            onSolved: () => { solved.cls = true; check(); }
        });
        body.insertAdjacentHTML('beforeend', '<h4 class="act-title">2. 일어난 순서대로 놓기</h4>');
        Activities.order(body, {
            topLabel: '먼저 일어난 일', bottomLabel: '나중에 일어난 일',
            items: [
                { value: 'sputnik', label: '최초의 인공위성 스푸트니크 1호 발사', extra: '1957년' },
                { value: 'vostok', label: '보스토크 1호, 처음으로 사람이 우주에 감', extra: '1961년' },
                { value: 'apollo', label: '아폴로 11호, 사람이 처음 달에 착륙', extra: '1969년' },
                { value: 'voyager', label: '보이저 1호 발사', extra: '1977년' },
                { value: 'iss', label: '국제 우주 정거장 건설 시작', extra: '1998년' },
                { value: 'artemis', label: '아르테미스 II, 사람이 다시 달 근처까지 감', extra: '2026년' }
            ],
            onSolved: () => { solved.ord = true; check(); }
        });
    }

    SIMS['3_2'] = { steps: HistoryKit.steps(ERAS) };
})();
