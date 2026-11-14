/* ============================================================
   app.js — the Game Boy portfolio.

   Big picture
   -----------
   The page is a picture of a Game Boy. The green screen is a div
   (#screen) that is exactly 320 x 288 CSS pixels; JavaScript scales
   it up or down to fit the console with a CSS transform, so the
   layout code can always think in those 320 x 288 units.

   The app is a small "state machine": at any moment we are on one
   screen (boot, title, menu, player, quests, ...). Each screen has
   a function that draws it into #screen using innerHTML, and the
   press() function decides what a button does on the current screen.

   Content (job history, skills, etc.) lives in data.js as PB.
   Anything that is text on the screen comes from PB.t(...) so it can
   be shown in English or Greek.

   Sections of this file
   ---------------------
   1. UI strings (button hints, headings) in both languages
   2. Pixel sprite for the title screen
   3. Sound (tiny square-wave beeps)
   4. Screen drawing functions (boot, title, menu, player, ...)
   5. The Pong mini-game
   6. Input: keyboard, on-screen buttons, mouse, touch
   7. 3D rotation of the console
   8. Start-up
   ============================================================ */
(function () {
  // Pull what we need out of data.js
  const { P, MENU, YEARS, t } = PB;
  const BADGES = P.badges.en.length;

  /* ============================================================
     1. UI STRINGS
     Headings and button hints. Same { en, el } format as data.js.
     ============================================================ */
  const UI = {
    mainMenu:{en:"MAIN MENU",el:"ΚΥΡΙΟ ΜΕΝΟΥ"},
    player:{en:"PLAYER",el:"ΠΑΙΚΤΗΣ"}, questLog:{en:"QUEST LOG",el:"ΑΠΟΣΤΟΛΕΣ"}, skills:{en:"SKILLS",el:"ΔΕΞΙΟΤΗΤΕΣ"},
    itemsHdr:{en:"ITEMS · PROJECTS",el:"ΑΝΤΙΚΕΙΜΕΝΑ · PROJECTS"}, training:{en:"TRAINING",el:"ΕΚΠΑΙΔΕΥΣΗ"},
    contactHdr:{en:"CONTACT · SAVE",el:"ΕΠΙΚΟΙΝΩΝΙΑ · SAVE"},
    pressStart:{en:"PRESS START",el:"ΠΑΤΑ START"},
    copy:{en:"© 2026 K. LYVERAS · SOFTWARE DEVELOPER",el:"© 2026 Κ. ΛΥΒΕΡΑΣ · SOFTWARE DEVELOPER"},
    name:{en:"NAME",el:"ΟΝΟΜΑ"}, cls:{en:"CLASS",el:"ΚΛΑΣΗ"}, home:{en:"HOME",el:"ΒΑΣΗ"}, exp:{en:"EXP",el:"ΕΜΠΕΙΡΙΑ"},
    summary:{en:"SUMMARY",el:"ΠΕΡΙΛΗΨΗ"},
    yrs:{en:"YRS",el:"ΕΤΗ"}, questsN:{en:"QUESTS",el:"ΑΠΟΣΤΟΛΕΣ"}, badgesN:{en:"BADGES",el:"ΠΙΣΤΟΠ."},
    // hints shown in the bar at the bottom of the screen
    back:{en:"◀ B:BACK",el:"◀ B:ΠΙΣΩ"}, scroll:{en:"↕:SCROLL",el:"↕:ΚΥΛΙΣΗ"}, open:{en:"A/CLICK:OPEN",el:"A/ΚΛΙΚ:ΑΝΟΙΓΜΑ"},
    next:{en:"◀▶:NEXT",el:"◀▶:ΕΠΟΜΕΝΗ"}, skip:{en:"A:SKIP",el:"A:ΠΑΡΑΛΕΙΨΗ"}, play:{en:"A/CLICK:PLAY",el:"A/ΚΛΙΚ:ΠΑΙΞΕ"},
    select:{en:"CLICK:SELECT",el:"ΚΛΙΚ:ΕΠΙΛΟΓΗ"}, more:{en:"▼ MORE",el:"▼ ΚΙ ΑΛΛΟ"}, top:{en:"▲ TOP",el:"▲ ΑΡΧΗ"},
    badges:{en:"BADGES · CERTIFICATIONS",el:"ΠΙΣΤΟΠΟΙΗΣΕΙΣ"},
    // "open link?" question and the pop-up-blocked message
    openQ:{en:"OPEN LINK?",el:"ΑΝΟΙΓΜΑ ΣΥΝΔΕΣΜΟΥ;"}, newWin:{en:"This opens in a new window.",el:"Θα ανοίξει σε νέο παράθυρο."},
    yes:{en:"A · YES, OPEN",el:"A · ΝΑΙ, ΑΝΟΙΞΕ"}, no:{en:"B · NO, BACK",el:"B · ΟΧΙ, ΠΙΣΩ"},
    link:{en:"LINK",el:"ΣΥΝΔΕΣΜΟΣ"}, blocked:{en:"POP-UP BLOCKED",el:"ΜΠΛΟΚΑΡΙΣΤΗΚΕ"},
    noPop:{en:"THE BROWSER BLOCKED THE NEW WINDOW",el:"Ο BROWSER ΜΠΛΟΚΑΡΕ ΤΟ ΝΕΟ ΠΑΡΑΘΥΡΟ"},
    copyAddr:{en:"Copy the address and open it in a new tab:",el:"Αντέγραψε τη διεύθυνση και άνοιξέ τη σε νέα καρτέλα:"},
    copied:{en:"COPIED TO CLIPBOARD ✓",el:"ΑΝΤΙΓΡΑΦΗΚΕ ✓"},
    rightClick:{en:"Or go back and right-click the entry to copy its link.",el:"Ή γύρνα πίσω και κάνε δεξί κλικ στην εγγραφή για αντιγραφή."},
    close:{en:"A/B/CLICK:CLOSE",el:"A/B/ΚΛΙΚ:ΚΛΕΙΣΙΜΟ"},
    // Pong
    you:{en:"YOU",el:"ΕΣΥ"}, youWin:{en:"YOU WIN!",el:"ΝΙΚΗΣΕΣ!"}, cpuWins:{en:"CPU WINS",el:"ΝΙΚΗ CPU"},
    again:{en:"A:AGAIN   B:BACK",el:"A:ΞΑΝΑ   B:ΠΙΣΩ"}, pongHint:{en:"↑↓ OR MOUSE · FIRST TO 5 · B:QUIT",el:"↑↓ Η ΠΟΝΤΙΚΙ · ΠΡΩΤΟΣ ΣΤΑ 5 · B:ΕΞΟΔΟΣ"},
    // help text under the console (HTML)
    legend:{
      en:`<b>D-PAD</b> <kbd>↑↓←→</kbd> or <kbd>WASD</kbd> &nbsp; <b>A</b> <kbd>Z</kbd>/<kbd>SPACE</kbd> &nbsp; <b>B</b> <kbd>X</kbd>/<kbd>ESC</kbd><br>
      <b>START</b> <kbd>ENTER</kbd> &nbsp; <b>SELECT</b> <kbd>SHIFT</kbd> = sound on/off<br>
      or use the mouse: click items, scroll wheel to move, click the bottom bar to go back<br>
      <b>3D</b> drag the console to spin it around · double-click the shell to reset`,
      el:`<b>D-PAD</b> <kbd>↑↓←→</kbd> ή <kbd>WASD</kbd> &nbsp; <b>A</b> <kbd>Z</kbd>/<kbd>SPACE</kbd> &nbsp; <b>B</b> <kbd>X</kbd>/<kbd>ESC</kbd><br>
      <b>START</b> <kbd>ENTER</kbd> &nbsp; <b>SELECT</b> <kbd>SHIFT</kbd> = ήχος on/off<br>
      ή με το ποντίκι: κλικ στα στοιχεία, ροδέλα για κίνηση, κλικ στην κάτω μπάρα για πίσω<br>
      <b>3D</b> σύρε την κονσόλα για να την περιστρέψεις · διπλό κλικ στο κέλυφος για επαναφορά`
    }
  };

  /* ============================================================
     2. PIXEL SPRITE
     A 12 x 12 character drawn as text art. Each letter is a colour:
     D = darkest green, M = mid green, L = lightest, . = empty.
     sprite() turns it into one element whose box-shadow paints every
     pixel. That is a cheap way to draw pixel art without an image.
     ============================================================ */
  const SPR = [
    "....DDDD....","...DDDDDD...","..DDLLLLDD..",".MDLLLLLLDM.",".MDLDLLDLDM.","..DLLLLLLD..",
    "...LLLLLL...","....LDDL....","..MMMMMMMM..",".MMMMMMMMMM.",".MM.MMMM.MM.","...DD..DD..."
  ];
  const SPRC = {D:"#0f380f", M:"#306230", L:"#9bbc0f"};
  function sprite(scale){
    const s=scale||3, shadows=[];
    SPR.forEach((row,y)=>[...row].forEach((c,x)=>{ if(SPRC[c]) shadows.push(`${x*s}px ${y*s}px 0 0 ${SPRC[c]}`); }));
    return `<div class="sprite" style="width:${s}px;height:${s}px;margin:0;display:inline-block;vertical-align:top"><i style="width:${s}px;height:${s}px;box-shadow:${shadows.join(",")}"></i></div>`;
  }

  /* ============================================================
     3. SOUND
     The browser's Web Audio API can make simple tones. We use square
     waves because that is what the original hardware sounded like.
     Browsers only allow sound after the visitor has clicked or pressed
     a key, so unlock() is called from every input handler.
     ============================================================ */
  let actx=null;        // the AudioContext, created on first input
  let soundOn=true;     // SELECT toggles this
  function unlock(){
    if(!actx){ try{ actx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
    if(actx && actx.state==="suspended") actx.resume();
  }
  // Play one tone: frequency in Hz, duration in seconds, volume 0-1.
  // "slide" optionally bends the pitch to another frequency.
  function beep(f, d=0.06, v=0.05, type="square", slide=0){
    if(!soundOn||!actx) return;
    const o=actx.createOscillator(), g=actx.createGain(), tm=actx.currentTime;
    o.type=type; o.frequency.setValueAtTime(f,tm);
    if(slide) o.frequency.exponentialRampToValueAtTime(slide, tm+d);
    g.gain.setValueAtTime(v,tm); g.gain.exponentialRampToValueAtTime(0.0001,tm+d);
    o.connect(g).connect(actx.destination); o.start(tm); o.stop(tm+d+0.02);
  }
  // Named sound effects used around the app
  const sfx = {
    move:()=>beep(880,0.04,0.04),                                          // cursor moved
    ok:()=>{beep(660,0.05,0.05); setTimeout(()=>beep(990,0.08,0.05),50);},  // confirmed
    back:()=>beep(330,0.07,0.05),                                          // went back
    ding:()=>{beep(1046,0.5,0.06); setTimeout(()=>beep(1318,0.6,0.05),80);},// boot chime
    hit:()=>beep(440,0.04,0.05),                                           // pong: paddle hit
    wall:()=>beep(220,0.04,0.04),                                          // pong: wall bounce
    score:()=>beep(150,0.25,0.06,"square",80),                             // pong: point scored
    win:()=>{[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.12,0.06),i*110));} // pong: victory
  };

  /* ============================================================
     4. SCREENS
     ============================================================ */
  const scr=document.getElementById("screen");   // the 320x288 LCD panel

  // Everything about "where we are" lives in this one object.
  const S={
    screen:"boot",   // name of the current screen
    cursor:0,        // which row is highlighted in a list
    menuCursor:0,    // remembered main-menu row, so BACK returns to it
    scroll:0,        // how far a long page is scrolled (in px)
    typed:0          // 1 when the typewriter text has finished
  };
  let typer=null;                     // interval id of the typewriter effect
  let pong=null;                      // animation frame id of the Pong loop
  const TW={text:"",el:null};         // what the typewriter is typing and where

  // Replace the whole screen with new HTML
  function html(s){ scr.innerHTML=s; }
  // Make text safe to put inside HTML (turns < into &lt; etc.)
  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

  // Switch fonts/legend to the current language
  function applyLang(){
    scr.classList.toggle("el", PB.L==="el");          // CSS uses .el to pick the Greek font
    document.getElementById("legend").innerHTML=t(UI.legend);
  }
  function toggleLang(){ PB.setLang(PB.L==="en" ? "el" : "en"); applyLang(); sfx.ok(); }

  /* ---------- boot: the logo drops in, then the title appears ---------- */
  function boot(){
    S.screen="boot";
    html(`<div class="boot"><div class="logo">LYVERAS<small>PORTFOLIO SYSTEM</small></div></div>`);
    const b=scr.querySelector(".boot");
    requestAnimationFrame(()=>b.classList.add("go"));   // "go" starts the CSS drop animation
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;  // respect the OS "less motion" setting
    setTimeout(()=>{ sfx.ding(); }, reduced?50:1400);
    setTimeout(title, reduced?600:2400);
  }

  /* ---------- title screen ---------- */
  function title(){
    S.screen="title";
    html(`<div class="title">
      <h1>KONSTANTINOS<br>LYVERAS<small>PORTFOLIO QUEST</small></h1>
      <div class="press">${t(UI.pressStart)}</div>
      <div class="langsw">◀ <span class="${PB.L==="en"?"on":""}" data-act="lang-en">EN</span> · <span class="${PB.L==="el"?"on":""}" data-act="lang-el">ΕΛ</span> ▶</div>
      <div class="walker">${sprite(3)}</div>
      <div class="ground"></div>
      <div class="copy">${t(UI.copy)}</div>
    </div>`);
  }

  /* ---------- main menu ---------- */
  function menu(){
    S.screen="menu";
    const m=MENU[S.cursor];
    html(`<div class="hdr"><span>${t(UI.mainMenu)}</span><span class="r">LV ${YEARS} · ♪ ${soundOn?"ON":"OFF"}</span></div>
      <div class="win" style="top:32px;padding:6px 10px">
        <ul class="menu">${MENU.map((x,i)=>`<li class="${i===S.cursor?"sel":""}">${t(x.l)}</li>`).join("")}</ul>
      </div>
      <div class="dlg" style="min-height:52px">${esc(t(m.d))}</div>`);
  }

  /* ---------- helpers for pages that can scroll ----------
     A "page" is: header bar, a window (.win.body) with the content inside
     (.inner), and a footer bar with button hints. Long content is moved
     up and down by changing the top position of .inner. */
  function page(titleTxt, right, inner, foot){
    html(`<div class="hdr"><span>${titleTxt}</span><span class="r">${right||""}</span></div>
      <div class="win body"><div class="inner" style="top:${10-S.scroll}px">${inner}</div></div>
      <div class="foot"><span>${foot||t(UI.back)}</span><span class="more" id="more"></span></div>`);
    updateMore();
  }
  // How far can this page scroll? (content height minus visible height)
  function maxScroll(){
    const win=scr.querySelector(".win.body"), inner=scr.querySelector(".inner");
    if(!win||!inner) return 0;
    return Math.max(0, inner.scrollHeight-(win.clientHeight-20));
  }
  // Show "▼ MORE" or "▲ TOP" in the footer when there is hidden content
  function updateMore(){
    const m=document.getElementById("more"); if(!m) return;
    const mx=maxScroll();
    m.textContent = mx===0 ? "" : (S.scroll<mx ? t(UI.more) : t(UI.top));
  }
  function setScroll(n){
    const mx=maxScroll(); n=Math.max(0,Math.min(mx,n));   // keep inside 0..max
    if(n===S.scroll) return false;                          // nothing changed
    S.scroll=n; scr.querySelector(".inner").style.top=(10-n)+"px"; updateMore(); return true;
  }
  function scrollBy(dy){ return setScroll(S.scroll+dy); }
  // In lists: scroll just enough so the highlighted row is visible
  function ensureCursor(){
    const li=scr.querySelector(".menu li.sel"), win=scr.querySelector(".win.body");
    if(!li||!win) return;
    const h=win.clientHeight-20, top=li.offsetTop, bot=top+li.offsetHeight;
    let n=S.scroll;
    if(bot-n>h) n=bot-h;     // row is below the window: scroll down
    if(top<n) n=top;         // row is above the window: scroll up
    if(n!==S.scroll){ S.scroll=Math.max(0,n); scr.querySelector(".inner").style.top=(10-S.scroll)+"px"; }
    updateMore();
  }

  /* ---------- PLAYER: portrait, stats, typewriter summary ---------- */
  function player(){
    S.screen="player"; S.typed=0; S.scroll=0;
    page(t(UI.player), `LV ${YEARS}`,
      `<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:10px">
          <img class="face" src="assets/portrait-56.png" width="56" height="56" alt="Pixel portrait of Konstantinos Lyveras">
          <div class="stats" style="flex:1;min-width:0">
            <div class="stat"><b>${t(UI.name)}</b><span>${t(P.short)}</span></div>
            <div class="stat"><b>${t(UI.cls)}</b><span>${t(P.cls)}</span></div>
            <div class="stat"><b>${t(UI.home)}</b><span>${t(P.home)}</span></div>
            <div class="stat"><b>${t(UI.exp)}</b><span>${YEARS} ${t(UI.yrs)} · ${P.quests.length} ${t(UI.questsN)} · ${BADGES} ${t(UI.badgesN)}</span></div>
          </div>
       </div>
       <span class="lab">${t(UI.summary)}</span>
       <p id="tw" style="min-height:60px"></p>`,
      `${t(UI.scroll)}  ${t(UI.skip)}  ${t(UI.back)}`);
    typewrite(t(P.summary), document.getElementById("tw"));
  }
  // Show text two letters at a time, like an RPG dialogue box
  function typewrite(text, el){
    clearInterval(typer); TW.text=text; TW.el=el; let i=0;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduced){ el.textContent=text; S.typed=1; updateMore(); return; }
    typer=setInterval(()=>{ i+=2; el.textContent=text.slice(0,i); if(i%8===0) beep(1200,0.015,0.015);
      if(i>=text.length){ clearInterval(typer); S.typed=1; updateMore(); } },22);
  }
  // Pressing A while typing shows the whole text at once
  function finishType(){ if(!S.typed && TW.el){ clearInterval(typer); TW.el.textContent=TW.text; S.typed=1; updateMore(); return true; } return false; }

  /* ---------- QUESTS: job list, then details ---------- */
  function quests(){
    S.screen="quests";
    page(t(UI.questLog), `${S.cursor+1}/${P.quests.length}`,
      `<ul class="menu">${P.quests.map((q,i)=>`<li class="${i===S.cursor?"sel":""}">${t(q.co)}<span class="tag">${t(q.status)}</span><span class="sub">${esc(t(q.role))} · ${t(q.when)}</span></li>`).join("")}</ul>`,
      `${t(UI.open)}  ${t(UI.back)}`);
    ensureCursor();
  }
  function questDetail(){
    S.screen="questDetail"; S.scroll=0;
    const q=P.quests[S.cursor];
    page(t(q.co), t(q.status),
      `<span class="lab">${esc(t(q.role))}</span><div style="font-size:.85em;margin-bottom:8px;color:var(--lcd1)">${t(q.when)}</div>
       <ul class="bul">${t(q.pts).map(p=>`<li>${esc(p)}</li>`).join("")}</ul>`,
      `${t(UI.scroll)}  ${t(UI.next)}  ${t(UI.back)}`);
  }

  /* ---------- SKILLS ---------- */
  function skills(){
    S.screen="skills"; S.scroll=0;
    const chips=a=>`<div class="chips">${a.map(x=>`<span class="chip">${esc(x)}</span>`).join("")}</div>`;
    page(t(UI.skills), "",
      P.skills.map(g=>`<span class="lab">${t(g.g)}</span>${chips(t(g.list))}`).join("") +
      `<span class="lab">${t(UI.badges)}</span>
       <ul class="bul">${t(P.badges).map(b=>`<li>${esc(b)}</li>`).join("")}</ul>`,
      `${t(UI.scroll)}  ${t(UI.back)}`);
  }

  /* ---------- ITEMS: project list with a description box ---------- */
  function items(){
    S.screen="items";
    const it=P.items[S.cursor];
    html(`<div class="hdr"><span>${t(UI.itemsHdr)}</span><span class="r">${S.cursor+1}/${P.items.length}</span></div>
      <div class="win body" style="bottom:104px"><div class="inner" style="top:${10-S.scroll}px">
        <ul class="menu">${P.items.map((x,i)=>`<li class="${i===S.cursor?"sel":""}">${t(x.n)}<span class="tag">${t(x.t)}${x.play?" ▶":""}</span></li>`).join("")}</ul>
      </div></div>
      <div class="dlg" style="bottom:26px;height:74px;min-height:0;font-size:.92em"><div style="font-family:var(--px-font);font-size:7px;color:var(--lcd1);margin-bottom:5px">${esc(it.tech)}</div>${esc(t(it.d))}</div>
      <div class="foot"><span>${it.play?t(UI.play):t(UI.select)}  ${t(UI.back)}</span><span></span></div>`);
    ensureCursor();
  }

  /* ---------- TRAINING ---------- */
  function training(){
    S.screen="training"; S.scroll=0;
    page(t(UI.training), "",
      P.training.map(x=>`<span class="lab">${t(x.sch)}</span><p>${esc(t(x.dip))}</p>`).join(""),
      t(UI.back));
  }

  /* ---------- CONTACT: links, with a confirmation before opening ---------- */
  function contact(){
    S.screen="contact";
    page(t(UI.contactHdr), `${S.cursor+1}/${P.contact.length}`,
      `<ul class="menu">${P.contact.map((c,i)=>`<li class="${i===S.cursor?"sel":""}"><a href="${c.href}" target="_blank" rel="noopener">${t(c.k)}<span class="sub">${esc(c.v)}</span></a></li>`).join("")}</ul>`,
      `${t(UI.open)}  ${t(UI.back)}`);
    ensureCursor();
  }
  // Show a link without the boring parts ("https://www.", "mailto:", ...)
  function shownUrl(href){ return href.replace(/^(https?:\/\/(www\.)?|mailto:|tel:|assets\/)/,""); }
  // "Open link? A: yes / B: no"
  function confirmOpen(){
    S.screen="confirm"; sfx.ok();
    const c=P.contact[S.cursor];
    html(`<div class="hdr"><span>${t(UI.openQ)}</span><span class="r">${t(c.k)}</span></div>
      <div class="win" style="top:32px;bottom:8px">
        <span class="lab">${t(c.k)}</span>
        <p class="chip" style="display:inline-block;word-break:break-all">${esc(shownUrl(c.href))}</p>
        <p style="color:var(--lcd1)">${t(UI.newWin)}</p>
        <div><span class="act pri" data-act="a">${t(UI.yes)}</span><span class="act" data-act="b">${t(UI.no)}</span></div>
      </div>`);
  }
  // Try to open the link in a new tab. If the browser blocks pop-ups,
  // window.open returns null, so we show the address and copy it instead.
  function openLink(href){
    let w=null;
    try{ w=window.open(href,"_blank"); if(w) w.opener=null; }catch(e){}
    if(w){ sfx.ok(); contact(); return; }
    S.screen="linkbox"; sfx.back();
    html(`<div class="hdr"><span>${t(UI.link)}</span><span class="r">${t(UI.blocked)}</span></div>
      <div class="win" style="top:32px;bottom:34px">
        <span class="lab">${t(UI.noPop)}</span>
        <p style="margin-top:6px">${t(UI.copyAddr)}</p>
        <p class="chip" style="display:inline-block;word-break:break-all">${esc(shownUrl(href))}</p>
        <p id="cp" style="color:var(--lcd1);font-size:.9em">${t(UI.rightClick)}</p>
      </div>
      <div class="foot"><span>${t(UI.close)}</span><span></span></div>`);
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(href).then(()=>{ const c=document.getElementById("cp"); if(c) c.textContent=t(UI.copied); }).catch(()=>{});
    }
  }

  /* ============================================================
     5. PONG MINI-GAME
     Drawn on a <canvas> every animation frame (about 60 times a second).
     step() moves things, draw() paints them. You control the left
     paddle (keys or mouse), the computer controls the right one.
     ============================================================ */
  let mouseY=null;   // mouse position over the screen, in canvas units
  function startPong(){
    S.screen="pong"; mouseY=null;
    html(`<canvas id="cv" class="game" width="320" height="288"></canvas>`);
    const cv=document.getElementById("cv"), c=cv.getContext("2d");
    const W=320,H=288,PW=6,PH=40,TOP=22;   // sizes: paddle width/height, top bar height
    // g = the game state: paddle positions (py, cy), ball position (bx, by),
    // ball speed (vx, vy), scores (ps, cs), and so on
    const g={ py:H/2, cy:H/2, bx:W/2, by:H/2, vx:0, vy:0, ps:0, cs:0, over:false, serve:1, pause:0, msg:"" };
    function serve(){ g.bx=W/2; g.by=H/2; const a=(Math.random()*0.8-0.4); g.vx=2.4*g.serve; g.vy=2.2*Math.sin(a*Math.PI); g.pause=50; }
    serve();
    function step(){
      if(g.over) return;
      // your paddle: keys first, otherwise follow the mouse
      if(held.has("up")) g.py-=3.6; else if(held.has("down")) g.py+=3.6;
      else if(mouseY!==null){ const d=mouseY-g.py; g.py+=Math.max(-5,Math.min(5,d*0.35)); }
      g.py=Math.max(TOP+PH/2,Math.min(H-PH/2,g.py));
      // computer paddle: follows the ball, but with a speed limit so it can lose
      const target=g.by+(g.vx>0?0:(H/2-g.by)*0.02);
      const d=target-g.cy; g.cy+=Math.max(-2.3,Math.min(2.3,d*0.12));
      g.cy=Math.max(TOP+PH/2,Math.min(H-PH/2,g.cy));
      if(g.pause>0){ g.pause--; }         // short pause after each point
      else{
        g.bx+=g.vx; g.by+=g.vy;
        // bounce off top and bottom
        if(g.by<TOP+3){g.by=TOP+3;g.vy=-g.vy;sfx.wall();}
        if(g.by>H-3){g.by=H-3;g.vy=-g.vy;sfx.wall();}
        // bounce off paddles; hitting near the edge adds spin, and the ball speeds up
        if(g.vx<0 && g.bx<16+PW && g.bx>10 && Math.abs(g.by-g.py)<PH/2+3){ g.vx=-g.vx*1.06; g.vy+=(g.by-g.py)/PH*3; g.bx=16+PW; sfx.hit(); }
        if(g.vx>0 && g.bx>W-16-PW && g.bx<W-10 && Math.abs(g.by-g.cy)<PH/2+3){ g.vx=-g.vx*1.06; g.vy+=(g.by-g.cy)/PH*3; g.bx=W-16-PW; sfx.hit(); }
        g.vx=Math.max(-7,Math.min(7,g.vx));
        // ball left the field: someone scored
        if(g.bx<-6){ g.cs++; g.serve=1; sfx.score(); serve(); }
        if(g.bx>W+6){ g.ps++; g.serve=-1; sfx.score(); serve(); }
        if(g.ps>=5||g.cs>=5){ g.over=true; g.msg=g.ps>=5?t(UI.youWin):t(UI.cpuWins); if(g.ps>=5) sfx.win(); }
      }
    }
    function draw(){
      c.fillStyle="#9bbc0f"; c.fillRect(0,0,W,H);           // background
      c.fillStyle="#0f380f"; c.fillRect(0,0,W,TOP);          // top bar
      c.fillStyle="#9bbc0f"; c.font='8px "Press Start 2P"'; c.textBaseline="middle";
      c.textAlign="left"; c.fillText(t(UI.you)+" "+g.ps,10,TOP/2+1);
      c.textAlign="right"; c.fillText("CPU "+g.cs,W-10,TOP/2+1);
      c.textAlign="center"; c.fillText("PING PONG",W/2,TOP/2+1);
      c.fillStyle="#306230";
      for(let y=TOP+6;y<H;y+=14) c.fillRect(W/2-2,y,4,8);   // dashed centre line
      c.fillStyle="#0f380f";
      c.fillRect(10,Math.round(g.py-PH/2),PW,PH);            // your paddle
      c.fillRect(W-10-PW,Math.round(g.cy-PH/2),PW,PH);       // computer paddle
      if(!g.over) c.fillRect(Math.round(g.bx-3),Math.round(g.by-3),6,6);   // ball
      if(g.over){                                            // result box
        c.fillStyle="#0f380f"; c.fillRect(50,110,220,72);
        c.fillStyle="#9bbc0f"; c.fillRect(54,114,212,64);
        c.fillStyle="#0f380f"; c.textAlign="center";
        c.font='12px "Press Start 2P"'; c.fillText(g.msg,W/2,136);
        c.font='7px "Press Start 2P"'; c.fillText(t(UI.again),W/2,164);
      } else if(g.pause>0 && g.ps+g.cs===0){                 // hint before the first serve
        c.fillStyle="#0f380f"; c.font='7px "Press Start 2P"'; c.textAlign="center";
        c.fillText(t(UI.pongHint),W/2,H-14);
      }
    }
    function loop(){ if(S.screen!=="pong") return; step(); draw(); pong=requestAnimationFrame(loop); }
    pong=requestAnimationFrame(loop);
    startPong.restart=()=>{ g.ps=0;g.cs=0;g.over=false;g.serve=1;serve(); };
  }
  function stopPong(){ cancelAnimationFrame(pong); }

  /* ============================================================
     6. INPUT
     Every way of pressing a button ends up in press(b), where b is
     "up", "down", "left", "right", "a", "b", "start" or "select".
     press() looks at the current screen and decides what to do.
     ============================================================ */
  const held=new Set();   // buttons currently held down (Pong needs this)
  // Move the highlight in a list, wrapping around at the ends
  function moveCursor(dir, len, render){ S.cursor=(S.cursor+len+dir)%len; sfx.move(); render(); }

  function press(b){
    unlock();
    switch(S.screen){
      case "boot": return;   // nothing to do while booting
      case "title":
        if(b==="start"||b==="a"){ sfx.ok(); S.cursor=0; menu(); }
        else if(b==="left"||b==="right"){ toggleLang(); title(); }
        else if(b==="select"){ soundOn=!soundOn; sfx.move(); }
        break;
      case "menu":
        if(b==="up") moveCursor(-1,MENU.length,menu);
        else if(b==="down") moveCursor(1,MENU.length,menu);
        else if(b==="a"||b==="start"){
          if(MENU[S.cursor].id==="lang"){ toggleLang(); menu(); break; }
          sfx.ok(); S.menuCursor=S.cursor; S.cursor=0; S.scroll=0; openScreen(MENU[S.menuCursor].id);
        }
        else if(b==="select"){ soundOn=!soundOn; sfx.move(); menu(); }
        break;
      case "player":
        if(b==="up"){ if(scrollBy(-24)) sfx.move(); }
        else if(b==="down"){ if(scrollBy(24)) sfx.move(); }
        else if(b==="a"){ if(!finishType()){ sfx.back(); back(); } }   // A skips the typing, then goes back
        else if(b==="b"||b==="start"){ sfx.back(); back(); }
        break;
      case "quests":
        if(b==="up") moveCursor(-1,P.quests.length,quests);
        else if(b==="down") moveCursor(1,P.quests.length,quests);
        else if(b==="a"){ sfx.ok(); questDetail(); }
        else if(b==="b"||b==="start"){ sfx.back(); back(); }
        break;
      case "questDetail":
        if(b==="up"){ if(scrollBy(-24)) sfx.move(); }
        else if(b==="down"){ if(scrollBy(24)) sfx.move(); }
        else if(b==="left") moveCursor(-1,P.quests.length,questDetail);    // previous job
        else if(b==="right") moveCursor(1,P.quests.length,questDetail);    // next job
        else if(b==="b"||b==="a"||b==="start"){ sfx.back(); S.scroll=0; quests(); }
        break;
      case "skills": case "training":
        if(b==="up"){ if(scrollBy(-24)) sfx.move(); }
        else if(b==="down"){ if(scrollBy(24)) sfx.move(); }
        else if(b==="b"||b==="a"||b==="start"){ sfx.back(); back(); }
        break;
      case "items":
        if(b==="up") moveCursor(-1,P.items.length,items);
        else if(b==="down") moveCursor(1,P.items.length,items);
        else if(b==="a"){ if(P.items[S.cursor].play){ sfx.ok(); startPong(); } else sfx.move(); }
        else if(b==="b"||b==="start"){ sfx.back(); back(); }
        break;
      case "contact":
        if(b==="up") moveCursor(-1,P.contact.length,contact);
        else if(b==="down") moveCursor(1,P.contact.length,contact);
        else if(b==="a") confirmOpen();
        else if(b==="b"||b==="start"){ sfx.back(); back(); }
        break;
      case "confirm":
        if(b==="a"||b==="start") openLink(P.contact[S.cursor].href);
        else if(b==="b"){ sfx.back(); contact(); }
        break;
      case "linkbox":
        if(b==="a"||b==="b"||b==="start"){ sfx.back(); contact(); }
        break;
      case "pong":
        if(b==="b"||b==="start"){ sfx.back(); stopPong(); items(); }
        else if(b==="a"&&startPong.restart){ startPong.restart(); }
        break;
    }
  }
  // Open a section by its id from the MENU list
  function openScreen(id){ ({player,quests,skills,items,training,contact})[id](); }
  // Return to the main menu, with the same row highlighted as before
  function back(){ clearInterval(typer); S.cursor=S.menuCursor||0; S.scroll=0; menu(); }

  /* ---- keyboard ---- */
  // Which keyboard key means which console button
  const KEYS={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",w:"up",s:"down",a:"left",d:"right",
    z:"a"," ":"a",x:"b",Escape:"b",Backspace:"b",Enter:"start",Shift:"select"};
  document.addEventListener("keydown",e=>{
    const k=KEYS[e.key.length===1?e.key.toLowerCase():e.key]; if(!k) return;
    e.preventDefault();          // stop the page from scrolling with the arrow keys
    if(e.repeat) return;         // ignore auto-repeat while a key is held
    held.add(k); press(k); showPressed(k,true);
  });
  document.addEventListener("keyup",e=>{
    const k=KEYS[e.key.length===1?e.key.toLowerCase():e.key]; if(!k) return;
    held.delete(k); showPressed(k,false);
  });
  // Make the drawn button look pressed while its key is down
  function showPressed(k,on){ document.querySelectorAll(`[data-btn="${k}"]`).forEach(el=>el.classList.toggle("pressed",on)); }

  /* ---- the drawn buttons on the console (mouse and touch) ---- */
  document.querySelectorAll(".btn").forEach(el=>{
    const k=el.dataset.btn;
    const down=e=>{ e.preventDefault(); el.setPointerCapture&&el.setPointerCapture(e.pointerId); el.classList.add("pressed"); held.add(k); press(k); };
    const up=()=>{ el.classList.remove("pressed"); held.delete(k); };
    el.addEventListener("pointerdown",down);
    el.addEventListener("pointerup",up); el.addEventListener("pointercancel",up); el.addEventListener("lostpointercapture",up);
    // keyboard users can Tab to a button and press Enter/Space
    el.addEventListener("keydown",e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); e.stopPropagation(); press(k);} });
  });

  /* ---- clicking directly on the screen ---- */
  const lcdEl=scr.parentElement;
  scr.addEventListener("click",e=>{
    if(S.screen==="boot"||S.screen==="pong") return;
    // elements with data-act are buttons drawn on the screen (yes/no, EN/ΕΛ)
    const act=e.target.closest("[data-act]");
    if(act){
      const a=act.dataset.act;
      if(a==="lang-en"||a==="lang-el"){ const want=a.slice(-2); if(want!==PB.L) toggleLang(); title(); return; }
      press(a); return;
    }
    if(S.screen==="title"){ press("start"); return; }
    if(S.screen==="linkbox"){ press("b"); return; }
    if(S.screen==="confirm") return;
    // clicking the header or footer bar goes back
    if(e.target.closest(".foot")||e.target.closest(".hdr")){ press("b"); return; }
    // clicking a list row selects it (and opens it where that makes sense)
    const li=e.target.closest(".menu li");
    if(li){
      const ul=li.parentElement, i=[...ul.children].indexOf(li);
      if(S.screen==="contact"){ e.preventDefault(); S.cursor=i; confirmOpen(); return; }
      if(S.screen==="menu"||S.screen==="quests"){ S.cursor=i; press("a"); return; }
      if(S.screen==="items"){ S.cursor=i; sfx.move(); items(); if(P.items[i].play) press("a"); return; }
    }
    if(S.screen==="player"){ finishType(); }
  });
  /* ---- mouse wheel: scrolls pages, moves the highlight in lists ---- */
  let wheelAcc=0;
  lcdEl.addEventListener("wheel",e=>{
    e.preventDefault(); unlock();
    const pages=["questDetail","skills","training","player"], lists=["menu","quests","items","contact"];
    if(pages.includes(S.screen)){ scrollBy(Math.sign(e.deltaY)*24); return; }
    if(lists.includes(S.screen)){
      wheelAcc+=e.deltaY;                                    // add up small wheel steps
      if(Math.abs(wheelAcc)>=40){ press(wheelAcc>0?"down":"up"); wheelAcc=0; }
    }
  },{passive:false});
  /* ---- mouse over the screen moves the Pong paddle ---- */
  lcdEl.addEventListener("pointermove",e=>{
    if(S.screen!=="pong") return;
    const r=lcdEl.getBoundingClientRect(); mouseY=(e.clientY-r.top)/r.height*288;
  });
  lcdEl.addEventListener("pointerleave",()=>{ mouseY=null; });

  /* ---- scale the 320x288 panel to the real size of the LCD ---- */
  function fit(){ const s=lcdEl.clientWidth/320; scr.style.transform=`scale(${s})`; }
  new ResizeObserver(fit).observe(lcdEl); fit();

  /* ============================================================
     7. 3D ROTATION
     The console is a box (.rig) with six faces made in CSS. Dragging
     changes two CSS variables, --rx and --ry, which the stylesheet uses
     in a rotateX()/rotateY() transform. When you let go, the leftover
     speed keeps it spinning for a moment (inertia).
     ============================================================ */
  (function rotate3d(){
    const rig=document.getElementById("rig"); if(!rig) return;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine=matchMedia("(pointer:fine)").matches;     // true for a mouse, false for touch
    let rx=0, ry=0;           // rotation set by dragging (degrees)
    let hx=0, hy=0;           // small extra tilt that follows the mouse
    let vx=0, vy=0;           // current spin speed
    let dragging=false, lx=0, ly=0, raf=null, inertia=null;
    const clampX=v=>Math.max(-80,Math.min(80,v));       // don't let it flip upside down
    function apply(){ raf=null; rig.style.setProperty("--ry",(ry+hy).toFixed(2)+"deg"); rig.style.setProperty("--rx",(rx+hx).toFixed(2)+"deg"); }
    function req(){ if(!raf) raf=requestAnimationFrame(apply); }
    // Buttons and the screen have their own jobs, so dragging starts only on the shell
    function isControl(el){ return el.closest(".btn")||el.closest(".lcd"); }
    rig.addEventListener("pointerdown",e=>{
      if(isControl(e.target)) return;
      dragging=true; lx=e.clientX; ly=e.clientY; vx=0; vy=0;
      cancelAnimationFrame(inertia); rig.classList.add("drag");
      rig.setPointerCapture(e.pointerId); e.preventDefault();
    });
    rig.addEventListener("pointermove",e=>{
      if(!dragging) return;
      const dx=e.clientX-lx, dy=e.clientY-ly; lx=e.clientX; ly=e.clientY;
      // how far the pointer moved becomes how far the box turns
      vy=Math.max(-18,Math.min(18,dx*0.45)); vx=Math.max(-12,Math.min(12,-dy*0.35));
      ry+=vy; rx=clampX(rx+vx); req();
    });
    function end(){
      if(!dragging) return; dragging=false;
      if(reduced){ rig.classList.remove("drag"); return; }
      // keep turning, a little slower every frame, until it stops
      const spin=()=>{
        vy*=0.93; vx*=0.9;
        if(Math.abs(vy)<0.05&&Math.abs(vx)<0.05){ rig.classList.remove("drag"); return; }
        ry+=vy; rx=clampX(rx+vx); req(); inertia=requestAnimationFrame(spin);
      };
      spin();
    }
    rig.addEventListener("pointerup",end); rig.addEventListener("pointercancel",end);
    // double-click the shell: straighten it out (turning the short way round)
    rig.addEventListener("dblclick",e=>{
      if(isControl(e.target)) return;
      cancelAnimationFrame(inertia); rig.classList.remove("drag");
      rx=0; ry=Math.round(ry/360)*360; req();
    });
    // gentle tilt that follows the mouse, on top of whatever rotation you dragged to
    if(fine&&!reduced){
      document.addEventListener("pointermove",e=>{
        if(dragging) return;
        const r=rig.getBoundingClientRect();
        const dx=(e.clientX-(r.left+r.width/2))/(innerWidth/2), dy=(e.clientY-(r.top+r.height/2))/(innerHeight/2);
        hy=Math.max(-1,Math.min(1,dx))*6; hx=-Math.max(-1,Math.min(1,dy))*4; req();
      });
      document.documentElement.addEventListener("pointerleave",()=>{ hy=0; hx=0; req(); });
    }
  })();

  /* ============================================================
     8. START
     ============================================================ */
  applyLang();
  // Redraw the menu once the web fonts arrive so the layout is measured correctly
  document.fonts && document.fonts.ready.then(()=>{ if(S.screen==="menu") menu(); });
  boot();
})();
