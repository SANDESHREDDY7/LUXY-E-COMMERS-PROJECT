export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  collections: string;
  details: string[];
  colors: string[] | string;
  colorList?: string[];
  detailList?: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Midnight Elegance",
    price: 4500,
    description: "Exquisite black leather handbag with gold hardware",
    image: "https://images.unsplash.com/photo-1773777145747-b5b7356f4e81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkZXNpZ25lciUyMGhhbmRiYWclMjBibGFja3xlbnwxfHx8fDE3NzUwMzEzMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    collections: "Handbags",
    details: [
      "Premium Italian leather",
      "24K gold-plated hardware",
      "Handcrafted detailing",
      "Interior zip pocket",
      "Adjustable shoulder strap"
    ],
    colors: ["Black", "Midnight Blue"]
  },
  {
    id: 2,
    name: "Sahara Dreams",
    price: 3800,
    description: "Timeless beige leather bag with minimalist design",
    image: "https://images.unsplash.com/photo-1762019108554-51759e47148a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsZWF0aGVyJTIwYmFnJTIwYmVpZ2V8ZW58MXx8fHwxNzc1MTExMDk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    collections: "Crossbody",
    details: [
      "Soft calfskin leather",
      "Magnetic closure",
      "Multiple compartments",
      "Detachable chain strap",
      "Limited edition"
    ],
    colors: ["Beige", "Camel", "Sand"]
  },
  {
    id: 3,
    name: "Pearl Essence",
    price: 5200,
    description: "Sophisticated white designer purse with pearl accents",
    image: "https://images.unsplash.com/photo-1774259479601-69a44c70bed1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHB1cnNlJTIwd2hpdGUlMjBlbGVnYW50fGVufDF8fHx8MTc3NTExMTA5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    collections: "Evening",
    details: [
      "Pristine white leather",
      "Pearl embellishments",
      "Silk-lined interior",
      "Gold chain strap",
      "Evening collection"
    ],
    colors: ["White", "Ivory"]
  },
  {
    id: 4,
    name: "Heritage Classic",
    price: 4200,
    description: "Rich brown leather handbag with vintage charm",
    image: "https://images.unsplash.com/photo-1691480150204-66dd1eb77391?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoYW5kYmFnJTIwYnJvd24lMjBsZWF0aGVyfGVufDF8fHx8MTc3NTExMTA5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    collections: "Tote",
    details: [
      "Full-grain leather",
      "Antique brass hardware",
      "Spacious interior",
      "Top handles",
      "Heritage collection"
    ],
    colors: ["Chocolate", "Cognac", "Mahogany"]
  },
  {
    id: 5,
    name: "Rouge Passion",
    price: 4800,
    description: "Bold red designer bag for the modern woman",
    image: "https://images.unsplash.com/photo-1773865305860-a7fe9a248f25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGJhZyUyMHJlZCUyMGx1eHVyeXxlbnwxfHx8fDE3NzUxMTEwOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    collections: "Statement",
    details: [
      "Vibrant red leather",
      "Contemporary design",
      "Silver hardware",
      "Convertible straps",
      "Modern collection"
    ],
    colors: ["Red", "Burgundy"]
  },
  {
    id: 6,
    name: "Ivory Grace",
    price: 3600,
    description: "Elegant cream tote bag for everyday luxury",
    image: "https://images.unsplash.com/photo-1611881290645-ed703c866fa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0b3RlJTIwYmFnJTIwY3JlYW18ZW58MXx8fHwxNzc1MTExMDk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    collections: "Tote",
    details: [
      "Cream pebbled leather",
      "Reinforced handles",
      "Inner pockets",
      "Lightweight design",
      "Everyday collection"
    ],
    colors: ["Cream", "Off-White", "Vanilla"]
  }
];
