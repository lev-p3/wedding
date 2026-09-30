/* ============================================================
   DATA — content, frames, copy
   ============================================================ */
(function () {
  "use strict";

  var U = "https://images.unsplash.com/";
  function photo(id, w) {
    return U + id + "?auto=format&fit=crop&w=" + (w || 1400) + "&q=70";
  }
  function srcset(id) {
    return [900, 1400, 2000].map(function (w) { return photo(id, w) + " " + w + "w"; }).join(", ");
  }

  var IDS = {
    coupleSunset: "photo-1591604466107-ec97de577aff",
    hands: "photo-1465495976277-4387d4b0b4c6",
    holdHands: "photo-1520854221256-17451cc331bf",
    veilField: "photo-1546032996-6dfacbacbf3f",
    veilBW: "photo-1460978812857-470ed1c77af0",
    confetti: "photo-1583939003579-730e3918a45a",
    palms: "photo-1606216794074-735e91aa2c92",
    toast: "photo-1519671482749-fd09be7ccebf",
    heartSunset: "photo-1516589178581-6cd7833ae3b2",
    groomBouquet: "photo-1494955870715-979ca4f13bf0",
    bouquet: "photo-1525258946800-98cfd641d0de",
    bouquetArm: "photo-1529636798458-92182e662485",
    table: "photo-1519225421980-715cb0215aed",
    tableAlt: "photo-1502635385003-ee1e6a1a742d",
    candles: "photo-1517457210348-703079e57d4b",
    italyStreet: "photo-1516483638261-f4dbaf036963",
    venice: "photo-1523906834658-6e24ef2386f9",
    colosseum: "photo-1552832230-c0197dd311b5",
    sunsetTown: "photo-1499678329028-101435549a4e",
    coast: "photo-1534445867742-43195f401b6c",
    ringsFlowers: "photo-1515934751635-c81c6bc9a2d8",
    partyCrowd: "photo-1517457373958-b7bdd4587205",
    partyToast: "photo-1541532713592-79a0317b6b77",
    partyDance: "photo-1470753937643-efeb931202a9",
    bar: "photo-1543007630-9710e4a00a20",
    brideVeil: "photo-1537633552985-df8429e8048b",
    coupleRocks: "photo-1541250848049-b4f7141dca3f",
    aisle: "photo-1469371670807-013ccf25f16a",
    shoes: "photo-1509927083803-4bd519298ac4",
    mrsmrs: "photo-1507504031003-b417219a0fde",
    brideBouquet: "photo-1478146896981-b80fe463b330",
    dinnerPlate: "photo-1414235077428-338989a2e8c0",
    friends: "photo-1490578474895-699cd4e2cf59",
    darkBride: "photo-1519741497674-611481863552",
    gazebo: "photo-1523438885200-e635ba2c371e",
    ceremony: "photo-1511285560929-80b456fea0bc",
    blackSand: "photo-1544078751-58fee2d8a03b",
    clock: "photo-1533090161767-e6ffed986c88",
    camera: "photo-1502920917128-1aa500764cbd",
    arcade: "photo-1546195643-70f48f9c5b87"
  };

  window.WEDDING = {
    names: { a: "Александр", b: "София" },
    dateISO: "2026-09-19T16:30:00+03:00",
    dateShort: "19.09.2026",
    venue: "Villa Verde",

    photo: photo,
    srcset: srcset,
    IDS: IDS,

    /* --- PHOTO FLIP STACK (§44) --- */
    stack: [
      { id: IDS.holdHands, alt: "Руки", n: "01", cap: "FRAME 01 · ЛЕТО 2021" },
      { id: IDS.veilField, alt: "Пара в поле", n: "02", cap: "FRAME 02 · ТОСКАНА" },
      { id: IDS.toast, alt: "Тост", n: "03", cap: "FRAME 03 · 22:40" },
      { id: IDS.bouquetArm, alt: "Букет", n: "04", cap: "FRAME 04 · УТРО" },
      { id: IDS.blackSand, alt: "Пара на берегу", n: "05", cap: "FRAME 05 · ДОРОГА ДОМОЙ" }
    ],

    /* --- CONTACT SHEET (§41) --- */
    contactSheet: [
      { id: IDS.brideVeil, alt: "Фата", cap: "01 · VILLA VERDE / 16:12" },
      { id: IDS.hands, alt: "Кольца", cap: "02 · CLOSE-UP / 35MM" },
      { id: IDS.italyStreet, alt: "Улица", cap: "03 · ROMA / 2025" },
      { id: IDS.candles, alt: "Свечи", cap: "04 · DINNER / 18:40" },
      { id: IDS.palms, alt: "Пара", cap: "05 · GOLDEN HOUR" },
      { id: IDS.bouquet, alt: "Букет", cap: "06 · PRIVATE COLLECTION" },
      { id: IDS.venice, alt: "Венеция", cap: "07 · VENEZIA / 17:05" },
      { id: IDS.shoes, alt: "Туфли", cap: "08 · DETAIL" },
      { id: IDS.confetti, alt: "Конфетти", cap: "09 · CELEBRATION" },
      { id: IDS.coast, alt: "Побережье", cap: "10 · WIDE SHOT" }
    ],

    /* --- ALBUM (§43) --- */
    album: [
      { id: IDS.coupleSunset, alt: "Пара на закате", cap: "GOLDEN HOUR / 19:42" },
      { id: IDS.veilBW, alt: "Чёрно-белая фата", cap: "ONE OF OUR FAVORITES" },
      { id: IDS.groomBouquet, alt: "Жених с букетом", cap: "MEDIUM SHOT / 50MM" },
      { id: IDS.arcade, alt: "Итальянская галерея", cap: "ROMA / 18:20" },
      { id: IDS.heartSunset, alt: "Сердце на закате", cap: "SUNSET / 19:50" },
      { id: IDS.dinnerPlate, alt: "Ужин", cap: "DINNER / 18:00" },
      { id: IDS.coupleRocks, alt: "Пара на скалах", cap: "COASTLINE / 17:30" },
      { id: IDS.friends, alt: "Друзья", cap: "THE PEOPLE WE LOVE" },
      { id: IDS.gazebo, alt: "Церемония", cap: "CEREMONY / 17:00" },
      { id: IDS.darkBride, alt: "Невеста", cap: "EXTREME CLOSE-UP" },
      { id: IDS.aisle, alt: "Аллея", cap: "THE TABLE IS SET" },
      { id: IDS.tableAlt, alt: "Сервировка", cap: "EDITORIAL NOTE / 04" }
    ],

    /* --- FILM STRIP (§42) --- */
    strip: [
      { id: IDS.ceremony, alt: "Церемония", note: "16:30 СБОР" },
      { id: IDS.holdHands, alt: "Руки", note: "17:00 ОБЕТЫ" },
      { id: IDS.veilBW, alt: "Фата", note: "17:40 ПОРТРЕТЫ" },
      { id: IDS.table, alt: "Стол", note: "18:00 УЖИН" },
      { id: IDS.toast, alt: "Тосты", note: "19:20 ТОСТЫ" },
      { id: IDS.partyCrowd, alt: "Праздник", note: "21:00 ТАНЦЫ" },
      { id: IDS.bar, alt: "Бар", note: "23:30 НОЧЬ" }
    ],

    /* --- PARTY FAST CUTS (§90) --- */
    partyCuts: [IDS.partyCrowd, IDS.confetti, IDS.partyToast, IDS.partyDance, IDS.bar],

    /* --- COLLAGE (§91) --- */
    collage: [
      { id: IDS.tableAlt, alt: "Сервировка", cap: "THE TABLE / 18:05" },
      { id: IDS.brideVeil, alt: "Невеста", cap: "PORTRAIT / 50MM" },
      { id: IDS.shoes, alt: "Деталь", cap: "DETAIL / 03" },
      { id: IDS.partyDance, alt: "Танцы", cap: "MOVEMENT / 21:40" },
      { id: IDS.bouquet, alt: "Букет", cap: "FLOWERS / MORNING" }
    ],

    /* --- MOODBOARD / DRESS CODE (§65) --- */
    mood: [
      { id: IDS.groomBouquet, alt: "Образ 1", label: "ЛЁН", hex: "#D8C3A5" },
      { id: IDS.brideBouquet, alt: "Образ 2", label: "ШЁЛК", hex: "#F5F0E6" },
      { id: IDS.coast, alt: "Образ 3", label: "ШАЛФЕЙ", hex: "#6F7A5E" },
      { id: IDS.toast, alt: "Образ 4", label: "ЗОЛОТО", hex: "#C4A468" },
      { id: IDS.italyStreet, alt: "Образ 5", label: "КАМЕНЬ", hex: "#C9BCA4" }
    ],

    /* --- TIMELINE (§70) --- */
    timeline: [
      { time: "16:30", title: "Сбор гостей", text: "Welcome drinks в саду, веера, лёгкая музыка и первые снимки." },
      { time: "17:00", title: "Церемония", text: "Короткая камерная церемония на открытой террасе." },
      { time: "18:00", title: "Ужин", text: "Сезонное меню, тосты и мягкая неоклассика под свечами." },
      { time: "20:30", title: "Торт и огни", text: "Сад зажигается: свечи, искры и первый танец." },
      { time: "21:00", title: "Танцы", text: "Плейлист становится смелее, ночь — длиннее." }
    ],

    /* --- SEED WISHES --- */
    wishes: [
      { author: "Анна и Дмитрий", text: "Пусть этот день станет первым кадром вашей самой длинной истории." },
      { author: "Мария Орлова", text: "Света, смеха и тех самых тихих утреней. Мы с вами." },
      { author: "Павел Соколов", text: "За дорогу, которая началась случайно и длится до сих пор." }
    ],

    /* --- MENU PREVIEW IMAGES --- */
    menu: {
      hero: IDS.coupleSunset,
      story: IDS.veilField,
      day: IDS.italyStreet,
      party: IDS.partyCrowd,
      rsvp: IDS.heartSunset
    }
  };
})();
