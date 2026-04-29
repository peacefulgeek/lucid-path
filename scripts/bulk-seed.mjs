#!/usr/bin/env node
/**
 * bulk-seed.mjs
 * Generates 500 articles via DeepSeek V4-Pro and inserts them as status='queued'.
 * Each article passes through the quality gate before being stored.
 * Failed articles are NOT stored (abandoned after 4 attempts).
 *
 * Usage: OPENAI_API_KEY=sk-xxx node scripts/bulk-seed.mjs [--start=0] [--count=500] [--batch=5]
 *
 * Flags:
 *   --start=N   Start from topic index N (default: 0)
 *   --count=N   Generate N articles (default: 500)
 *   --batch=N   Concurrent batch size (default: 5)
 */

import OpenAI from 'openai';
import { runQualityGate, GENERATION_HARD_RULES } from '../src/lib/article-quality-gate.mjs';
import { extractAsinsFromText, verifyAsin, buildAmazonUrl } from '../src/lib/amazon-verify.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AMAZON_TAG = process.env.AMAZON_TAG || 'spankyspinola-20';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.deepseek.com'
});

const MODEL = process.env.OPENAI_MODEL || 'deepseek-v4-pro';

// ─── 500 NICHE-SPECIFIC LUCID DREAMING TOPICS ───
const TOPICS = [
  // THE BASICS (100 topics)
  { topic: "What is lucid dreaming and why should you care", category: "the-basics" },
  { topic: "The difference between vivid dreams and lucid dreams", category: "the-basics" },
  { topic: "How to know if you've had a lucid dream before", category: "the-basics" },
  { topic: "Lucid dreaming myths that hold beginners back", category: "the-basics" },
  { topic: "Your first lucid dream: what to expect and how to prepare", category: "the-basics" },
  { topic: "Why some people naturally lucid dream and others don't", category: "the-basics" },
  { topic: "The beginner's roadmap to consistent lucid dreaming", category: "the-basics" },
  { topic: "How long does it take to have your first lucid dream", category: "the-basics" },
  { topic: "Dream signs: the gateway to recognizing you're dreaming", category: "the-basics" },
  { topic: "Understanding sleep cycles and when lucid dreams happen", category: "the-basics" },
  { topic: "The role of intention in lucid dreaming", category: "the-basics" },
  { topic: "Common first lucid dream experiences people report", category: "the-basics" },
  { topic: "Why dream recall is the foundation of lucid dreaming", category: "the-basics" },
  { topic: "How to set up your bedroom for lucid dreaming success", category: "the-basics" },
  { topic: "The connection between mindfulness and dream awareness", category: "the-basics" },
  { topic: "Lucid dreaming vs astral projection: clearing up the confusion", category: "the-basics" },
  { topic: "How stress and anxiety affect your ability to lucid dream", category: "the-basics" },
  { topic: "The best time of night to attempt lucid dreaming", category: "the-basics" },
  { topic: "Why consistency matters more than technique in lucid dreaming", category: "the-basics" },
  { topic: "How diet affects your dreams and lucid dreaming potential", category: "the-basics" },
  { topic: "Screen time before bed and its impact on dream quality", category: "the-basics" },
  { topic: "The relationship between sleep quality and lucid dreaming", category: "the-basics" },
  { topic: "How to explain lucid dreaming to skeptical friends", category: "the-basics" },
  { topic: "Children and lucid dreaming: what parents should know", category: "the-basics" },
  { topic: "Lucid dreaming and creativity: unlocking your imagination", category: "the-basics" },
  { topic: "The history of lucid dreaming across cultures", category: "the-basics" },
  { topic: "Famous lucid dreamers throughout history", category: "the-basics" },
  { topic: "How alcohol affects your dreams and lucid dreaming", category: "the-basics" },
  { topic: "Cannabis and lucid dreaming: what the research says", category: "the-basics" },
  { topic: "The difference between dream control and dream awareness", category: "the-basics" },
  { topic: "How to stay motivated when lucid dreaming progress is slow", category: "the-basics" },
  { topic: "Lucid dreaming terminology every beginner should know", category: "the-basics" },
  { topic: "The role of belief and expectation in lucid dreaming", category: "the-basics" },
  { topic: "How napping can help you achieve lucid dreams", category: "the-basics" },
  { topic: "Lucid dreaming and sleep disorders: what you need to know", category: "the-basics" },
  { topic: "The difference between spontaneous and induced lucid dreams", category: "the-basics" },
  { topic: "How temperature affects your sleep and dream quality", category: "the-basics" },
  { topic: "Lucid dreaming as a tool for personal growth", category: "the-basics" },
  { topic: "The connection between daydreaming and lucid dreaming", category: "the-basics" },
  { topic: "How exercise affects your dreams", category: "the-basics" },
  { topic: "Lucid dreaming and memory: how they're connected", category: "the-basics" },
  { topic: "The role of REM sleep in lucid dreaming", category: "the-basics" },
  { topic: "How to create a lucid dreaming practice schedule", category: "the-basics" },
  { topic: "Lucid dreaming apps: which ones actually help", category: "the-basics" },
  { topic: "The psychology behind why we dream", category: "the-basics" },
  { topic: "How meditation prepares your mind for lucid dreaming", category: "the-basics" },
  { topic: "Lucid dreaming and emotional intelligence", category: "the-basics" },
  { topic: "The difference between lucid dreaming and sleep paralysis", category: "the-basics" },
  { topic: "How to use affirmations for lucid dreaming", category: "the-basics" },
  { topic: "Lucid dreaming retreats: are they worth it", category: "the-basics" },
  { topic: "The role of curiosity in becoming a lucid dreamer", category: "the-basics" },
  { topic: "How aging affects lucid dreaming ability", category: "the-basics" },
  { topic: "Lucid dreaming and problem solving", category: "the-basics" },
  { topic: "The connection between hypnagogia and lucid dreaming", category: "the-basics" },
  { topic: "How to use music to enhance dream quality", category: "the-basics" },
  { topic: "Lucid dreaming and the default mode network", category: "the-basics" },
  { topic: "Why some nights are better for lucid dreaming than others", category: "the-basics" },
  { topic: "The role of dopamine in dream vividness", category: "the-basics" },
  { topic: "How to track your lucid dreaming progress effectively", category: "the-basics" },
  { topic: "Lucid dreaming and flow states: the connection", category: "the-basics" },
  { topic: "The impact of blue light on dream quality", category: "the-basics" },
  { topic: "How to use visualization for lucid dreaming", category: "the-basics" },
  { topic: "Lucid dreaming and the placebo effect", category: "the-basics" },
  { topic: "The role of acetylcholine in lucid dreaming", category: "the-basics" },
  { topic: "How to overcome fear of lucid dreaming", category: "the-basics" },
  { topic: "Lucid dreaming and self-awareness: the deep connection", category: "the-basics" },
  { topic: "The best books for lucid dreaming beginners", category: "the-basics" },
  { topic: "How to use podcasts and audiobooks for lucid dreaming", category: "the-basics" },
  { topic: "Lucid dreaming communities: where to find support", category: "the-basics" },
  { topic: "The role of serotonin in dream quality", category: "the-basics" },
  { topic: "How to deal with dry spells in lucid dreaming", category: "the-basics" },
  { topic: "Lucid dreaming and the unconscious mind", category: "the-basics" },
  { topic: "The connection between reading and dream vividness", category: "the-basics" },
  { topic: "How to use scent to trigger lucid dreams", category: "the-basics" },
  { topic: "Lucid dreaming and spiritual awakening", category: "the-basics" },
  { topic: "The role of melatonin in dream quality", category: "the-basics" },
  { topic: "How to create a dream-friendly sleep environment", category: "the-basics" },
  { topic: "Lucid dreaming and the brain's prefrontal cortex", category: "the-basics" },
  { topic: "The connection between yoga and lucid dreaming", category: "the-basics" },
  { topic: "How to use binaural beats for lucid dreaming", category: "the-basics" },
  { topic: "Lucid dreaming and the science of consciousness", category: "the-basics" },
  { topic: "The role of GABA in sleep and dreaming", category: "the-basics" },
  { topic: "How to use progressive muscle relaxation for lucid dreaming", category: "the-basics" },
  { topic: "Lucid dreaming and the theta brainwave state", category: "the-basics" },
  { topic: "The connection between journaling and dream awareness", category: "the-basics" },
  { topic: "How to use body scanning for lucid dreaming", category: "the-basics" },
  { topic: "Lucid dreaming and the gamma brainwave state", category: "the-basics" },
  { topic: "The role of sleep pressure in dream quality", category: "the-basics" },
  { topic: "How to use counting techniques for lucid dreaming", category: "the-basics" },
  { topic: "Lucid dreaming and neuroplasticity", category: "the-basics" },
  { topic: "The connection between gratitude practice and dream quality", category: "the-basics" },
  { topic: "How to use the wake-back-to-bed method as a beginner", category: "the-basics" },
  { topic: "Lucid dreaming and the circadian rhythm", category: "the-basics" },
  { topic: "The role of sleep stages in dream formation", category: "the-basics" },
  { topic: "How to use dream incubation for specific dreams", category: "the-basics" },
  { topic: "Lucid dreaming and the hippocampus", category: "the-basics" },
  { topic: "The connection between nature exposure and dream quality", category: "the-basics" },
  { topic: "How to use breathing exercises for lucid dreaming", category: "the-basics" },
  { topic: "Lucid dreaming and emotional processing during sleep", category: "the-basics" },
  { topic: "The role of sleep architecture in lucid dreaming", category: "the-basics" },
  { topic: "How to build a morning dream recall routine", category: "the-basics" },

  // THE TECHNIQUES (100 topics)
  { topic: "MILD technique: the complete step-by-step guide", category: "the-techniques" },
  { topic: "WILD technique: entering dreams directly from waking", category: "the-techniques" },
  { topic: "WBTB technique: the most reliable lucid dreaming method", category: "the-techniques" },
  { topic: "SSILD technique: senses initiated lucid dreaming explained", category: "the-techniques" },
  { topic: "FILD technique: finger induced lucid dreaming for beginners", category: "the-techniques" },
  { topic: "DILD technique: dream initiated lucid dreaming mastery", category: "the-techniques" },
  { topic: "Reality testing: the 10 most effective reality checks", category: "the-techniques" },
  { topic: "The nose pinch reality check: why it works so well", category: "the-techniques" },
  { topic: "Hand reality checks: looking at your hands in dreams", category: "the-techniques" },
  { topic: "Digital clock reality checks and how to use them", category: "the-techniques" },
  { topic: "The light switch reality check technique", category: "the-techniques" },
  { topic: "How to combine WBTB with MILD for maximum success", category: "the-techniques" },
  { topic: "The DEILD technique: chaining lucid dreams together", category: "the-techniques" },
  { topic: "Wake initiated lucid dreaming without sleep paralysis", category: "the-techniques" },
  { topic: "How to use the CANWILD technique effectively", category: "the-techniques" },
  { topic: "The VILD technique: visual induction of lucid dreams", category: "the-techniques" },
  { topic: "Autosuggestion techniques for lucid dreaming", category: "the-techniques" },
  { topic: "How to use prospective memory training for lucid dreaming", category: "the-techniques" },
  { topic: "The TILD technique: timer induced lucid dreaming", category: "the-techniques" },
  { topic: "How to use the LILD technique with light cues", category: "the-techniques" },
  { topic: "Mnemonic devices for improving dream recall", category: "the-techniques" },
  { topic: "How to perform reality checks without looking weird in public", category: "the-techniques" },
  { topic: "The awareness technique: all-day awareness for lucid dreaming", category: "the-techniques" },
  { topic: "How to use the phantom wiggle technique", category: "the-techniques" },
  { topic: "Dream journaling techniques that actually improve recall", category: "the-techniques" },
  { topic: "Voice recording your dreams: pros and cons", category: "the-techniques" },
  { topic: "How to use dream mapping for pattern recognition", category: "the-techniques" },
  { topic: "The cycle adjustment technique for lucid dreaming", category: "the-techniques" },
  { topic: "How to use the anchor technique for dream stability", category: "the-techniques" },
  { topic: "The spinning technique for staying in a lucid dream", category: "the-techniques" },
  { topic: "Hand rubbing technique for dream stabilization", category: "the-techniques" },
  { topic: "How to extend the duration of your lucid dreams", category: "the-techniques" },
  { topic: "The verbal command technique in lucid dreams", category: "the-techniques" },
  { topic: "How to change dream scenes intentionally", category: "the-techniques" },
  { topic: "The door technique for dream scene transitions", category: "the-techniques" },
  { topic: "How to summon dream characters", category: "the-techniques" },
  { topic: "The expectation technique for dream control", category: "the-techniques" },
  { topic: "How to fly in lucid dreams: techniques that work", category: "the-techniques" },
  { topic: "Telekinesis in lucid dreams: moving objects with your mind", category: "the-techniques" },
  { topic: "How to create objects in lucid dreams", category: "the-techniques" },
  { topic: "The behind-the-back technique for summoning", category: "the-techniques" },
  { topic: "How to use mantras for lucid dreaming induction", category: "the-techniques" },
  { topic: "The wake-up-go-back-to-sleep technique variations", category: "the-techniques" },
  { topic: "How to use the WBTB alarm strategy optimally", category: "the-techniques" },
  { topic: "The 61-point relaxation technique for WILD", category: "the-techniques" },
  { topic: "How to use hypnagogic imagery for lucid dreaming", category: "the-techniques" },
  { topic: "The falling asleep consciously technique", category: "the-techniques" },
  { topic: "How to use the third eye technique for lucid dreaming", category: "the-techniques" },
  { topic: "The body scan technique for entering lucid dreams", category: "the-techniques" },
  { topic: "How to use the rope technique for OBE-style lucid dreams", category: "the-techniques" },
  { topic: "The roll-out technique for exiting sleep paralysis into dreams", category: "the-techniques" },
  { topic: "How to use the mirror technique in lucid dreams", category: "the-techniques" },
  { topic: "The portal technique for accessing specific dream locations", category: "the-techniques" },
  { topic: "How to use the elevator technique for dream level changes", category: "the-techniques" },
  { topic: "The television technique for dream scene selection", category: "the-techniques" },
  { topic: "How to use the phone technique for dream communication", category: "the-techniques" },
  { topic: "The pocket technique for finding objects in dreams", category: "the-techniques" },
  { topic: "How to use the gravity technique for dream flight", category: "the-techniques" },
  { topic: "The time dilation technique in lucid dreams", category: "the-techniques" },
  { topic: "How to use the cloak technique for dream invisibility", category: "the-techniques" },
  { topic: "The healing technique: using lucid dreams for physical recovery", category: "the-techniques" },
  { topic: "How to use the interview technique with dream characters", category: "the-techniques" },
  { topic: "The painting technique for creating dream landscapes", category: "the-techniques" },
  { topic: "How to use the music technique for dream mood control", category: "the-techniques" },
  { topic: "The taste technique: experiencing food in lucid dreams", category: "the-techniques" },
  { topic: "How to use the weather technique for dream atmosphere", category: "the-techniques" },
  { topic: "The size-shifting technique in lucid dreams", category: "the-techniques" },
  { topic: "How to use the duplication technique for dream cloning", category: "the-techniques" },
  { topic: "The transformation technique: shapeshifting in dreams", category: "the-techniques" },
  { topic: "How to use the rewind technique for dream replay", category: "the-techniques" },
  { topic: "The zoom technique for enhanced dream perception", category: "the-techniques" },
  { topic: "How to use the freeze technique for dream time control", category: "the-techniques" },
  { topic: "The dissolve technique for ending unwanted dream scenarios", category: "the-techniques" },
  { topic: "How to use the amplify technique for dream senses", category: "the-techniques" },
  { topic: "The layer technique for building complex dream worlds", category: "the-techniques" },
  { topic: "How to use the memory palace technique in lucid dreams", category: "the-techniques" },
  { topic: "The conversation technique for accessing dream wisdom", category: "the-techniques" },
  { topic: "How to use the writing technique for dream messages", category: "the-techniques" },
  { topic: "The meditation technique inside lucid dreams", category: "the-techniques" },
  { topic: "How to use the breathing technique for dream deepening", category: "the-techniques" },
  { topic: "The grounding technique for preventing premature awakening", category: "the-techniques" },
  { topic: "How to use the focus technique for dream clarity", category: "the-techniques" },
  { topic: "The surrender technique for advanced dream exploration", category: "the-techniques" },
  { topic: "How to use the intention technique for dream goals", category: "the-techniques" },
  { topic: "The awareness technique for maintaining lucidity", category: "the-techniques" },
  { topic: "How to use the questioning technique for dream insight", category: "the-techniques" },
  { topic: "The observation technique for passive lucid dreaming", category: "the-techniques" },
  { topic: "How to use the acceptance technique for dream flow", category: "the-techniques" },
  { topic: "The integration technique for post-lucid dream processing", category: "the-techniques" },
  { topic: "How to combine multiple techniques for better results", category: "the-techniques" },
  { topic: "The progressive technique ladder for skill building", category: "the-techniques" },
  { topic: "How to troubleshoot when techniques stop working", category: "the-techniques" },
  { topic: "The adaptation technique for personalizing your approach", category: "the-techniques" },
  { topic: "How to use the review technique for continuous improvement", category: "the-techniques" },
  { topic: "The minimalist approach to lucid dreaming techniques", category: "the-techniques" },
  { topic: "How to use the experimental technique for discovery", category: "the-techniques" },
  { topic: "The hybrid technique: creating your own lucid dreaming method", category: "the-techniques" },
  { topic: "How to use the social technique for group lucid dreaming practice", category: "the-techniques" },
  { topic: "The documentation technique for tracking what works", category: "the-techniques" },

  // THE SCIENCE (100 topics)
  { topic: "The neuroscience of lucid dreaming: what happens in the brain", category: "the-science" },
  { topic: "EEG studies on lucid dreaming: what the brainwaves reveal", category: "the-science" },
  { topic: "fMRI research on lucid dreaming and brain activation", category: "the-science" },
  { topic: "The role of the prefrontal cortex in dream awareness", category: "the-science" },
  { topic: "Gamma waves and lucid dreaming: the 40Hz connection", category: "the-science" },
  { topic: "How REM sleep creates the conditions for lucid dreaming", category: "the-science" },
  { topic: "The default mode network and its role in dreaming", category: "the-science" },
  { topic: "Acetylcholine and lucid dreaming: the neurotransmitter connection", category: "the-science" },
  { topic: "The science behind galantamine and lucid dreaming", category: "the-science" },
  { topic: "How alpha-GPC supports dream vividness", category: "the-science" },
  { topic: "The role of choline in dream enhancement", category: "the-science" },
  { topic: "Melatonin and dream quality: what the research shows", category: "the-science" },
  { topic: "5-HTP and its effects on REM sleep and dreaming", category: "the-science" },
  { topic: "The science of dream herbs: mugwort, calea, and blue lotus", category: "the-science" },
  { topic: "How vitamin B6 affects dream vividness", category: "the-science" },
  { topic: "The tACS research on inducing lucid dreams with electricity", category: "the-science" },
  { topic: "Transcranial direct current stimulation and lucid dreaming", category: "the-science" },
  { topic: "The science of sleep paralysis and its connection to lucid dreaming", category: "the-science" },
  { topic: "How the thalamus gates consciousness during sleep", category: "the-science" },
  { topic: "The hippocampus and dream memory consolidation", category: "the-science" },
  { topic: "Neuroplasticity and how lucid dreaming changes the brain", category: "the-science" },
  { topic: "The science of dream recall: why we forget dreams", category: "the-science" },
  { topic: "How sleep spindles relate to lucid dreaming ability", category: "the-science" },
  { topic: "The role of the anterior cingulate cortex in dream awareness", category: "the-science" },
  { topic: "Mirror neurons and their role in dream simulation", category: "the-science" },
  { topic: "The science of false awakenings", category: "the-science" },
  { topic: "How the brain distinguishes dreams from reality", category: "the-science" },
  { topic: "The neuroscience of nightmare formation and treatment", category: "the-science" },
  { topic: "Sleep architecture and how it changes with age", category: "the-science" },
  { topic: "The science of dream content: what we dream about and why", category: "the-science" },
  { topic: "How cortisol levels affect dream quality", category: "the-science" },
  { topic: "The role of the amygdala in dream emotions", category: "the-science" },
  { topic: "Dopamine and its influence on dream motivation", category: "the-science" },
  { topic: "The science of recurring dreams", category: "the-science" },
  { topic: "How the brain processes time in dreams", category: "the-science" },
  { topic: "The neuroscience of dream characters and their autonomy", category: "the-science" },
  { topic: "Sleep deprivation and REM rebound effects on dreaming", category: "the-science" },
  { topic: "The science of dream incubation: can you choose what to dream", category: "the-science" },
  { topic: "How polyphasic sleep affects dream quality", category: "the-science" },
  { topic: "The role of the pons in REM sleep generation", category: "the-science" },
  { topic: "Norepinephrine and its role in dream state transitions", category: "the-science" },
  { topic: "The science of lucid dreaming supplements: a systematic review", category: "the-science" },
  { topic: "How the brain creates dream environments", category: "the-science" },
  { topic: "The neuroscience of dream emotions vs waking emotions", category: "the-science" },
  { topic: "Sleep quality metrics that predict lucid dreaming success", category: "the-science" },
  { topic: "The science of dream journaling and memory encoding", category: "the-science" },
  { topic: "How meditation changes brain structure for lucid dreaming", category: "the-science" },
  { topic: "The role of the insula in dream body awareness", category: "the-science" },
  { topic: "Serotonin and its complex role in sleep and dreaming", category: "the-science" },
  { topic: "The science of binaural beats and their effect on brainwaves", category: "the-science" },
  { topic: "How the brain generates visual imagery in dreams", category: "the-science" },
  { topic: "The neuroscience of dream narrative structure", category: "the-science" },
  { topic: "Sleep disorders that affect lucid dreaming ability", category: "the-science" },
  { topic: "The science of dream sharing and telepathic dreaming claims", category: "the-science" },
  { topic: "How circadian rhythms influence dream content", category: "the-science" },
  { topic: "The role of the basal ganglia in dream movement", category: "the-science" },
  { topic: "GABA and its role in sleep onset and dream transitions", category: "the-science" },
  { topic: "The science of sleep inertia and dream recall windows", category: "the-science" },
  { topic: "How the brain processes pain in dreams", category: "the-science" },
  { topic: "The neuroscience of dream creativity and insight", category: "the-science" },
  { topic: "Sleep genetics and inherited dreaming traits", category: "the-science" },
  { topic: "The science of dream reentry techniques", category: "the-science" },
  { topic: "How the brain handles paradoxes in dreams", category: "the-science" },
  { topic: "The neuroscience of dream lucidity levels", category: "the-science" },
  { topic: "Sleep microstructure and its relationship to dream quality", category: "the-science" },
  { topic: "The science of dream symbolism: is there a universal language", category: "the-science" },
  { topic: "How the brain creates the sense of self in dreams", category: "the-science" },
  { topic: "The neuroscience of wake-initiated lucid dreaming", category: "the-science" },
  { topic: "Sleep pressure and adenosine effects on dream quality", category: "the-science" },
  { topic: "The science of dream healing and psychosomatic effects", category: "the-science" },
  { topic: "How the brain integrates sensory information in dreams", category: "the-science" },
  { topic: "The neuroscience of dream control vs dream observation", category: "the-science" },
  { topic: "Sleep chronotype and its influence on lucid dreaming", category: "the-science" },
  { topic: "The science of prophetic dreams: coincidence or cognition", category: "the-science" },
  { topic: "How the brain generates dream sounds and music", category: "the-science" },
  { topic: "The neuroscience of dream amnesia", category: "the-science" },
  { topic: "Sleep fragmentation and its effects on dream continuity", category: "the-science" },
  { topic: "The science of dream anxiety and its waking correlates", category: "the-science" },
  { topic: "How the brain processes language in dreams", category: "the-science" },
  { topic: "The neuroscience of shared dream elements across cultures", category: "the-science" },
  { topic: "Sleep homeostasis and its role in dream regulation", category: "the-science" },
  { topic: "The science of dream priming and pre-sleep suggestion", category: "the-science" },
  { topic: "How the brain creates the illusion of dream time", category: "the-science" },
  { topic: "The neuroscience of dream vividness and sensory fidelity", category: "the-science" },
  { topic: "Sleep and memory consolidation through dream replay", category: "the-science" },
  { topic: "The science of dream therapy for PTSD", category: "the-science" },
  { topic: "How the brain manages attention in lucid dreams", category: "the-science" },
  { topic: "The neuroscience of dream metacognition", category: "the-science" },
  { topic: "Sleep and immune function: how dreaming supports health", category: "the-science" },
  { topic: "The science of dream phenomenology: mapping the dream world", category: "the-science" },
  { topic: "How the brain processes gravity and physics in dreams", category: "the-science" },
  { topic: "The neuroscience of dream boundaries and reality testing", category: "the-science" },
  { topic: "Sleep and hormonal cycles: effects on dream content", category: "the-science" },
  { topic: "The science of dream enhancement through cognitive training", category: "the-science" },
  { topic: "How the brain generates dream narratives from memory fragments", category: "the-science" },
  { topic: "The neuroscience of waking up from lucid dreams", category: "the-science" },
  { topic: "Sleep research breakthroughs that changed our understanding of dreams", category: "the-science" },
  { topic: "The science of dream frequency and what it means for mental health", category: "the-science" },

  // THE PRACTICE (100 topics)
  { topic: "Building a daily lucid dreaming practice that sticks", category: "the-practice" },
  { topic: "The perfect morning routine for dream recall", category: "the-practice" },
  { topic: "Evening rituals that prime your mind for lucid dreaming", category: "the-practice" },
  { topic: "How to keep a dream journal that actually works", category: "the-practice" },
  { topic: "Digital vs paper dream journals: which is better", category: "the-practice" },
  { topic: "Meditation practices specifically designed for lucid dreamers", category: "the-practice" },
  { topic: "Mindfulness exercises you can do throughout the day for lucid dreaming", category: "the-practice" },
  { topic: "How to use yoga nidra for lucid dreaming", category: "the-practice" },
  { topic: "Breathwork practices that enhance dream awareness", category: "the-practice" },
  { topic: "The role of physical exercise in dream quality", category: "the-practice" },
  { topic: "Sleep hygiene habits every lucid dreamer needs", category: "the-practice" },
  { topic: "How to optimize your sleep schedule for lucid dreaming", category: "the-practice" },
  { topic: "The ideal bedroom setup for a lucid dreamer", category: "the-practice" },
  { topic: "How to use essential oils for dream enhancement", category: "the-practice" },
  { topic: "Crystal practices for lucid dreaming: amethyst, moonstone, and more", category: "the-practice" },
  { topic: "How to use sound machines for better sleep and dreams", category: "the-practice" },
  { topic: "The role of weighted blankets in sleep quality and dreaming", category: "the-practice" },
  { topic: "How to use sleep masks for darkness and dream cues", category: "the-practice" },
  { topic: "Tea rituals for lucid dreaming: mugwort, chamomile, and valerian", category: "the-practice" },
  { topic: "How to use supplements safely for lucid dreaming", category: "the-practice" },
  { topic: "The galantamine protocol: timing, dosage, and safety", category: "the-practice" },
  { topic: "How to use alpha-GPC for dream enhancement", category: "the-practice" },
  { topic: "Vitamin B6 supplementation for vivid dreams", category: "the-practice" },
  { topic: "How to use mugwort for dream enhancement", category: "the-practice" },
  { topic: "Blue lotus tea and its effects on dreaming", category: "the-practice" },
  { topic: "How to create a dream altar or sacred sleep space", category: "the-practice" },
  { topic: "The role of intention setting before sleep", category: "the-practice" },
  { topic: "How to use dream pillows for enhanced dreaming", category: "the-practice" },
  { topic: "Lucid dreaming and intermittent fasting: the connection", category: "the-practice" },
  { topic: "How to use cold exposure for better sleep and dreams", category: "the-practice" },
  { topic: "The role of hydration in dream quality", category: "the-practice" },
  { topic: "How to use progressive relaxation for sleep onset", category: "the-practice" },
  { topic: "The body scan meditation for lucid dreamers", category: "the-practice" },
  { topic: "How to use loving-kindness meditation for dream quality", category: "the-practice" },
  { topic: "Walking meditation and its effects on dream awareness", category: "the-practice" },
  { topic: "How to use tai chi for improved dream recall", category: "the-practice" },
  { topic: "The role of creative expression in dream quality", category: "the-practice" },
  { topic: "How to use art journaling for dream processing", category: "the-practice" },
  { topic: "Dream sketching: drawing your dreams for better recall", category: "the-practice" },
  { topic: "How to use dream dictation apps effectively", category: "the-practice" },
  { topic: "The role of social dreaming groups in practice", category: "the-practice" },
  { topic: "How to find a lucid dreaming accountability partner", category: "the-practice" },
  { topic: "The 30-day lucid dreaming challenge: a complete guide", category: "the-practice" },
  { topic: "How to maintain your practice during stressful periods", category: "the-practice" },
  { topic: "The role of weekend practice in lucid dreaming progress", category: "the-practice" },
  { topic: "How to use vacation time for intensive dream practice", category: "the-practice" },
  { topic: "The seasonal approach to lucid dreaming practice", category: "the-practice" },
  { topic: "How to adapt your practice for shift work schedules", category: "the-practice" },
  { topic: "The role of napping in a lucid dreaming practice", category: "the-practice" },
  { topic: "How to use the snooze alarm for dream re-entry", category: "the-practice" },
  { topic: "The role of dream sharing in a practice community", category: "the-practice" },
  { topic: "How to teach lucid dreaming to a friend", category: "the-practice" },
  { topic: "The role of reading before bed in dream quality", category: "the-practice" },
  { topic: "How to use guided meditations for lucid dreaming", category: "the-practice" },
  { topic: "The role of gratitude practice in dream positivity", category: "the-practice" },
  { topic: "How to use the Wim Hof method for dream enhancement", category: "the-practice" },
  { topic: "The role of forest bathing in dream quality", category: "the-practice" },
  { topic: "How to use flotation tanks for lucid dreaming", category: "the-practice" },
  { topic: "The role of sensory deprivation in dream enhancement", category: "the-practice" },
  { topic: "How to use dream re-entry techniques after waking", category: "the-practice" },
  { topic: "The role of pre-sleep visualization in dream content", category: "the-practice" },
  { topic: "How to use the memory palace technique for dream recall", category: "the-practice" },
  { topic: "The role of cognitive behavioral techniques in dream practice", category: "the-practice" },
  { topic: "How to use self-hypnosis for lucid dreaming", category: "the-practice" },
  { topic: "The role of neurofeedback in lucid dreaming training", category: "the-practice" },
  { topic: "How to use the Zeo or Muse headband for dream tracking", category: "the-practice" },
  { topic: "The role of smart watches in sleep and dream monitoring", category: "the-practice" },
  { topic: "How to use the Remee sleep mask for lucid dreaming", category: "the-practice" },
  { topic: "The role of light therapy in sleep quality and dreaming", category: "the-practice" },
  { topic: "How to use white noise for better sleep and dreams", category: "the-practice" },
  { topic: "The role of pink noise in sleep quality research", category: "the-practice" },
  { topic: "How to use ASMR for sleep onset and dream quality", category: "the-practice" },
  { topic: "The role of sleep stories in dream incubation", category: "the-practice" },
  { topic: "How to use the 4-7-8 breathing technique for sleep", category: "the-practice" },
  { topic: "The role of magnesium supplementation in sleep quality", category: "the-practice" },
  { topic: "How to use L-theanine for relaxation and dream quality", category: "the-practice" },
  { topic: "The role of ashwagandha in sleep and dream quality", category: "the-practice" },
  { topic: "How to use valerian root for better sleep and dreams", category: "the-practice" },
  { topic: "The role of passionflower in dream enhancement", category: "the-practice" },
  { topic: "How to create a supplement stack for lucid dreaming", category: "the-practice" },
  { topic: "The role of diet timing in dream quality", category: "the-practice" },
  { topic: "How to use the Mediterranean diet for better sleep", category: "the-practice" },
  { topic: "The role of tryptophan-rich foods in dream quality", category: "the-practice" },
  { topic: "How to use cherry juice for melatonin and dream enhancement", category: "the-practice" },
  { topic: "The role of caffeine timing in dream quality", category: "the-practice" },
  { topic: "How to use dream herbs responsibly", category: "the-practice" },
  { topic: "The role of micro-dosing in dream enhancement research", category: "the-practice" },
  { topic: "How to create a personalized lucid dreaming protocol", category: "the-practice" },
  { topic: "The role of accountability in long-term dream practice", category: "the-practice" },
  { topic: "How to measure and track your lucid dreaming progress", category: "the-practice" },
  { topic: "The role of patience and persistence in dream mastery", category: "the-practice" },
  { topic: "How to celebrate milestones in your lucid dreaming journey", category: "the-practice" },
  { topic: "The role of self-compassion in dream practice", category: "the-practice" },
  { topic: "How to recover from a lucid dreaming burnout", category: "the-practice" },
  { topic: "The role of variety in maintaining dream practice motivation", category: "the-practice" },
  { topic: "How to integrate lucid dreaming into a busy lifestyle", category: "the-practice" },
  { topic: "The role of retreat practice in accelerating progress", category: "the-practice" },
  { topic: "How to build a home lucid dreaming retreat experience", category: "the-practice" },

  // THE ADVANCED (100 topics)
  { topic: "Dream yoga: the Tibetan Buddhist approach to lucid dreaming", category: "the-advanced" },
  { topic: "Yoga nidra and lucid dreaming: the conscious sleep connection", category: "the-advanced" },
  { topic: "Advanced WILD techniques for experienced dreamers", category: "the-advanced" },
  { topic: "The art of dream stabilization at high lucidity levels", category: "the-advanced" },
  { topic: "Exploring the void: what happens between dream scenes", category: "the-advanced" },
  { topic: "Dream characters as autonomous entities: the debate", category: "the-advanced" },
  { topic: "Communicating with the dream itself: asking the dream questions", category: "the-advanced" },
  { topic: "Shared dreaming: can two people meet in a dream", category: "the-advanced" },
  { topic: "Dream telepathy research: the Maimonides experiments", category: "the-advanced" },
  { topic: "Precognitive dreaming: coincidence or genuine phenomenon", category: "the-advanced" },
  { topic: "The philosophy of consciousness in lucid dreaming", category: "the-advanced" },
  { topic: "Lucid dreaming and the hard problem of consciousness", category: "the-advanced" },
  { topic: "Dream phenomenology: mapping the landscape of dream experience", category: "the-advanced" },
  { topic: "The relationship between lucid dreaming and meditation mastery", category: "the-advanced" },
  { topic: "Using lucid dreams for shadow work and psychological integration", category: "the-advanced" },
  { topic: "Lucid dreaming as a tool for overcoming phobias", category: "the-advanced" },
  { topic: "Using lucid dreams to process grief and loss", category: "the-advanced" },
  { topic: "Lucid dreaming for athletic performance visualization", category: "the-advanced" },
  { topic: "Using lucid dreams to practice musical instruments", category: "the-advanced" },
  { topic: "Lucid dreaming for artistic inspiration and creation", category: "the-advanced" },
  { topic: "The role of lucid dreaming in scientific discovery", category: "the-advanced" },
  { topic: "Using lucid dreams for language learning", category: "the-advanced" },
  { topic: "Lucid dreaming and the exploration of altered states", category: "the-advanced" },
  { topic: "The connection between lucid dreaming and out-of-body experiences", category: "the-advanced" },
  { topic: "Dream within a dream: nested lucidity and false awakenings", category: "the-advanced" },
  { topic: "The experience of dream death and what it teaches", category: "the-advanced" },
  { topic: "Lucid dreaming and the concept of dream time", category: "the-advanced" },
  { topic: "Exploring dream architecture: the structure of dream spaces", category: "the-advanced" },
  { topic: "The role of dream guides and mentors in lucid dreams", category: "the-advanced" },
  { topic: "Advanced dream control: manipulating dream physics", category: "the-advanced" },
  { topic: "The experience of infinite space in lucid dreams", category: "the-advanced" },
  { topic: "Lucid dreaming and the dissolution of the ego", category: "the-advanced" },
  { topic: "The mystical experience in lucid dreams", category: "the-advanced" },
  { topic: "Lucid dreaming and non-dual awareness", category: "the-advanced" },
  { topic: "The role of surrender in advanced lucid dreaming", category: "the-advanced" },
  { topic: "Dream healing: using lucid dreams for emotional recovery", category: "the-advanced" },
  { topic: "The experience of dream light and luminosity", category: "the-advanced" },
  { topic: "Lucid dreaming and the exploration of dream symbols", category: "the-advanced" },
  { topic: "The role of archetypes in lucid dream encounters", category: "the-advanced" },
  { topic: "Jungian dreamwork and lucid dreaming integration", category: "the-advanced" },
  { topic: "The experience of dream music and sound", category: "the-advanced" },
  { topic: "Lucid dreaming and synesthesia: crossing sensory boundaries", category: "the-advanced" },
  { topic: "The experience of dream taste and smell", category: "the-advanced" },
  { topic: "Lucid dreaming and the exploration of dream emotions", category: "the-advanced" },
  { topic: "The role of compassion in advanced dream practice", category: "the-advanced" },
  { topic: "Lucid dreaming and the Tibetan Book of the Dead", category: "the-advanced" },
  { topic: "The Sufi tradition of dream interpretation and lucid dreaming", category: "the-advanced" },
  { topic: "Indigenous dream traditions and their relevance today", category: "the-advanced" },
  { topic: "The Hindu tradition of dream yoga and consciousness", category: "the-advanced" },
  { topic: "Lucid dreaming in the Western esoteric tradition", category: "the-advanced" },
  { topic: "The role of lucid dreaming in shamanic practice", category: "the-advanced" },
  { topic: "Dream incubation in ancient Greek temples", category: "the-advanced" },
  { topic: "The Aboriginal Australian dreamtime and lucid awareness", category: "the-advanced" },
  { topic: "Lucid dreaming and the concept of maya in Hinduism", category: "the-advanced" },
  { topic: "The Buddhist concept of clear light dreaming", category: "the-advanced" },
  { topic: "Lucid dreaming and the exploration of past lives", category: "the-advanced" },
  { topic: "The experience of meeting deceased loved ones in lucid dreams", category: "the-advanced" },
  { topic: "Lucid dreaming and the nature of reality", category: "the-advanced" },
  { topic: "The philosophical implications of dream control", category: "the-advanced" },
  { topic: "Lucid dreaming and the simulation hypothesis", category: "the-advanced" },
  { topic: "The ethics of dream manipulation and control", category: "the-advanced" },
  { topic: "Lucid dreaming and artificial intelligence: future possibilities", category: "the-advanced" },
  { topic: "The future of lucid dreaming technology", category: "the-advanced" },
  { topic: "Brain-computer interfaces and lucid dreaming", category: "the-advanced" },
  { topic: "The potential of targeted memory reactivation for lucid dreaming", category: "the-advanced" },
  { topic: "Lucid dreaming and virtual reality: convergent technologies", category: "the-advanced" },
  { topic: "The role of psychedelics in lucid dreaming research", category: "the-advanced" },
  { topic: "Lucid dreaming and the exploration of collective consciousness", category: "the-advanced" },
  { topic: "The experience of cosmic consciousness in lucid dreams", category: "the-advanced" },
  { topic: "Lucid dreaming and the exploration of parallel realities", category: "the-advanced" },
  { topic: "The role of lucid dreaming in death preparation practices", category: "the-advanced" },
  { topic: "Advanced techniques for maintaining all-night lucidity", category: "the-advanced" },
  { topic: "The experience of dream within dream within dream", category: "the-advanced" },
  { topic: "Lucid dreaming and the exploration of mathematical concepts", category: "the-advanced" },
  { topic: "The role of lucid dreaming in creative problem solving at scale", category: "the-advanced" },
  { topic: "Advanced dream character interaction techniques", category: "the-advanced" },
  { topic: "The experience of becoming the dream environment", category: "the-advanced" },
  { topic: "Lucid dreaming and the exploration of impossible geometries", category: "the-advanced" },
  { topic: "The role of lucid dreaming in developing intuition", category: "the-advanced" },
  { topic: "Advanced techniques for dream scene persistence", category: "the-advanced" },
  { topic: "The experience of dream within meditation within dream", category: "the-advanced" },
  { topic: "Lucid dreaming and the exploration of dream logic", category: "the-advanced" },
  { topic: "The role of lucid dreaming in understanding the nature of mind", category: "the-advanced" },
  { topic: "Advanced techniques for dream body awareness", category: "the-advanced" },
  { topic: "The experience of formless awareness in lucid dreams", category: "the-advanced" },
  { topic: "Lucid dreaming and the exploration of dream boundaries", category: "the-advanced" },
  { topic: "The role of lucid dreaming in developing equanimity", category: "the-advanced" },
  { topic: "Advanced techniques for dream narrative control", category: "the-advanced" },
  { topic: "The experience of dream transformation and metamorphosis", category: "the-advanced" },
  { topic: "Lucid dreaming and the exploration of dream aesthetics", category: "the-advanced" },
  { topic: "The role of lucid dreaming in cultivating wisdom", category: "the-advanced" },
  { topic: "Advanced techniques for multi-layered dream awareness", category: "the-advanced" },
  { topic: "The experience of dream silence and stillness", category: "the-advanced" },
  { topic: "Lucid dreaming as a path to awakening", category: "the-advanced" },
  { topic: "The master lucid dreamer: what decades of practice looks like", category: "the-advanced" },
  { topic: "Teaching lucid dreaming: how to guide others on the path", category: "the-advanced" },
  { topic: "The future of lucid dreaming as a mainstream practice", category: "the-advanced" },
  { topic: "Building a legacy through dream exploration and documentation", category: "the-advanced" },
  { topic: "The role of lucid dreaming in processing childhood memories", category: "the-practice" },
  { topic: "How to use dream re-scripting for recurring nightmares", category: "the-practice" },
  { topic: "The documentation technique for building a personal dream encyclopedia", category: "the-techniques" },
  { topic: "How the brain generates the sense of touch in dreams", category: "the-science" },
  { topic: "The neuroscience of dream déjà vu experiences", category: "the-science" },
  { topic: "Lucid dreaming and the exploration of dream architecture at scale", category: "the-advanced" },
];

// ─── ASIN POOL ───
const VERIFIED_ASINS = [
  '034537410X', 'B07RWRJ4XW', 'B07PCVWM6N', 'B0C1Z3SJ36', 'B09NXLM8ZD',
  'B00E9M4XEE', 'B000GG0BNE', 'B0DJHK7DPQ', 'B0BF2KBHBP', 'B0BSHRYXFG',
  'B0D2M1HFQZ', '1577319443', '0062515675', '1250113326', '0553370286',
  '1855384566', '0345413350', '1683643313', '1683491564', '0062513710',
  '1577314808', '0143111345', '0140195963', '1591799600', 'B07BFQCF9D',
  'B0CGKFNQMS', 'B0C5KGKX2L', 'B09JNR5HBQ', 'B0C7CTYLQ2', 'B0BX7DVMHH',
  'B0B14QQV6R', 'B08DG4GNKP', 'B09683N7BX', 'B08LQNL42J'
];

function loadCatalog() {
  try {
    const catalogPath = path.resolve(__dirname, '../client/src/lib/product-catalog.ts');
    const raw = fs.readFileSync(catalogPath, 'utf-8');
    const products = [];
    const regex = /\{\s*name:\s*"([^"]+)",\s*asin:\s*"([^"]+)",\s*category:\s*"([^"]+)"/g;
    let m;
    while ((m = regex.exec(raw)) !== null) {
      products.push({ name: m[1], asin: m[2], category: m[3] });
    }
    return products;
  } catch (e) {
    console.error('[seed] Failed to load catalog:', e);
    return [];
  }
}

function getRandomAsins(count = 4) {
  const shuffled = [...VERIFIED_ASINS].sort(() => Math.random() - 0.5);
  return [...new Set(shuffled)].slice(0, count);
}

async function generateArticle(topic, category, catalog) {
  const catalogSnippet = catalog
    .filter(p => p.category === category || Math.random() < 0.3)
    .slice(0, 15)
    .map(p => `- ${p.name} (ASIN: ${p.asin})`)
    .join('\n');

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `You are a lucid dreaming expert writing for The Lucid Path blog. Write in a warm, conversational, direct-address style. You're writing for people who are genuinely curious about lucid dreaming.

Available Amazon products to link (use exactly 3 or 4 naturally in prose, each followed by "(paid link)"):
${catalogSnippet}

Amazon link format: <a href="https://www.amazon.com/dp/ASIN?tag=${AMAZON_TAG}" target="_blank" rel="nofollow sponsored">Product Name (paid link)</a>

${GENERATION_HARD_RULES}`
      },
      {
        role: 'user',
        content: `Write a blog article about: ${topic}\n\nCategory: ${category}\n\nReturn the article as HTML (no <html>/<body> tags, just the article content with <h2>, <h3>, <p>, <a> tags). Include a compelling title in an <h1> tag at the start. Aim for 1500-2000 words.`
      }
    ],
    temperature: 0.72
  });

  return response.choices[0]?.message?.content || '';
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('[seed] OPENAI_API_KEY not set. Usage: OPENAI_API_KEY=sk-xxx node scripts/bulk-seed.mjs');
    process.exit(1);
  }

  // Parse args
  const args = process.argv.slice(2);
  const startIdx = parseInt(args.find(a => a.startsWith('--start='))?.split('=')[1] || '0');
  const count = parseInt(args.find(a => a.startsWith('--count='))?.split('=')[1] || '500');
  const batchSize = parseInt(args.find(a => a.startsWith('--batch='))?.split('=')[1] || '5');

  const catalog = loadCatalog();
  const articlesPath = path.resolve(__dirname, '../client/src/data/articles.json');
  let data;
  try { data = JSON.parse(fs.readFileSync(articlesPath, 'utf-8')); } catch { data = { articles: [] }; }
  if (!data.articles) data.articles = [];

  // Get existing slugs to avoid duplicates
  const existingSlugs = new Set(data.articles.map(a => a.slug));

  const endIdx = Math.min(startIdx + count, TOPICS.length);
  const topicsToProcess = TOPICS.slice(startIdx, endIdx);

  console.log(`[seed] Processing topics ${startIdx}-${endIdx - 1} (${topicsToProcess.length} total, batch size ${batchSize})`);

  let stored = 0;
  let failed = 0;

  // Process in batches
  for (let i = 0; i < topicsToProcess.length; i += batchSize) {
    const batch = topicsToProcess.slice(i, i + batchSize);
    console.log(`[seed] Batch ${Math.floor(i / batchSize) + 1}: topics ${startIdx + i}-${startIdx + i + batch.length - 1}`);

    const results = await Promise.allSettled(
      batch.map(async ({ topic, category }) => {
        // 4-attempt quality gate
        for (let attempt = 1; attempt <= 4; attempt++) {
          try {
            const body = await generateArticle(topic, category, catalog);
            const gate = runQualityGate(body);

            if (gate.passed) {
              const titleMatch = body.match(/<h1[^>]*>(.*?)<\/h1>/i);
              const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '') : topic;
              const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

              // Skip if slug already exists
              if (existingSlugs.has(slug)) {
                console.log(`[seed] Skipping duplicate slug: ${slug}`);
                return { stored: false, reason: 'duplicate' };
              }

              existingSlugs.add(slug);
              return {
                stored: true,
                article: {
                  title, slug, category,
                  body: gate.body,
                  status: 'queued',
                  queued_at: new Date().toISOString(),
                  dateISO: new Date().toISOString().split('T')[0],
                  wordCount: gate.wordCount,
                  amazonLinks: gate.amazonLinks,
                  metaDescription: title,
                  heroImage: '',
                  ogImage: '',
                  topic
                }
              };
            }

            console.warn(`[seed] "${topic}" attempt ${attempt} failed: ${gate.failures.join(' | ')}`);
          } catch (e) {
            console.error(`[seed] "${topic}" attempt ${attempt} error: ${e.message}`);
          }
        }

        return { stored: false, reason: 'quality-gate-exhausted', topic };
      })
    );

    // Collect successful articles
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.stored) {
        data.articles.push(result.value.article);
        stored++;
      } else {
        failed++;
      }
    }

    // Save after each batch
    fs.writeFileSync(articlesPath, JSON.stringify(data, null, 2));
    console.log(`[seed] Progress: ${stored} stored, ${failed} failed, ${topicsToProcess.length - stored - failed} remaining`);

    // Rate limit between batches (2 seconds per article in batch)
    if (i + batchSize < topicsToProcess.length) {
      await new Promise(r => setTimeout(r, batchSize * 2000));
    }
  }

  console.log(`\n[seed] COMPLETE: ${stored} articles stored as 'queued', ${failed} failed`);
  console.log(`[seed] Total articles in file: ${data.articles.length}`);
  console.log(`[seed] Published: ${data.articles.filter(a => a.status === 'published' || !a.status).length}`);
  console.log(`[seed] Queued: ${data.articles.filter(a => a.status === 'queued').length}`);
}

main().catch(e => {
  console.error('[seed] Fatal error:', e);
  process.exit(1);
});
