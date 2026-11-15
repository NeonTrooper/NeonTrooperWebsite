#!/usr/bin/env python3
"""
build.py — generates the two pages of the portfolio from one set of content:

    index.html       English
    el/index.html    Greek

HOW TO EDIT THE SITE
--------------------
1. Change the text in the CONTENT section below. Every visible text is
   written as  {"en": "English", "el": "Ελληνικά"}.  Text that is the same
   in both languages (like "C++") is a plain string.
2. Run:   python3 tools/build.py
3. Commit the regenerated index.html, el/index.html and the two CV PDFs in assets/
   (the PDFs are printed with Google Chrome, so Chrome must be installed).

No dependencies: only the Python standard library. Styles are in
assets/site.css. The old Game Boy site is in /retro/ and is not touched
by this script.
"""
from html import escape
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://www.konstantinoslyveras.gr"

# ======================================================================
# CONTENT
# ======================================================================

NAME = {"en": "Konstantinos Lyveras", "el": "Κωνσταντίνος Λυβέρας"}
EMAIL = "kostaslyveras@gmail.com"
LINKEDIN = "https://www.linkedin.com/in/konstantinos-lyveras-231a96329/"
GITHUB = "https://github.com/NeonTrooper"
PROJECTS_REPO = "https://github.com/NeonTrooper/my-projects-repo/tree/main/"
PHONE = "+30 694 958 0200"          # shown on the CV PDFs only, not on the web pages
CV_FILE = {"en": "assets/Konstantinos-Lyveras-CV-EN.pdf", "el": "assets/Konstantinos-Lyveras-CV-EL.pdf"}

META = {
    "title": {"en": "Konstantinos Lyveras | IT Support & Software Development",
              "el": "Κωνσταντίνος Λυβέρας | IT Support & Ανάπτυξη Λογισμικού"},
    "description": {
        "en": "Konstantinos Lyveras is an IT professional and software developer in Athens, Greece: IT support, Microsoft 365 and Active Directory administration, and development with JavaScript, PHP, SQL, Python, C# and Java.",
        "el": "Ο Κωνσταντίνος Λυβέρας είναι επαγγελματίας IT και software developer στην Αθήνα: υποστήριξη IT, διαχείριση Microsoft 365 και Active Directory, ανάπτυξη με JavaScript, PHP, SQL, Python, C# και Java."},
}

HERO = {
    "eyebrow": {"en": "IT Support · Software Development", "el": "IT Support · Ανάπτυξη Λογισμικού"},
    "lead": {
        "en": "IT professional and software developer based in Athens. At Lamda Development I support the users and systems of the corporate infrastructure, and alongside that I build software, from internal tools and databases to web front ends.",
        "el": "Επαγγελματίας IT και software developer με έδρα την Αθήνα. Στη Lamda Development υποστηρίζω τους χρήστες και τα συστήματα της εταιρικής υποδομής και παράλληλα αναπτύσσω λογισμικό, από εσωτερικά εργαλεία και βάσεις δεδομένων μέχρι web front end."},
    "lead2": {
        "en": "Interested in roles in software development (front end or back end), web development and IT operations.",
        "el": "Με ενδιαφέρουν θέσεις σε ανάπτυξη λογισμικού (front end ή back end), web development και IT operations."},
}

FACTS = [
    ({"en": "Currently", "el": "Τώρα"},
     "Service Delivery Associate", "Lamda Development"),
    ({"en": "Based in", "el": "Έδρα"},
     {"en": "Chaidari, Athens", "el": "Χαϊδάρι, Αθήνα"}, {"en": "Greece", "el": "Ελλάδα"}),
    ({"en": "Working in IT since", "el": "Στον χώρο του IT από"},
     "2019", {"en": "Telecoms, retail, Hellenic Navy, media, real estate development",
              "el": "Τηλεπικοινωνίες, λιανική, Πολεμικό Ναυτικό, media, ανάπτυξη ακινήτων"}),
]

JOBS = [
    {"co": "Lamda Development", "role": "Service Delivery Associate", "current": True,
     "when": {"en": "Apr 2025 – Present", "el": "Απρ 2025 – Σήμερα"},
     "pts": {
         "en": ["First-level IT support for local and remote users, covering hardware (PCs, printers, scanners, mobile devices) and software (Windows, MS Office, Microsoft 365).",
                "Log, track and escalate incidents and service requests in ManageEngine ServiceDesk, following ITIL-based procedures.",
                "Manage user accounts, group policies and access rights in Active Directory.",
                "Configure and deploy new workstations and mobile devices; maintain the IT asset inventory and contribute to audit reports.",
                "Monitor the corporate infrastructure and coordinate with second-level support and vendors to keep services available.",
                "Built a user management system and its supporting database for the company with Power Apps (Microsoft Power Platform)."],
         "el": ["Υποστήριξη IT πρώτου επιπέδου σε τοπικούς και απομακρυσμένους χρήστες, σε hardware (PCs, εκτυπωτές, scanners, κινητές συσκευές) και software (Windows, MS Office, Microsoft 365).",
                "Καταγραφή, παρακολούθηση και κλιμάκωση περιστατικών και αιτημάτων στο ManageEngine ServiceDesk, με διαδικασίες βασισμένες στο ITIL.",
                "Διαχείριση λογαριασμών χρηστών, group policies και δικαιωμάτων πρόσβασης στο Active Directory.",
                "Ρύθμιση και παράδοση νέων σταθμών εργασίας και κινητών συσκευών, τήρηση της απογραφής παγίων IT και συμμετοχή στις αναφορές ελέγχου.",
                "Παρακολούθηση της εταιρικής υποδομής και συντονισμός με το δεύτερο επίπεδο υποστήριξης και τους προμηθευτές για τη διαθεσιμότητα των υπηρεσιών.",
                "Ανάπτυξη συστήματος διαχείρισης χρηστών και της βάσης δεδομένων του για την εταιρεία, με Power Apps (Microsoft Power Platform)."]}},
    {"co": {"en": "Media Time IKE", "el": "Media Time ΙΚΕ"},
     "role": {"en": "IT Support Technician", "el": "Τεχνικός Υποστήριξης IT"},
     "when": {"en": "Jun 2023 – Mar 2025", "el": "Ιουν 2023 – Μαρ 2025"},
     "pts": {
         "en": ["IT support for a media company, keeping broadcasting systems, networks and IT infrastructure running smoothly.",
                "Troubleshot hardware and software issues, managed Microsoft 365 accounts, maintained security protocols and supported end users."],
         "el": ["Υποστήριξη IT σε εταιρεία media, με ευθύνη για την ομαλή λειτουργία των συστημάτων εκπομπής, των δικτύων και της υποδομής IT.",
                "Επίλυση προβλημάτων hardware και software, διαχείριση λογαριασμών Microsoft 365, τήρηση πρωτοκόλλων ασφαλείας και υποστήριξη τελικών χρηστών."]}},
    {"co": {"en": "Hellenic Navy", "el": "Πολεμικό Ναυτικό"},
     "role": {"en": "Electronics & Automation Technician", "el": "Τεχνικός Ηλεκτρονικών & Αυτοματισμού"},
     "when": {"en": "Nov 2020 – Apr 2022", "el": "Νοε 2020 – Απρ 2022"},
     "pts": {
         "en": ["Maintained and repaired electronic and communication systems in a military environment.",
                "Diagnosed technical faults, performed preventive maintenance on naval equipment and kept critical systems operationally ready.",
                "Worked under pressure while following strict efficiency and security protocols."],
         "el": ["Συντήρηση και επισκευή ηλεκτρονικών και επικοινωνιακών συστημάτων σε στρατιωτικό περιβάλλον.",
                "Διάγνωση τεχνικών βλαβών, προληπτική συντήρηση ναυτικού εξοπλισμού και διατήρηση της επιχειρησιακής ετοιμότητας κρίσιμων συστημάτων.",
                "Εργασία υπό πίεση με αυστηρά πρωτόκολλα αποδοτικότητας και ασφάλειας."]}},
    {"co": "Public",
     "role": {"en": "IT Technician", "el": "Τεχνικός IT"},
     "when": {"en": "Jun 2020 – Nov 2020", "el": "Ιουν 2020 – Νοε 2020"},
     "pts": {
         "en": ["Technical support at a major electronics retail chain: IT issues, product setup and troubleshooting for customers.",
                "Diagnosed and repaired hardware and software problems, managed warranty claims and configured new devices."],
         "el": ["Τεχνική υποστήριξη σε μεγάλη αλυσίδα ηλεκτρονικών: θέματα IT, εγκατάσταση προϊόντων και επίλυση προβλημάτων για πελάτες.",
                "Διάγνωση και επισκευή προβλημάτων hardware και software, διαχείριση εγγυήσεων και ρύθμιση νέων συσκευών."]}},
    {"co": {"en": "OTE", "el": "ΟΤΕ"},
     "role": {"en": "Computer & Network Technician (Intern)", "el": "Τεχνικός Η/Υ & Δικτύων (Πρακτική άσκηση)"},
     "when": {"en": "Sep 2019 – Feb 2020", "el": "Σεπ 2019 – Φεβ 2020"},
     "pts": {
         "en": ["Installed, configured and maintained network infrastructure for Greece's leading telecommunications provider.",
                "Supported enterprise and residential customers with internet, VoIP and networking issues.",
                "Carried out troubleshooting, testing and upgrades of networking hardware."],
         "el": ["Εγκατάσταση, ρύθμιση και συντήρηση δικτυακής υποδομής στον μεγαλύτερο πάροχο τηλεπικοινωνιών της Ελλάδας.",
                "Υποστήριξη εταιρικών και οικιακών πελατών σε θέματα internet, VoIP και δικτύων.",
                "Έλεγχοι, δοκιμές και αναβαθμίσεις δικτυακού εξοπλισμού."]}},
]

SKILLS = [
    ({"en": "Web", "el": "Web"},
     ["HTML5", "CSS", "JavaScript", "PHP", "SQL (PostgreSQL)"]),
    ({"en": "Programming languages", "el": "Γλώσσες προγραμματισμού"},
     ["Python", "C#", "Java", "C", "C++", "Bash", "Android (Java)"]),
    ({"en": "IT & systems", "el": "IT & συστήματα"},
     {"en": ["Microsoft 365", "Active Directory", "Windows 10/11", "iOS", "Power Apps / Power Platform",
             "ManageEngine ServiceDesk (ITIL)", "MS Teams / SharePoint", "Networking fundamentals"],
      "el": ["Microsoft 365", "Active Directory", "Windows 10/11", "iOS", "Power Apps / Power Platform",
             "ManageEngine ServiceDesk (ITIL)", "MS Teams / SharePoint", "Βασικές αρχές δικτύων"]}),
]

ACADEMIC = {"en": "Academic project", "el": "Ακαδημαϊκό project"}
PERSONAL = {"en": "Personal project", "el": "Προσωπικό project"}
CODE = {"en": "Source code", "el": "Κώδικας"}

PROJECTS = [
    {"wide": True,
     "tag": {"en": "Power Apps · Work project at Lamda Development", "el": "Power Apps · Επαγγελματικό project στη Lamda Development"},
     "name": {"en": "User management system", "el": "Σύστημα διαχείρισης χρηστών"},
     "desc": {"en": "A user management system and the database behind it, designed and built for Lamda Development with Power Apps on the Microsoft Power Platform.",
              "el": "Σύστημα διαχείρισης χρηστών και η βάση δεδομένων του, σχεδιασμένα και υλοποιημένα για τη Lamda Development με Power Apps στο Microsoft Power Platform."}},
    {"tag": "HTML · CSS · JavaScript",
     "name": "Portfolio Boy",
     "desc": {"en": "An interactive version of this portfolio: a 3D handheld console built with plain HTML, CSS and JavaScript, with a playable Pong inside.",
              "el": "Μια διαδραστική εκδοχή αυτού του portfolio: τρισδιάστατη φορητή κονσόλα φτιαγμένη με απλή HTML, CSS και JavaScript, με Pong που παίζεται."},
     "href": "retro/", "local": True,
     "link": {"en": "Open it", "el": "Άνοιγμα"}},
    {"tag": "HTML · CSS · JavaScript", "personal": True,
     "name": {"en": "Help desk ticket tracker", "el": "Σύστημα καταγραφής αιτημάτων help desk"},
     "desc": {"en": "Log incidents, work them by priority and track the SLA clock. Runs in the browser, with tested logic for SLA times, sorting and CSV export.",
              "el": "Καταγραφή περιστατικών, διαχείριση ανά προτεραιότητα και παρακολούθηση του χρόνου SLA. Τρέχει στον browser, με ελεγμένη (tested) λογική για χρόνους SLA, ταξινόμηση και εξαγωγή CSV."},
     "href": "demos/helpdesk/", "local": True, "link": {"en": "Live demo", "el": "Live demo"},
     "code": GITHUB + "/helpdesk-tickets"},
    {"tag": "Python · SQL (SQLite) · JavaScript", "personal": True,
     "name": {"en": "IT asset inventory", "el": "Απογραφή εξοπλισμού IT"},
     "desc": {"en": "A web app that tracks devices, who has them and when warranties end. Python back end with a JSON API, SQLite database, change history for every asset and automated tests.",
              "el": "Web εφαρμογή για την παρακολούθηση συσκευών, των κατόχων τους και της λήξης των εγγυήσεων. Back end σε Python με JSON API, βάση SQLite, ιστορικό αλλαγών για κάθε συσκευή και αυτοματοποιημένα tests."},
     "href": GITHUB + "/it-asset-inventory"},
    {"tag": "Python · Networking", "personal": True,
     "name": "netcheck",
     "desc": {"en": "A command-line tool that checks a list of network services at the same time and explains each failure: timeout, DNS or refused connection. JSON and CSV reports.",
              "el": "Εργαλείο γραμμής εντολών που ελέγχει ταυτόχρονα μια λίστα δικτυακών υπηρεσιών και εξηγεί κάθε αποτυχία: timeout, DNS ή άρνηση σύνδεσης. Αναφορές σε JSON και CSV."},
     "href": GITHUB + "/netcheck"},
    {"tag": "Python", "name": {"en": "Password manager", "el": "Διαχείριση κωδικών πρόσβασης"},
     "desc": {"en": "Stores and retrieves credentials from a local vault.", "el": "Αποθήκευση και ανάκτηση κωδικών από τοπικό vault."},
     "academic": True, "href": PROJECTS_REPO + "Python-Projects"},
    {"tag": "C++", "name": {"en": "Battleship", "el": "Ναυμαχία"},
     "desc": {"en": "The classic grid game: place the fleet, call the shots.", "el": "Το κλασικό παιχνίδι: τοποθέτηση στόλου και βολές στο πλέγμα."},
     "academic": True, "href": PROJECTS_REPO + "C%2B%2B-Projects/Battleship%20Game"},
    {"tag": "C++", "name": {"en": "Card game", "el": "Παιχνίδι καρτών"},
     "desc": {"en": "Deck, hands and rounds implemented in C++.", "el": "Τράπουλα, χέρια και γύροι υλοποιημένα σε C++."},
     "academic": True, "href": PROJECTS_REPO + "C%2B%2B-Projects/CardGame"},
    {"tag": "Java · Android Studio", "name": {"en": "Employee salary calculator", "el": "Υπολογισμός μισθού εργαζομένου"},
     "desc": {"en": "An Android app that calculates employee salaries.", "el": "Εφαρμογή Android για τον υπολογισμό μισθού εργαζομένων."},
     "academic": True, "href": PROJECTS_REPO + "Android-Projects/YpologismosMisthouErgazomenou"},
    {"tag": "C#", "name": "Ping Pong",
     "desc": {"en": "Two paddles, one ball: a desktop game in C#.", "el": "Δύο ρακέτες, μία μπάλα: παιχνίδι για desktop σε C#."},
     "academic": True},
    {"tag": "C#", "name": {"en": "Traffic light", "el": "Φανάρι κυκλοφορίας"},
     "desc": {"en": "A state machine that cycles a traffic light.", "el": "Μηχανή καταστάσεων που εναλλάσσει τις φάσεις ενός φαναριού."},
     "academic": True},
]

EDUCATION = [
    ({"en": "Diploma, Software Development and Applications / Web and Video Game Design",
      "el": "Δίπλωμα, Τεχνικός Εφαρμογών Λογισμικού / Σχεδιασμός Ιστοσελίδων & Βιντεοπαιχνιδιών"},
     {"en": "IEK Omiros", "el": "ΙΕΚ Όμηρος"}, "2024 – 2025"),
    ({"en": "Diploma, Computer Technician", "el": "Δίπλωμα, Τεχνικός Η/Υ"},
     {"en": "DIEK Chaidari", "el": "ΔΙΕΚ Χαϊδαρίου"}, "2016 – 2018"),
]

CERTS = {"en": ["Android Development (Android Studio)", "Introduction to Cybersecurity (Cisco)"],
         "el": ["Android Development (Android Studio)", "Εισαγωγή στην Κυβερνοασφάλεια (Cisco)"]}

LANGUAGES = {"en": ["Greek (native)", "English (proficient)"],
             "el": ["Ελληνικά (μητρική)", "Αγγλικά (άριστη γνώση, Proficiency)"]}

# Summary used at the top of the CV PDFs.
CV_SUMMARY = {
    "en": "IT and software development professional with experience in IT support, Microsoft 365 administration and custom application development. Skilled in C, C++, C#, Java, Python, HTML, CSS, JavaScript, SQL, PHP and Power Apps, with a solid grounding in networking. Strong problem-solving, teamwork and adaptability skills.",
    "el": "Επαγγελματίας IT και ανάπτυξης λογισμικού, με εμπειρία στην υποστήριξη IT, στη διαχείριση Microsoft 365 και στην ανάπτυξη προσαρμοσμένων εφαρμογών. Γνώσεις C, C++, C#, Java, Python, HTML, CSS, JavaScript, SQL, PHP και Power Apps, με στέρεες βάσεις στα δίκτυα. Ικανότητα επίλυσης προβλημάτων, ομαδικότητα και προσαρμοστικότητα."}

UI = {
    "skip": {"en": "Skip to content", "el": "Μετάβαση στο περιεχόμενο"},
    "experience": {"en": "Experience", "el": "Εμπειρία"},
    "skills": {"en": "Skills", "el": "Δεξιότητες"},
    "projects": {"en": "Projects", "el": "Projects"},
    "education": {"en": "Education", "el": "Εκπαίδευση"},
    "contact": {"en": "Contact", "el": "Επικοινωνία"},
    "certs": {"en": "Certifications", "el": "Πιστοποιήσεις"},
    "current": {"en": "Current", "el": "Τρέχουσα"},
    "email_me": {"en": "Email me", "el": "Στείλτε email"},
    "cv": {"en": "Download CV", "el": "Λήψη βιογραφικού"},
    "cv_note": {"en": "PDF", "el": "PDF"},
    "languages": {"en": "Languages", "el": "Γλώσσες"},
    "summary": {"en": "Summary", "el": "Περίληψη"},
    "tech": {"en": "Technical skills", "el": "Τεχνικές δεξιότητες"},
    "prof_exp": {"en": "Professional experience", "el": "Επαγγελματική εμπειρία"},
    "photo_alt": {"en": "Portrait of Konstantinos Lyveras", "el": "Φωτογραφία του Κωνσταντίνου Λυβέρα"},
    "contact_lead": {"en": "For roles, projects or questions, email is the fastest way to reach me.",
                     "el": "Για θέσεις εργασίας, συνεργασίες ή ερωτήσεις, το email είναι ο πιο γρήγορος τρόπος επικοινωνίας."},
    "resume": {"en": "Résumé", "el": "Βιογραφικό"},
    "lang_label": {"en": "Language", "el": "Γλώσσα"},
    "retro": {"en": "Retro version", "el": "Retro έκδοση"},
}

# ======================================================================
# TEMPLATE
# ======================================================================

ICON_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'
ICON_DOWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg>'


def render(lang):
    pre = "" if lang == "en" else "../"          # path back to the site root
    url = BASE + ("/" if lang == "en" else "/el/")

    def t(x):
        """Pick the right language; escape for HTML."""
        if isinstance(x, dict):
            x = x[lang]
        return escape(x, quote=True) if isinstance(x, str) else x

    def raw(x):
        return x[lang] if isinstance(x, dict) else x

    nav = "".join(f'<a href="#{k}">{t(UI[k])}</a>'
                  for k in ("experience", "skills", "projects", "education", "contact"))

    lang_switch = ('<span aria-current="true">EN</span><a href="el/" lang="el" hreflang="el">ΕΛ</a>' if lang == "en"
                   else '<a href="../" lang="en" hreflang="en">EN</a><span aria-current="true">ΕΛ</span>')

    facts = "".join(f"<div><dt>{t(k)}</dt><dd>{t(v)}<small>{t(s)}</small></dd></div>" for k, v, s in FACTS)

    jobs = ""
    for j in JOBS:
        badge = f'<span class="badge">{t(UI["current"])}</span>' if j.get("current") else ""
        pts = "".join(f"<li>{t(p)}</li>" for p in raw(j["pts"]))
        jobs += (f'<article class="job"><p class="when">{t(j["when"])}</p><div>'
                 f'<h3>{t(j["co"])}{badge}</h3><p class="role">{t(j["role"])}</p>'
                 f'<ul class="bullets">{pts}</ul></div></article>\n')

    skills = ""
    for title, items in SKILLS:
        chips = "".join(f"<li>{t(i)}</li>" for i in raw(items))
        skills += f'<div class="skillgroup"><h3>{t(title)}</h3><ul class="chips">{chips}</ul></div>\n'

    cards = ""
    for p in PROJECTS:
        tag = t(p["tag"]) + (f' · {t(ACADEMIC)}' if p.get("academic") else "") + (f' · {t(PERSONAL)}' if p.get("personal") else "")
        more = ""
        if p.get("href"):
            href = (pre + p["href"]) if p.get("local") else p["href"]
            ext = "" if p.get("local") else ' target="_blank" rel="noopener"'
            more = f'<a class="more" href="{href}"{ext}>{t(p.get("link", CODE))} →</a>'
            if p.get("code"):
                more += f'<a class="more" href="{p["code"]}" target="_blank" rel="noopener">{t(CODE)} →</a>'
        cards += (f'<article class="card{" wide" if p.get("wide") else ""}"><p class="tag">{tag}</p>'
                  f'<h3>{t(p["name"])}</h3><p>{t(p["desc"])}</p><div class="card-links">{more}</div></article>\n')

    edu = "".join(f"<li><strong>{t(d)}</strong><span>{t(s)} · {y}</span></li>" for d, s, y in EDUCATION)
    langs = "".join(f"<li>{t(c)}</li>" for c in LANGUAGES[lang])
    cv = pre + CV_FILE[lang]
    cv_name = CV_FILE[lang].split("/")[-1]
    certs = "".join(f"<li>{t(c)}</li>" for c in CERTS[lang])

    ld = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "url": url,
        "inLanguage": lang,
        "mainEntity": {
            "@type": "Person",
            "@id": BASE + "/#person",
            "name": "Konstantinos Lyveras",
            "alternateName": "Κωνσταντίνος Λυβέρας",
            "url": BASE + "/",
            "jobTitle": "Service Delivery Associate",
            "worksFor": {"@type": "Organization", "name": "Lamda Development"},
            "description": META["description"][lang],
            "address": {"@type": "PostalAddress", "addressLocality": "Chaidari",
                        "addressRegion": "Attiki", "addressCountry": "GR"},
            "knowsAbout": ["IT support", "Microsoft 365", "Active Directory", "Web development", "JavaScript",
                           "HTML", "CSS", "PHP", "SQL", "Python", "C#", "Java", "C++"],
            "sameAs": [LINKEDIN, GITHUB],
        },
    }

    def sec(i, key, body):
        return (f'<section class="section" id="{key}"><div class="wrap">'
                f'<h2><span>{i:02d}</span>{t(UI[key])}</h2><div>\n{body}</div></div></section>\n')

    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{t(META["title"])}</title>
<meta name="description" content="{t(META["description"])}">
<meta name="author" content="Konstantinos Lyveras">
<meta name="theme-color" content="#1f6b63">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="en" href="{BASE}/">
<link rel="alternate" hreflang="el" href="{BASE}/el/">
<link rel="alternate" hreflang="x-default" href="{BASE}/">
<meta property="og:type" content="profile">
<meta property="og:title" content="{t(META["title"])}">
<meta property="og:description" content="{t(META["description"])}">
<meta property="og:url" content="{url}">
<meta property="og:locale" content="{"en_GB" if lang == "en" else "el_GR"}">
<meta name="twitter:card" content="summary">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
<link rel="icon" href="{pre}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&display=swap">
<link rel="stylesheet" href="{pre}assets/site.css">
</head>
<body>
<a class="skip" href="#main">{t(UI["skip"])}</a>

<header class="top"><div class="wrap">
  <a class="mark" href="#top" aria-label="{t(NAME)}"><i>KL</i><b>{t(NAME)}</b></a>
  <nav class="nav" aria-label="{t(UI["contact"])}">{nav}</nav>
  <div class="lang" role="group" aria-label="{t(UI["lang_label"])}">{lang_switch}</div>
</div></header>

<main id="main">
<section class="hero" id="top"><div class="wrap">
  <div>
    <p class="eyebrow">{t(HERO["eyebrow"])}</p>
    <h1>{t(NAME)}</h1>
    <p class="lead">{t(HERO["lead"])}</p>
    <div class="cta">
      <a class="btn primary" href="mailto:{EMAIL}">{ICON_MAIL}{t(UI["email_me"])}</a>
      <a class="btn" href="{cv}" download="{cv_name}">{ICON_DOWN}{t(UI["cv"])}</a>
      <a class="btn" href="{LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a>
      <a class="btn" href="{GITHUB}" target="_blank" rel="noopener">GitHub</a>
    </div>
  </div>
  <aside class="side">
    <img class="portrait" src="{pre}assets/portrait.jpg" width="160" height="160" alt="{t(UI["photo_alt"])}">
    <dl class="facts">{facts}</dl>
  </aside>
</div></section>

{sec(1, "experience", jobs)}
{sec(2, "skills", skills)}
{sec(3, "projects", f'<div class="cards">{cards}</div>')}
{sec(4, "education", f'<ul class="edu">{edu}</ul><h3 class="sub">{t(UI["certs"])}</h3><ul class="chips">{certs}</ul><h3 class="sub">{t(UI["languages"])}</h3><ul class="chips">{langs}</ul>')}
{sec(5, "contact", f'''<p class="contact-lead">{t(UI["contact_lead"])}</p>
<div class="links">
<a href="mailto:{EMAIL}"><small>Email</small><b>{EMAIL}</b></a>
<a href="{LINKEDIN}" target="_blank" rel="noopener"><small>LinkedIn</small><b>konstantinos-lyveras</b></a>
<a href="{GITHUB}" target="_blank" rel="noopener"><small>GitHub</small><b>NeonTrooper</b></a>
<a href="{cv}" download="{cv_name}"><small>{t(UI["resume"])}</small><b>{t(UI["cv"])} ({t(UI["cv_note"])})</b></a>
</div>''')}
</main>

<footer class="foot"><div class="wrap">
  <span>© 2026 {t(NAME)}</span>
  <a href="{pre}retro/">{t(UI["retro"])} →</a>
</div></footer>
</body>
</html>
"""


CV_CSS = """
@page { size: A4; margin: 15mm 16mm; }
* { box-sizing: border-box; }
body { margin: 0; font: 10pt/1.42 "Helvetica Neue", Helvetica, Arial, sans-serif; color: #111; }
h1 { font-size: 22pt; letter-spacing: .04em; text-align: center; margin: 0 0 4pt; text-transform: uppercase; }
.contact { text-align: center; margin: 0 0 10pt; }
.contact a { color: inherit; text-decoration: none; }
h2 { font-size: 10pt; letter-spacing: .09em; text-transform: uppercase; color: #1f6b63;
     border-bottom: 1pt solid #1f6b63; padding-bottom: 2pt; margin: 12pt 0 6pt; break-after: avoid; }
p { margin: 0 0 3pt; }
.job { margin-bottom: 7pt; }
.jobhead { display: flex; justify-content: space-between; gap: 12pt; font-weight: 700; break-after: avoid; }
ul { margin: 2pt 0 0; padding-left: 14pt; }
li { margin-bottom: 1.5pt; }
"""


def render_cv(lang):
    def t(x):
        if isinstance(x, dict):
            x = x[lang]
        return escape(x, quote=True)

    def items(x):
        return ", ".join(escape(i) for i in (x[lang] if isinstance(x, dict) else x))

    edu = "".join(f"<p><b>{t(d)}</b>, {t(s)} ({y})</p>" for d, s, y in EDUCATION)
    skills = "".join(f"<p><b>{t(title)}:</b> {items(lst)}</p>" for title, lst in SKILLS)
    jobs = ""
    for j in JOBS:
        pts = "".join(f"<li>{escape(p)}</li>" for p in j["pts"][lang])
        jobs += (f'<div class="job"><div class="jobhead"><span>{t(j["co"])} — {t(j["role"])}</span>'
                 f'<span>{t(j["when"])}</span></div><ul>{pts}</ul></div>')
    projects = "".join(
        f"<p><b>{t(p['name'])}</b> ({t(p['tag'])}): {t(p['desc'])}</p>" for p in PROJECTS)
    return f"""<!DOCTYPE html>
<html lang="{lang}"><head><meta charset="utf-8"><title>{t(NAME)} – CV</title><style>{CV_CSS}</style></head><body>
<h1>{t(NAME)}</h1>
<p class="contact">{PHONE} • <a href="mailto:{EMAIL}">{EMAIL}</a> • <a href="{LINKEDIN}">LinkedIn</a> • <a href="{GITHUB}">GitHub</a> • <a href="{BASE}/">konstantinoslyveras.gr</a></p>
<h2>{t(UI["summary"])}</h2><p>{t(CV_SUMMARY)}</p>
<h2>{t(UI["prof_exp"])}</h2>{jobs}
<h2>{t(UI["education"])}</h2>{edu}
<p><b>{t(UI["certs"])}:</b> {items(CERTS)}</p>
<h2>{t(UI["tech"])}</h2>{skills}
<p><b>{t(UI["languages"])}:</b> {items(LANGUAGES)}</p>
<h2>{t(UI["projects"])}</h2>{projects}
</body></html>
"""


def build_cvs():
    """Print the two CV PDFs with headless Chrome (skipped if Chrome is not installed)."""
    import subprocess, tempfile
    chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    if not Path(chrome).exists():
        print("Chrome not found: CV PDFs were not regenerated")
        return
    with tempfile.TemporaryDirectory() as tmp:
        for lang in ("en", "el"):
            src = Path(tmp) / f"cv-{lang}.html"
            src.write_text(render_cv(lang), encoding="utf-8")
            out = ROOT / CV_FILE[lang]
            subprocess.run([chrome, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                            f"--print-to-pdf={out}", src.as_uri()],
                           check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print("Wrote", CV_FILE[lang])


if __name__ == "__main__":
    (ROOT / "index.html").write_text(render("en"), encoding="utf-8")
    (ROOT / "el").mkdir(exist_ok=True)
    (ROOT / "el" / "index.html").write_text(render("el"), encoding="utf-8")
    print("Wrote index.html and el/index.html")
    build_cvs()
