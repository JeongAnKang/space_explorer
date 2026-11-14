// =========================================================
// 우주 탐사대 공통 코드
// =========================================================

// 💡 교사 설정: 수업 진도에 맞춰 아래 값만 바꾸면 됩니다.
const TEACHER_SETTINGS = Object.freeze({
    // ① 바로 열어 둘 퀘스트: 1번부터 이 번호까지는 앞 퀘스트를 끝내지 않아도 들어갈 수 있어요.
    //    그보다 뒤의 퀘스트는 앞 퀘스트를 모두 완료하면 열려요.
    openQuestsUpTo: 3,
    // ② 공개할 마지막 퀘스트: 이 번호보다 뒤의 퀘스트는 완료 여부와 상관없이 잠겨요. (전부 공개: 3)
    lastVisibleQuest: 3,
    // ③ 특정 미션만 잠그기: '퀘스트:미션' 형식 (예: ['2:4'] → 퀘스트 2의 미션 4 잠금)
    lockedMissions: []
});

// 퀘스트·미션 목록 (미션 수는 퀘스트마다 달라도 됩니다)
const QUESTS = {
    1: {
        name: '별', page: 'quest1.html',
        missions: [
            { id: 1, title: '거리' },
            { id: 2, title: '밝기' },
            { id: 3, title: '온도' }
        ]
    },
    2: {
        name: '우주', page: 'quest2.html',
        missions: [
            { id: 1, title: '우리은하의 구조' },
            { id: 2, title: '우리은하의 구성 천체' },
            { id: 3, title: '팽창하는 우주' },
            { id: 4, title: '우주탐사' }
        ]
    },
    3: {
        name: '6개의 밝기에서 우주로', page: 'quest3.html',
        missions: [
            { id: 1, title: '우주 관측의 역사' },
            { id: 2, title: '우주 탐사선' },
            { id: 3, title: '대한민국의 우주 역량' }
        ]
    }
};
window.QUESTS = QUESTS;

// ---------- 진행도 저장 (이 브라우저에만 저장) ----------
const STORAGE_KEY = 'spaceExplorerProgress';
let memoryProgress = { completedMissions: [] };   // 저장소를 못 쓰는 환경 대비

function getProgress() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { completedMissions: [...memoryProgress.completedMissions] };
        const data = JSON.parse(raw);
        return { completedMissions: Array.isArray(data.completedMissions) ? data.completedMissions : [] };
    } catch (e) {
        return { completedMissions: [...memoryProgress.completedMissions] };
    }
}
function saveProgress(p) {
    memoryProgress = p;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (e) { /* 저장 불가: 이번 접속 동안만 기억 */ }
}

const key = (q, m) => `${q}_${m}`;
function isMissionCompleted(q, m) { return getProgress().completedMissions.includes(key(q, m)); }
function isQuestFullyCompleted(q) { return QUESTS[q] ? QUESTS[q].missions.every(m => isMissionCompleted(q, m.id)) : false; }
function totalMissions() { return Object.values(QUESTS).reduce((n, q) => n + q.missions.length, 0); }
function completedCount() {
    const done = getProgress().completedMissions;
    return Object.entries(QUESTS).reduce((n, [q, quest]) => n + quest.missions.filter(m => done.includes(key(q, m.id))).length, 0);
}

function canAccessMission(questId, missionId) {
    questId = parseInt(questId, 10); missionId = parseInt(missionId, 10);
    const quest = QUESTS[questId];
    if (!quest || !quest.missions.some(m => m.id === missionId)) return { access: false, reason: 'not_created' };
    if (TEACHER_SETTINGS.lockedMissions.includes(`${questId}:${missionId}`)) return { access: false, reason: 'explicit_lock' };
    if (questId > TEACHER_SETTINGS.lastVisibleQuest) return { access: false, reason: 'teacher_locked_quest' };
    if (isMissionCompleted(questId, missionId)) return { access: true, reason: 'completed' };
    if (missionId === 1) {
        if (questId === 1 || questId <= TEACHER_SETTINGS.openQuestsUpTo) return { access: true, reason: 'open' };
        if (isQuestFullyCompleted(questId - 1)) return { access: true, reason: 'next_quest' };
        return { access: false, reason: 'locked' };
    }
    if (isMissionCompleted(questId, missionId - 1)) return { access: true, reason: 'next_mission' };
    return { access: false, reason: 'locked' };
}
function canAccessQuest(q) { return canAccessMission(q, 1); }

function lockMessage(questId, missionId) {
    const r = canAccessMission(questId, missionId).reason;
    if (r === 'teacher_locked_quest' || r === 'explicit_lock') return '선생님이 아직 열지 않은 미션이에요.';
    if (missionId === 1) return `퀘스트 ${questId - 1}을(를) 모두 완료하면 열려요.`;
    return `미션 ${missionId - 1}을(를) 먼저 완료해야 열려요.`;
}

// 진행할 수 있는 마지막 미션 (다시 들어올 때 여기서 시작)
function getLastAvailableMission(questId) {
    const missions = QUESTS[questId].missions;
    let last = 1;
    for (const m of missions) {
        if (!canAccessMission(questId, m.id).access) break;
        last = m.id;
        if (!isMissionCompleted(questId, m.id)) break;
    }
    return last;
}

// 미션 완료 기록 (배지는 완료한 미션 수만큼 생김)
function completeMission(questId, missionId) {
    if (!canAccessMission(questId, missionId).access) return false;
    const p = getProgress();
    const k = key(questId, missionId);
    if (!p.completedMissions.includes(k)) {
        p.completedMissions.push(k);
        saveProgress(p);
    }
    return true;
}

// 미션 상태: completed / available / locked (+ 퀘스트 화면에서 현재 미션은 active)
function missionState(questId, missionId) {
    if (isMissionCompleted(questId, missionId)) return 'completed';
    return canAccessMission(questId, missionId).access ? 'available' : 'locked';
}
const STATE_LABEL = { active: '진행 중', completed: '완료', available: '도전 가능', locked: '잠김' };

// ---------- 퀘스트 화면 사이드바 (모든 퀘스트 공통) ----------
function renderMissionNav(container, questId, activeMission, onSelect) {
    container.innerHTML = '';
    QUESTS[questId].missions.forEach(m => {
        const state = m.id === activeMission ? 'active' : missionState(questId, m.id);
        const b = document.createElement('button');
        b.type = 'button';
        b.id = `nav-m${m.id}`;
        b.className = `mission-item ${state}`;
        b.setAttribute('aria-current', state === 'active' ? 'step' : 'false');
        b.innerHTML = `<span class="mission-icon">${STATE_LABEL[state]}</span>
            <span class="mission-no">MISSION ${m.id}</span>
            <span class="mission-title">${m.title}</span>`;
        b.addEventListener('click', () => {
            if (!canAccessMission(questId, m.id).access) { toast(lockMessage(questId, m.id)); return; }
            onSelect(m.id);
        });
        container.appendChild(b);
    });
}

// ---------- 화면 알림 (alert 대신) ----------
let toastTimer;
function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
}

// ---------- 축하 효과 (외부 라이브러리 없이) ----------
function starBurst(host) {
    const wrap = document.createElement('div');
    wrap.className = 'burst';
    const colors = ['var(--star)', 'var(--done)', 'var(--cool)', '#ffffff'];
    for (let i = 0; i < 28; i++) {
        const s = document.createElement('i');
        const a = (Math.PI * 2 * i) / 28, d = 110 + (i % 4) * 30;
        s.style.setProperty('--dx', `${Math.cos(a) * d}px`);
        s.style.setProperty('--dy', `${Math.sin(a) * d}px`);
        s.style.background = colors[i % colors.length];
        wrap.appendChild(s);
    }
    host.appendChild(wrap);
    setTimeout(() => wrap.remove(), 1300);
}

// ---------- 배경 별 그리기 ----------
function drawStarfield(canvas, count = 140) {
    const ctx = canvas.getContext('2d');
    const draw = () => {
        const r = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = r.width * dpr; canvas.height = r.height * dpr;
        ctx.scale(dpr, dpr);
        let seed = 7;
        const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
        for (let i = 0; i < count; i++) {
            const x = rnd() * r.width, y = rnd() * r.height, s = rnd() * 1.6 + 0.3;
            ctx.globalAlpha = 0.3 + rnd() * 0.7;
            ctx.fillStyle = rnd() > 0.85 ? '#f5c451' : '#dfe6ff';
            ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
    };
    draw();
    window.addEventListener('resize', draw);
}

Object.assign(window, {
    TEACHER_SETTINGS, getProgress, saveProgress, isMissionCompleted, isQuestFullyCompleted,
    canAccessMission, canAccessQuest, lockMessage, getLastAvailableMission, completeMission,
    missionState, STATE_LABEL, renderMissionNav, toast, starBurst, drawStarfield, totalMissions, completedCount
});
