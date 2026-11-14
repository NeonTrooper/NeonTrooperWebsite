/* ============================================================
   data.js — ALL the text of the portfolio, in English and Greek.

   If you want to change what the site says, this is the only file
   you need to touch. app.js never contains portfolio text.

   How the bilingual fields work
   -----------------------------
   Any field that a visitor can read is written as an object with
   two keys:      { en: "English text", el: "Greek text" }
   Fields that are the same in both languages (like "C++") are
   plain strings.

   app.js asks for text through PB.t(field):
     PB.t({ en: "PLAYER", el: "ΠΑΙΚΤΗΣ" })  ->  "PLAYER" or "ΠΑΙΚΤΗΣ"
     PB.t("C++")                            ->  "C++"
   depending on the current language (PB.L, which is "en" or "el").

   Everything below is wrapped in a function that runs once and
   returns one object called PB. That keeps the variables private
   and exposes only what the app needs.
   ============================================================ */
window.PB = (function () {

  /* ---------- current language ---------- */
  let L = "en";
  try {
    // Remember the visitor's last choice. If there is none, pick Greek
    // for Greek browsers and English for everyone else.
    const saved = localStorage.getItem("pb-lang");
    if (saved === "el" || saved === "en") L = saved;
    else if ((navigator.language || "").toLowerCase().startsWith("el")) L = "el";
  } catch (e) {
    // localStorage can be unavailable (private mode etc.). English is fine then.
  }

  // Pick the right language out of a bilingual field.
  function t(x) {
    const isBilingual = x && typeof x === "object" && !Array.isArray(x);
    if (!isBilingual) return x;                       // plain string or array: return as is
    return x[L] !== undefined ? x[L] : x.en;          // fall back to English if a translation is missing
  }

  // Change language and remember it.
  function setLang(l) {
    L = l === "el" ? "el" : "en";
    try { localStorage.setItem("pb-lang", L); } catch (e) {}
    document.documentElement.lang = L;
  }

  /* ---------- the content ---------- */
  const P = {
    fullName: "KONSTANTINOS LYVERAS",
    short: { en: "KONSTANTINOS", el: "ΚΩΝΣΤΑΝΤΙΝΟΣ" },
    home: { en: "CHAIDARI, ATTIKI, GR", el: "ΧΑΪΔΑΡΙ, ΑΤΤΙΚΗ" },
    cls: { en: "SOFTWARE DEV · FRONT / BACK END", el: "SOFTWARE DEV · FRONT / BACK END" },

    // First year of work. The "level" shown on screen is (current year - since).
    since: 2019,

    summary: {
      en: "Software developer with a front-end and back-end focus, backed by hands-on IT support and Microsoft 365 administration. Builds with JavaScript, HTML/CSS, PHP, SQL, Python, C# and Java. Looking for quests in software engineering, web development or IT operations.",
      el: "Software developer με έμφαση σε front end και back end, με πραγματική εμπειρία σε IT support και διαχείριση Microsoft 365. Αναπτύσσει με JavaScript, HTML/CSS, PHP, SQL, Python, C# και Java. Αναζητά αποστολές σε software engineering, web development ή IT operations."
    },

    /* Work history = "quests". Newest first.
       co     company name
       role   job title
       when   dates
       status shown as a small tag ("ACTIVE" for the current job)
       active true only for the current job (changes the tag style)
       pts    bullet points, one list per language */
    quests: [
      { co: { en: "LAMDA DEVELOPMENT", el: "LAMDA DEVELOPMENT" }, role: { en: "Service Delivery Associate", el: "Service Delivery Associate" },
        when: { en: "APR 2025 – NOW", el: "ΑΠΡ 2025 – ΣΗΜΕΡΑ" }, status: { en: "ACTIVE", el: "ΕΝΕΡΓΗ" }, active: true,
        pts: {
          en: ["1st-level IT support for local and remote users: PCs, printers, scanners, mobiles, Windows, MS Office, MS 365.",
               "Log, track and escalate incidents in ME Service Desk following ITIL-based procedures.",
               "Configure and deploy new workstations, phones and accessories; keep the IT asset inventory accurate.",
               "Monitor corporate infrastructure and coordinate 2nd-level support and vendors.",
               "Active Directory: user provisioning, group policies and access rights.",
               "Inventory and audit reporting for hardware and software assets.",
               "Support Windows 10/11, iOS, MS Teams, SharePoint, Outlook and the rest of M365."],
          el: ["Υποστήριξη IT 1ου επιπέδου σε τοπικούς και απομακρυσμένους χρήστες: PCs, εκτυπωτές, scanners, κινητά, Windows, MS Office, MS 365.",
               "Καταγραφή, παρακολούθηση και κλιμάκωση περιστατικών στο ME Service Desk με διαδικασίες βασισμένες σε ITIL.",
               "Ρύθμιση και παράδοση νέων σταθμών εργασίας, κινητών και περιφερειακών. Τήρηση ακριβούς απογραφής παγίων IT.",
               "Παρακολούθηση της εταιρικής υποδομής και συντονισμός με 2ο επίπεδο υποστήριξης και προμηθευτές.",
               "Active Directory: δημιουργία χρηστών, group policies και δικαιώματα πρόσβασης.",
               "Αναφορές απογραφής και ελέγχου για hardware και software.",
               "Υποστήριξη Windows 10/11, iOS, MS Teams, SharePoint, Outlook και υπόλοιπου M365."] } },
      { co: { en: "MEDIA TIME IKE", el: "MEDIA TIME ΙΚΕ" }, role: { en: "IT Support Technician", el: "Τεχνικός Υποστήριξης IT" },
        when: { en: "JUN 2023 – MAR 2025", el: "ΙΟΥΝ 2023 – ΜΑΡ 2025" }, status: { en: "CLEARED", el: "ΟΛΟΚΛ." },
        pts: {
          en: ["IT support for a media company: broadcasting systems, networks and IT infrastructure.",
               "Troubleshooting hardware and software issues.",
               "Managing Microsoft 365 accounts and maintaining security protocols.",
               "Supporting end-users with technical issues."],
          el: ["Υποστήριξη IT σε εταιρεία media: συστήματα εκπομπής, δίκτυα και υποδομή IT.",
               "Επίλυση προβλημάτων hardware και software.",
               "Διαχείριση λογαριασμών Microsoft 365 και τήρηση πρωτοκόλλων ασφαλείας.",
               "Υποστήριξη τελικών χρηστών σε τεχνικά θέματα."] } },
      { co: { en: "HELLENIC NAVY", el: "ΠΟΛΕΜΙΚΟ ΝΑΥΤΙΚΟ" }, role: { en: "Electronics & Automation Technician", el: "Τεχνικός Ηλεκτρονικών & Αυτοματισμού" },
        when: { en: "NOV 2020 – APR 2022", el: "ΝΟΕ 2020 – ΑΠΡ 2022" }, status: { en: "CLEARED", el: "ΟΛΟΚΛ." },
        pts: {
          en: ["Maintained and repaired electronic and communication systems in a military environment.",
               "Diagnosed technical faults and kept critical systems operational.",
               "Preventive maintenance on naval equipment.",
               "Worked under pressure following strict protocols for efficiency and security."],
          el: ["Συντήρηση και επισκευή ηλεκτρονικών και επικοινωνιακών συστημάτων σε στρατιωτικό περιβάλλον.",
               "Διάγνωση τεχνικών βλαβών και διατήρηση κρίσιμων συστημάτων σε λειτουργία.",
               "Προληπτική συντήρηση ναυτικού εξοπλισμού.",
               "Εργασία υπό πίεση με αυστηρά πρωτόκολλα αποδοτικότητας και ασφάλειας."] } },
      { co: { en: "PUBLIC", el: "PUBLIC" }, role: { en: "IT Technician", el: "Τεχνικός IT" },
        when: { en: "JUN 2020 – NOV 2020", el: "ΙΟΥΝ 2020 – ΝΟΕ 2020" }, status: { en: "CLEARED", el: "ΟΛΟΚΛ." },
        pts: {
          en: ["Technical support at a major electronics retail chain: IT issues, product setup, troubleshooting.",
               "Diagnosed and repaired hardware and software problems.",
               "Managed warranty claims and configured new devices for customers."],
          el: ["Τεχνική υποστήριξη σε μεγάλη αλυσίδα ηλεκτρονικών: θέματα IT, εγκατάσταση προϊόντων, επίλυση προβλημάτων.",
               "Διάγνωση και επισκευή προβλημάτων hardware και software.",
               "Διαχείριση εγγυήσεων και ρύθμιση νέων συσκευών για πελάτες."] } },
      { co: { en: "OTE", el: "ΟΤΕ" }, role: { en: "Computer & Network Technician (Intern)", el: "Τεχνικός Η/Υ & Δικτύων (Πρακτική)" },
        when: { en: "SEP 2019 – FEB 2020", el: "ΣΕΠ 2019 – ΦΕΒ 2020" }, status: { en: "CLEARED", el: "ΟΛΟΚΛ." },
        pts: {
          en: ["Installed, configured and maintained network infrastructure for Greece's leading telecom provider.",
               "Supported enterprise and residential customers with internet, VoIP and networking issues.",
               "Troubleshooting, testing and upgrades of networking hardware."],
          el: ["Εγκατάσταση, ρύθμιση και συντήρηση δικτυακής υποδομής στον μεγαλύτερο πάροχο τηλεπικοινωνιών της Ελλάδας.",
               "Υποστήριξη εταιρικών και οικιακών πελατών σε θέματα internet, VoIP και δικτύων.",
               "Έλεγχοι, δοκιμές και αναβαθμίσεις δικτυακού εξοπλισμού."] } }
    ],

    /* Skills, grouped. Each group has a title (g) and a list.
       A list can be a plain array (same words in both languages)
       or a bilingual object with two arrays. */
    skills: [
      { g: { en: "FRONT END", el: "FRONT END" }, list: ["HTML5", "CSS", "JavaScript"] },
      { g: { en: "BACK END", el: "BACK END" }, list: ["PHP", "SQL (Postgres)", "Python", "C#", "Java", "Bash"] },
      { g: { en: "SYSTEMS & MOBILE", el: "ΣΥΣΤΗΜΑΤΑ & MOBILE" }, list: ["C", "C++", "Android (Java)"] },
      { g: { en: "IT OPS · GEAR", el: "IT OPS · ΕΞΟΠΛΙΣΜΟΣ" },
        list: { en: ["Microsoft 365", "Active Directory", "Windows 10/11", "iOS", "Power Platform", "ME Service Desk (ITIL)", "Networking", "MS Teams / SharePoint"],
                el: ["Microsoft 365", "Active Directory", "Windows 10/11", "iOS", "Power Platform", "ME Service Desk (ITIL)", "Δίκτυα", "MS Teams / SharePoint"] } }
    ],

    // Certifications = "badges"
    badges: { en: ["Android Development (Android Studio)", "Introduction to Cybersecurity (Cisco)"],
              el: ["Android Development (Android Studio)", "Εισαγωγή στην Κυβερνοασφάλεια (Cisco)"] },

    /* Projects = "items".
       n     name        t   short tag shown on the right
       tech  technology  d   description
       play  true = pressing A on it starts the Pong mini-game */
    items: [
      { n: { en: "USER MGMT SYSTEM", el: "ΔΙΑΧΕΙΡΙΣΗ ΧΡΗΣΤΩΝ" }, t: { en: "WORK", el: "ΕΡΓΑΣΙΑ" }, tech: "Lamda Development",
        d: { en: "User management system and database creation for Lamda Development.", el: "Σύστημα διαχείρισης χρηστών και δημιουργία βάσης δεδομένων για τη Lamda Development." } },
      { n: { en: "PASSWORD MANAGER", el: "PASSWORD MANAGER" }, t: "PYTHON", tech: "Python",
        d: { en: "Academic project. Store and retrieve credentials from a local vault.", el: "Ακαδημαϊκό project. Αποθήκευση και ανάκτηση κωδικών από τοπικό vault." } },
      { n: { en: "BATTLESHIP", el: "ΝΑΥΜΑΧΙΑ" }, t: "C++", tech: "C++",
        d: { en: "Academic project. The classic grid game: place the fleet, call the shots.", el: "Ακαδημαϊκό project. Το κλασικό παιχνίδι: τοποθέτησε τον στόλο, ρίξε τις βολές." } },
      { n: { en: "CARD GAME", el: "ΠΑΙΧΝΙΔΙ ΚΑΡΤΩΝ" }, t: "C++", tech: "C++",
        d: { en: "Academic project. Deck, hands and rounds in C++.", el: "Ακαδημαϊκό project. Τράπουλα, χέρια και γύροι σε C++." } },
      { n: { en: "PING PONG", el: "PING PONG" }, t: "C#", tech: "C#", play: true,
        d: { en: "Academic project. Two paddles, one ball. Play a version of it right here.", el: "Ακαδημαϊκό project. Δύο ρακέτες, μία μπάλα. Παίξε το εδώ." } },
      { n: { en: "TRAFFIC LIGHT", el: "ΦΑΝΑΡΙ" }, t: "C#", tech: "C#",
        d: { en: "Academic project. A state machine that cycles a traffic light.", el: "Ακαδημαϊκό project. Μηχανή καταστάσεων που εναλλάσσει ένα φανάρι." } },
      { n: { en: "SALARY CALCULATOR", el: "ΥΠΟΛΟΓ. ΜΙΣΘΟΥ" }, t: "ANDROID", tech: "Java / Android Studio",
        d: { en: "Academic project. Employee salary calculator as an Android app.", el: "Ακαδημαϊκό project. Υπολογιστής μισθού εργαζομένων ως εφαρμογή Android." } }
    ],

    // Education = "training"
    training: [
      { sch: { en: "IEK OMIROS", el: "ΙΕΚ ΟΜΗΡΟΣ" }, dip: { en: "Diploma – Software Development & Applications / Web & Video Game Design", el: "Δίπλωμα – Τεχνικός Εφαρμογών Λογισμικού / Σχεδιασμός Ιστοσελίδων & Βιντεοπαιχνιδιών" } },
      { sch: { en: "DIEK HAIDARI", el: "ΔΙΕΚ ΧΑΪΔΑΡΙΟΥ" }, dip: { en: "Diploma – Computer Technician", el: "Δίπλωμα – Τεχνικός Η/Υ" } },
      { sch: { en: "COURSEWORK", el: "ΜΑΘΗΜΑΤΑ" }, dip: { en: "Programming, Software Engineering", el: "Προγραμματισμός, Τεχνολογία Λογισμικού" } }
    ],

    /* Contact links.  k = label, v = text shown, href = where it goes.
       The resume is the PDF inside this folder (assets/resume.pdf). */
    contact: [
      { k: "EMAIL", v: "kostaslyveras@gmail.com", href: "mailto:kostaslyveras@gmail.com" },
      { k: { en: "PHONE", el: "ΤΗΛΕΦΩΝΟ" }, v: "+30 694 958 0200", href: "tel:+306949580200" },
      { k: "WEB", v: "konstantinoslyveras.gr", href: "https://konstantinoslyveras.gr" },
      { k: "LINKEDIN", v: "konstantinos-lyveras", href: "https://www.linkedin.com/in/konstantinos-lyveras-231a96329/" },
      { k: "GITHUB", v: "NeonTrooper", href: "https://github.com/NeonTrooper" },
      { k: "INSTAGRAM", v: "konstantinos_lyveras", href: "https://www.instagram.com/konstantinos_lyveras" },
      { k: { en: "RESUME", el: "ΒΙΟΓΡΑΦΙΚΟ" }, v: "resume.pdf", href: "assets/resume.pdf" }
    ]
  };

  /* Main menu entries. id = which screen opens, l = label, d = one-line description.
     The last entry is not a screen: choosing it switches the language. */
  const MENU = [
    { id: "player",   l: { en: "PLAYER", el: "ΠΑΙΚΤΗΣ" },        d: { en: "Who is holding the controller.", el: "Ποιος κρατάει το χειριστήριο." } },
    { id: "quests",   l: { en: "QUESTS", el: "ΑΠΟΣΤΟΛΕΣ" },      d: { en: "Work history. 5 quests, 1 active.", el: "Επαγγελματική εμπειρία. 5 αποστολές, 1 ενεργή." } },
    { id: "skills",   l: { en: "SKILLS", el: "ΔΕΞΙΟΤΗΤΕΣ" },     d: { en: "Front end, back end, IT ops and badges.", el: "Front end, back end, IT ops και πιστοποιήσεις." } },
    { id: "items",    l: { en: "ITEMS", el: "ΑΝΤΙΚΕΙΜΕΝΑ" },     d: { en: "Projects. One of them is playable.", el: "Projects. Ένα από αυτά παίζεται." } },
    { id: "training", l: { en: "TRAINING", el: "ΕΚΠΑΙΔΕΥΣΗ" },   d: { en: "Diplomas and coursework.", el: "Διπλώματα και μαθήματα." } },
    { id: "contact",  l: { en: "CONTACT", el: "ΕΠΙΚΟΙΝΩΝΙΑ" },   d: { en: "Links. Each one asks before opening a new window.", el: "Σύνδεσμοι. Ρωτάει πριν ανοίξει νέο παράθυρο." } },
    { id: "lang",     l: { en: "ΕΛΛΗΝΙΚΑ", el: "ENGLISH" },      d: { en: "Switch the text to Greek.", el: "Αλλαγή κειμένου στα Αγγλικά." } }
  ];

  // Years of experience, shown as "LV 7" etc.
  const YEARS = new Date().getFullYear() - P.since;

  // This is what the rest of the app can use.
  return { P, MENU, YEARS, t, setLang, get L() { return L; } };
})();
