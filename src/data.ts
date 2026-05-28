import { Sneaker } from './types';
import giannis from './assets/giannis-immortality-white.png';
import nikeJa3 from './assets/nike-ja3.png';
import sabrina2Mismatched from './assets/2.png';
import sabrina2Miracle from './assets/3.png';
import giannisGreyOrange from './assets/4.png';

export const SNEAKERS_DATA: Sneaker[] = [
  {
    id: 'air-flight-x',
    name: 'GIANNIS IMMORTALITY 4',
    price: 220,
    description: 'Built for the asphalt. Engineered for the air. The Giannis Immortality 4 combines brutalist design logic with premium streetwear materials for uncompromising court performance and unmatched response.',
    image: giannis,
    badge: 'NEW DROP',
    bgDecorative: 'bg-accent-red/20',
    gallery: [
      giannis,
      'https://lh3.googleusercontent.com/aida-public/AB6AXuArDV_V1tgULAmlXObs30QiY7Oj1Q_SnnlkY91JJp5yHM5KFWLe461Xz0FcRrfQVjKKfDHCkAETVas89NohsOO63OjXX7HqIUBmg2X-rGUJJ_sNihtJFMJJj3pohITafQcW8_zPscLMWAWg1ppCLtFGKS3gHekBcgB__7tkz4NFT3oHRwXITB9VsmQHnsojcaRkyAxDgGRgNijB2sHjkzDRHOYkpXt7ckC5C-mcVLJt1FDnBHiobrssvQisqHu5SYaI4VqbYRNCTY0',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAg8ciBPk8dMTwlKXcgQilqvtCuldGi9Bd0oBaQ3nweaeAg2zOTZf08E0QyqImpPPmHPwEG8Z9s1Msl_Q-f_BU8KbFC02GM5lwnOpK8jUB-6eiZkwwdeyC_CWU0RE3zCFaZqff9cbh_8I4DgRxdli07Bat5t_iUvNfkRrxxaq7Kd8vuEmw3yLEROzoCrpDGnf1VpZVmcUEDeIy5zjAX8eSCn5N1iyd2dl0UO6YxatLZ5kBe_AMjmeKV7Icq5dZwgtw0LK78Vzrugqk'
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    color: 'Summit White'
  },
  {
    id: 'giannis-freak-7',
    name: 'GIANNIS FREAK 7 EP',
    price: 110,
    description: 'A striking performance shoe designed to amplify your court speed and quick cuts, featuring active response Zoom Air cushioning and a lightweight, breathable structured upper with neon orange accent Swooshes.',
    image: giannisGreyOrange,
    badge: 'NEW',
    gallery: [
      giannisGreyOrange
    ],
    sizes: [8, 9, 9.5, 10, 11],
    color: 'Light Grey / Orange'
  },
  {
    id: 'sabrina-3-what-the',
    name: 'SABRINA 3 \'WHAT THE?\' EP',
    price: 140,
    description: 'A spectacular mismatched dual-shoe design for elite ballers. Featuring asymmetrical color blocking, responsive lateral lockdown, and dynamic traction. Masterfully crafted to stand out on the court.',
    image: sabrina2Mismatched,
    badge: 'HOT',
    gallery: [
      sabrina2Mismatched
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    color: 'Mismatched Teal / Violet'
  },
  {
    id: 'nike-ja-2',
    name: 'NIKE JA 2 \'MISMAPPED\'',
    price: 210,
    description: 'A striking, asymmetrical masterpiece showcasing an explosive contrast between neon yellow and bright electric pink. Features active ZoomX responsive court cushioning and premium micro-textured traction overlay.',
    image: nikeJa3,
    badge: 'EXCLUSIVE',
    gallery: [
      nikeJa3
    ],
    sizes: [8, 9, 10, 11],
    color: 'Mismatched Pink / Neon'
  },
  {
    id: 'sabrina-3',
    name: 'SABRINA 3 EP',
    price: 110,
    description: 'Dressed in a rich, warm peach and coral hue with an iconic micro-textured black Swoosh. This low-profile signature sneaker offers exceptional lateral lockdown and explosive energy return for lightning-fast guards.',
    image: sabrina2Miracle,
    badge: 'EXCLUSIVE',
    gallery: [
      sabrina2Miracle
    ],
    sizes: [7, 8, 9, 10, 11, 12],
    color: 'Miracle Peach / Coral'
  }
];

export const RECENT_SNAPS_DATA = [
  {
    id: 'chicago-high',
    name: 'Air Retro 1 High "Chicago"',
    price: 450,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfLaOi8zVV0n9VwOW5GPmEP96uRUh3XNzVJ7KR5hruYhmqFDOIYnPgbDhT53AtMLK45SP2oQZfyBDifF2ejoqmtKCobFFPYezGsgNpRQ1sc5nujl76eMhlHSyO7Ih_dTkbx1TAjGBetAxGJ6vTNr7Aj8R475NQJwGPCKYtc_DZs6jIylyV4DOy9urOQg8xa2JQQnMLtrJK6BNvZzAZbeECJEVDPpq4qmiI8uLt7KC8ZqvwWpNW3NQ7hUOd7tLpw1yByAkCNaBoDM8',
    size: 9.5
  },
  {
    id: 'panda-low',
    name: 'Court Vision Low "Panda"',
    price: 120,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2yj5btzFA3Q52w835Ha0iDkLUqH1e4bnTgnkpsqWanAIOXTYfyz9_N-t2OL3lmpM-hCh4XWVBaJGOnJVMQxiJMw4YUfIg3HNtchjuwGJAcPWIr3OJ2ktvxzxvBBMAAxEQiByypUslWDRACSai7umRTyiZqvq1kyo4oY8vgsTeOXhaLyju82kPTfn49cm0Wq-3wR-vTcuKVc8Sp4SZnb-PE2nPaREP2LyDsF_gNbHQN3ePEgrXjxAzQMi0TyIwCzfkuuhJ1A9db8k',
    size: 10
  },
  {
    id: 'volt-heavy',
    name: 'Streetball Heavy "Volt"',
    price: 180,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn_7s8Cky04j7r3jIrfuMpZz_A5h65GJBwKUG_JS8hlTyHJfM22GBfUtJp3abcSVmronSMIv8mUzsoTVdN-prSBTnOKl4To4w0ygsRxewz7NrjldpkXwq18TOxTOKAKnVEOvecKg_3sSaCQ20EzomW27yd4-okMeUVaX0PJsdgLqE5riYvrBqhcpetz4ArD_r841gjNgiSmH4lqNcCWQiL_0wozBkkOeJQ3W63-ForTqD0cjUcp1KJ9fAw1PLH64Qr92A-k7-BORw',
    size: 9
  }
];
