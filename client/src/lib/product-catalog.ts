/**
 * Product Catalog for The Lucid Path
 * 67 verified Amazon products with real ASINs, organized by category with topic-matching keywords.
 * All links use tag=spankyspinola-20
 * Every link ends with (paid link)
 * ALL ASINs verified as real Amazon products (April 2026)
 */

export const AFFILIATE_TAG = "spankyspinola-20";

export interface Product {
  name: string;
  asin: string;
  category: string;
  keywords: string[];
  embedding: string; // Natural conversational sentence for inline placement
}

export function amazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

/**
 * Master product catalog — 67 verified products across lucid dreaming categories
 */
export const PRODUCT_CATALOG: Product[] = [
  // ═══════════════════════════════════════════
  // CATEGORY: Dream Journals & Writing
  // ═══════════════════════════════════════════
  { name: "Dream Journal for Lucid Dreaming Practices", asin: "B09T39P48Z", category: "journals", keywords: ["dream journal", "journaling", "dream diary", "recording dreams", "dream recall", "writing dreams"], embedding: "A dedicated dream journal is the cornerstone of any serious dreaming practice - write in it every morning before the memories fade" },
  { name: "Dream Journal Notebook: Guided Diary for Lucid Dreaming", asin: "B0D8KQ3LBH", category: "journals", keywords: ["beginner", "dream journal", "guided", "prompts", "new dreamer"], embedding: "This guided dream journal includes structured prompts that help beginners develop their dream recall practice" },
  { name: "Dream Journal: A Dream Diary for Reflection", asin: "B099TQ6DZV", category: "journals", keywords: ["dream diary", "reflection", "dream signs", "recording"], embedding: "Keeping a dream diary beside your bed is the single most important habit for improving dream recall and recognizing dream signs" },
  { name: "Lucid Dreams Journal", asin: "B09918FNSG", category: "journals", keywords: ["lucid dreams", "journal", "tracking", "patterns"], embedding: "This lucid dreams journal is designed specifically for tracking the patterns and themes that emerge across your dream life" },
  { name: "Lucid Dream Journal, Diary, Notebook, Log", asin: "B09HRW82JM", category: "journals", keywords: ["dream notebook", "log", "diary", "beautiful", "intentional"], embedding: "A beautifully bound dream notebook can make the morning journaling ritual feel more intentional and sacred" },
  { name: "Lucid Dreaming Journal: The Ultimate Dream Diary", asin: "1729489176", category: "journals", keywords: ["ultimate", "dream diary", "dream recall", "structured"], embedding: "A structured dream diary provides the framework for tracking your dream signs and building consistent recall" },
  { name: "Moleskine Cahier Journal Pocket Ruled", asin: "B07J33Q4V1", category: "journals", keywords: ["moleskine", "notebook", "compact", "nightstand", "simple"], embedding: "Many dreamers prefer a simple Moleskine notebook for dream journaling - the compact size fits perfectly on a nightstand" },
  { name: "Moleskine Cahier Journal Large Ruled", asin: "8862931077", category: "journals", keywords: ["moleskine", "large", "journal", "sketching", "room"], embedding: "A larger journal notebook gives you room to sketch dream scenes alongside your written descriptions" },

  // ═══════════════════════════════════════════
  // CATEGORY: Sleep Masks & Light Blocking
  // ═══════════════════════════════════════════
  { name: "MZOO Luxury Sleep Mask for Back/Side Sleeper", asin: "B0B14QQV6R", category: "sleep-masks", keywords: ["sleep mask", "eye mask", "light blocking", "darkness", "REM sleep", "blackout", "contoured"], embedding: "A quality contoured sleep mask creates the total darkness your brain needs for deeper, more vivid dream states" },
  { name: "MZOO Luxury Sleep Eye Mask for Side Sleeper", asin: "B07KC5DWCC", category: "sleep-masks", keywords: ["sleep mask", "side sleeper", "3D", "REM", "comfortable"], embedding: "This 3D contoured sleep mask blocks all light while leaving space for your eyes to move during REM sleep" },
  { name: "MZOO Contoured Sleeping Blindfold", asin: "B07YXLYTBN", category: "sleep-masks", keywords: ["blackout", "sleep mask", "blindfold", "REM", "darkness"], embedding: "Many lucid dreamers swear by a blackout sleep mask as an essential tool for maintaining the darkness that supports longer REM periods" },
  { name: "Sound Oasis Deluxe Glo to Sleep Eye Mask", asin: "B00ACDVG94", category: "sleep-masks", keywords: ["glo to sleep", "brainwaves", "hypnagogic", "light points", "sleep therapy"], embedding: "The Glo to Sleep mask uses blue light points to help slow brainwaves and transition into the hypnagogic state where lucidity begins" },
  { name: "Glo to Sleep Eye Mask", asin: "B005NKF41C", category: "sleep-masks", keywords: ["glo", "sleep mask", "focal point", "dream state", "therapy"], embedding: "Sleep therapy masks like the Glo to Sleep work by giving your mind a gentle focal point as you drift into the dream state" },

  // ═══════════════════════════════════════════
  // CATEGORY: Sound & White Noise
  // ═══════════════════════════════════════════
  { name: "Magicteam Sound White Noise Machine 20 Sounds", asin: "B07RWRJ4XW", category: "sound", keywords: ["white noise", "sound machine", "sleep sounds", "noise blocking", "sleep environment"], embedding: "A white noise machine masks disruptive sounds and creates the consistent auditory environment that supports uninterrupted sleep cycles" },
  { name: "Easysleep Sound White Noise Machine 25 Sounds", asin: "B086W6SDZB", category: "sound", keywords: ["sound machine", "25 sounds", "ambient", "sleep", "dreaming"], embedding: "This sound machine with 25 sounds lets you find the perfect ambient backdrop for your sleep and dreaming practice" },
  { name: "Easysleep White Noise Machine with Night Light", asin: "B087CPCVK9", category: "sound", keywords: ["sound machine", "night light", "journaling", "sleep"], embedding: "A sound machine with night light serves double duty - the sounds promote deeper sleep while the gentle light aids middle-of-the-night journaling" },
  { name: "Sound Machine Night Light White Noise Brown Noise", asin: "B0CCV845B7", category: "sound", keywords: ["brown noise", "sound machine", "soothing", "deep sleep"], embedding: "Brown noise from a quality sound machine has a deeper, more soothing quality that many dreamers find more conducive to vivid dreaming than white noise" },
  { name: "Dreamegg D1 Sound Machine", asin: "B07HKPXKCD", category: "sound", keywords: ["dreamegg", "nature sounds", "pre-sleep", "ritual", "dream content"], embedding: "The Dreamegg sound machine offers nature sounds that can become part of your pre-sleep ritual and even influence dream content" },
  { name: "Dreamegg Portable Noise Machine", asin: "B0BBQX7P5J", category: "sound", keywords: ["portable", "travel", "noise machine", "consistent", "sleep environment"], embedding: "A portable travel noise machine ensures you can maintain your sleep environment and dreaming practice even when away from home" },
  { name: "Dreamegg White Noise Sound Machine D3 Pro", asin: "B0CCJ2Y22Z", category: "sound", keywords: ["premium", "29 sounds", "REM", "acoustic", "sleep"], embedding: "This premium sound machine with 29 different sounds helps create the acoustic cocoon that supports deeper, longer REM periods" },

  // ═══════════════════════════════════════════
  // CATEGORY: Supplements & Herbs
  // ═══════════════════════════════════════════
  { name: "Lucidimine Galantamine Lucid Dream Supplement", asin: "B00IJQCA6E", category: "supplements", keywords: ["galantamine", "supplement", "lucid dreaming supplement", "acetylcholine", "dream enhancement"], embedding: "Galantamine-based lucid dreaming supplements work by increasing acetylcholine levels during REM sleep, making conscious dreaming significantly more likely" },
  { name: "Galantamine 8mg Lucid Dreaming Nootropic 60 Capsules", asin: "B0758FYZVC", category: "supplements", keywords: ["galantamine", "capsules", "WBTB", "lucid dream", "nootropic"], embedding: "Many advanced practitioners use galantamine capsules with the Wake-Back-to-Bed method for remarkably consistent lucid dream induction" },
  { name: "Dream Leaf Pro Premium Lucid Dreaming Supplement", asin: "B07PCVWM6N", category: "supplements", keywords: ["dream leaf", "supplement", "galantamine", "alpha-GPC", "mugwort"], embedding: "The Dream Leaf Pro supplement combines multiple dream-enhancing compounds including galantamine, alpha-GPC, and mugwort extract" },
  { name: "Natrol Melatonin 5mg 60 Tablets", asin: "B00DKEUBIE", category: "supplements", keywords: ["melatonin", "sleep", "sleep onset", "circadian rhythm", "low dose"], embedding: "Low-dose melatonin supplements can help regulate your sleep-wake cycle, especially when adjusting your schedule for dream practice" },
  { name: "Natrol Melatonin 10mg Gummies 90 Count", asin: "B079TD7HG2", category: "supplements", keywords: ["melatonin", "gummies", "sleep rhythm", "vivid dreaming"], embedding: "These melatonin gummies offer a convenient way to support your natural sleep rhythm and promote more vivid dreaming" },
  { name: "Natrol Melatonin Gummies 10mg", asin: "B08666GMWG", category: "supplements", keywords: ["melatonin", "supplement", "REM", "fall asleep", "sleep stages"], embedding: "A gentle melatonin supplement taken 30 minutes before bed can help you fall asleep faster and spend more time in the REM stages where lucid dreams happen" },

  // ═══════════════════════════════════════════
  // CATEGORY: Herbs & Dream Teas
  // ═══════════════════════════════════════════
  { name: "Natural Dried Mugwort Herb Tea for Lucid Dreaming", asin: "B0CH15QX8V", category: "herbs", keywords: ["mugwort", "dream tea", "herbal", "dream herb", "vivid dreams", "lucid"], embedding: "Traditional mugwort tea has been used for centuries across cultures to enhance dream vividness and promote lucid awareness" },
  { name: "FullChea Pure Natural Dried Mugwort Herb Loose Leaf", asin: "B09SZ8JMG6", category: "herbs", keywords: ["mugwort", "loose leaf", "brewing", "dream explorers", "vivid"], embedding: "Brewing loose leaf mugwort before bed is a time-honored practice among dream explorers seeking more vivid and memorable dreams" },
  { name: "Biokoma Organic Mugwort Dried Herb", asin: "B07CF2RQ7N", category: "herbs", keywords: ["organic", "mugwort", "dream pillows", "sachets", "relaxation"], embedding: "Organic dried mugwort herb can be used in dream pillows, teas, or sachets to promote vivid dreaming and deep relaxation" },

  // ═══════════════════════════════════════════
  // CATEGORY: Books — Lucid Dreaming
  // ═══════════════════════════════════════════
  { name: "Exploring the World of Lucid Dreaming — Stephen LaBerge", asin: "034537410X", category: "books", keywords: ["laberge", "lucid dreaming book", "EWLD", "beginner book", "classic", "techniques", "MILD"], embedding: "Stephen LaBerge's 'Exploring the World of Lucid Dreaming' remains one of the best starting points for anyone interested in conscious dreaming" },
  { name: "Lucid Dreaming: Gateway to the Inner Self — Robert Waggoner", asin: "193049114X", category: "books", keywords: ["waggoner", "advanced lucid dreaming", "inner self", "dream communication", "5 stages"], embedding: "Robert Waggoner's 'Lucid Dreaming: Gateway to the Inner Self' is a masterclass in advanced lucid dreaming techniques and inner exploration" },
  { name: "Are You Dreaming? — Daniel Love", asin: "0957497709", category: "books", keywords: ["daniel love", "reality testing", "beginner", "practical guide", "science-based"], embedding: "Daniel Love's 'Are You Dreaming?' offers a modern, science-based approach to learning lucid dreaming from the ground up" },
  { name: "Dreams of Awakening — Charlie Morley", asin: "1781802025", category: "books", keywords: ["charlie morley", "buddhist", "lucid dreaming", "mindfulness", "spiritual", "dream yoga"], embedding: "Charlie Morley's 'Dreams of Awakening' bridges Western lucid dreaming with Tibetan Buddhist dream yoga traditions" },
  { name: "Dreams of Awakening (Revised Edition) — Charlie Morley", asin: "1401978142", category: "books", keywords: ["charlie morley", "revised", "updated", "mindfulness", "techniques"], embedding: "The revised edition of 'Dreams of Awakening' includes updated techniques for inducing lucid dreams through mindfulness practice" },
  { name: "Advanced Lucid Dreaming: The Power of Supplements — Thomas Yuschak", asin: "1430305428", category: "books", keywords: ["yuschak", "supplements", "galantamine", "advanced", "chemical"], embedding: "Thomas Yuschak's 'Advanced Lucid Dreaming: The Power of Supplements' is the definitive guide to supplement-assisted lucid dream induction" },
  { name: "Lucid Dreaming Supplements Blueprint", asin: "1976898749", category: "books", keywords: ["supplements", "blueprint", "technical", "dream enhancement"], embedding: "The 'Lucid Dreaming Supplements Blueprint' details technical approaches to enhancing dream vividness through targeted supplementation" },
  { name: "The Tibetan Yogas of Dream and Sleep — Tenzin Wangyal Rinpoche", asin: "1559391014", category: "books", keywords: ["tibetan", "dream yoga", "sleep yoga", "rinpoche", "bon", "advanced", "spiritual"], embedding: "Tenzin Wangyal Rinpoche's 'The Tibetan Yogas of Dream and Sleep' takes dream practice into the territory of spiritual awakening and liberation" },
  { name: "The Tibetan Yogas of Dream and Sleep (Revised)", asin: "1611809517", category: "books", keywords: ["tibetan", "revised", "clear light", "sleep yoga", "practices"], embedding: "The updated edition of 'The Tibetan Yogas of Dream and Sleep' includes new practices for working with the clear light of sleep" },

  // ═══════════════════════════════════════════
  // CATEGORY: Books — Consciousness & Sleep
  // ═══════════════════════════════════════════
  { name: "Why We Sleep — Matthew Walker (Hardcover)", asin: "1501144316", category: "books", keywords: ["walker", "sleep science", "neuroscience", "REM", "sleep research", "health"], embedding: "Matthew Walker's 'Why We Sleep' is the definitive scientific exploration of sleep, dreams, and their role in human health" },
  { name: "Why We Sleep — Matthew Walker (Paperback)", asin: "1501144324", category: "books", keywords: ["walker", "sleep", "REM", "neurological", "dreaming"], embedding: "Walker's research in 'Why We Sleep' reveals how REM sleep creates the neurological conditions for conscious dreaming" },
  { name: "Waking Up — Sam Harris (Hardcover)", asin: "1451636024", category: "books", keywords: ["sam harris", "meditation", "mindfulness", "secular", "consciousness", "awareness"], embedding: "Sam Harris's 'Waking Up' explores the intersection of consciousness, meditation, and the nature of awareness itself" },
  { name: "Waking Up — Sam Harris (Paperback)", asin: "1476777721", category: "books", keywords: ["sam harris", "spirituality", "neuroscience", "investigation"], embedding: "In 'Waking Up', Sam Harris makes the case that spiritual experience can be understood through neuroscience and direct investigation" },
  { name: "The Power of Now — Eckhart Tolle", asin: "1577314808", category: "books", keywords: ["tolle", "presence", "now", "awareness", "consciousness", "awakening"], embedding: "Eckhart Tolle's 'The Power of Now' teaches the present-moment awareness that directly translates to becoming conscious within dreams" },
  { name: "The Headspace Guide to Meditation and Mindfulness", asin: "1250104904", category: "books", keywords: ["headspace", "meditation", "mindfulness", "accessible", "techniques"], embedding: "The 'Headspace Guide to Meditation and Mindfulness' offers accessible techniques that strengthen the awareness muscles used in lucid dreaming" },

  // ═══════════════════════════════════════════
  // CATEGORY: Meditation & Yoga
  // ═══════════════════════════════════════════
  { name: "Mindful & Modern Large Meditation Cushion Zafu", asin: "B077P4336Y", category: "meditation", keywords: ["meditation cushion", "zafu", "sitting", "meditation practice", "posture"], embedding: "A proper meditation cushion supports the daily sitting practice that builds the mindfulness foundation for dream awareness" },
  { name: "Hunnidspace Meditation Zafu Cushion Set Buckwheat", asin: "B0D2K8N8NR", category: "meditation", keywords: ["meditation set", "buckwheat", "stable", "longer sessions"], embedding: "This meditation cushion set with buckwheat hull filling provides the stable, comfortable base needed for longer meditation sessions" },
  { name: "Jumbo Kapok Zafu Meditation Cushion", asin: "B07D1XWJ3D", category: "meditation", keywords: ["zafu", "kapok", "traditional", "alertness", "awareness"], embedding: "A traditional zafu meditation cushion elevates your hips above your knees, making it easier to maintain the alertness needed for awareness meditation" },

  // ═══════════════════════════════════════════
  // CATEGORY: Sleep Technology
  // ═══════════════════════════════════════════
  { name: "Philips SmartSleep Wake-up Light HF3520", asin: "B0093162RM", category: "sleep-tech", keywords: ["sunrise alarm", "wake-up light", "circadian", "gentle alarm", "WBTB", "morning dreams"], embedding: "A sunrise alarm clock gently brings you through lighter sleep stages, making it easier to catch and remember those final morning dreams" },
  { name: "Bose Sleepbuds II", asin: "B08FRR6Z1N", category: "sleep-tech", keywords: ["sleep earbuds", "noise masking", "sleep sounds", "clinically proven"], embedding: "The Bose Sleepbuds II use clinically proven sound technology to help you fall asleep faster and stay in deeper sleep stages" },
  { name: "Oura Ring 4 Sleep Tracker", asin: "B0D9WWB3WX", category: "sleep-tech", keywords: ["oura ring", "sleep tracker", "sleep stages", "REM tracking", "wearable"], embedding: "Sleep trackers like the Oura Ring help you identify your REM cycles and time your lucid dreaming attempts for maximum effectiveness" },
  { name: "Fitbit Inspire 3 Health Tracker with Sleep Tracking", asin: "B0B5F9SZW7", category: "sleep-tech", keywords: ["fitbit", "sleep tracking", "sleep stages", "personal", "architecture"], embedding: "Wearable trackers like the Fitbit Inspire 3 provide sleep stage data that helps you understand your personal sleep architecture" },
  { name: "Fitbit Luxe Wellness Tracker with Sleep Tracking", asin: "B08ZF7QDXJ", category: "sleep-tech", keywords: ["fitbit luxe", "sleep stages", "WBTB", "optimal timing"], embedding: "The Fitbit Luxe tracks your sleep stages and can help you identify the optimal times for Wake-Back-to-Bed lucid dreaming attempts" },

  // ═══════════════════════════════════════════
  // CATEGORY: Blue Light Blocking
  // ═══════════════════════════════════════════
  { name: "Blue Light Blocking Amber Glasses for Sleep 99.9%", asin: "B01GSFTX08", category: "blue-light", keywords: ["blue light", "glasses", "amber", "melatonin", "circadian", "evening"], embedding: "Wearing blue light blocking glasses in the evening supports natural melatonin production and healthier sleep cycles that favor vivid dreaming" },
  { name: "Sleep ZM Blue Light Blocking Glasses", asin: "B0GRTH9B7J", category: "blue-light", keywords: ["blue light", "amber", "sleep glasses", "99.9%", "dream"], embedding: "These amber-tinted sleep glasses filter up to 99.9% of disruptive blue light, helping your body prepare for the deep sleep where dreams flourish" },
  { name: "Spectra479 Fit Over Blue Light Blocking Glasses", asin: "B08176FSKZ", category: "blue-light", keywords: ["fit over", "prescription", "blue light", "sleep quality"], embedding: "If you wear prescription glasses, these fit-over blue light blockers let you protect your sleep quality without switching to contacts" },

  // ═══════════════════════════════════════════
  // CATEGORY: Aromatherapy
  // ═══════════════════════════════════════════
  { name: "Majestic Pure Lavender Essential Oil with Dropper", asin: "B07NQSTXL1", category: "aromatherapy", keywords: ["lavender", "essential oil", "calming", "sleep", "aromatherapy", "pre-sleep"], embedding: "Many practitioners use lavender essential oil as part of their pre-sleep ritual to promote relaxation and more vivid dreaming" },
  { name: "Majestic Pure Lavender Essential Oil", asin: "B00TSTZQEY", category: "aromatherapy", keywords: ["lavender", "therapeutic", "pillow", "olfactory", "dream practice"], embedding: "Pure therapeutic-grade lavender oil applied to your pillow or wrists can become a powerful olfactory anchor for your dream practice" },
  { name: "Cliganic USDA Organic Lavender Essential Oil", asin: "B07Q86KDVJ", category: "aromatherapy", keywords: ["organic", "lavender", "vividness", "relaxation", "studies"], embedding: "Studies suggest that organic lavender oil promotes relaxation and may increase the vividness of dreams when used consistently" },
  { name: "ASAKUKI Essential Oil Diffuser 500ml", asin: "B07T8DSTW3", category: "aromatherapy", keywords: ["diffuser", "essential oil", "sensory", "pre-sleep", "ritual"], embedding: "An aromatherapy diffuser with calming essential oils can become a powerful sensory anchor in your pre-sleep ritual" },
  { name: "Lagunamoon Essential Oils Aromatherapy Set 6 Oils", asin: "B06XRLR9RQ", category: "aromatherapy", keywords: ["essential oils set", "experiment", "scents", "dream experience"], embedding: "This essential oils set lets you experiment with different scents to find which ones most enhance your personal dream experience" },
  { name: "Aromatherapy Essential Oil Diffuser 550ml", asin: "B09YH3FJ1R", category: "aromatherapy", keywords: ["diffuser", "large", "all night", "calming", "atmosphere"], embedding: "A large-capacity essential oil diffuser can run all night, maintaining the calming atmosphere that supports deeper sleep and dreaming" },

  // ═══════════════════════════════════════════
  // CATEGORY: Weighted Blankets
  // ═══════════════════════════════════════════
  { name: "Topcee Weighted Blanket 20lbs Queen Size", asin: "B09MDFV73Q", category: "weighted-blankets", keywords: ["weighted blanket", "deep pressure", "sleep", "anxiety", "calming"], embedding: "A weighted blanket provides the deep pressure stimulation that helps many people fall asleep faster and sleep more soundly" },
  { name: "Topcee Weighted Blanket 15lbs", asin: "B09MDGMKKS", category: "weighted-blankets", keywords: ["weighted blanket", "15 pounds", "held", "anxiety", "deep sleep"], embedding: "The gentle, even pressure of a 15-pound weighted blanket mimics the sensation of being held, reducing anxiety and promoting the deep sleep where dreams thrive" },
  { name: "Topcee Weighted Blanket 5lbs Throw", asin: "B09MDFJ9TM", category: "weighted-blankets", keywords: ["weighted blanket", "throw", "nap", "WBTB", "calming"], embedding: "For those new to weighted blankets, a lighter 5-pound throw is a good starting point for experiencing the calming effects during naps and WBTB sessions" },

  // ═══════════════════════════════════════════
  // CATEGORY: Dream Catchers
  // ═══════════════════════════════════════════
  { name: "Dream Catchers Handmade Feather Luminous Beads", asin: "B0BJJVWJ85", category: "decor", keywords: ["dream catcher", "handmade", "intention", "bedroom", "symbolic"], embedding: "While a dream catcher may be more symbolic than scientific, many dreamers find these beautiful objects serve as powerful intention-setting reminders" },

  // ═══════════════════════════════════════════
  // CATEGORY: Brain Technology
  // ═══════════════════════════════════════════
  { name: "MUSE 2 Smart Meditation Headband", asin: "B0FG8KSDRL", category: "brain-tech", keywords: ["EEG", "brainwave", "meditation", "neurofeedback", "sleep transitions"], embedding: "EEG devices like the Muse 2 headband allow you to observe your own brainwave patterns during meditation and sleep transitions" },
  { name: "Muse S Athena Brain Sensing Headband", asin: "B0G4F6Z1WN", category: "brain-tech", keywords: ["muse", "neurofeedback", "advanced", "meditative states", "real-time"], embedding: "The Muse S Athena headband provides real-time neurofeedback that can help advanced practitioners develop deeper meditative states" },
];

/**
 * Topic-matching engine: finds relevant products for an article based on title, category, and keywords
 */
export function matchProducts({ articleTitle, articleTags = [], articleCategory, catalog, minLinks = 3, maxLinks = 4 }: {
  articleTitle: string;
  articleTags?: string[];
  articleCategory: string;
  catalog?: Product[];
  minLinks?: number;
  maxLinks?: number;
}): Product[] {
  if (typeof articleTitle !== 'string') throw new TypeError('articleTitle must be string');
  if (!Array.isArray(articleTags)) throw new TypeError('articleTags must be array');
  if (typeof articleCategory !== 'string') throw new TypeError('articleCategory must be string');

  const products = catalog || PRODUCT_CATALOG;
  const titleLower = articleTitle.toLowerCase();
  const catLower = articleCategory.toLowerCase();
  
  // Score each product by keyword relevance
  const scored = products.map(product => {
    let score = 0;
    
    // Check keyword matches against article title
    for (const kw of product.keywords) {
      if (titleLower.includes(kw.toLowerCase())) {
        score += 3;
      }
    }
    
    // Category affinity mapping
    const categoryAffinities: Record<string, string[]> = {
      "the-basics": ["journals", "books", "sleep-masks", "decor", "weighted-blankets"],
      "the-techniques": ["supplements", "sleep-tech", "sleep-masks", "books", "blue-light"],
      "the-science": ["books", "sleep-tech", "brain-tech", "supplements", "blue-light"],
      "the-practice": ["journals", "meditation", "aromatherapy", "sound", "weighted-blankets", "books"],
      "the-advanced": ["books", "supplements", "herbs", "brain-tech", "meditation"],
    };
    
    const affinities = categoryAffinities[catLower] || [];
    if (affinities.includes(product.category)) {
      score += 2;
    }
    
    // Specific keyword boosts
    if (titleLower.includes("journal") && product.category === "journals") score += 5;
    if (titleLower.includes("supplement") && product.category === "supplements") score += 5;
    if (titleLower.includes("wbtb") && (product.category === "sleep-tech")) score += 5;
    if (titleLower.includes("meditation") && product.category === "meditation") score += 5;
    if (titleLower.includes("sleep") && (product.category === "sleep-masks" || product.category === "sound" || product.category === "weighted-blankets")) score += 4;
    if (titleLower.includes("dream yoga") && product.category === "books") score += 3;
    if (titleLower.includes("galantamine") && product.category === "supplements") score += 5;
    if (titleLower.includes("mugwort") && product.category === "herbs") score += 5;
    if (titleLower.includes("aromatherapy") && product.category === "aromatherapy") score += 5;
    if (titleLower.includes("lavender") && product.category === "aromatherapy") score += 5;
    if (titleLower.includes("noise") && product.category === "sound") score += 5;
    if (titleLower.includes("mask") && product.category === "sleep-masks") score += 5;
    
    return { product, score };
  });
  
  // Sort by score descending, then shuffle ties
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return Math.random() - 0.5;
  });
  
  // Return top N unique products
  const seen = new Set<string>();
  const results: Product[] = [];
  
  for (const { product } of scored) {
    if (seen.has(product.asin)) continue;
    seen.add(product.asin);
    results.push(product);
    if (results.length >= maxLinks) break;
  }
  
  return results;
}
