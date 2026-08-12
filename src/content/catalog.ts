/**
 * Static content catalogue for Prasanna Trends.
 * This is the "admin managed" content that gets seeded into PostgreSQL on
 * first boot, then served to the mobile app through /api/bootstrap.
 */

export const px = (id: number, w = 900, h = 1350) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export const thumb = (id: number) => px(id, 420, 630);

export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", isDefault: true, isActive: true, completion: 100 },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", isDefault: false, isActive: true, completion: 92 },
  { code: "mr", name: "Marathi", nativeName: "मराठी", isDefault: false, isActive: true, completion: 78 },
];

export const CATEGORIES = [
  {
    slug: "clothing",
    name: "Clothing",
    nameHi: "वस्त्र",
    nameMr: "वस्त्र",
    emoji: "🧵",
    tagline: "Sarees, blouses, lehengas & more",
    cover: px(35108809, 800, 800),
    accent: "#E7A17A",
    displayOrder: 1,
    isFeatured: true,
    isActive: true,
    comingSoon: false,
  },
  {
    slug: "jewellery",
    name: "Jewellery",
    nameHi: "आभूषण",
    nameMr: "दागिने",
    emoji: "💎",
    tagline: "Temple gold, jhumkas, bridal sets",
    cover: px(29038003, 800, 800),
    accent: "#E9C46A",
    displayOrder: 2,
    isFeatured: true,
    isActive: true,
    comingSoon: false,
  },
  {
    slug: "mehendi",
    name: "Mehendi & Rangoli",
    nameHi: "मेहंदी और रंगोली",
    nameMr: "मेहंदी आणि रांगोळी",
    emoji: "🪷",
    tagline: "Launching soon — added by admin",
    cover: px(13102907, 800, 800),
    accent: "#B5838D",
    displayOrder: 3,
    isFeatured: false,
    isActive: true,
    comingSoon: true,
  },
];

export const SUBCATEGORIES = [
  { slug: "sarees", categorySlug: "clothing", name: "Sarees", nameHi: "साड़ी", nameMr: "साडी", cover: thumb(28943474), displayOrder: 1 },
  { slug: "blouses", categorySlug: "clothing", name: "Blouses & Cholis", nameHi: "ब्लाउज", nameMr: "ब्लाउज", cover: thumb(34037596), displayOrder: 2 },
  { slug: "lehengas", categorySlug: "clothing", name: "Lehengas", nameHi: "लहंगा", nameMr: "लेहंगा", cover: thumb(33101418), displayOrder: 3 },
  { slug: "kurtas", categorySlug: "clothing", name: "Kurtas & Kurtis", nameHi: "कुर्ता", nameMr: "कुर्ता", cover: thumb(35521738), displayOrder: 4 },
  { slug: "mens-wear", categorySlug: "clothing", name: "Men's Wear", nameHi: "पुरुष वस्त्र", nameMr: "पुरुष वस्त्र", cover: thumb(35542177), displayOrder: 5 },
  { slug: "necklaces", categorySlug: "jewellery", name: "Necklaces", nameHi: "हार", nameMr: "हार", cover: thumb(28347073), displayOrder: 1 },
  { slug: "earrings", categorySlug: "jewellery", name: "Earrings", nameHi: "कान की बाली", nameMr: "कर्णफुले", cover: thumb(37601639), displayOrder: 2 },
  { slug: "bangles", categorySlug: "jewellery", name: "Bangles & Bracelets", nameHi: "चूड़ियाँ", nameMr: "बांगड्या", cover: thumb(35059564), displayOrder: 3 },
  { slug: "rings", categorySlug: "jewellery", name: "Rings", nameHi: "अंगूठी", nameMr: "अंगठी", cover: thumb(35270153), displayOrder: 4 },
  { slug: "bridal-sets", categorySlug: "jewellery", name: "Bridal Sets", nameHi: "दुल्हन सेट", nameMr: "वधू संच", cover: thumb(29038003), displayOrder: 5 },
];

export const COLLECTIONS = [
  { slug: "kanjeevaram-classics", categorySlug: "clothing", subcategorySlug: "sarees", name: "Kanjeevaram Classics", nameHi: "कांजीवरम क्लासिक्स", nameMr: "कांजीवरम क्लासिक्स", cover: thumb(17040892), blurb: "Zari borders, temple motifs, wedding silks", isFeatured: true, displayOrder: 1 },
  { slug: "festive-georgette", categorySlug: "clothing", subcategorySlug: "sarees", name: "Festive Georgette", nameHi: "फेस्टिव जॉर्जेट", nameMr: "फेस्टिव्ह जॉर्जेट", cover: thumb(7920055), blurb: "Light drapes for haldi, sangeet & pooja", isFeatured: false, displayOrder: 2 },
  { slug: "bridal-blouse", categorySlug: "clothing", subcategorySlug: "blouses", name: "Bridal Blouse Designs", nameHi: "ब्राइडल ब्लाउज डिज़ाइन", nameMr: "वधू ब्लाउज डिझाईन", cover: thumb(37439026), blurb: "Aari work, maggam, mirror & cutwork backs", isFeatured: true, displayOrder: 1 },
  { slug: "everyday-necklines", categorySlug: "clothing", subcategorySlug: "blouses", name: "Everyday Necklines", nameHi: "रोज़ के नेकलाइन", nameMr: "रोजचे नेकलाइन", cover: thumb(29105314), blurb: "Boat neck, collar & simple piping patterns", isFeatured: false, displayOrder: 2 },
  { slug: "bridal-lehenga-couture", categorySlug: "clothing", subcategorySlug: "lehengas", name: "Bridal Lehenga Couture", nameHi: "ब्राइडल लहंगा कॉउचर", nameMr: "वधू लेहंगा कॉउचर", cover: thumb(33101418), blurb: "Hand embroidered bridal panels & dupattas", isFeatured: true, displayOrder: 1 },
  { slug: "chikankari-edit", categorySlug: "clothing", subcategorySlug: "kurtas", name: "Chikankari Edit", nameHi: "चिकनकारी एडिट", nameMr: "चिकनकारी एडिट", cover: thumb(28512776), blurb: "Soft threadwork kurtas for daily wear", isFeatured: false, displayOrder: 1 },
  { slug: "sherwani-sets", categorySlug: "clothing", subcategorySlug: "mens-wear", name: "Sherwani & Kurta Sets", nameHi: "शेरवानी सेट", nameMr: "शेरवानी संच", cover: thumb(12779726), blurb: "Groom & family wedding looks", isFeatured: true, displayOrder: 1 },
  { slug: "nehru-jackets", categorySlug: "clothing", subcategorySlug: "mens-wear", name: "Festive Nehru Jackets", nameHi: "नेहरू जैकेट", nameMr: "नेहरू जॅकेट", cover: thumb(6468525), blurb: "Layered festive looks for men", isFeatured: false, displayOrder: 2 },
  { slug: "temple-gold-haram", categorySlug: "jewellery", subcategorySlug: "necklaces", name: "Temple Gold Haram", nameHi: "टेम्पल गोल्ड हार", nameMr: "टेंपल गोल्ड हार", cover: thumb(28347073), blurb: "Antique finish long haram & lakshmi kasu", isFeatured: true, displayOrder: 1 },
  { slug: "minimal-chains", categorySlug: "jewellery", subcategorySlug: "necklaces", name: "Minimal Everyday Chains", nameHi: "मिनिमल चेन", nameMr: "मिनिमल चेन", cover: thumb(10117804), blurb: "Office & daily wear light gold", isFeatured: false, displayOrder: 2 },
  { slug: "jhumka-collection", categorySlug: "jewellery", subcategorySlug: "earrings", name: "Jhumka Collection", nameHi: "झुमका कलेक्शन", nameMr: "झुमका कलेक्शन", cover: thumb(37601639), blurb: "Chandbali, jhumka & chandelier drops", isFeatured: true, displayOrder: 1 },
  { slug: "bridal-bangle-stacks", categorySlug: "jewellery", subcategorySlug: "bangles", name: "Bridal Bangle Stacks", nameHi: "ब्राइडल चूड़ी सेट", nameMr: "वधू बांगडी संच", cover: thumb(37035227), blurb: "Kada, bangle sets & chooda styling", isFeatured: false, displayOrder: 1 },
  { slug: "diamond-solitaires", categorySlug: "jewellery", subcategorySlug: "rings", name: "Diamond Solitaires", nameHi: "डायमंड सॉलिटेयर", nameMr: "डायमंड सॉलिटेअर", cover: thumb(35270153), blurb: "Engagement & anniversary rings", isFeatured: true, displayOrder: 1 },
  { slug: "everyday-stackables", categorySlug: "jewellery", subcategorySlug: "rings", name: "Everyday Stackables", nameHi: "डेली स्टैकेबल", nameMr: "डेली स्टॅकेबल", cover: thumb(10897815), blurb: "Slim bands you can wear together", isFeatured: false, displayOrder: 2 },
  { slug: "complete-bridal-sets", categorySlug: "jewellery", subcategorySlug: "bridal-sets", name: "Complete Bridal Sets", nameHi: "पूर्ण दुल्हन सेट", nameMr: "संपूर्ण वधू संच", cover: thumb(29038003), blurb: "Head to toe bridal jewellery styling", isFeatured: true, displayOrder: 1 },
];

type DesignSeed = {
  code: string;
  title: string;
  titleHi?: string;
  titleMr?: string;
  description: string;
  descriptionHi?: string;
  categorySlug: string;
  subcategorySlug: string;
  collectionSlug: string;
  image: string;
  thumb: string;
  isPremium: boolean;
  requiredPlan: string | null;
  allowDownload: boolean;
  allowShare: boolean;
  watermark: boolean;
  colour: string;
  style: string;
  material: string;
  occasion: string;
  gender: string;
  tags: string[];
  views: number;
  downloads: number;
  shares: number;
  favourites: number;
  status: string;
  isFeatured: boolean;
  isTrending: boolean;
  publishedAt: Date;
};

let seq = 0;
const mk = (
  prefix: string,
  title: string,
  sub: string,
  coll: string,
  img: number,
  premium: boolean,
  colour: string,
  style: string,
  material: string,
  occasion: string,
  gender: string,
  tags: string[],
  extra: Partial<DesignSeed> = {},
): DesignSeed => {
  seq += 1;
  const n = seq;
  const cat = ["sarees", "blouses", "lehengas", "kurtas", "mens-wear"].includes(sub) ? "clothing" : "jewellery";
  return {
    code: `${prefix}-${String(1000 + n)}`,
    title,
    description:
      extra.description ??
      `${title} — a curated ${occasion.toLowerCase()} reference from the ${coll.replace(/-/g, " ")} line. Crafted in ${material.toLowerCase()} with a ${style.toLowerCase()} silhouette, ideal to share with your tailor or karigar.`,
    categorySlug: cat,
    subcategorySlug: sub,
    collectionSlug: coll,
    image: px(img),
    thumb: thumb(img),
    isPremium: premium,
    requiredPlan: premium ? "basic-monthly" : null,
    allowDownload: extra.allowDownload ?? true,
    allowShare: extra.allowShare ?? true,
    watermark: premium,
    colour,
    style,
    material,
    occasion,
    gender,
    tags,
    views: 240 + ((n * 733) % 9200),
    downloads: 12 + ((n * 197) % 940),
    shares: 4 + ((n * 71) % 260),
    favourites: 8 + ((n * 113) % 620),
    status: "published",
    isFeatured: n % 7 === 0,
    isTrending: n % 5 === 0,
    publishedAt: new Date(Date.now() - n * 36 * 3600 * 1000),
    ...extra,
  };
};

export const DESIGNS: DesignSeed[] = [
  // ---- Sarees / Kanjeevaram
  mk("PT-SR", "Maroon Kanjeevaram with Temple Zari", "sarees", "kanjeevaram-classics", 17040892, true, "Maroon", "Traditional", "Kanjeevaram Silk", "Wedding", "Women", ["saree", "kanjeevaram", "zari", "bridal", "silk"], { titleHi: "मैरून कांजीवरम टेंपल ज़री", titleMr: "मरून कांजीवरम टेंपल जरी" }),
  mk("PT-SR", "Ivory Gold Tissue Drape", "sarees", "kanjeevaram-classics", 37054322, true, "Ivory", "Contemporary", "Tissue Silk", "Reception", "Women", ["saree", "tissue", "gold", "reception"], { titleHi: "आइवरी गोल्ड टिशू साड़ी" }),
  mk("PT-SR", "Rose Pink Silk with Buttis", "sarees", "kanjeevaram-classics", 35108809, false, "Pink", "Traditional", "Pure Silk", "Festival", "Women", ["saree", "pink", "butti", "festival"], { titleHi: "गुलाबी सिल्क बूटी साड़ी", titleMr: "गुलाबी सिल्क बुट्टी साडी" }),
  mk("PT-SR", "Rani Red Bridal Kanjeevaram", "sarees", "kanjeevaram-classics", 28943543, true, "Red", "Bridal", "Kanjeevaram Silk", "Wedding", "Women", ["saree", "red", "bridal", "muhurtham"]),
  mk("PT-SR", "Emerald Georgette with Sequin Pallu", "sarees", "festive-georgette", 7920055, false, "Green", "Contemporary", "Georgette", "Sangeet", "Women", ["saree", "georgette", "sequin", "party"]),
  mk("PT-SR", "Runway Drape with Gold Belt", "sarees", "festive-georgette", 20957555, true, "Gold", "Indo-Western", "Satin Georgette", "Reception", "Women", ["saree", "belt", "runway", "designer"]),
  mk("PT-SR", "Dual Tone Pink & Blue Silk", "sarees", "festive-georgette", 35108855, false, "Multicolour", "Traditional", "Art Silk", "Festival", "Women", ["saree", "dual tone", "festive"]),
  mk("PT-SR", "Mustard Chiffon with Thread Border", "sarees", "festive-georgette", 38969253, false, "Yellow", "Casual", "Chiffon", "Haldi", "Women", ["saree", "haldi", "chiffon", "yellow"]),
  mk("PT-SR", "Outdoor Shoot Cotton Silk", "sarees", "festive-georgette", 37054318, false, "Beige", "Casual", "Cotton Silk", "Daily", "Women", ["saree", "cotton", "daily", "handloom"]),
  // ---- Blouses (studio design references, not model portraits)
  mk("PT-BL", "Aari Work Deep-U Back Blouse", "blouses", "bridal-blouse", 37439026, true, "Maroon", "Bridal", "Raw Silk", "Wedding", "Women", ["blouse", "back neck", "aari", "tassels", "bridal"], {
    titleHi: "आरी वर्क डीप-U बैक ब्लाउज",
    titleMr: "आरी वर्क डीप-U बॅक ब्लाउज",
    description: "Deep U-shaped back neckline outlined in gold aari embroidery, with zardosi floral vine work across the shoulder blades and pearl drops along the tie strings. Elbow-length sleeves with matching embroidered cuffs. Back view so the cut and stitch layout are clear for your tailor.",
  }),
  mk("PT-BL", "Gold Zardosi Sweetheart Blouse", "blouses", "bridal-blouse", 34037596, true, "Maroon", "Bridal", "Velvet", "Wedding", "Women", ["blouse", "zardosi", "sweetheart", "handwork", "bridal"], {
    titleHi: "गोल्ड ज़रदोज़ी स्वीटहार्ट ब्लाउज",
    description: "Maroon velvet bodice with a sweetheart neckline and symmetrical mango-paisley zardosi hand embroidery, finished with mirror, stone and bead scatter work. Front close-up for neckline and bodice panel reference.",
  }),
  mk("PT-BL", "Peacock Maggam Back Neck Detail", "blouses", "bridal-blouse", 9496723, true, "Green", "Bridal", "Kanjeevaram Silk", "Wedding", "Women", ["blouse", "maggam", "peacock", "back neck", "keyhole"], {
    titleHi: "पीकॉक मग्गम बैक नेक डिज़ाइन",
    description: "Peacock-motif maggam back neck worked in gold zari over green Kanjeevaram silk, with mirror accents and pearl drops along the edge. Keyhole opening fastened with a gold potli button and thread loop. Back reference for the karigar.",
  }),
  mk("PT-BL", "Mirror & Kundan Boat Neckline", "blouses", "bridal-blouse", 37597730, true, "Red", "Bridal", "Brocade", "Wedding", "Women", ["blouse", "mirror", "kundan", "boat neck", "piping"], {
    titleHi: "मिरर और कुंदन बोट नेकलाइन",
    description: "High boat neckline on red brocade, edged with round mirror work and gold-set kundan stones over a geometric chain-stitch band. Neat seam and piping construction visible along the collarbone line, styled with a temple choker.",
  }),
  mk("PT-BL", "Emerald Boat Neck — Everyday", "blouses", "everyday-necklines", 29105314, false, "Green", "Minimal", "Cotton Silk", "Daily", "Women", ["blouse", "boat neck", "piping", "simple", "floral"], {
    titleHi: "एमराल्ड बोट नेक — रोज़ाना",
    titleMr: "एमराल्ड बोट नेक — रोजचे",
    description: "Everyday cotton-silk blouse in emerald green with a wide boat neckline, floral print panels and short puff sleeves. Side view showing darts, seam lines and the sleeve set-in your tailor will need.",
  }),
  mk("PT-BL", "Navy Round Neck with Contrast Piping", "blouses", "everyday-necklines", 38796569, false, "Blue", "Minimal", "Cotton", "Daily", "Women", ["blouse", "round neck", "piping", "daily", "back neck"], {
    titleHi: "नेवी राउंड नेक कॉन्ट्रास्ट पाइपिंग",
    description: "Simple daily-wear cotton blouse in navy with a round back neckline finished in contrast piping and matching piped short sleeves. Princess-line darts and hook-and-eye closure clearly visible from the back.",
  }),
  // ---- Lehengas
  mk("PT-LH", "Red & Gold Bridal Lehenga Detail", "lehengas", "bridal-lehenga-couture", 33101418, true, "Red", "Bridal", "Velvet", "Wedding", "Women", ["lehenga", "embroidery", "bridal", "gota"], { titleHi: "लाल-सुनहरा ब्राइडल लहंगा" }),
  mk("PT-LH", "Hand Embroidered Panel Lehenga", "lehengas", "bridal-lehenga-couture", 37396069, true, "Peach", "Couture", "Organza", "Wedding", "Women", ["lehenga", "handwork", "couture"]),
  mk("PT-LH", "Garden Shoot Pastel Lehenga", "lehengas", "bridal-lehenga-couture", 37396070, true, "Pastel", "Couture", "Net", "Engagement", "Women", ["lehenga", "pastel", "engagement"]),
  mk("PT-LH", "Draped Lehenga on Palm Backdrop", "lehengas", "bridal-lehenga-couture", 36489477, false, "Rust", "Contemporary", "Silk Blend", "Sangeet", "Women", ["lehenga", "drape", "sangeet"]),
  mk("PT-LH", "Runway Bridal Trail Lehenga", "lehengas", "bridal-lehenga-couture", 13267023, true, "Crimson", "Couture", "Raw Silk", "Wedding", "Women", ["lehenga", "trail", "runway"]),
  // ---- Kurtas
  mk("PT-KR", "Wine Flared Festive Kurti", "kurtas", "chikankari-edit", 14693247, false, "Wine", "Indo-Western", "Crepe", "Party", "Women", ["kurti", "flared", "party"]),
  mk("PT-KR", "Sister Duo Printed Kurta Set", "kurtas", "chikankari-edit", 38374231, false, "Pink", "Traditional", "Cotton", "Festival", "Women", ["kurta", "family", "festive", "printed"]),
  mk("PT-KR", "Festive Red Kurta Styling", "kurtas", "chikankari-edit", 36567501, true, "Red", "Traditional", "Silk Cotton", "Wedding", "Women", ["kurta", "festive", "styling"]),
  // ---- Men's wear
  mk("PT-MW", "Blush Pink Sherwani", "mens-wear", "sherwani-sets", 35542177, true, "Pink", "Groom", "Silk", "Wedding", "Men", ["sherwani", "groom", "wedding"], { titleHi: "ब्लश पिंक शेरवानी" }),
  mk("PT-MW", "Cream Chikankari Kurta Set", "mens-wear", "sherwani-sets", 37439727, false, "Cream", "Traditional", "Cotton Silk", "Festival", "Men", ["kurta", "chikankari", "festive"]),
  mk("PT-MW", "Ivory Brocade Groom Sherwani", "mens-wear", "sherwani-sets", 12779726, true, "Ivory", "Groom", "Brocade", "Wedding", "Men", ["sherwani", "groom", "safa"]),
  mk("PT-MW", "Printed Backdrop Kurta Portrait", "mens-wear", "sherwani-sets", 12026298, false, "Blue", "Contemporary", "Linen", "Party", "Men", ["kurta", "print", "portrait"]),
  mk("PT-MW", "Bandhgala with Festive Stole", "mens-wear", "nehru-jackets", 30891941, false, "Orange", "Traditional", "Cotton Silk", "Festival", "Men", ["bandhgala", "stole", "festive"]),
  mk("PT-MW", "Yellow Kurta with Red Sofa Shoot", "mens-wear", "nehru-jackets", 28113603, false, "Yellow", "Casual", "Cotton", "Haldi", "Men", ["kurta", "haldi", "yellow"]),
  mk("PT-MW", "White Kurta with Red Nehru Jacket", "mens-wear", "nehru-jackets", 6468525, true, "White", "Indo-Western", "Raw Silk", "Reception", "Men", ["nehru jacket", "white", "reception"]),
  mk("PT-MW", "Golden Hour Kurta Pyjama", "mens-wear", "nehru-jackets", 28113615, false, "Yellow", "Casual", "Cotton", "Daily", "Men", ["kurta", "pyjama", "casual"]),
  mk("PT-MW", "Floral Wall Festive Look", "mens-wear", "nehru-jackets", 27519224, false, "Blue", "Traditional", "Cotton Silk", "Festival", "Men", ["kurta", "floral", "ceremony"]),
  mk("PT-MW", "Balcony Portrait Modern Kurta", "mens-wear", "nehru-jackets", 35542195, true, "Beige", "Contemporary", "Linen Blend", "Party", "Men", ["kurta", "modern", "portrait"]),
  // ---- Necklaces
  mk("PT-NK", "Antique Gold Layered Haram", "necklaces", "temple-gold-haram", 28347073, true, "Gold", "Temple", "22K Gold", "Wedding", "Women", ["necklace", "haram", "antique", "temple"], { titleHi: "एंटीक गोल्ड लेयर्ड हार", titleMr: "अँटिक गोल्ड लेयर्ड हार" }),
  mk("PT-NK", "Layered Pearl & Polki Necklace", "necklaces", "temple-gold-haram", 30929039, true, "Pearl White", "Vintage", "Pearl & Gold", "Reception", "Women", ["necklace", "pearl", "polki", "layered"]),
  mk("PT-NK", "Hand Held Gold Chain Study", "necklaces", "temple-gold-haram", 8706570, false, "Gold", "Minimal", "18K Gold", "Daily", "Women", ["necklace", "chain", "study"]),
  mk("PT-NK", "Slim Gold Chain on Collar", "necklaces", "minimal-chains", 10117804, false, "Gold", "Minimal", "18K Gold", "Office", "Women", ["chain", "office", "minimal"]),
  mk("PT-NK", "Layered Chain with White Shirt", "necklaces", "minimal-chains", 10117825, false, "Gold", "Minimal", "Gold Plated", "Office", "Women", ["chain", "layered", "workwear"]),
  mk("PT-NK", "Classic Rope Chain", "necklaces", "minimal-chains", 10120007, false, "Gold", "Classic", "22K Gold", "Daily", "Women", ["chain", "rope", "classic"]),
  mk("PT-NK", "Floral Gold Pendant on Chain", "necklaces", "minimal-chains", 32780784, false, "Gold", "Minimal", "Gold Plated", "Daily", "Women", ["pendant", "floral", "delicate"]),
  mk("PT-NK", "Statement Chain with Blazer", "necklaces", "minimal-chains", 6467618, true, "Gold", "Contemporary", "Gold Plated", "Party", "Women", ["chain", "statement", "party"]),
  mk("PT-NK", "Beaded Necklace Close Up", "necklaces", "minimal-chains", 17643567, false, "Ivory", "Bohemian", "Beads", "Casual", "Women", ["beads", "boho", "casual"]),
  mk("PT-NK", "Oxidised Silver Temple Necklace", "necklaces", "minimal-chains", 5673960, false, "Silver", "Temple", "Oxidised Silver", "Festival", "Women", ["necklace", "oxidised", "temple", "statement"]),
  // ---- Earrings
  mk("PT-ER", "Grand Gold Jhumka", "earrings", "jhumka-collection", 37601639, true, "Gold", "Temple", "22K Gold", "Wedding", "Women", ["jhumka", "temple", "bridal"], { titleHi: "ग्रैंड गोल्ड झुमका", titleMr: "भव्य गोल्ड झुमका" }),
  mk("PT-ER", "Emerald Chandelier Drops", "earrings", "jhumka-collection", 32989030, true, "Green", "Chandbali", "Gold & Emerald", "Reception", "Women", ["chandbali", "emerald", "drops"]),
  mk("PT-ER", "Gold Hoop on Silk", "earrings", "jhumka-collection", 13081070, false, "Gold", "Minimal", "Gold Plated", "Daily", "Women", ["hoop", "minimal", "daily"]),
  // ---- Bangles
  mk("PT-BN", "Bridal Bangle & Necklace Layout", "bangles", "bridal-bangle-stacks", 35059564, true, "Gold", "Bridal", "22K Gold", "Wedding", "Women", ["bangles", "bridal", "set"]),
  mk("PT-BN", "Jewellery Flatlay with Juttis", "bangles", "bridal-bangle-stacks", 29037987, false, "Gold", "Bridal", "Gold Plated", "Sangeet", "Women", ["bangles", "flatlay", "styling"]),
  // ---- Rings
  mk("PT-RG", "Diamond Bow Ring", "rings", "diamond-solitaires", 35270153, true, "Silver", "Contemporary", "Diamond & Platinum", "Engagement", "Women", ["ring", "diamond", "bow"], { titleHi: "डायमंड बो रिंग" }),
  mk("PT-RG", "Showcase of Solitaire Rings", "rings", "diamond-solitaires", 9145395, true, "Silver", "Classic", "Diamond", "Engagement", "Unisex", ["ring", "solitaire", "showcase"]),
  mk("PT-RG", "Marble Shoot Solitaire", "rings", "diamond-solitaires", 2849742, true, "Silver", "Classic", "Diamond", "Engagement", "Women", ["ring", "solitaire", "marble"]),
  mk("PT-RG", "Gold & Diamond Ring Pair", "rings", "diamond-solitaires", 32797483, true, "Gold", "Contemporary", "Diamond & Gold", "Anniversary", "Unisex", ["ring", "pair", "anniversary"]),
  mk("PT-RG", "Silver Stack on Velvet", "rings", "everyday-stackables", 20507408, false, "Silver", "Minimal", "Sterling Silver", "Daily", "Unisex", ["ring", "stack", "silver"]),
  mk("PT-RG", "Gemstone Ring Portrait", "rings", "everyday-stackables", 8675736, false, "Multicolour", "Bohemian", "Gemstone", "Casual", "Women", ["ring", "gemstone", "casual"]),
  mk("PT-RG", "Outdoor Bracelet & Ring Pairing", "rings", "everyday-stackables", 34549908, false, "Silver", "Contemporary", "Diamond", "Party", "Women", ["bracelet", "ring", "pairing"]),
  mk("PT-RG", "Diamond Bracelet with Ring", "rings", "everyday-stackables", 33343009, true, "Silver", "Contemporary", "Diamond", "Reception", "Women", ["bracelet", "diamond", "styling"]),
  mk("PT-RG", "Gold Hand Jewellery Styling", "rings", "everyday-stackables", 9722363, false, "Gold", "Contemporary", "18K Gold", "Party", "Women", ["ring", "styling", "gold", "stack"]),
  // ---- Bridal sets
  mk("PT-BS", "Complete Wedding Jewellery Set", "bridal-sets", "complete-bridal-sets", 29038003, true, "Gold", "Bridal", "22K Gold", "Wedding", "Women", ["bridal", "set", "wedding"], { titleHi: "संपूर्ण वेडिंग ज्वेलरी सेट", titleMr: "संपूर्ण वेडिंग ज्वेलरी संच" }),
  mk("PT-BS", "Kundan Bridal Hand & Bangle Styling", "bridal-sets", "complete-bridal-sets", 2064505, false, "Gold", "Bridal", "Gold & Kundan", "Wedding", "Women", ["bridal", "kundan", "mehendi", "hands"]),
  mk("PT-BS", "Couple Portrait Jewellery Styling", "bridal-sets", "complete-bridal-sets", 37430604, true, "Gold", "Bridal", "Gold & Kundan", "Wedding", "Unisex", ["couple", "bridal", "styling"], { allowDownload: false }),
];

export const PLANS = [
  {
    code: "basic-monthly",
    name: "Basic Monthly",
    nameHi: "बेसिक मासिक",
    nameMr: "बेसिक मासिक",
    description: "Unlock every premium clothing & jewellery design for a month.",
    price: "100.00",
    mrp: "149.00",
    currency: "INR",
    taxPercent: 18,
    durationDays: 30,
    durationLabel: "1 month",
    benefits: [
      "All premium clothing & jewellery designs",
      "60 HD downloads every month",
      "Watermark-free saves to gallery",
      "Share original images on WhatsApp",
      "New drops every week",
    ],
    includedCategories: ["clothing", "jewellery"],
    downloadLimit: 60,
    quality: "HD",
    allowShare: true,
    trialDays: 3,
    isPopular: true,
    isActive: true,
    displayOrder: 1,
  },
  {
    code: "quarterly-saver",
    name: "Quarterly Saver",
    nameHi: "त्रैमासिक सेवर",
    nameMr: "त्रैमासिक सेव्हर",
    description: "Three months of full access with a bigger download bucket.",
    price: "249.00",
    mrp: "300.00",
    currency: "INR",
    taxPercent: 18,
    durationDays: 90,
    durationLabel: "3 months",
    benefits: [
      "Everything in Basic Monthly",
      "250 HD downloads every quarter",
      "Early access to bridal collections",
      "Priority support on WhatsApp",
    ],
    includedCategories: ["clothing", "jewellery"],
    downloadLimit: 250,
    quality: "Ultra HD",
    allowShare: true,
    trialDays: 0,
    isPopular: false,
    isActive: true,
    displayOrder: 2,
  },
  {
    code: "jewellery-only",
    name: "Jewellery Pack",
    nameHi: "ज्वेलरी पैक",
    nameMr: "ज्वेलरी पॅक",
    description: "Only jewellery categories — perfect for goldsmiths & showrooms.",
    price: "79.00",
    mrp: "99.00",
    currency: "INR",
    taxPercent: 18,
    durationDays: 30,
    durationLabel: "1 month",
    benefits: [
      "All premium jewellery designs",
      "40 HD downloads every month",
      "Clothing designs stay locked",
    ],
    includedCategories: ["jewellery"],
    downloadLimit: 40,
    quality: "HD",
    allowShare: true,
    trialDays: 0,
    isPopular: false,
    isActive: true,
    displayOrder: 3,
  },
];

export const BANNERS = [
  {
    title: "Bridal Season Edit 2026",
    titleHi: "ब्राइडल सीज़न एडिट 2026",
    subtitle: "180 new lehenga & haram references added this week",
    image: px(33101418, 900, 600),
    cta: "Explore collection",
    target: "collection:bridal-lehenga-couture",
    tone: "gold",
    displayOrder: 1,
  },
  {
    title: "₹100 unlocks everything",
    titleHi: "₹100 में सब कुछ अनलॉक",
    subtitle: "Basic Monthly · 3 day free trial · cancel anytime",
    image: px(29038003, 900, 600),
    cta: "View plans",
    target: "screen:plans",
    tone: "plum",
    displayOrder: 2,
  },
  {
    title: "Temple gold, reimagined",
    titleHi: "टेम्पल गोल्ड, नए अंदाज़ में",
    subtitle: "Antique haram styles for muhurtham mornings",
    image: px(28347073, 900, 600),
    cta: "See jewellery",
    target: "category:jewellery",
    tone: "rose",
    displayOrder: 3,
  },
];

export const HOME_SECTIONS = [
  { key: "banners", title: "Promotions", titleHi: "प्रोमोशन", titleMr: "प्रमोशन", subtitle: null, layout: "banner", displayOrder: 1, isVisible: true },
  { key: "categories", title: "Browse categories", titleHi: "श्रेणियाँ देखें", titleMr: "श्रेणी पहा", subtitle: "Admin managed · updates without app release", layout: "chips", displayOrder: 2, isVisible: true },
  { key: "trending", title: "Trending this week", titleHi: "इस हफ्ते ट्रेंडिंग", titleMr: "या आठवड्यात ट्रेंडिंग", subtitle: "Most viewed by Prasanna Trends users", layout: "carousel", displayOrder: 3, isVisible: true },
  { key: "featured-collections", title: "Featured collections", titleHi: "चुनिंदा कलेक्शन", titleMr: "निवडक कलेक्शन", subtitle: null, layout: "collections", displayOrder: 4, isVisible: true },
  { key: "new", title: "Recently added", titleHi: "नए डिज़ाइन", titleMr: "नवीन डिझाईन", subtitle: "Fresh uploads from the studio", layout: "carousel", displayOrder: 5, isVisible: true },
  { key: "free", title: "Free for everyone", titleHi: "सबके लिए मुफ़्त", titleMr: "सर्वांसाठी मोफत", subtitle: "No subscription needed", layout: "grid", displayOrder: 6, isVisible: true },
  { key: "premium", title: "Premium picks", titleHi: "प्रीमियम चुनाव", titleMr: "प्रीमियम निवड", subtitle: "Included in the ₹100 plan", layout: "carousel", displayOrder: 7, isVisible: true },
  { key: "recent", title: "Continue browsing", titleHi: "ब्राउज़िंग जारी रखें", titleMr: "ब्राउझिंग सुरू ठेवा", subtitle: null, layout: "carousel", displayOrder: 8, isVisible: true },
];

export const FAQS = [
  { question: "What does the ₹100 Basic plan include?", answer: "The Basic Monthly plan unlocks every premium clothing and jewellery design for 30 days, with 60 watermark-free HD downloads and sharing enabled.", topic: "Subscription", displayOrder: 1 },
  { question: "Can I keep downloaded designs after my plan expires?", answer: "Yes. Files already saved to your gallery stay with you. In-app premium previews and new downloads stop until you renew.", topic: "Subscription", displayOrder: 2 },
  { question: "How do I renew or cancel?", answer: "Go to Profile → My subscription. Renewal is manual by default; you can also enable auto-renew through the payment gateway. Cancelling stops future charges immediately.", topic: "Subscription", displayOrder: 3 },
  { question: "Why do some designs show a watermark?", answer: "Premium designs show a watermarked preview until you subscribe. After subscribing, the original file is delivered through a short-lived secure link.", topic: "Designs", displayOrder: 4 },
  { question: "Can I share a design with my tailor?", answer: "Yes — use Share to send a public design link, a watermarked preview, or the original image if the admin has allowed it for that design.", topic: "Designs", displayOrder: 5 },
  { question: "How do I change the app language?", answer: "Profile → Language. English, Hindi and Marathi are available today, and more languages can be added by the admin without an app update.", topic: "General", displayOrder: 6 },
  { question: "How do I delete my account?", answer: "Profile → Settings → Delete account. We remove or anonymise your personal data, revoke sessions, and keep only the payment records that law requires.", topic: "Account", displayOrder: 7 },
  { question: "My payment failed but money was deducted.", answer: "Failed and pending payments are re-checked automatically against the gateway. If it is not resolved in 30 minutes, contact support with the transaction reference.", topic: "Payments", displayOrder: 8 },
];

export const LEGAL_PAGES = [
  {
    slug: "about",
    title: "About Prasanna Trends",
    body: [
      "Prasanna Trends is a design discovery library for boutiques, tailors, goldsmiths and families planning a celebration.",
      "Every design is photographed or licensed by our studio team and organised into categories, subcategories and collections so you can reach the right reference in seconds.",
      "We started with clothing and jewellery. New categories such as Mehendi & Rangoli are added by our team from the admin panel and appear instantly in the app — no update required.",
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    body: [
      "1. Licence — Designs are provided for personal reference and tailoring/manufacturing inspiration. Re-selling the image files or claiming ownership is not permitted.",
      "2. Subscription — Access is granted only after a payment is verified by the gateway. Plan benefits are shown before purchase and stored with each transaction.",
      "3. Fair use — Automated scraping, bulk downloading, or sharing your account with others may lead to suspension.",
      "4. Content — Designs may be added, edited, archived or removed at any time. Archived designs stay in your download history.",
      "5. Governing law — These terms follow applicable Indian law and are subject to the jurisdiction of the courts of Maharashtra.",
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    body: [
      "We collect only what the app needs: your name, mobile number, optional email, language preference and activity such as views, favourites and downloads.",
      "Card and UPI credentials are never stored on our servers — payments are processed by the gateway and we keep only the reference, status and invoice.",
      "You can export or delete your data from Profile → Settings. Deletion anonymises your profile and revokes all sessions, while legally required payment records are retained.",
      "Analytics is aggregated and used to improve recommendations, search results and the content roadmap.",
    ],
  },
  {
    slug: "refund",
    title: "Refund & Cancellation Policy",
    body: [
      "Subscriptions are digital and activate immediately after payment verification.",
      "If a payment is debited but the plan is not activated within 24 hours, the amount is refunded in full to the original payment method.",
      "Cancellation stops future renewals. The current cycle stays active until the expiry date shown in Profile → My subscription.",
      "Refund requests for accidental duplicate purchases are honoured within 7 days.",
    ],
  },
  {
    slug: "copyright",
    title: "Copyright & Content Ownership",
    body: [
      "All designs are owned by Prasanna Trends or licensed for display, download and sharing inside the app.",
      "If you believe a design infringes your copyright, use the Report option on the design or write to legal@prasannatrends.in with proof of ownership.",
      "Reported designs are reviewed within 48 hours and can be unpublished by the admin immediately.",
    ],
  },
];

export const SETTINGS: Record<string, string> = {
  appName: "Prasanna Trends",
  tagline: "Designs worth saving",
  supportEmail: "support@prasannatrends.in",
  supportPhone: "+91 98220 45671",
  whatsapp: "+91 98220 45671",
  instagram: "@prasannatrends",
  minAppVersion: "1.0.0",
  currentVersion: "1.4.2",
  forceUpdate: "false",
  maintenanceMessage: "",
  defaultLanguage: "en",
};

export const NOTIFICATIONS = [
  { title: "Bridal Season Edit is live", body: "42 new lehenga and blouse references added to your favourite collection.", kind: "content", image: thumb(33101418), target: "collection:bridal-lehenga-couture", isRead: false, minutesAgo: 45 },
  { title: "3 days of free trial left", body: "Your Basic Monthly trial ends soon. Keep unlimited premium access for just ₹100.", kind: "subscription", image: null, target: "screen:plans", isRead: false, minutesAgo: 260 },
  { title: "Temple gold haram drop", body: "12 antique finish haram designs from the Jaipur studio.", kind: "content", image: thumb(4889719), target: "collection:temple-gold-haram", isRead: true, minutesAgo: 1500 },
  { title: "Festive offer · 20% off", body: "Quarterly Saver at ₹249 till Sunday midnight.", kind: "offer", image: null, target: "screen:plans", isRead: true, minutesAgo: 2900 },
  { title: "Your download receipt", body: "Invoice PT-INV-2041 for ₹118 (incl. GST) is ready to download.", kind: "payment", image: null, target: "screen:payments", isRead: true, minutesAgo: 6400 },
];

export const DEMO_USER = {
  name: "Ananya Kulkarni",
  phone: "+91 98765 43210",
  email: "ananya.k@example.com",
  avatar: thumb(35108855),
  language: "en",
};

export const REPORT_REASONS = [
  "Incorrect category",
  "Poor image quality",
  "Duplicate content",
  "Copyright concern",
  "Inappropriate content",
  "Other reason",
];

export const POPULAR_SEARCHES = [
  "bridal blouse",
  "temple haram",
  "kanjeevaram",
  "jhumka",
  "nehru jacket",
  "boat neck",
  "solitaire ring",
];
