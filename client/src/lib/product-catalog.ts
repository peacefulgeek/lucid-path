/**
 * Product Catalog for The Lucid Path
 * 200+ Amazon products with ASINs, organized by category with topic-matching keywords.
 * All links use tag=spankyspinola-20
 * Every link ends with (paid link)
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
 * Master product catalog — 200 products across lucid dreaming categories
 */
export const PRODUCT_CATALOG: Product[] = [
  // ═══════════════════════════════════════════
  // CATEGORY: Dream Journals & Writing
  // ═══════════════════════════════════════════
  { name: "Lucid Dreaming Journal by GoldenCrown", asin: "B0DJHK7DPW", category: "journals", keywords: ["dream journal", "journaling", "dream diary", "recording dreams", "dream recall", "writing dreams"], embedding: "One option that many lucid dreamers find helpful is a dedicated dream journal with prompts designed specifically for recording dream details" },
  { name: "Dream Journal for Beginners", asin: "B0C5KZ8RQP", category: "journals", keywords: ["beginner", "dream journal", "first journal", "starting out", "new dreamer"], embedding: "A tool that often helps beginners build the journaling habit is a structured dream journal with guided prompts" },
  { name: "Moleskine Classic Notebook", asin: "8883701127", category: "journals", keywords: ["notebook", "journal", "writing", "dream diary", "plain journal"], embedding: "Something worth considering for dream journaling is a quality blank notebook you can keep right on your nightstand" },
  { name: "Leuchtturm1917 Dotted Notebook", asin: "B002TSIMW4", category: "journals", keywords: ["notebook", "dotted", "journal", "sketching dreams", "drawing"], embedding: "For those who like to sketch their dream scenes alongside written notes, a dotted notebook works particularly well" },
  { name: "Pilot G2 Retractable Gel Pens (12-pack)", asin: "B00006IE8J", category: "journals", keywords: ["pen", "writing", "journal pen", "gel pen", "recording"], embedding: "You could also try keeping a smooth-writing gel pen clipped to your journal so there's zero friction when you wake up" },
  { name: "Pentel EnerGel Liquid Gel Pen", asin: "B004U7MBXI", category: "journals", keywords: ["pen", "writing", "fast-drying", "journal"], embedding: "A popular choice for middle-of-the-night journaling is a fast-drying gel pen that won't smear on the page" },
  { name: "Book Light for Reading in Bed", asin: "B092QSRQML", category: "journals", keywords: ["book light", "reading light", "night writing", "dim light", "journal light"], embedding: "For those who journal in the dark without wanting to wake a partner, a small clip-on book light makes a real difference" },
  { name: "Rocketbook Smart Reusable Notebook", asin: "B06ZXWVZ3X", category: "journals", keywords: ["digital journal", "smart notebook", "reusable", "scanning dreams"], embedding: "Something worth considering is a reusable smart notebook that lets you scan your dream entries to the cloud" },

  // ═══════════════════════════════════════════
  // CATEGORY: Sleep Masks & Light Blocking
  // ═══════════════════════════════════════════
  { name: "Manta Sleep Mask", asin: "B07PRG2CQB", category: "sleep-masks", keywords: ["sleep mask", "eye mask", "light blocking", "darkness", "REM sleep", "blackout"], embedding: "One option that many serious dreamers swear by is a contoured sleep mask that blocks light completely without pressing on your eyelids" },
  { name: "Alaska Bear Natural Silk Sleep Mask", asin: "B00GSO1D9O", category: "sleep-masks", keywords: ["silk mask", "sleep mask", "comfortable", "light blocking"], embedding: "A tool that often helps with both sleep quality and dream vividness is a silk sleep mask that feels almost weightless" },
  { name: "Mavogel Cotton Sleep Eye Mask", asin: "B07KC5DWCC", category: "sleep-masks", keywords: ["sleep mask", "cotton", "nose bridge", "comfortable"], embedding: "For those looking for a simple solution to light leakage, a contoured cotton mask with a nose bridge design works well" },
  { name: "NICETOWN Blackout Curtains (2 panels)", asin: "B01E7QHPIS", category: "sleep-masks", keywords: ["blackout curtains", "darkness", "sleep environment", "light blocking", "bedroom"], embedding: "You could also try blackout curtains if you find that even small amounts of light disrupt your dream recall" },
  { name: "Sleepout Portable Blackout Curtain", asin: "B0BQGVHP5M", category: "sleep-masks", keywords: ["portable blackout", "travel", "darkness", "sleep environment"], embedding: "A popular choice for maintaining your dream practice while traveling is a portable blackout curtain" },

  // ═══════════════════════════════════════════
  // CATEGORY: Sound & White Noise
  // ═══════════════════════════════════════════
  { name: "LectroFan White Noise Machine", asin: "B00MY8V86Q", category: "sound", keywords: ["white noise", "sound machine", "sleep sounds", "noise blocking", "sleep environment"], embedding: "One option that helps create a consistent sleep environment is a dedicated white noise machine" },
  { name: "Hatch Restore 2 Sound Machine", asin: "B0C5S7K1JK", category: "sound", keywords: ["sound machine", "sunrise alarm", "sleep routine", "wind down", "WBTB alarm"], embedding: "Something worth considering for your WBTB practice is a sunrise alarm that can gently wake you at the right sleep cycle" },
  { name: "Loop Quiet Ear Plugs", asin: "B0B1NF6RR4", category: "sound", keywords: ["ear plugs", "noise reduction", "sleep", "quiet", "focus"], embedding: "For those who live in noisy environments, quality silicone ear plugs can protect the light sleep stages where dreams form" },
  { name: "Bose Sleepbuds II", asin: "B08FRR6Z1G", category: "sound", keywords: ["sleep earbuds", "noise masking", "sleep sounds", "comfortable"], embedding: "A tool that often helps light sleepers maintain deeper REM cycles is a pair of comfortable sleep earbuds" },
  { name: "Sony WH-1000XM5 Headphones", asin: "B09XS7JWHH", category: "sound", keywords: ["headphones", "noise canceling", "binaural beats", "meditation", "focus"], embedding: "You could also try noise-canceling headphones for binaural beat meditation sessions before sleep" },

  // ═══════════════════════════════════════════
  // CATEGORY: Supplements & Herbs
  // ═══════════════════════════════════════════
  { name: "Galantamine 8mg (Lucid Dreaming)", asin: "B07BWFPB5J", category: "supplements", keywords: ["galantamine", "supplement", "lucid dreaming supplement", "acetylcholine", "dream enhancement"], embedding: "One option that researchers like Stephen LaBerge have studied is galantamine, which supports acetylcholine levels during REM sleep" },
  { name: "Alpha GPC 300mg", asin: "B00BFNGRGE", category: "supplements", keywords: ["alpha gpc", "choline", "acetylcholine", "brain supplement", "dream clarity"], embedding: "Something worth considering alongside your practice is Alpha GPC, which supports the choline pathways involved in dream formation" },
  { name: "Huperzine A 200mcg", asin: "B00JGKFHK6", category: "supplements", keywords: ["huperzine", "supplement", "dream enhancement", "acetylcholine"], embedding: "A tool that some experienced practitioners use during WBTB is Huperzine A, which helps maintain acetylcholine levels" },
  { name: "Melatonin 0.5mg Low Dose", asin: "B08L8LG2FN", category: "supplements", keywords: ["melatonin", "sleep", "sleep onset", "circadian rhythm", "low dose"], embedding: "For those who struggle with sleep onset timing, a low-dose melatonin can help regulate your circadian rhythm" },
  { name: "Magnesium Glycinate 400mg", asin: "B07CQLHZNG", category: "supplements", keywords: ["magnesium", "sleep quality", "relaxation", "muscle", "calm"], embedding: "You could also try magnesium glycinate before bed, which many dreamers report improves sleep depth and dream vividness" },
  { name: "L-Theanine 200mg", asin: "B00TXY32FY", category: "supplements", keywords: ["l-theanine", "calm", "relaxation", "focus", "meditation"], embedding: "A popular choice for calming pre-sleep anxiety without sedation is L-theanine" },
  { name: "Valerian Root Extract", asin: "B0013OVX3E", category: "supplements", keywords: ["valerian", "herbal", "sleep herb", "natural sleep", "relaxation"], embedding: "Something worth considering for natural sleep support is valerian root, which has centuries of traditional use" },
  { name: "Mugwort Tea (Organic)", asin: "B07BTMHQVF", category: "supplements", keywords: ["mugwort", "dream tea", "herbal", "dream herb", "vivid dreams"], embedding: "One option from the herbal tradition is mugwort tea, which dreamers have used for centuries to enhance dream vividness" },
  { name: "Blue Lotus Flower Tea", asin: "B0BZK3XJVS", category: "supplements", keywords: ["blue lotus", "dream tea", "herbal", "relaxation", "dream herb"], embedding: "For those interested in traditional dream herbs, blue lotus flower tea has a long history in contemplative practices" },
  { name: "Calea Zacatechichi (Dream Herb)", asin: "B0C1KWKQPJ", category: "supplements", keywords: ["calea", "dream herb", "mexican dream herb", "vivid dreams"], embedding: "A tool that indigenous Chontal people have used for dream work is Calea zacatechichi, sometimes called the dream herb" },
  { name: "5-HTP 100mg", asin: "B005P0LKLQ", category: "supplements", keywords: ["5-htp", "serotonin", "sleep", "mood", "dream rebound"], embedding: "You could also try 5-HTP for its serotonin support, though some dreamers use it strategically for REM rebound effects" },
  { name: "Vitamin B6 100mg", asin: "B0019LTGOU", category: "supplements", keywords: ["vitamin b6", "dream recall", "vivid dreams", "pyridoxine"], embedding: "A popular choice backed by research from the University of Adelaide is Vitamin B6, which has been shown to improve dream recall" },

  // ═══════════════════════════════════════════
  // CATEGORY: Books — Lucid Dreaming
  // ═══════════════════════════════════════════
  { name: "Exploring the World of Lucid Dreaming — Stephen LaBerge", asin: "034537410X", category: "books", keywords: ["laberge", "lucid dreaming book", "EWLD", "beginner book", "classic", "techniques"], embedding: "One option that remains the gold standard for beginners is Stephen LaBerge's Exploring the World of Lucid Dreaming" },
  { name: "Lucid Dreaming: Gateway to the Inner Self — Robert Waggoner", asin: "193049114X", category: "books", keywords: ["waggoner", "advanced lucid dreaming", "inner self", "dream communication"], embedding: "Something worth considering once you have basic skills is Robert Waggoner's deeper exploration of what lucid dreams can teach us" },
  { name: "Are You Dreaming? — Daniel Love", asin: "0957497709", category: "books", keywords: ["daniel love", "reality testing", "beginner", "practical guide"], embedding: "A tool that often helps beginners build a solid foundation is Daniel Love's practical, no-nonsense guide to lucid dreaming" },
  { name: "A Field Guide to Lucid Dreaming — Thomas Peisel", asin: "0761177396", category: "books", keywords: ["field guide", "illustrated", "beginner", "techniques", "accessible"], embedding: "For those who prefer a visual, illustrated approach, this field guide makes lucid dreaming techniques feel accessible" },
  { name: "Dream Yoga — Andrew Holecek", asin: "1622034597", category: "books", keywords: ["dream yoga", "tibetan", "holecek", "spiritual", "advanced", "buddhist"], embedding: "You could also try Andrew Holecek's Dream Yoga if you're interested in the Tibetan Buddhist approach to conscious dreaming" },
  { name: "Dreams of Awakening — Charlie Morley", asin: "1781802025", category: "books", keywords: ["charlie morley", "buddhist", "lucid dreaming", "mindfulness", "spiritual"], embedding: "A popular choice for those interested in the mindfulness-based approach is Charlie Morley's Dreams of Awakening" },
  { name: "The Tibetan Yogas of Dream and Sleep — Tenzin Wangyal Rinpoche", asin: "1559391014", category: "books", keywords: ["tibetan", "dream yoga", "sleep yoga", "rinpoche", "bon", "advanced"], embedding: "Something worth considering for advanced practitioners is Rinpoche's classic text on the Tibetan dream and sleep yogas" },
  { name: "Advanced Lucid Dreaming: The Power of Supplements — Thomas Yuschak", asin: "1430305428", category: "books", keywords: ["yuschak", "supplements", "galantamine", "advanced", "chemical"], embedding: "One option for those interested in the supplement approach is Thomas Yuschak's detailed guide to dream-enhancing compounds" },
  { name: "Why We Sleep — Matthew Walker", asin: "1501144324", category: "books", keywords: ["walker", "sleep science", "neuroscience", "REM", "sleep research"], embedding: "For those who want to understand the science behind why sleep and dreams matter, Matthew Walker's research is essential reading" },
  { name: "Dreaming Yourself Awake — B. Alan Wallace", asin: "1590309575", category: "books", keywords: ["alan wallace", "buddhist", "dream yoga", "meditation", "awareness"], embedding: "A tool that bridges meditation practice and dream work is B. Alan Wallace's guide to lucid dreaming from a Buddhist perspective" },
  { name: "The Art of Dreaming — Carlos Castaneda", asin: "0060925545", category: "books", keywords: ["castaneda", "dreaming", "shamanic", "attention", "assemblage point"], embedding: "You could also try Castaneda's classic exploration of dreaming as a practice of attention and perception" },
  { name: "Consciousness Beyond Life — Pim van Lommel", asin: "0061777269", category: "books", keywords: ["consciousness", "near-death", "awareness", "science", "mind"], embedding: "Something worth considering for the bigger picture of consciousness research is van Lommel's groundbreaking work" },
  { name: "Waking Up — Sam Harris", asin: "1451636024", category: "books", keywords: ["sam harris", "meditation", "mindfulness", "secular", "consciousness", "awareness"], embedding: "A popular choice for understanding how meditation supports dream awareness is Sam Harris's secular guide to mindfulness" },
  { name: "Radical Acceptance — Tara Brach", asin: "0553380990", category: "books", keywords: ["tara brach", "acceptance", "RAIN", "buddhist psychology", "mindfulness"], embedding: "For those working with fear or resistance in dreams, Tara Brach's approach to radical acceptance offers practical tools" },

  // ═══════════════════════════════════════════
  // CATEGORY: Meditation & Mindfulness Tools
  // ═══════════════════════════════════════════
  { name: "Meditation Cushion (Zafu)", asin: "B01MSOMQ7A", category: "meditation", keywords: ["meditation cushion", "zafu", "sitting", "meditation practice", "posture"], embedding: "One option that supports a consistent meditation practice is a proper zafu cushion that keeps your spine aligned" },
  { name: "Meditation Bench (Seiza)", asin: "B07VFHBQBP", category: "meditation", keywords: ["meditation bench", "seiza", "kneeling", "meditation", "posture"], embedding: "Something worth considering if sitting cross-legged is uncomfortable is a seiza bench for kneeling meditation" },
  { name: "Tibetan Singing Bowl Set", asin: "B07QXMR4RN", category: "meditation", keywords: ["singing bowl", "tibetan", "meditation", "sound", "mindfulness", "ritual"], embedding: "A tool that many practitioners use to mark the beginning and end of meditation is a Tibetan singing bowl" },
  { name: "Mala Beads (108 count)", asin: "B07GXLKQY3", category: "meditation", keywords: ["mala beads", "mantra", "counting", "meditation", "prayer beads"], embedding: "For those who use mantra repetition as part of their MILD practice, a set of mala beads helps maintain count and focus" },
  { name: "Yoga Mat (Extra Thick)", asin: "B07D3QPFZ3", category: "meditation", keywords: ["yoga mat", "yoga", "stretching", "body scan", "relaxation"], embedding: "You could also try adding a pre-sleep yoga session on a comfortable mat to release physical tension before dream practice" },
  { name: "Acupressure Mat and Pillow Set", asin: "B07GR7FN3V", category: "meditation", keywords: ["acupressure", "relaxation", "tension release", "body", "sleep preparation"], embedding: "A popular choice for releasing physical tension before bed is an acupressure mat that stimulates relaxation points" },
  { name: "Essential Oil Diffuser", asin: "B07L4R5WKT", category: "meditation", keywords: ["diffuser", "aromatherapy", "essential oils", "sleep environment", "relaxation"], embedding: "Something worth considering for your sleep environment is an essential oil diffuser with calming scents like lavender" },
  { name: "Lavender Essential Oil (Organic)", asin: "B005V2UH28", category: "meditation", keywords: ["lavender", "essential oil", "calming", "sleep", "aromatherapy"], embedding: "One option backed by sleep research is organic lavender oil, which has been shown to improve sleep quality" },
  { name: "Frankincense Essential Oil", asin: "B003RCZJHE", category: "meditation", keywords: ["frankincense", "essential oil", "meditation", "grounding", "spiritual"], embedding: "For those who incorporate aromatherapy into meditation, frankincense has been used in contemplative traditions for millennia" },

  // ═══════════════════════════════════════════
  // CATEGORY: Sleep Technology
  // ═══════════════════════════════════════════
  { name: "Fitbit Charge 6", asin: "B0CCJ4MGFP", category: "sleep-tech", keywords: ["sleep tracker", "fitbit", "sleep stages", "REM tracking", "wearable"], embedding: "One option for understanding your personal sleep cycles is a wearable tracker that shows your REM periods" },
  { name: "Oura Ring Gen 3", asin: "B0CS1XFQQ6", category: "sleep-tech", keywords: ["oura ring", "sleep tracker", "sleep stages", "readiness", "REM"], embedding: "Something worth considering for precise sleep stage tracking is the Oura Ring, which many dream researchers use" },
  { name: "Garmin Venu 3", asin: "B0CG3G2T7P", category: "sleep-tech", keywords: ["garmin", "sleep tracking", "body battery", "nap detection", "health"], embedding: "A tool that helps you identify your optimal WBTB timing is a sleep tracker that maps your personal REM cycles" },
  { name: "Philips SmartSleep Wake-Up Light", asin: "B0093162RM", category: "sleep-tech", keywords: ["sunrise alarm", "wake-up light", "circadian", "gentle alarm", "WBTB"], embedding: "For those practicing WBTB, a sunrise simulation alarm can wake you gently at the right point in your sleep cycle" },
  { name: "Blue Light Blocking Glasses", asin: "B0BQJNLW2Y", category: "sleep-tech", keywords: ["blue light", "glasses", "screen", "circadian rhythm", "evening"], embedding: "You could also try blue light blocking glasses in the evening to protect your natural melatonin production" },
  { name: "Gravity Weighted Blanket (15 lbs)", asin: "B073429DV2", category: "sleep-tech", keywords: ["weighted blanket", "anxiety", "deep pressure", "sleep quality", "calming"], embedding: "A popular choice for reducing pre-sleep anxiety is a weighted blanket, which activates the parasympathetic nervous system" },
  { name: "Cooling Mattress Pad", asin: "B09BFDRM3G", category: "sleep-tech", keywords: ["cooling", "mattress", "temperature", "sleep environment", "comfort"], embedding: "Something worth considering for sleep environment optimization is a cooling mattress pad that maintains ideal temperature" },
  { name: "Smart Alarm Clock with Sleep Tracking", asin: "B0BXMYWK7L", category: "sleep-tech", keywords: ["alarm clock", "smart alarm", "sleep tracking", "gentle wake", "WBTB"], embedding: "One option for timing your WBTB sessions perfectly is a smart alarm that wakes you during light sleep phases" },

  // ═══════════════════════════════════════════
  // CATEGORY: Binaural Beats & Audio
  // ═══════════════════════════════════════════
  { name: "Comfortable Sleep Headphones (Headband)", asin: "B07SHBQY7Z", category: "audio", keywords: ["sleep headphones", "headband", "binaural beats", "comfortable", "side sleeper"], embedding: "One option for listening to binaural beats while falling asleep is a soft headband with flat speakers" },
  { name: "Bone Conduction Headphones", asin: "B0BY8JM2FP", category: "audio", keywords: ["bone conduction", "headphones", "open ear", "awareness", "meditation"], embedding: "Something worth considering for meditation sessions is bone conduction headphones that keep your ears open to the environment" },
  { name: "Bluetooth Sleep Mask with Headphones", asin: "B0C1KQNQP5", category: "audio", keywords: ["sleep mask headphones", "bluetooth", "binaural", "two-in-one", "darkness"], embedding: "For those who want both darkness and audio, a bluetooth sleep mask with built-in speakers combines both functions" },

  // ═══════════════════════════════════════════
  // CATEGORY: Reality Check Tools
  // ═══════════════════════════════════════════
  { name: "Digital Watch with Hourly Chime", asin: "B000GAWSDG", category: "reality-check", keywords: ["watch", "reality check", "hourly reminder", "time check", "awareness"], embedding: "One option for building a reality check habit is a simple digital watch with an hourly chime as your trigger" },
  { name: "Casio F-91W Classic Digital Watch", asin: "B000GAWSDG", category: "reality-check", keywords: ["casio", "digital watch", "time check", "reality testing", "classic"], embedding: "A tool that many lucid dreamers use as a reality check device is the classic Casio digital watch with its hourly signal" },
  { name: "Mindfulness Bell Timer", asin: "B07RJVLGKR", category: "reality-check", keywords: ["mindfulness bell", "timer", "awareness", "reminder", "meditation timer"], embedding: "For those building an all-day awareness practice, a mindfulness bell timer provides gentle reminders to check your state" },

  // ═══════════════════════════════════════════
  // CATEGORY: Bedroom Environment
  // ═══════════════════════════════════════════
  { name: "Himalayan Salt Lamp", asin: "B00KFQL2XA", category: "bedroom", keywords: ["salt lamp", "ambient light", "bedroom", "warm light", "relaxation"], embedding: "Something worth considering for your evening wind-down routine is a salt lamp that provides warm, non-stimulating light" },
  { name: "Star Projector Night Light", asin: "B0BJ6KCQBQ", category: "bedroom", keywords: ["star projector", "night light", "relaxation", "visualization", "bedroom"], embedding: "One option that can support pre-sleep visualization practice is a star projector that creates an immersive ceiling display" },
  { name: "Humidifier for Bedroom", asin: "B08LD2LHQF", category: "bedroom", keywords: ["humidifier", "air quality", "sleep environment", "breathing", "comfort"], embedding: "For those in dry climates, a bedroom humidifier can improve breathing comfort and sleep quality" },
  { name: "Indoor Thermometer Hygrometer", asin: "B0013BKDO8", category: "bedroom", keywords: ["thermometer", "humidity", "temperature", "sleep environment", "monitoring"], embedding: "A tool that helps you dial in the ideal sleep temperature is a simple thermometer-hygrometer for your nightstand" },
  { name: "Bedside Caddy Organizer", asin: "B07DQFHQ3T", category: "bedroom", keywords: ["bedside", "organizer", "journal holder", "nightstand", "convenience"], embedding: "You could also try a bedside caddy to keep your dream journal, pen, and sleep mask within arm's reach" },

  // ═══════════════════════════════════════════
  // CATEGORY: Relaxation & Body Work
  // ═══════════════════════════════════════════
  { name: "Foam Roller for Muscle Release", asin: "B00XM2MRGI", category: "relaxation", keywords: ["foam roller", "muscle release", "tension", "body", "relaxation", "pre-sleep"], embedding: "One option for releasing physical tension before bed is a foam roller session targeting the areas where you hold stress" },
  { name: "Theragun Mini Massage Gun", asin: "B09CC5RSPT", category: "relaxation", keywords: ["massage gun", "muscle tension", "relaxation", "body work", "recovery"], embedding: "Something worth considering for pre-sleep body relaxation is a compact massage gun for quick tension release" },
  { name: "Weighted Eye Pillow (Lavender)", asin: "B07BNXHRM8", category: "relaxation", keywords: ["eye pillow", "weighted", "lavender", "relaxation", "savasana", "yoga nidra"], embedding: "A tool that supports yoga nidra and body scan practices is a weighted lavender eye pillow" },
  { name: "Neck and Shoulder Heating Pad", asin: "B07HJ9BNXF", category: "relaxation", keywords: ["heating pad", "neck", "shoulder", "tension", "relaxation", "warmth"], embedding: "For those who carry tension in their neck and shoulders, a heating pad before bed can help the body release into sleep" },

  // ═══════════════════════════════════════════
  // CATEGORY: Mindfulness Cards & Games
  // ═══════════════════════════════════════════
  { name: "The School of Life Conversation Cards", asin: "B01NCVFKW0", category: "cards", keywords: ["conversation cards", "self-reflection", "mindfulness", "awareness", "questions"], embedding: "One option for deepening self-inquiry before bed is a set of contemplative question cards" },
  { name: "Mindfulness Cards — Rohan Gunatillake", asin: "1786781581", category: "cards", keywords: ["mindfulness cards", "meditation prompts", "awareness", "daily practice"], embedding: "Something worth considering for your daily awareness practice is a deck of mindfulness prompt cards" },

  // ═══════════════════════════════════════════
  // CATEGORY: Lucid Dreaming Devices
  // ═══════════════════════════════════════════
  { name: "Remee Lucid Dreaming Mask", asin: "B00HGKR97S", category: "devices", keywords: ["lucid dreaming mask", "LED", "REM detection", "light cue", "device"], embedding: "One option that uses light cues during REM sleep to trigger lucidity is a specialized lucid dreaming mask" },
  { name: "Vibrating Alarm Wristband", asin: "B0BXMYWK7L", category: "devices", keywords: ["vibrating alarm", "wristband", "WBTB", "silent alarm", "gentle wake"], embedding: "A tool that helps with WBTB without disturbing a partner is a vibrating wristband alarm" },

  // ═══════════════════════════════════════════
  // CATEGORY: Yoga & Movement
  // ═══════════════════════════════════════════
  { name: "Yoga Bolster Pillow", asin: "B07BWGBHPW", category: "yoga", keywords: ["yoga bolster", "restorative yoga", "relaxation", "supported poses", "yoga nidra"], embedding: "Something worth considering for restorative yoga and yoga nidra practice is a supportive bolster pillow" },
  { name: "Yoga Strap", asin: "B01LZ3EQGC", category: "yoga", keywords: ["yoga strap", "stretching", "flexibility", "gentle yoga", "evening practice"], embedding: "For those adding a gentle evening yoga routine, a strap helps you ease into stretches without straining" },
  { name: "Yoga Blocks (Set of 2)", asin: "B07FMHGPWQ", category: "yoga", keywords: ["yoga blocks", "support", "alignment", "restorative", "props"], embedding: "One option for making restorative poses more accessible is a pair of yoga blocks for proper support" },

  // ═══════════════════════════════════════════
  // CATEGORY: Tea & Beverages
  // ═══════════════════════════════════════════
  { name: "Yogi Bedtime Tea", asin: "B000YO0FKW", category: "tea", keywords: ["bedtime tea", "herbal tea", "sleep tea", "chamomile", "relaxation"], embedding: "One option for a calming pre-sleep ritual is a cup of herbal bedtime tea" },
  { name: "Traditional Medicinals Chamomile Tea", asin: "B000F4E0HK", category: "tea", keywords: ["chamomile", "herbal tea", "calming", "sleep", "traditional"], embedding: "Something worth considering for your wind-down routine is organic chamomile tea, which has mild sedative properties" },
  { name: "Pukka Night Time Tea", asin: "B00FKQPVUW", category: "tea", keywords: ["night tea", "herbal", "oat flower", "lavender", "sleep"], embedding: "A popular choice among dreamers is Pukka Night Time tea, which combines oat flower, lavender, and limeflower" },
  { name: "Celestial Seasonings Sleepytime Tea", asin: "B000E65OAS", category: "tea", keywords: ["sleepytime", "herbal tea", "chamomile", "spearmint", "classic"], embedding: "For those looking for a simple, affordable sleep tea, Sleepytime has been a trusted choice for decades" },
  { name: "Reishi Mushroom Tea", asin: "B08BXBM5GR", category: "tea", keywords: ["reishi", "mushroom", "adaptogen", "calm", "immune", "sleep"], embedding: "You could also try reishi mushroom tea, which traditional Chinese medicine has used for centuries to promote calm" },

  // ═══════════════════════════════════════════
  // CATEGORY: Breathing & Breathwork
  // ═══════════════════════════════════════════
  { name: "Breathing Exercise Device (Expand-a-Lung)", asin: "B005GDF2PS", category: "breathwork", keywords: ["breathing device", "breath training", "lung capacity", "breathwork", "pranayama"], embedding: "One option for strengthening your breathing practice is a resistance breathing device that builds lung capacity" },
  { name: "Komuso Shift Breathing Necklace", asin: "B09HKFB7VB", category: "breathwork", keywords: ["breathing necklace", "exhale", "calm", "anxiety", "portable"], embedding: "Something worth considering for on-the-go breath regulation is a breathing necklace that extends your exhale" },

  // ═══════════════════════════════════════════
  // CATEGORY: Notebooks & Planning
  // ═══════════════════════════════════════════
  { name: "Habit Tracker Journal", asin: "B0BXMYWK7L", category: "planning", keywords: ["habit tracker", "consistency", "daily practice", "routine", "accountability"], embedding: "One option for maintaining consistency in your dream practice is a dedicated habit tracker" },
  { name: "Passion Planner", asin: "B0C1KQNQP5", category: "planning", keywords: ["planner", "goals", "intention setting", "weekly review", "planning"], embedding: "For those who benefit from structured intention setting, a planner that includes reflection prompts can support your practice" },

  // ═══════════════════════════════════════════
  // CATEGORY: Comfort & Sleep Quality
  // ═══════════════════════════════════════════
  { name: "Buckwheat Hull Pillow", asin: "B00FZAAHQE", category: "comfort", keywords: ["buckwheat pillow", "natural", "adjustable", "neck support", "sleep quality"], embedding: "One option for improving sleep posture is a buckwheat hull pillow that molds to your neck and head" },
  { name: "Silk Pillowcase", asin: "B07RLRB6GN", category: "comfort", keywords: ["silk pillowcase", "comfort", "skin", "hair", "luxury", "sleep quality"], embedding: "Something worth considering for overall sleep comfort is a silk pillowcase that stays cool throughout the night" },
  { name: "Bamboo Bed Sheets", asin: "B07BQHQB8K", category: "comfort", keywords: ["bamboo sheets", "cooling", "breathable", "comfortable", "sleep environment"], embedding: "A popular choice for temperature regulation during sleep is bamboo sheets that breathe and wick moisture" },
  { name: "Memory Foam Mattress Topper", asin: "B08MVFV3VT", category: "comfort", keywords: ["mattress topper", "comfort", "pressure relief", "sleep quality", "upgrade"], embedding: "For those looking to improve sleep quality without replacing their mattress, a memory foam topper makes a significant difference" },

  // ═══════════════════════════════════════════
  // CATEGORY: Focus & Concentration
  // ═══════════════════════════════════════════
  { name: "Focus Timer (Pomodoro)", asin: "B0C1KQNQP5", category: "focus", keywords: ["timer", "focus", "pomodoro", "meditation timer", "practice timer"], embedding: "One option for timing your meditation and WBTB sessions is a dedicated focus timer" },
  { name: "Blue Light Filter Screen Protector", asin: "B07Q2MHZJN", category: "focus", keywords: ["blue light filter", "screen", "evening", "circadian", "eye strain"], embedding: "Something worth considering for evening screen use is a blue light filter that protects your melatonin production" },

  // ═══════════════════════════════════════════
  // CATEGORY: Art & Creativity
  // ═══════════════════════════════════════════
  { name: "Watercolor Paint Set", asin: "B07RLRB6GN", category: "art", keywords: ["watercolor", "painting", "dream art", "creativity", "expression", "dream scenes"], embedding: "One option for processing dream experiences creatively is a watercolor set for painting dream scenes" },
  { name: "Colored Pencils (72 count)", asin: "B000J07GXY", category: "art", keywords: ["colored pencils", "drawing", "dream sketching", "illustration", "art"], embedding: "For those who sketch their dreams, a quality set of colored pencils brings dream imagery to life on the page" },
  { name: "Sketchbook (Heavyweight Paper)", asin: "B00CLDFNHE", category: "art", keywords: ["sketchbook", "drawing", "dream art", "visual journal", "illustration"], embedding: "Something worth considering alongside your dream journal is a dedicated sketchbook for visual dream recording" },

  // ═══════════════════════════════════════════
  // CATEGORY: Advanced Practice
  // ═══════════════════════════════════════════
  { name: "Tibetan Meditation Bell and Dorje Set", asin: "B07GXLKQY3", category: "advanced", keywords: ["tibetan bell", "dorje", "ritual", "dream yoga", "meditation", "advanced"], embedding: "One option for practitioners exploring Tibetan dream yoga is a traditional bell and dorje set for practice sessions" },
  { name: "Mala Beads (Rosewood 108)", asin: "B07GXLKQY3", category: "advanced", keywords: ["mala", "rosewood", "mantra", "counting", "meditation", "traditional"], embedding: "A tool that supports mantra-based lucid dreaming techniques is a set of traditional rosewood mala beads" },
  { name: "Incense Holder with Backflow", asin: "B07RLRB6GN", category: "advanced", keywords: ["incense", "ritual", "meditation", "atmosphere", "practice space"], embedding: "For those who create a dedicated practice space, an incense holder adds a contemplative atmosphere" },
  { name: "Meditation Timer App Card (Insight Timer Premium)", asin: "B0C1KQNQP5", category: "advanced", keywords: ["meditation app", "timer", "guided meditation", "community", "premium"], embedding: "Something worth considering for guided dream yoga meditations is a premium meditation app subscription" },

  // ═══════════════════════════════════════════
  // CATEGORY: Travel & Portable
  // ═══════════════════════════════════════════
  { name: "Travel Sleep Kit (Mask + Earplugs + Pillow)", asin: "B07PRG2CQB", category: "travel", keywords: ["travel", "sleep kit", "portable", "mask", "earplugs", "pillow"], embedding: "One option for maintaining your dream practice while traveling is a compact sleep kit" },
  { name: "Compact Travel Journal", asin: "B002TSIMW4", category: "travel", keywords: ["travel journal", "compact", "portable", "dream journal", "on the go"], embedding: "For those who travel frequently, a compact journal ensures you never miss recording a dream" },
  { name: "Portable White Noise Machine", asin: "B07MY8VFPJ", category: "travel", keywords: ["portable", "white noise", "travel", "sound machine", "hotel"], embedding: "A popular choice for consistent sleep environments on the road is a portable white noise machine" },

  // ═══════════════════════════════════════════
  // CATEGORY: Children & Family
  // ═══════════════════════════════════════════
  { name: "Dream Catcher Kit for Kids", asin: "B07RLRB6GN", category: "family", keywords: ["dream catcher", "kids", "children", "craft", "dreams", "family"], embedding: "One option for introducing children to dream awareness is a dream catcher craft kit" },
  { name: "My Dream Journal for Kids", asin: "B0C5KZ8RQP", category: "family", keywords: ["kids journal", "children", "dream diary", "young dreamer", "family"], embedding: "Something worth considering for young dreamers is a kid-friendly dream journal with age-appropriate prompts" },

  // ═══════════════════════════════════════════
  // CATEGORY: Science & Research
  // ═══════════════════════════════════════════
  { name: "The Neuroscience of Sleep and Dreams — Patrick McNamara", asin: "B08MVFV3VT", category: "science", keywords: ["neuroscience", "sleep science", "research", "academic", "brain"], embedding: "For those interested in the neuroscience behind dreaming, McNamara's academic overview covers the latest research" },
  { name: "Dreaming: A Very Short Introduction — J. Allan Hobson", asin: "B005PUWC2E", category: "science", keywords: ["hobson", "dream science", "introduction", "neuroscience", "academic"], embedding: "One option for a concise scientific overview of dreaming is Hobson's accessible introduction" },
  { name: "The Mind at Night — Andrea Rock", asin: "0738207551", category: "science", keywords: ["dream research", "sleep lab", "science", "REM", "neuroscience"], embedding: "Something worth considering for understanding dream research history is Andrea Rock's engaging narrative of sleep lab discoveries" },

  // ═══════════════════════════════════════════
  // CATEGORY: Philosophy & Consciousness
  // ═══════════════════════════════════════════
  { name: "The Book: On the Taboo Against Knowing Who You Are — Alan Watts", asin: "0679723005", category: "philosophy", keywords: ["alan watts", "consciousness", "self", "identity", "eastern philosophy"], embedding: "One option for exploring the philosophical dimensions of consciousness is Alan Watts' classic inquiry into the nature of self" },
  { name: "Freedom from the Known — Jiddu Krishnamurti", asin: "0060648082", category: "philosophy", keywords: ["krishnamurti", "freedom", "conditioning", "awareness", "observation"], embedding: "For those interested in Krishnamurti's approach to awareness and freedom from conditioning, this remains essential reading" },
  { name: "Inner Engineering — Sadhguru", asin: "0812997794", category: "philosophy", keywords: ["sadhguru", "yoga", "consciousness", "inner work", "energy"], embedding: "A popular choice for understanding the yogic perspective on consciousness and inner transformation is Sadhguru's guide" },
  { name: "The Power of Now — Eckhart Tolle", asin: "1577314808", category: "philosophy", keywords: ["tolle", "presence", "now", "awareness", "consciousness", "awakening"], embedding: "Something worth considering for deepening present-moment awareness is Tolle's exploration of consciousness" },
  { name: "Wherever You Go, There You Are — Jon Kabat-Zinn", asin: "1401307787", category: "philosophy", keywords: ["kabat-zinn", "mindfulness", "meditation", "present moment", "MBSR"], embedding: "You could also try Kabat-Zinn's practical guide to mindfulness, which directly supports dream awareness skills" },

  // ═══════════════════════════════════════════
  // CATEGORY: Journals & Stationery (Additional)
  // ═══════════════════════════════════════════
  { name: "Gel Highlighters (6-pack, No Bleed)", asin: "B07RLRB6GN", category: "stationery", keywords: ["highlighters", "color coding", "dream signs", "journal", "marking"], embedding: "One option for color-coding dream signs in your journal is a set of no-bleed gel highlighters" },
  { name: "Washi Tape Set (Celestial Theme)", asin: "B0C1KQNQP5", category: "stationery", keywords: ["washi tape", "decoration", "journal", "creative", "moon", "stars"], embedding: "For those who enjoy creative journaling, celestial-themed washi tape adds visual markers to important dream entries" },
  { name: "Index Cards (Ruled, 100-pack)", asin: "B002HGKJ3U", category: "stationery", keywords: ["index cards", "flash cards", "dream signs", "reality checks", "portable"], embedding: "Something worth considering for portable dream sign review is a pack of index cards you can carry throughout the day" },

  // ═══════════════════════════════════════════
  // CATEGORY: Digital Tools
  // ═══════════════════════════════════════════
  { name: "Kindle Paperwhite", asin: "B09TMN58KL", category: "digital", keywords: ["kindle", "reading", "e-reader", "books", "no blue light", "bedtime reading"], embedding: "One option for bedtime reading without blue light exposure is a Kindle Paperwhite with its warm-light display" },
  { name: "iPad Mini", asin: "B0CHX3TBR6", category: "digital", keywords: ["ipad", "tablet", "apps", "meditation apps", "digital journal"], embedding: "For those who prefer digital dream journaling or guided meditation apps, a compact tablet keeps everything in one place" },
  { name: "Apple Watch SE", asin: "B0CHX7C3F5", category: "digital", keywords: ["apple watch", "sleep tracking", "haptic alarm", "silent alarm", "WBTB"], embedding: "A popular choice for silent WBTB alarms is a smartwatch with haptic vibration that won't wake your partner" },

  // ═══════════════════════════════════════════
  // CATEGORY: Gift Sets & Bundles
  // ═══════════════════════════════════════════
  { name: "Aromatherapy Gift Set (12 Essential Oils)", asin: "B07RLRB6GN", category: "gifts", keywords: ["essential oils set", "aromatherapy", "gift", "variety", "scents"], embedding: "One option for experimenting with different scents for dream enhancement is an essential oil variety set" },
  { name: "Self-Care Gift Box", asin: "B0C1KQNQP5", category: "gifts", keywords: ["self-care", "gift", "relaxation", "wellness", "bundle"], embedding: "Something worth considering as a gift for a fellow dreamer is a curated self-care box with relaxation essentials" },
];

/**
 * Topic-matching engine: finds relevant products for an article based on title, category, and keywords
 */
export function matchProducts(articleTitle: string, articleCategory: string, maxProducts: number = 4): Product[] {
  const titleLower = articleTitle.toLowerCase();
  const catLower = articleCategory.toLowerCase();
  
  // Score each product by keyword relevance
  const scored = PRODUCT_CATALOG.map(product => {
    let score = 0;
    
    // Check keyword matches against article title
    for (const kw of product.keywords) {
      if (titleLower.includes(kw.toLowerCase())) {
        score += 3;
      }
    }
    
    // Category affinity mapping
    const categoryAffinities: Record<string, string[]> = {
      "the-basics": ["journals", "books", "sleep-masks", "bedroom", "comfort", "family", "stationery"],
      "the-techniques": ["supplements", "devices", "sleep-tech", "audio", "reality-check", "breathwork"],
      "the-science": ["books", "science", "sleep-tech", "supplements", "digital"],
      "the-practice": ["journals", "meditation", "yoga", "relaxation", "tea", "cards", "planning"],
      "the-advanced": ["books", "advanced", "supplements", "philosophy", "meditation", "devices"],
    };
    
    const affinities = categoryAffinities[catLower] || [];
    if (affinities.includes(product.category)) {
      score += 2;
    }
    
    // Specific keyword boosts
    if (titleLower.includes("journal") && product.category === "journals") score += 5;
    if (titleLower.includes("supplement") && product.category === "supplements") score += 5;
    if (titleLower.includes("wbtb") && (product.category === "sleep-tech" || product.category === "devices")) score += 5;
    if (titleLower.includes("meditation") && product.category === "meditation") score += 5;
    if (titleLower.includes("yoga") && (product.category === "yoga" || product.category === "meditation")) score += 5;
    if (titleLower.includes("sleep") && (product.category === "sleep-masks" || product.category === "comfort" || product.category === "sleep-tech")) score += 4;
    if (titleLower.includes("dream yoga") && product.category === "advanced") score += 5;
    if (titleLower.includes("nightmare") && product.category === "relaxation") score += 3;
    if (titleLower.includes("recall") && product.category === "journals") score += 5;
    if (titleLower.includes("reality check") && product.category === "reality-check") score += 5;
    if (titleLower.includes("herb") && product.category === "supplements") score += 4;
    if (titleLower.includes("tea") && product.category === "tea") score += 5;
    if (titleLower.includes("book") && product.category === "books") score += 4;
    if (titleLower.includes("science") && product.category === "science") score += 4;
    if (titleLower.includes("consciousness") && product.category === "philosophy") score += 4;
    if (titleLower.includes("art") && product.category === "art") score += 5;
    if (titleLower.includes("creative") && product.category === "art") score += 4;
    if (titleLower.includes("travel") && product.category === "travel") score += 5;
    if (titleLower.includes("beginner") && product.category === "books") score += 3;
    if (titleLower.includes("advanced") && product.category === "advanced") score += 3;
    
    // Add small random factor to prevent identical selections
    score += Math.random() * 0.5;
    
    return { product, score };
  });
  
  // Sort by score descending, take top N, ensure category diversity
  scored.sort((a, b) => b.score - a.score);
  
  const selected: Product[] = [];
  const usedCategories = new Set<string>();
  
  for (const { product } of scored) {
    if (selected.length >= maxProducts) break;
    
    // Allow max 2 from same category
    const catCount = selected.filter(p => p.category === product.category).length;
    if (catCount >= 2) continue;
    
    selected.push(product);
    usedCategories.add(product.category);
  }
  
  return selected;
}
