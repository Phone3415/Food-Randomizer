export interface SeedItem {
  id: string;
  name: string;
  category: string;
  imageFileName: string;
  svgContent: string;
}

export const SEED_FOODS: SeedItem[] = [
  {
    id: "seed-1",
    name: "ผัดไทยกุ้งสดโบราณ",
    category: "อาหารตามสั่ง & สตรีทฟู้ด",
    imageFileName: "seed-pad-thai.svg",
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" fill="#f8fafc"/>
      <circle cx="200" cy="200" r="140" fill="#fed7aa" stroke="#f97316" stroke-width="4"/>
      <ellipse cx="200" cy="200" rx="110" ry="80" fill="#ea580c"/>
      <path d="M120 180 Q160 140 220 170 T280 200" stroke="#fef08a" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M130 210 Q180 230 240 190 T270 230" stroke="#fef08a" stroke-width="10" fill="none" stroke-linecap="round"/>
      <circle cx="170" cy="180" r="16" fill="#f87171"/>
      <circle cx="230" cy="170" r="14" fill="#f87171"/>
      <circle cx="210" cy="220" r="15" fill="#f87171"/>
      <circle cx="160" cy="220" r="6" fill="#22c55e"/>
      <circle cx="240" cy="210" r="6" fill="#22c55e"/>
      <circle cx="190" cy="160" r="6" fill="#22c55e"/>
      <text x="200" y="360" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#64748b" text-anchor="middle">STREET FOOD</text>
    </svg>`,
  },
  {
    id: "seed-2",
    name: "ทาโกะยากิกรอบนอกนุ่มใน",
    category: "ของทานเล่น & อาหารว่าง",
    imageFileName: "seed-takoyaki.svg",
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" fill="#f8fafc"/>
      <rect x="70" y="140" width="260" height="150" rx="20" fill="#e2e8f0" stroke="#94a3b8" stroke-width="3"/>
      <circle cx="140" cy="190" r="34" fill="#d97706" stroke="#b45309" stroke-width="3"/>
      <circle cx="205" cy="185" r="34" fill="#d97706" stroke="#b45309" stroke-width="3"/>
      <circle cx="270" cy="190" r="34" fill="#d97706" stroke="#b45309" stroke-width="3"/>
      <circle cx="170" cy="245" r="34" fill="#d97706" stroke="#b45309" stroke-width="3"/>
      <circle cx="235" cy="245" r="34" fill="#d97706" stroke="#b45309" stroke-width="3"/>
      <path d="M120 185 Q140 170 160 190 M185 180 Q205 165 225 185 M250 185 Q270 170 290 190" stroke="#78350f" stroke-width="6" fill="none" stroke-linecap="round"/>
      <text x="200" y="360" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#64748b" text-anchor="middle">STREET FOOD</text>
    </svg>`,
  },
  {
    id: "seed-3",
    name: "ไก่สะเต๊ะเนื้อนุ่มน้ำจิ้มถั่ว",
    category: "อาหารตามสั่ง & สตรีทฟู้ด",
    imageFileName: "seed-satay.svg",
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" fill="#f8fafc"/>
      <ellipse cx="200" cy="210" rx="140" ry="100" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="3"/>
      <line x1="80" y1="280" x2="310" y2="120" stroke="#d97706" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="180" cy="210" rx="28" ry="16" transform="rotate(-30 180 210)" fill="#b45309"/>
      <ellipse cx="220" cy="185" rx="28" ry="16" transform="rotate(-30 220 185)" fill="#b45309"/>
      <ellipse cx="260" cy="160" rx="28" ry="16" transform="rotate(-30 260 160)" fill="#b45309"/>
      <circle cx="130" cy="170" r="35" fill="#fef3c7" stroke="#f59e0b" stroke-width="3"/>
      <circle cx="130" cy="170" r="26" fill="#d97706"/>
      <text x="200" y="360" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#64748b" text-anchor="middle">STREET FOOD</text>
    </svg>`,
  },
  {
    id: "seed-4",
    name: "เบอร์เกอร์เนื้อสแมชชีสเยิ้ม",
    category: "ฟาสต์ฟู้ด & จานด่วน",
    imageFileName: "seed-burger.svg",
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" fill="#f8fafc"/>
      <path d="M120 170 C120 110, 280 110, 280 170 Z" fill="#f59e0b" stroke="#d97706" stroke-width="4"/>
      <path d="M110 175 C130 190, 150 165, 170 180 C190 165, 210 190, 230 175 C250 190, 270 170, 290 180" stroke="#22c55e" stroke-width="12" fill="none" stroke-linecap="round"/>
      <rect x="125" y="190" width="150" height="14" rx="7" fill="#ef4444"/>
      <path d="M120 205 L280 205 L250 225 L180 215 L140 228 Z" fill="#facc15"/>
      <rect x="115" y="220" width="170" height="24" rx="10" fill="#78350f"/>
      <rect x="120" y="246" width="160" height="30" rx="15" fill="#f59e0b" stroke="#d97706" stroke-width="4"/>
      <text x="200" y="360" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#64748b" text-anchor="middle">FAST FOOD</text>
    </svg>`,
  },
  {
    id: "seed-5",
    name: "พิซซ่าเตาฟืนมาเกริต้า",
    category: "ฟาสต์ฟู้ด & จานด่วน",
    imageFileName: "seed-pizza.svg",
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" fill="#f8fafc"/>
      <circle cx="200" cy="200" r="130" fill="#d97706"/>
      <circle cx="200" cy="200" r="114" fill="#f59e0b"/>
      <circle cx="200" cy="200" r="98" fill="#ef4444"/>
      <circle cx="160" cy="170" r="18" fill="#fef08a"/>
      <circle cx="240" cy="180" r="16" fill="#fef08a"/>
      <circle cx="190" cy="230" r="20" fill="#fef08a"/>
      <circle cx="170" cy="210" r="8" fill="#16a34a"/>
      <circle cx="225" cy="215" r="9" fill="#16a34a"/>
      <circle cx="205" cy="165" r="8" fill="#16a34a"/>
      <text x="200" y="360" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#64748b" text-anchor="middle">FAST FOOD</text>
    </svg>`,
  },
  {
    id: "seed-6",
    name: "ราเมงทงคตสึเข้มข้นหมูชาชู",
    category: "ก๋วยเตี๋ยว & เมนูเส้น",
    imageFileName: "seed-ramen.svg",
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" fill="#f8fafc"/>
      <path d="M100 180 C100 290, 300 290, 300 180 Z" fill="#0f172a"/>
      <ellipse cx="200" cy="180" rx="100" ry="24" fill="#fef08a"/>
      <ellipse cx="160" cy="180" rx="24" ry="18" fill="#ffffff"/>
      <circle cx="160" cy="180" r="11" fill="#f97316"/>
      <circle cx="230" cy="175" r="22" fill="#b45309" stroke="#78350f" stroke-width="4"/>
      <circle cx="195" cy="170" r="6" fill="#22c55e"/>
      <circle cx="210" cy="190" r="6" fill="#22c55e"/>
      <line x1="80" y1="130" x2="320" y2="160" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
      <text x="200" y="360" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#64748b" text-anchor="middle">RAMEN</text>
    </svg>`,
  },
  {
    id: "seed-7",
    name: "ติ่มซำเสี่ยวหลงเปาน้ำซุปฉ่ำ",
    category: "อาหารตามสั่ง & สตรีทฟู้ด",
    imageFileName: "seed-dimsum.svg",
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" fill="#f8fafc"/>
      <circle cx="200" cy="200" r="130" fill="#fef3c7" stroke="#d97706" stroke-width="8"/>
      <ellipse cx="160" cy="165" rx="30" ry="24" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
      <ellipse cx="240" cy="165" rx="30" ry="24" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
      <ellipse cx="200" cy="230" rx="32" ry="26" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
      <circle cx="160" cy="155" r="4" fill="#ea580c"/>
      <circle cx="240" cy="155" r="4" fill="#ea580c"/>
      <circle cx="200" cy="220" r="4" fill="#ea580c"/>
      <text x="200" y="360" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#64748b" text-anchor="middle">DIM SUM</text>
    </svg>`,
  },
  {
    id: "seed-8",
    name: "โปเก้โบลแซลมอนสดคลีน",
    category: "เพื่อสุขภาพ & สลัด",
    imageFileName: "seed-poke.svg",
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" fill="#f8fafc"/>
      <circle cx="200" cy="200" r="130" fill="#f1f5f9" stroke="#94a3b8" stroke-width="4"/>
      <path d="M200 200 L110 200 A90 90 0 0 1 200 110 Z" fill="#fb7185"/>
      <path d="M200 200 L200 110 A90 90 0 0 1 290 200 Z" fill="#4ade80"/>
      <path d="M200 200 L290 200 A90 90 0 0 1 200 290 Z" fill="#fde047"/>
      <path d="M200 200 L200 290 A90 90 0 0 1 110 200 Z" fill="#a78bfa"/>
      <circle cx="200" cy="200" r="22" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
      <text x="200" y="360" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#64748b" text-anchor="middle">POKE BOWL</text>
    </svg>`,
  },
  {
    id: "seed-9",
    name: "ข้าวเหนียวมะม่วงอกร่องกะทิสด",
    category: "ของหวาน & เครื่องดื่ม",
    imageFileName: "seed-mango-rice.svg",
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" fill="#f8fafc"/>
      <ellipse cx="200" cy="210" rx="140" ry="90" fill="#15803d"/>
      <ellipse cx="150" cy="205" rx="45" ry="35" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <path d="M200 170 C240 160, 270 190, 250 230 C220 230, 210 190, 200 170 Z" fill="#facc15" stroke="#eab308" stroke-width="2"/>
      <path d="M225 185 C265 175, 290 205, 270 240 C240 240, 235 200, 225 185 Z" fill="#eab308"/>
      <path d="M130 195 Q150 185 170 200" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round"/>
      <text x="200" y="360" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#64748b" text-anchor="middle">DESSERT</text>
    </svg>`,
  },
  {
    id: "seed-10",
    name: "วาฟเฟิลเบลเยียมราดช็อกโกแลต",
    category: "ของหวาน & เครื่องดื่ม",
    imageFileName: "seed-waffle.svg",
    svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" fill="#f8fafc"/>
      <rect x="110" y="110" width="180" height="180" rx="16" fill="#f59e0b" stroke="#b45309" stroke-width="4"/>
      <rect x="130" y="130" width="30" height="30" fill="#d97706" rx="4"/>
      <rect x="170" y="130" width="30" height="30" fill="#d97706" rx="4"/>
      <rect x="210" y="130" width="30" height="30" fill="#d97706" rx="4"/>
      <rect x="130" y="170" width="30" height="30" fill="#d97706" rx="4"/>
      <rect x="170" y="170" width="30" height="30" fill="#d97706" rx="4"/>
      <rect x="210" y="170" width="30" height="30" fill="#d97706" rx="4"/>
      <rect x="130" y="210" width="30" height="30" fill="#d97706" rx="4"/>
      <rect x="170" y="210" width="30" height="30" fill="#d97706" rx="4"/>
      <rect x="210" y="210" width="30" height="30" fill="#d97706" rx="4"/>
      <circle cx="245" cy="140" r="14" fill="#ef4444"/>
      <text x="200" y="360" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#64748b" text-anchor="middle">WAFFLE</text>
    </svg>`,
  },
];
