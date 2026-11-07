// =========================================================
// 퀘스트 화면 공통 진행 (사이드바, 단계 이동, 탐구 질문, 미션 완료 화면)
// 각 미션의 내용은 js/sim/ 파일들이 window.SIMS에 등록합니다.
// =========================================================
window.SIMS = window.SIMS || {};

// 시뮬레이션 공통 도구: SVG 요소 만들기, [그림 | 조작판] 배치, 터치 좌표를 SVG 좌표로
window.SimKit = {
    svgEl(tag, attrs, parent) {
        const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (const k in attrs) e.setAttribute(k, attrs[k]);
        if (parent) parent.appendChild(e);
        return e;
    },
    layout(body) {
        const wrap = document.createElement('div');
        wrap.className = 'sim-grid';
        wrap.innerHTML = '<div class="sim-view"></div><div class="controls"></div>';
        body.appendChild(wrap);
        return { view: wrap.querySelector('.sim-view'), ctrl: wrap.querySelector('.controls') };
    },
    point(svg, e, W, H) {
        const r = svg.getBoundingClientRect();
        return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height];
    },
    text(parent, x, y, str, attrs = {}) {
        const t = window.SimKit.svgEl('text', { x, y, fill: '#a9b1d9', 'font-size': 13, ...attrs }, parent);
        t.textContent = str;
        return t;
    }
};

(function () {
    const QUEST_ID = parseInt(document.body.dataset.quest, 10);
    const quest = QUESTS[QUEST_ID];
    const $ = s => document.querySelector(s);

    let mission = 1, step = 0, stepDone = [];

    // 탐구 질문: 정답을 고르면 다음 단계가 열림
    function quiz(container, { q, options, answer, explain, hint, onRight }) {
        const box = document.createElement('div');
        box.className = 'quiz';
        box.innerHTML = `<div class="q">${q}</div><div class="opts"></div><div class="feedback" aria-live="polite"></div>`;
        const opts = box.querySelector('.opts'), fb = box.querySelector('.feedback');
        options.forEach((o, i) => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'btn'; b.textContent = o;
            b.addEventListener('click', () => {
                if (box.dataset.solved) return;
                if (i === answer) {
                    b.classList.add('right'); box.dataset.solved = '1';
                    fb.className = 'feedback ok'; fb.textContent = explain || '맞았어요!';
                    onRight && onRight();
                } else {
                    b.classList.add('wrong');
                    fb.className = 'feedback'; fb.textContent = hint || '시뮬레이션을 다시 조작해 보고 골라 보세요.';
                }
            });
            opts.appendChild(b);
        });
        container.appendChild(box);
        return box;
    }

    function api() {
        const m = mission, s = step;
        return {
            questId: QUEST_ID, missionId: m,
            done() { if (mission === m && step === s && !stepDone[s]) { stepDone[s] = true; renderStepChrome(); } },
            quiz(container, cfg) { return quiz(container, { ...cfg, onRight: () => { cfg.onRight && cfg.onRight(); this.done(); } }); },
            completeMission() { finishMission(m); }
        };
    }

    function steps() { return (SIMS[`${QUEST_ID}_${mission}`] || { steps: [] }).steps; }

    function openMission(m, s) {
        mission = m;
        const n = steps().length;
        const finished = isMissionCompleted(QUEST_ID, m);
        stepDone = Array.from({ length: n }, () => finished);
        step = Math.min(s || 0, n - 1);
        try { history.replaceState(null, '', `#m${m}`); } catch (e) { /* 일부 환경에서는 주소 변경 불가 */ }
        render();
        window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    }

    function render() {
        renderMissionNav($('#mission-nav'), QUEST_ID, mission, m => openMission(m, 0));
        const meta = quest.missions.find(x => x.id === mission);
        $('#mission-kicker').textContent = `QUEST ${QUEST_ID} · ${quest.name}  —  MISSION ${mission}`;
        $('#mission-title').textContent = meta.title;
        const stage = $('#stage');
        stage.innerHTML = '';
        const st = steps()[step];
        if (!st) { stage.innerHTML = '<p class="lead">준비 중인 미션이에요.</p>'; return; }
        const h = document.createElement('h3'); h.textContent = st.title;
        stage.appendChild(h);
        const body = document.createElement('div');
        body.style.display = 'grid'; body.style.gap = '16px';
        stage.appendChild(body);
        st.build(body, api());
        renderStepChrome();
    }

    function renderStepChrome() {
        const tabs = $('#step-tabs');
        tabs.innerHTML = '';
        steps().forEach((st, i) => {
            const b = document.createElement('button');
            b.type = 'button';
            const open = i === 0 || stepDone[i - 1] || stepDone[i];
            b.className = 'step-tab' + (i === step ? ' current' : '') + (stepDone[i] ? ' done' : '');
            b.disabled = !open;
            b.innerHTML = `<span class="n">${i + 1}</span>${st.short || st.title}`;
            b.addEventListener('click', () => { if (i !== step) { step = i; render(); } });
            tabs.appendChild(b);
        });
        const last = step === steps().length - 1;
        const prev = $('#prev-step'), next = $('#next-step'), hint = $('#step-hint');
        prev.disabled = step === 0;
        next.hidden = last;
        next.disabled = !stepDone[step];
        hint.textContent = last
            ? (isMissionCompleted(QUEST_ID, mission) ? '이미 완료한 미션이에요. 다시 연습해도 좋아요.' : '내용정리를 모두 맞히면 미션이 완료돼요.')
            : (stepDone[step] ? '다음 단계로 넘어갈 수 있어요.' : '시뮬레이션을 조작하고 탐구 질문에 답하면 다음 단계가 열려요.');
    }

    function finishMission(m) {
        const first = !isMissionCompleted(QUEST_ID, m);
        completeMission(QUEST_ID, m);
        stepDone = stepDone.map(() => true);
        renderMissionNav($('#mission-nav'), QUEST_ID, mission, x => openMission(x, 0));
        renderStepChrome();
        const meta = quest.missions.find(x => x.id === m);
        const ov = document.createElement('div');
        ov.className = 'complete-overlay';
        ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'complete-title');
        ov.innerHTML = `<div class="complete-card">
            <div class="medal">${QUEST_ID}-${m}</div>
            <h2 id="complete-title">미션 ${m} '${meta.title}' 완료!</h2>
            <p>${first ? '탐사 배지를 하나 얻었어요.' : '다시 한 번 완료했어요.'} 우주 탐사대로 돌아가 단원을 얼마나 클리어했는지 확인해 보세요.</p>
            <a class="btn btn-primary" href="index.html">우주 탐사대로 돌아가기</a>
        </div>`;
        document.body.appendChild(ov);
        starBurst(ov.querySelector('.complete-card'));
        ov.querySelector('a').focus();
    }

    document.addEventListener('DOMContentLoaded', () => {
        $('#prev-step').addEventListener('click', () => { if (step > 0) { step--; render(); } });
        $('#next-step').addEventListener('click', () => { if (stepDone[step]) { step++; render(); } });

        // 주소의 #m2 같은 표시로 미션 선택, 없으면 진행할 수 있는 마지막 미션
        const asked = parseInt((location.hash.match(/^#m(\d+)$/) || [])[1], 10);
        if (asked && canAccessMission(QUEST_ID, asked).access) return openMission(asked, 0);
        if (!canAccessQuest(QUEST_ID)) {
            $('#stage').innerHTML = `<p class="lead">${lockMessage(QUEST_ID, 1)}</p><a class="btn btn-primary" href="index.html">우주 탐사대로 돌아가기</a>`;
            renderMissionNav($('#mission-nav'), QUEST_ID, 0, () => {});
            return;
        }
        openMission(getLastAvailableMission(QUEST_ID), 0);
    });
})();
