/* ---------- Elements ---------- */

const welcomeScreen = document.getElementById("welcomeScreen");
const homeScreen = document.getElementById("homeScreen");
const stageScreen = document.getElementById("stageScreen");
const gardenScreen = document.getElementById("gardenScreen");
const friendScreen = document.getElementById("friendScreen");

const startBtn = document.getElementById("startBtn");
const stagesContainer = document.getElementById("stagesContainer");

const stageTitle = document.getElementById("stageTitle");
const stageText = document.getElementById("stageText");
const stageQuestion = document.getElementById("stageQuestion");

const noteInput = document.getElementById("noteInput");
const saveNoteBtn = document.getElementById("saveNote");

const gardenList = document.getElementById("gardenList");

const navHome = document.getElementById("navHome");
const navGarden = document.getElementById("navGarden");
const navFriend = document.getElementById("navFriend");

const backHome = document.getElementById("backHome");
const backHome2 = document.getElementById("backHome2");

const rabbit = document.getElementById("rabbit");
const speechBox = document.getElementById("speechBox");
const dragCarrot = document.getElementById("dragCarrot");

let currentStage = null;
let clickCount = 0;

let carrots = parseInt(localStorage.getItem("carrots")) || 0;
/* ---------- Screen System ---------- */

function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(s => {
        s.classList.remove("active");
    });

    if (screen) {
        screen.classList.add("active");
    }

    const carrotCounter = document.getElementById("carrotCounter");
    const isFriendScreen = screen === friendScreen;

    if (carrotCounter) carrotCounter.style.display = isFriendScreen ? "flex" : "none";
    if (rabbit) rabbit.style.display = isFriendScreen ? "block" : "none";
}


/* ---------- Start ---------- */

if (startBtn) {
    startBtn.addEventListener("click", () => {
        showScreen(homeScreen);
    });
}
/* ---------- Build Stages ---------- */

function buildStages() {

    if (!stagesContainer) return;

    stagesContainer.innerHTML = "";

    stages.forEach(stage => {

        const card = document.createElement("div");
        card.className = "stage-card";

        card.innerHTML = `
            <div class="stage-left">
                <div class="stage-icon">🌱</div>
            </div>

            <div class="stage-center">
                <div class="stage-title">
                    ${stage.title || ("مرحله " + stage.id)}
                </div>
            </div>

            <div class="stage-right">
                <div class="stage-badge">
                    ${stage.id}
                </div>
            </div>
        `;

        card.addEventListener("click", () => {

            currentStage = stage;

            stageTitle.textContent = stage.title || ("مرحله " + stage.id);
            stageText.textContent = stage.text || "متن این مرحله را در data.js وارد کنید.";
            stageQuestion.textContent = stage.question || "سوال این مرحله را وارد کنید.";

            const savedNotes = JSON.parse(localStorage.getItem("notes") || "{}");
            noteInput.value = savedNotes[stage.id] || "";

            showScreen(stageScreen);
        });

        stagesContainer.appendChild(card);
    });
}
/* ---------- Save Note ---------- */

function saveNote() {

    if (!currentStage) return;

    const text = noteInput.value.trim();

    let notes = JSON.parse(localStorage.getItem("notes") || "{}");

    notes[currentStage.id] = text;

    localStorage.setItem("notes", JSON.stringify(notes));

    checkGarden(text);

    carrots++;
    updateCarrotUI();

    updateRabbitByStage(currentStage.id);

    checkGift();

    alert("یادداشت ذخیره شد 🥕");
}
/* ---------- Gift System ---------- */

function checkGift() {

    const completedStages = Object.keys(JSON.parse(localStorage.getItem("notes") || "{}")).length;
    const giftBtn = document.getElementById("giftBtn");

    if (!giftBtn) return;

    if (completedStages >= 1 && carrots >= 1) {
        giftBtn.classList.add("gift-ready");
        giftBtn.disabled = false;
    }
}

const stageGiftMessages = {
    1: "بعضی آهنگا بیشتر از صاحبشون عمر می‌کنن 🎵",
    2: "امروز یه خاطره یادت اومد. خب که چی؟ 🍂",
    3: "بعضی سؤال‌ها باز می‌مونن. مثل پنجره‌ای که کسی یادش رفته ببنده 🌙",
    4: "فکر کردن به یه چیز، به معنی خواستن اون چیز نیست 🌿",
    5: "یه روز می‌فهمی چند هفته‌ست به بعضی چیزا فکر نکردی.",
    6: "خرگوش‌ها هم بعضی وقتا به یه نقطه خیره میشن و نمی‌دونن دارن به چی فکر می‌کنن 🐰",
    7: "امروز لازم نیست نتیجه‌ای بگیری.",
    8: "بعضی آدم‌ها از زندگی ما میرن، ولی از فرهنگ لغتمون نه.",
    9: "ذهن آدم آرشیو عجیبی داره 📚",
    10: "همه چیز قرار نیست پیام مخفی داشته باشه.",
    11: "بعضی خیابون‌ها بیشتر از اینکه خیابون باشن، آرشیون.",
    12: "یه اسم می‌تونه سال‌ها بعد هم آشنا به نظر برسه.",
    13: "عجیبه که بعضی بوها حافظه بهتری از آدم‌ها دارن.",
    14: "گاهی یه آهنگ فقط یه آهنگه. گاهی نه.",
    15: "بعضی خاطره‌ها در میزنن، وارد نمیشن.",
    16: "ذهن بعضی وقتا فقط داره مرتب‌کاری می‌کنه.",
    17: "همه چیز ارزش تحلیل شدن نداره.",
    18: "گاهی یه فکر فقط از جلوی پنجره رد میشه ☁️",
    19: "آدم‌ها بیشتر از چیزی که فکر می‌کنن تغییر می‌کنن.",
    20: "بعضی نسخه‌های آدم‌ها فقط توی خاطره‌ها وجود دارن.",
    21: "لازم نیست برای هر احساسی توضیح پیدا کنی.",
    22: "یه جاهایی روی نقشه نیستن؛ توی حافظه‌ان.",
    23: "بعضی روزا ذهن آدم بی‌اجازه میره قدم بزنه.",
    24: "همه درهای بسته قرار نیست دوباره باز بشن.",
    25: "خاطره‌ها معمولاً بلندتر از اتفاق‌ها عمر می‌کنن.",
    26: "بعضی مکث‌ها غم نیستن، فقط مکثن.",
    27: "یه وقتایی هیچ اتفاق خاصی نمیفته، و این طبیعیه.",
    28: "ذهن آدم عاشق وصل کردن نقطه‌هاست.",
    29: "بعضی فصل‌ها تموم میشن، حتی وقتی هنوز یادشون میاد.",
    30: "عجیبه... چقدر چیزها عوض میشن و ما همیشه هم متوجهش نمیشیم. 🌱"
};

function openGift() {
    const currentId = currentStage ? currentStage.id : 1;
    const msg = stageGiftMessages[currentId] || "داری خوب پیش می‌ری 🌱";

    const giftBtn = document.getElementById("giftBtn");
    const giftMessage = document.getElementById("giftMessage");

    if (giftMessage) {
        giftMessage.innerText = msg;
        giftMessage.style.display = "block";
    }

    if (giftBtn) {
        giftBtn.classList.remove("gift-ready");
        giftBtn.classList.add("gift-opened");
        giftBtn.innerText = "🎁";
    }

    if (rabbit) {
        setRabbitBlush();
        setTimeout(() => setRabbitNormal(), 2000);
    }
}
/* ---------- Garden Check ---------- */

function checkGarden(text) {

    if (!text) return;

    const found = gardenKeywords.some(keyword =>
        text.includes(keyword)
    );

    if (!found) return;

    let garden = JSON.parse(localStorage.getItem("garden") || "[]");

    garden.push({
        date: new Date().toLocaleDateString("fa-IR"),
        text: text
    });

    localStorage.setItem("garden", JSON.stringify(garden));
}


/* ---------- Load Garden ---------- */

function loadGarden() {

    if (!gardenList) return;

    gardenList.innerHTML = "";

    let garden = JSON.parse(localStorage.getItem("garden") || "[]");

    if (garden.length === 0) {

        gardenList.innerHTML = `
            <div class="empty-garden">
                <div class="empty-icon">🌱</div>
                <h3>هنوز خاطره‌ای ثبت نشده</h3>
                <p>
                    وقتی یادداشت‌هات با کلمات مهم
                    نوشته بشن ،اینجا میان.
                </p>
            </div>
        `;

        return;
    }

    garden.reverse().forEach(item => {

        const card = document.createElement("div");
        card.className = "memory-card";

        card.innerHTML = `
            <h4>${item.date}</h4>
            <p>${item.text}</p>
        `;

        gardenList.appendChild(card);
    });
}
/* ---------- Carrot System ---------- */

function updateCarrotUI() {
    const carrotCount = document.getElementById("carrotCount");
    if (carrotCount) {
        carrotCount.innerText = carrots; 
    }
    localStorage.setItem("carrots", carrots);
}

/* ---------- Rabbit Images ---------- */

function setRabbitNormal() {
    if (rabbit) {
        rabbit.src = "Rabbit.png";
    }
}

function setRabbitWave() {
    if (rabbit) {
        rabbit.src = "RabbitWave.png";
    }
}

function setRabbitBlush() {
    if (rabbit) {
        rabbit.src = "RabbitBlush.png";
    }
}


/* ---------- Rabbit Upgrade By Stage ---------- */

function updateRabbitByStage(stage) {

    if (!rabbit) return;

    if (stage >= 24) {
        rabbit.src = "RabbitBalloon.png";
    }
    else if (stage >= 21) {
        rabbit.src = "RabbitGift.png";
    }
    else if (stage >= 18) {
        rabbit.src = "RabbitCoffee.png";
    }
    else if (stage >= 15) {
        rabbit.src = "RabbitHat.png";
    }
    else if (stage >= 12) {
        rabbit.src = "RabbitStudent.png";
    }
    else if (stage >= 9) {
        rabbit.src = "RabbitChef.png";
    }
    else if (stage >= 6) {
        rabbit.src = "RabbitCookie.png";
    }
    else if (stage >= 3) {
        rabbit.src = "RabbitCarrot.png";
    }
    else {
        rabbit.src = "Rabbit.png";
    }
}
/* ---------- Rabbit Messages ---------- */

const rabbitMessages = [

    "🎀امروز لازم نیست دنیا رو نجات بدی.",
    "به عنوان یک خرگوش متخصص ، پنج دقیقه لم دادن کاملاً قانونیه.",
    "شاید الان وقتشه از جات بلند شی و یه کش و قوس کوچولو به خودت بدی",
    "امروز یه چیز کوچیک پیدا کن که ازش خوشت بیاد",
    "🐥گاهی موفقیت یعنی فقط از تخت بلند شدن.",
    "اگر الان داری زیادی فکر می‌کنی، من پیشنهاد می‌کنم یک لیوان آب بخوری. بقیه مشکلات بعداً.",
    "خرگوش‌ها هم بعضی وقتا نمی‌دونن دارن چیکار می‌کنن.🙃",
    "درخت‌ها برای رشد کردن عجله نمی‌کنن.🥕",
    "همه روزهای خوب از قبل اعلام نمی‌شن ساخته میشن🌟.",
    "گاهی اتفاق خاصی نمی‌افته و این کاملاً طبیعیه.",

    "بعضی سؤال‌ها با گذشت زمان جواب می‌شن",
    "هیچ ابری مجبور نیست شکل خاصی داشته باشه.",
    "لازم نیست همه چیز رو همین الان بفهمی✨.",
    "آروم بودن هم نوعی پیشرفته<:",
    "☀️خورشید هر روز بدون سر و صدا طلوع می‌کنه.",
    "واقعیت تصادفی: تو تا اینجای زندگی از همه روزهای سخت قبلی رد شدی.🙃✨",
    "اخبار فوری: لازم نیست همه چیز رو حل کنی🥕.",
    "امروز با موفقیت از کنار یک نگرانی رد شدم و بهش دست تکون دادم.🐥",
    "یادآوری: همه فکرها ارزش نشستن دور میز مذاکره رو ندارن.😊",
    "من به عنوان یک خرگوش، با قاطعیت اعلام می‌کنم که استراحت تنبلی نیست.🥕",

    "آسمون هیچ‌وقت از خودش نمی‌پرسه چرا هنوز ابر داره.☁️",
    "همه ردپاها برای برگشتن نیستن. بعضیا فقط نشون میدن که یه زمانی از اونجا رد شدی.",
    "ذهن آدم گاهی موزه باز می‌کنه، نه ماشین زمان.",
    "زندگی همیشه با جواب شروع نمیشه. گاهی با قدم بعدی شروع میشه.🥕",
    "امروز یه توت‌فرنگی دیدم. هنوز به نظرم دستاورد مهمیه🐥",
    "من هیچ مدرکی ندارم، ولی حس می‌کنم یه چرت کوتاه خیلی چیزا رو بهتر می‌کنه.🐱",
    "لطفاً امروز با خودت همون‌قدر مهربون باش که با یه خرگوش کوچولو میشی.🎀",
    "یه قدم کوچیک هنوز قدمه.✨",
    "پند امروز:هیچ‌کس همه‌چیز رو بلد نیست. حتی اونایی که وانمود می‌کنن.🎀",
    "روزهای معمولی بیشتر از چیزی که فکر می‌کنیم ارزش دارن.🐱",

    "بیا یه کم از شلوغی مغزت رو بذار روی زمین، من مراقبشم 🐰🧺",
    "تو از چیزی که فکر می‌کنی خیلی بیشتر بلدی ادامه بدی ✨",
    "بعضی وقتا قوی بودن یعنی فقط یه پتو برداری و نفس بکشی 🧸",
    "اگه دلت گرفته، من با گوشام یه چتر کوچیک برات می‌سازم 🐰☔",
    "امروز همون‌قدر که تونستی کافی بود 🌼",
    "یه قدم کوچیک هم قدمه، حتی اگه با دمپایی باشه 🩴",
    "تو هنوز داری ادامه می‌دی، و این خیلی چیز بزرگیه 🐰",
    "اگه امروز مغزت شلوغه، اشکال نداره؛ خرگوش‌ها هم گاهی گیج می‌زنن 🥕",
    "من نمی‌ذارم با خودت بد حرف بزنی، اینجا قلمرو منه😔",
    "امروز اگه فقط خودتو جمع‌وجور کردی، من بهت مدال هویجی می‌دم 🥕",
    "من طرف توام، حتی وقتی خودت با خودت مهربون نیستی 🤍🐰",
    "تو خسته‌ای، نه شکست‌خورده. فرقش خیلی مهمه ☁️",
    "بیا یه قرارداد ببندیم: امروز کمتر خودتو دعوا کنی ✨",
    "تو آدم بدی نیستی؛ فقط شاید خیلی چیزا رو تنهایی حمل کردی 🧳",
    "من با تمام پشمالویی‌ام تأیید می‌کنم که تو کافی‌ای 🐰",
    "تا همین‌جا هم راه زیادی اومدی، حتی اگه به چشم نیاد من میبینم 🛤️",
    "من یه گوشم رو می‌دم به نگرانی‌هات، اون یکی رو به امیدت 🐰✨",
    "من به نسخه آروم‌تر امروزت هم افتخار می‌کنم 🐰🌸",
    "تو مجبور نیستی همیشه قوی به نظر برسی 🧸",
    "من اینجام؛ یه خرگوش کوچیک با باور بزرگ به تو 🐰✨",
    "اگه امروز سنگینه، بیا با هم کوچیکش کنیم 🐰☁️",
    "تو از پسِ امروز برمیای، شاید نه قهرمانانه، ولی واقعی 🌙",
    "تو اجازه داری استراحت کنی؛ اینم بخشی از مسیرته 🧸🌿",
];

function randomRabbitMessage() {
    const random = rabbitMessages[Math.floor(Math.random() * rabbitMessages.length)];

    if (speechBox) {
        speechBox.innerText = random;
    }
}
/* ---------- Feed Rabbit ---------- */

function feedRabbit() {

    if (carrots <= 0) {
        if (speechBox) {
            speechBox.innerText = "هویجی نداری 🥕";
        }
        return;
    }

    carrots--;
    updateCarrotUI();

    if (speechBox) {
        speechBox.innerText = "مرسیی 🥕";
    }

    setRabbitBlush();

    setTimeout(() => {
        setRabbitNormal();
    }, 1500);

    const eatSound = document.getElementById("eatSound");

    if (eatSound) {
        eatSound.play();
    }
}
/* ---------- Drag & Drop + Touch Feeding ---------- */

if (dragCarrot) {
    dragCarrot.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text", "carrot");
    });

    dragCarrot.addEventListener("touchstart", (e) => {
        e.preventDefault();
    }, { passive: false });

    dragCarrot.addEventListener("touchend", (e) => {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && (target.id === "rabbit" || target.closest("#gardenArea"))) {
            feedRabbit();
        }
    }, { passive: false });
}

if (rabbit) {
    rabbit.addEventListener("dragover", (e) => e.preventDefault());
    rabbit.addEventListener("drop", (e) => {
        e.preventDefault();
        feedRabbit();
    });
}
/* ---------- Rabbit Click ---------- */

if (rabbit) {
    rabbit.addEventListener("click", () => {

        clickCount++;

        randomRabbitMessage();

        setRabbitBlush();

        setTimeout(() => {
            setRabbitNormal();
        }, 1000);
    });
}
/* ---------- Navigation ---------- */

if (saveNoteBtn) {
    saveNoteBtn.addEventListener("click", saveNote);
}

if (navHome) {
    navHome.addEventListener("click", () => {
        showScreen(homeScreen);
    });
}

if (navGarden) {
    navGarden.addEventListener("click", () => {
        loadGarden();
        showScreen(gardenScreen);
    });
}

if (navFriend) {
    navFriend.addEventListener("click", () => {
        showScreen(friendScreen);

        setRabbitWave();

        setTimeout(() => {
            setRabbitNormal();
        }, 1200);
    });
}

if (backHome) {
    backHome.addEventListener("click", () => {
        showScreen(homeScreen);
    });
}

if (backHome2) {
    backHome2.addEventListener("click", () => {
        showScreen(homeScreen);
    });
}
/* ---------- Init ---------- */

buildStages();
updateCarrotUI();
setRabbitNormal();
/* ---------- Breath Modal ---------- */

function startBreath() {
    const modal = document.getElementById("breathModal");
    modal.style.display = "flex";
    runBreathCycle();
}

function closeBreath() {
    const modal = document.getElementById("breathModal");
    modal.style.display = "none";
}

function runBreathCycle() {
    const circle = document.getElementById("breathCircle");
    const breathText = document.getElementById("breathText");
    const breathSub = document.getElementById("breathSub");

    const steps = [
    { text: "دم بگیر", sub: "۴ ثانیه", scale: "scale(1.4)", duration: 4000, rabbit: "Rabbit1.png" },
    { text: "نگه‌دار", sub: "۴ ثانیه", scale: "scale(1.4)", duration: 4000, rabbit: "Rabbit2.png" },
    { text: "بازدم بده", sub: "۶ ثانیه", scale: "scale(1)", duration: 6000, rabbit: "Rabbit3.png" },
];

    let i = 0;

    function step() {
    if (document.getElementById("breathModal").style.display === "none") return;

    const s = steps[i];
    breathText.innerText = s.text;
    breathSub.innerText = s.sub;
    circle.style.transform = s.scale;

    // این خط رو اضافه کن 👇
    document.getElementById("breathRabbit").src = s.rabbit;

    i = (i + 1) % steps.length;
    setTimeout(step, s.duration);
}

    step();
}

/* ---------- Mood ---------- */

function saveMood(value) {
    const emojis = { 1: "🙂", 2: "😐", 3: "😕", 4: "😔", 5: "😣" };
    const messages = { 1: "خوشحالم که امروز حالت خوبه 🌟", 2: "روزهای معمولی هم بخشی از مسیرن 🌿", 3: "درهم بودن هم حسیه، لازم نیست حلش کنی ☁️", 4: "امروز سنگینه، ولی می‌گذره 🧸", 5: "خیلی زیر فشاری، مراقب خودت باش 🐰" };

    let moods = JSON.parse(localStorage.getItem("moods") || "[]");

    const today = new Date().toLocaleDateString("fa-IR");
    const exists = moods.findIndex(m => m.date === today);

    if (exists >= 0) {
        moods[exists].value = value;
    } else {
        moods.push({ date: today, value });
    }

    if (moods.length > 30) moods = moods.slice(-30);

    localStorage.setItem("moods", JSON.stringify(moods));

    const msg = document.getElementById("moodSavedMsg");
    if (msg) {
        msg.style.display = "block";
        msg.innerText = emojis[value] + " " + messages[value];
    }

    drawMoodChart();
}

function drawMoodChart() {
    let moods = JSON.parse(localStorage.getItem("moods") || "[]");
    const canvas = document.getElementById("moodChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = 300;
    canvas.height = 150;
    ctx.clearRect(0, 0, 300, 150);

    if (moods.length === 0) {
        ctx.fillStyle = "#a0b89a";
        ctx.font = "14px Vazirmatn";
        ctx.textAlign = "center";
        ctx.fillText("هنوز حالی ثبت نشده 🌱", 150, 80);
        return;
    }

    const data = moods.slice(-30);
    const len = data.length;

    // grid lines
    ctx.strokeStyle = "rgba(142,181,138,0.2)";
    ctx.lineWidth = 1;
    for (let g = 1; g <= 5; g++) {
        const y = 130 - (g / 5) * 110;
        ctx.beginPath();
        ctx.moveTo(10, y);
        ctx.lineTo(290, y);
        ctx.stroke();
    }

    // fill under line
    ctx.beginPath();
    data.forEach((m, i) => {
        const x = len === 1 ? 150 : (i / (len - 1)) * 280 + 10;
        const y = 130 - (m.value / 5) * 110;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(len === 1 ? 150 : 290, 130);
    ctx.lineTo(10, 130);
    ctx.closePath();
    ctx.fillStyle = "rgba(142,181,138,0.15)";
    ctx.fill();

    // main line
    ctx.beginPath();
    ctx.strokeStyle = "#8ab57d";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    data.forEach((m, i) => {
        const x = len === 1 ? 150 : (i / (len - 1)) * 280 + 10;
        const y = 130 - (m.value / 5) * 110;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // dots
    data.forEach((m, i) => {
        const x = len === 1 ? 150 : (i / (len - 1)) * 280 + 10;
        const y = 130 - (m.value / 5) * 110;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#66895c";
        ctx.fill();
    });
}
function loadMoodScreen() {
    drawMoodChart();
    showScreen(document.getElementById("moodScreen"));
	
}
