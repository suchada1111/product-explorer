import { z } from "zod";

export const CATEGORIES = [
  "beauty", "fragrances", "furniture", "groceries",
  "home-decoration", "kitchen-accessories", "laptops",
  "mens-shirts", "mens-shoes", "mens-watches",
  "mobile-accessories", "motorcycle", "skin-care",
  "smartphones", "sports-accessories", "sunglasses",
  "tablets", "tops", "vehicle", "womens-bags",
  "womens-dresses", "womens-jewellery", "womens-shoes", "womens-watches",
] as const;

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string().trim().min(1, "กรุณากรอกชื่อสินค้า"),
  price: z.number({ error: "กรุณากรอกราคา" }).min(0, "ราคาต้องไม่ติดลบ"),
  stock: z
    .number({ error: "กรุณากรอกจำนวนคงเหลือ" })
    .int("จำนวนคงเหลือต้องเป็นจำนวนเต็ม")
    .min(0, "จำนวนคงเหลือต้องไม่ติดลบ"),
  category: z.enum(CATEGORIES, { error: "กรุณาเลือกหมวดหมู่" }),
  thumbnail: z.string().optional(),
});

export const ProductListSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductList = z.infer<typeof ProductListSchema>;

export const ProductDraftSchema = ProductSchema.omit({ id: true });
export type ProductDraft = z.infer<typeof ProductDraftSchema>;

const API_BASE = "https://dummyjson.com";
export const SORT_FIELDS = ["title", "price", "stock"] as const;

export const SearchQuerySchema = z.object({
  q: z.string().trim(),
  limit: z
    .number({ error: "กรุณากรอกจำนวนรายการ" })
    .int("จำนวนรายการต้องเป็นจำนวนเต็ม")
    .min(1, "อย่างน้อย 1 รายการ")
    .max(30, "ไม่เกิน 30 รายการ"),
  sortBy: z.enum(SORT_FIELDS),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export const defaultQuery: SearchQuery = {
  q: "",
  limit: 10,
  sortBy: "title",
};

// พจนานุกรมแปลคำค้นหาภาษาไทยครอบคลุมทุกหมวดหมู่
const THAI_TO_EN_DICTIONARY: Record<string, string> = {
  // มือถือ / แกดเจ็ต / คอมพิวเตอร์
  "โทรศัพท์": "phone",
  "มือถือ": "phone",
  "สมาร์ตโฟน": "smartphone",
  "สมาร์ทโฟน": "smartphone",
  "ไอโฟน": "iphone",
  "ซัมซุง": "samsung",
  "แท็บเล็ต": "tablet",
  "แทบเล็ต": "tablet",
  "ไอแพด": "ipad",
  "คอม": "laptop",
  "คอมพิวเตอร์": "laptop",
  "โน้ตบุ๊ก": "laptop",
  "โน๊ตบุ๊ค": "laptop",
  "เคส": "case",
  "สายชาร์จ": "charger",
  "หัวชาร์จ": "charger",
  "หูฟัง": "headphone",
  "อุปกรณ์เสริม": "accessories",

  // ความงาม / เครื่องสำอาง / ดูแลผิว
  "ความงาม": "beauty",
  "เครื่องสำอาง": "beauty",
  "เมคอัพ": "makeup",
  "ลิป": "lipstick",
  "ลิปสติก": "lipstick",
  "น้ำหอม": "perfume",
  "หอม": "perfume",
  "บำรุงผิว": "skin",
  "สกินแคร์": "skin care",
  "ครีม": "cream",
  "เซรั่ม": "serum",
  "มาสคาร่า": "mascara",
  "แป้ง": "powder",
  "อายแชโดว์": "eyeshadow",
  "ยาทาเล็บ": "nail",

  // เสื้อผ้า / แฟชั่น
  "เสื้อ": "shirt",
  "เสื้อผ้า": "shirt",
  "เสื้อเชิ้ต": "shirt",
  "เสื้อยืด": "t-shirt",
  "กางเกง": "pants",
  "กระโปรง": "dress",
  "ชุดเดรส": "dress",
  "เดรส": "dress",
  "ชุดนอน": "dress",
  "เสื้อผู้ชาย": "men shirt",
  "เสื้อผู้หญิง": "women",

  // รองเท้า / กระเป๋า / เครื่องประดับ
  "รองเท้า": "shoes",
  "รองเท้าผ้าใบ": "sneaker",
  "รองเท้าแตะ": "shoes",
  "รองเท้าผู้หญิง": "women shoes",
  "รองเท้าผู้ชาย": "men shoes",
  "กระเป๋า": "bag",
  "กระเป๋าสะพาย": "bag",
  "กระเป๋าถือ": "bag",
  "กระเป๋าตังค์": "bag",
  "กระเป๋าสตางค์": "wallet",
  "กระเป๋าเป้": "backpack",
  "นาฬิกา": "watch",
  "นาฬิกาข้อมือ": "watch",
  "แว่น": "sunglasses",
  "แว่นตา": "sunglasses",
  "แว่นกันแดด": "sunglasses",
  "เครื่องประดับ": "jewellery",
  "สร้อย": "necklace",
  "แหวน": "ring",
  "ต่างหู": "earring",
  "กำไล": "bracelet",

  // เฟอร์นิเจอร์ / ของตกแต่งบ้าน / เครื่องครัว
  "บ้าน": "home",
  "แต่งบ้าน": "home decoration",
  "ของแต่งบ้าน": "home decoration",
  "เฟอร์นิเจอร์": "furniture",
  "โต๊ะ": "table",
  "เก้าอี้": "chair",
  "โซฟา": "sofa",
  "เตียง": "bed",
  "ที่นอน": "bed",
  "ตู้": "cabinet",
  "ชั้นวาง": "shelf",
  "โคมไฟ": "lamp",
  "ครัว": "kitchen",
  "เครื่องครัว": "kitchen",
  "ของใช้ในครัว": "kitchen accessories",
  "กระทะ": "pan",
  "หม้อ": "pot",
  "จาน": "plate",
  "ชาม": "bowl",
  "ช้อน": "spoon",
  "แก้ว": "cup",
  "แก้วน้ำ": "glass",

  // อาหาร / ของกิน / ซูเปอร์มาร์เก็ต
  "อาหาร": "food",
  "ของกิน": "grocery",
  "ผลไม้": "fruit",
  "ผัก": "vegetable",
  "เนื้อ": "meat",
  "ไข่": "egg",
  "ปลา": "fish",
  "ขนม": "snack",
  "น้ำ": "water",
  "เครื่องดื่ม": "drink",
  "กาแฟ": "coffee",
  "ชา": "tea",

  // ยานพาหนะ
  "รถ": "car",
  "รถยนต์": "vehicle",
  "มอเตอร์ไซค์": "motorcycle",
  "มอไซค์": "motorcycle",
  "มอไซ": "motorcycle",
  "จักรยาน": "bike",

  // กีฬา
  "กีฬา": "sports",
  "ออกกำลังกาย": "sports",
  "ฟิตเนส": "fitness",
};

// ฟังก์ชันค้นหาคำแปลภาษาไทยเป็นภาษาอังกฤษ
export function translateThaiSearch(input: string): string {
  const clean = input.trim().toLowerCase();
  if (!clean) return "";

  // 1. ตรวจสอบว่าตรงกับคีย์เวิร์ดในพจนานุกรมเป๊ะๆ หรือไม่
  if (THAI_TO_EN_DICTIONARY[clean]) {
    return THAI_TO_EN_DICTIONARY[clean];
  }

  // 2. ตรวจสอบว่ามีคำสำคัญบางส่วนอยู่ในข้อความที่พิมพ์มาหรือไม่
  for (const [thaiWord, enWord] of Object.entries(THAI_TO_EN_DICTIONARY)) {
    if (clean.includes(thaiWord)) {
      return enWord;
    }
  }

  return clean;
}

export function buildProductUrl(query: SearchQuery): string {
  const params = new URLSearchParams();
  const searchTerm = translateThaiSearch(query.q);

  params.set("q", searchTerm);
  params.set("limit", String(query.limit));
  params.set("sortBy", query.sortBy);
  params.set("order", "asc");
  params.set("select", "title,price,stock,category,thumbnail");
  return `${API_BASE}/products/search?${params.toString()}`;
}

export async function fetchProducts(query: SearchQuery): Promise<ProductList> {
  const response = await fetch(buildProductUrl(query));
  if (!response.ok) {
    throw new Error(`เรียกข้อมูลไม่สำเร็จ สถานะ ${response.status}`);
  }
  const data = await response.json();
  const result = ProductListSchema.safeParse(data);
  if (!result.success) {
    throw new Error("รูปแบบข้อมูลที่ได้รับไม่ตรงกับที่กำหนดไว้");
  }
  return result.data;
}