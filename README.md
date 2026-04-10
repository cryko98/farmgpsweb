# FarmGPS

**Precíziós GPS Robotkormány Rendszerek**  
Üzemeltető: SUGÁR-KER 2002 Kereskedelmi és Szolgáltató Betéti Társaság  
Tulajdonos: Vígvári Sándor

---

## Leírás

A FarmGPS weboldal a Hi-Target és FJ Dynamics robotkormány-rendszerek magyarországi és külföldi forgalmazásával és beépítésével foglalkozó cég hivatalos weboldala.

## Struktúra

```
farmgps/
├── index.html          # Főoldal (single-page)
├── css/
│   └── style.css       # Teljes stíluslap
├── js/
│   ├── main.js         # Interakciók, animációk
│   └── translations.js # HU/RO kétnyelvűség
├── images/
│   └── farmgpslogo.png # FarmGPS logó
└── .gitignore
```

## Technológia

- HTML5 + CSS3 + Vanilla JavaScript
- Mobile-first, responsive design
- HU / RO kétnyelvű (localStorage-alapú)
- Google Fonts: Syne + DM Sans
- Scroll animációk (IntersectionObserver)
- Cookie consent banner
- Nincs szerver-oldali függőség

## Telepítés (magyarhosting.hu)

1. Töltse fel az összes fájlt a tárhely gyökérkönyvtárába (public_html)
2. A logó és képek az `images/` mappába kerüljenek
3. Szükség esetén cserélje ki a placeholder adatokat:
   - Telefonszám: `index.html` → `tel:+36XXXXXXXXX`
   - E-mail: `index.html` → `info@farmgps.hu`
   - Cím: `index.html` → valós cím

## TODO (kitöltendő adatok)

- [ ] Valós telefonszám beillesztése
- [ ] Valós e-mail cím beillesztése  
- [ ] Valós cím beillesztése
- [ ] Vígvári Sándor fotójának feltöltése (`images/sandor.jpg`)
- [ ] Kontaktform backend (FormSubmit / EmailJS integráció)
- [ ] Google Analytics kód (opcionális)

## Fejlesztő

Weboldal: FarmGPS  
© 2025 SUGÁR-KER 2002 Bt. — Minden jog fenntartva.
