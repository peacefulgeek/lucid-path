import { useEffect, useState, useRef } from "react";
import { SITE_NAME } from "@/lib/articles";
import { ChevronRight, Download, RotateCcw, CheckCircle2, ClipboardCheck } from "lucide-react";

interface AssessmentQuestion {
  question: string;
  options: string[];
  scores: number[];
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  results: { min: number; max: number; title: string; description: string; recommendations: string[] }[];
}

const assessments: Assessment[] = [
  {
    id: "dream-journal-audit",
    title: "Dream Journal Practice Audit",
    description: "Evaluate the effectiveness of your dream journaling practice and identify specific improvements that will accelerate your lucid dreaming progress.",
    questions: [
      { question: "How consistently do you write in your dream journal?", options: ["Haven't started", "A few times a month", "Most mornings", "Every single morning"], scores: [0, 1, 2, 3] },
      { question: "When do you record your dreams?", options: ["Later in the day", "Within an hour of waking", "Within minutes", "Immediately upon waking, before moving"], scores: [0, 1, 2, 3] },
      { question: "How much detail do you include?", options: ["A sentence or two", "Basic plot summary", "Detailed narrative with emotions", "Full sensory detail, emotions, and reflections"], scores: [0, 1, 2, 3] },
      { question: "Do you record dreams you barely remember?", options: ["No, only clear dreams", "Sometimes", "Usually note fragments", "Always — even 'no recall' entries"], scores: [0, 1, 2, 3] },
      { question: "Do you review past entries for patterns?", options: ["Never", "Rarely", "Monthly", "Weekly"], scores: [0, 1, 2, 3] },
      { question: "Do you tag or categorize your dream signs?", options: ["No system", "Informal notes", "Basic categories", "Detailed dream sign catalog"], scores: [0, 1, 2, 3] },
      { question: "Do you sketch or draw dream imagery?", options: ["Never", "Rarely", "Sometimes", "Regularly"], scores: [0, 1, 2, 3] },
      { question: "Do you note your emotional state before sleep and upon waking?", options: ["Never", "Occasionally", "Usually", "Always"], scores: [0, 1, 2, 3] },
      { question: "How many journal entries do you have total?", options: ["Under 10", "10-50", "50-200", "Over 200"], scores: [0, 1, 2, 3] },
      { question: "Has your dream recall improved since starting?", options: ["Haven't noticed", "Slightly", "Noticeably", "Dramatically"], scores: [0, 1, 2, 3] },
    ],
    results: [
      { min: 0, max: 7, title: "Journal Practice: Beginning", description: "Your journaling practice needs structure. The single most impactful change: place your journal within arm's reach and write the moment you wake, before any other thought.", recommendations: ["Place journal and pen on your pillow or nightstand tonight", "Write immediately upon waking — even one word counts", "Record 'no recall' on blank mornings to maintain the habit", "Set a gentle alarm 30 minutes before your usual wake time on weekends"] },
      { min: 8, max: 15, title: "Journal Practice: Developing", description: "You have the habit forming. Now increase depth and consistency. The difference between a good journal and a great one is sensory detail and pattern recognition.", recommendations: ["Add sensory details: What did you see, hear, feel, smell?", "Note your emotional state before sleep and upon waking", "Start a dream sign list on the first page of your journal", "Review entries weekly — circle recurring themes in a different color"] },
      { min: 16, max: 22, title: "Journal Practice: Strong", description: "Your journaling is effective and consistent. Optimize for lucid dreaming by deepening your dream sign analysis and adding pre-sleep intention notes.", recommendations: ["Create a 'Top 10 Dream Signs' list and review it before sleep", "Add a pre-sleep section: technique used, intention set, mood", "Experiment with sketching key dream images", "Rate each dream's vividness and emotional intensity on a 1-10 scale"] },
      { min: 23, max: 30, title: "Journal Practice: Exemplary", description: "Your dream journal practice is exceptional. You're extracting maximum value from your dream life. Consider sharing your methods with other practitioners.", recommendations: ["Explore digital journaling apps for searchability alongside your physical journal", "Create monthly dream reports analyzing trends and breakthroughs", "Use your dream sign catalog to design targeted reality checks", "Consider voice recording for capturing dreams that are too vivid to write fast enough"] },
    ],
  },
  {
    id: "reality-check-audit",
    title: "Reality Check Effectiveness Audit",
    description: "Are your reality checks actually working? Many practitioners go through the motions without the genuine questioning that triggers lucidity.",
    questions: [
      { question: "How many reality checks do you perform daily?", options: ["0-2", "3-5", "6-10", "More than 10"], scores: [0, 1, 2, 3] },
      { question: "When you do a reality check, do you genuinely question reality?", options: ["Just going through motions", "Sometimes genuine", "Usually genuine", "Deep genuine questioning every time"], scores: [0, 1, 2, 3] },
      { question: "How many different types of reality checks do you use?", options: ["One or none", "Two", "Three", "Four or more"], scores: [0, 1, 2, 3] },
      { question: "Do you reality check in response to dream-sign-like situations?", options: ["No — random only", "Occasionally", "Often", "Always when I notice anomalies"], scores: [0, 1, 2, 3] },
      { question: "Have your reality checks ever appeared in a dream?", options: ["Never", "Once", "A few times", "Regularly"], scores: [0, 1, 2, 3] },
      { question: "Do you combine reality checks with awareness of your surroundings?", options: ["No — just the check", "Sometimes look around", "Usually pause and observe", "Full mindful awareness each time"], scores: [0, 1, 2, 3] },
      { question: "How long does each reality check take?", options: ["Under 2 seconds", "2-5 seconds", "5-15 seconds", "15+ seconds of genuine inquiry"], scores: [0, 1, 2, 3] },
      { question: "Do you use triggers (specific events) for reality checks?", options: ["No triggers", "One trigger", "Several triggers", "Comprehensive trigger system"], scores: [0, 1, 2, 3] },
      { question: "After a reality check, do you imagine what you'd do if you were dreaming?", options: ["Never", "Rarely", "Sometimes", "Every time"], scores: [0, 1, 2, 3] },
      { question: "Have reality checks led to a lucid dream?", options: ["Never", "Once", "A few times", "Multiple times"], scores: [0, 1, 2, 3] },
    ],
    results: [
      { min: 0, max: 7, title: "Reality Checks: Ineffective", description: "Your reality checks aren't generating the genuine questioning needed for lucidity. Quality matters far more than quantity.", recommendations: ["Slow down — spend 15 full seconds on each reality check", "Ask 'How did I get here? What was I doing 5 minutes ago?'", "Look at your hands, count your fingers, then look away and back", "After each check, imagine: 'If this were a dream, what would I do?'"] },
      { min: 8, max: 15, title: "Reality Checks: Developing", description: "You have the habit but need more depth and intentionality. The key is making each check a genuine moment of questioning, not a mechanical gesture.", recommendations: ["Add environmental awareness: notice 5 details around you with each check", "Create 3-5 specific triggers based on your personal dream signs", "Try the 'finger through palm' test — it's the most reliable in dreams", "Pair every reality check with the question: 'Am I dreaming right now?'"] },
      { min: 16, max: 22, title: "Reality Checks: Effective", description: "Your reality checking practice is strong and generating results. Fine-tune by deepening the mindfulness component and expanding your trigger system.", recommendations: ["Add 'state testing' — check your memory, read text twice, check time", "Create a reality check journal noting when checks feel most genuine", "Practice 'prospective memory' — set intentions to check at specific future moments", "Experiment with the 'nose pinch' test as a backup to your primary method"] },
      { min: 23, max: 30, title: "Reality Checks: Mastery", description: "Your reality checking practice is exemplary. You've internalized genuine questioning as a habit that carries into dreams.", recommendations: ["Transition toward 'all-day awareness' — continuous mindfulness rather than discrete checks", "Use reality checks as meditation bells — each one a moment of full presence", "Teach your method to others — explaining deepens your own practice", "Explore whether you can trigger lucidity through awareness alone, without formal checks"] },
    ],
  },
  {
    id: "sleep-optimization",
    title: "Sleep Environment Optimization Assessment",
    description: "Your sleep environment directly affects dream vividness, recall, and lucid dreaming success. Identify what to optimize.",
    questions: [
      { question: "How dark is your bedroom during sleep?", options: ["Significant light sources", "Some light leaks", "Mostly dark", "Complete blackout"], scores: [0, 1, 2, 3] },
      { question: "What's your bedroom temperature?", options: ["Too warm (above 72°F/22°C)", "Slightly warm", "Comfortable", "Cool (65-68°F/18-20°C)"], scores: [0, 1, 2, 3] },
      { question: "How quiet is your sleep environment?", options: ["Noisy", "Some disruptions", "Generally quiet", "Very quiet or white noise"], scores: [0, 1, 2, 3] },
      { question: "What's your mattress and pillow quality?", options: ["Old/uncomfortable", "Adequate", "Good", "Optimized for comfort"], scores: [0, 1, 2, 3] },
      { question: "Do you use your bed only for sleep?", options: ["Work, eat, watch TV in bed", "Sometimes other activities", "Mostly sleep only", "Strictly sleep only"], scores: [0, 1, 2, 3] },
      { question: "What's your screen exposure before bed?", options: ["Screens until sleep", "Screens until 30 min before", "Screens off 1 hour before", "No screens 2+ hours before"], scores: [0, 1, 2, 3] },
      { question: "Do you have a consistent pre-sleep routine?", options: ["No routine", "Loose routine", "Consistent routine", "Detailed wind-down ritual"], scores: [0, 1, 2, 3] },
      { question: "How consistent is your sleep/wake schedule?", options: ["Varies by 2+ hours", "Varies by 1-2 hours", "Within 30 minutes", "Same time every day"], scores: [0, 1, 2, 3] },
      { question: "Do you consume caffeine, alcohol, or heavy meals before bed?", options: ["Regularly", "Sometimes", "Rarely", "Never within 4-6 hours"], scores: [0, 1, 2, 3] },
      { question: "How do you feel upon waking?", options: ["Exhausted", "Groggy for a while", "Fairly rested", "Refreshed and alert"], scores: [0, 1, 2, 3] },
    ],
    results: [
      { min: 0, max: 7, title: "Environment: Needs Major Improvement", description: "Your sleep environment is significantly impacting your dream practice. Addressing these basics will improve both sleep quality and dream vividness.", recommendations: ["Get blackout curtains or a quality sleep mask immediately", "Set bedroom temperature to 65-68°F (18-20°C)", "Remove all screens from the bedroom", "Establish a fixed bedtime and wake time — even on weekends"] },
      { min: 8, max: 15, title: "Environment: Room for Improvement", description: "You have some good habits but key areas need attention. Focus on the lowest-scoring areas first for the biggest impact.", recommendations: ["Address your weakest area first — it's likely light, temperature, or screens", "Create a 30-minute wind-down routine: dim lights, gentle stretching, journaling", "Stop caffeine by noon and alcohol by 6pm", "Consider a sunrise alarm clock for more natural waking"] },
      { min: 16, max: 22, title: "Environment: Well Optimized", description: "Your sleep environment supports good dreaming. Fine-tune the remaining areas and add dream-specific optimizations.", recommendations: ["Add dream-specific elements: lavender, mugwort, or calming scents", "Optimize your WBTB setup: gentle alarm, journal ready, dim light available", "Consider a sleep tracking device to understand your sleep cycles", "Add a brief meditation or body scan to your pre-sleep routine"] },
      { min: 23, max: 30, title: "Environment: Excellent", description: "Your sleep environment is highly optimized. You're getting the most from your sleep for dream practice.", recommendations: ["Experiment with polyphasic sleep elements for additional REM periods", "Try sleeping in different positions to see how it affects dreams", "Consider binaural beats or isochronic tones during WBTB", "Your environment is ready for advanced practices like dream yoga"] },
    ],
  },
  {
    id: "meditation-for-dreams",
    title: "Meditation Practice Assessment for Dreamers",
    description: "Meditation and lucid dreaming share the same core skill: sustained awareness. Evaluate how your meditation practice supports your dream work.",
    questions: [
      { question: "How often do you meditate?", options: ["Never/rarely", "A few times a month", "Several times a week", "Daily"], scores: [0, 1, 2, 3] },
      { question: "How long are your typical sessions?", options: ["Under 5 minutes", "5-10 minutes", "10-20 minutes", "20+ minutes"], scores: [0, 1, 2, 3] },
      { question: "What type of meditation do you practice?", options: ["None/unsure", "Guided apps only", "Breath awareness", "Multiple types including open awareness"], scores: [0, 1, 2, 3] },
      { question: "Can you maintain focus on your breath for 60 seconds?", options: ["Very difficult", "Lose focus frequently", "Can maintain with effort", "Easily"], scores: [0, 1, 2, 3] },
      { question: "Do you practice body scanning or yoga nidra?", options: ["Never", "Tried once", "Occasionally", "Regularly"], scores: [0, 1, 2, 3] },
      { question: "Do you meditate specifically before sleep?", options: ["Never", "Rarely", "Sometimes", "Most nights"], scores: [0, 1, 2, 3] },
      { question: "Can you observe thoughts without engaging them?", options: ["Very difficult", "Sometimes briefly", "Often for short periods", "Sustained witnessing awareness"], scores: [0, 1, 2, 3] },
      { question: "Do you practice visualization meditation?", options: ["Never", "Tried it", "Occasionally", "Regular practice"], scores: [0, 1, 2, 3] },
      { question: "Have you noticed meditation improving your dream awareness?", options: ["No connection noticed", "Possibly", "Some improvement", "Clear improvement"], scores: [0, 1, 2, 3] },
      { question: "Do you practice awareness during daily activities (walking, eating)?", options: ["Never", "Rarely", "Sometimes", "Frequently"], scores: [0, 1, 2, 3] },
    ],
    results: [
      { min: 0, max: 7, title: "Meditation: Beginner", description: "Starting a meditation practice will be the single most impactful thing you can do for your lucid dreaming journey. Even 5 minutes daily creates measurable changes.", recommendations: ["Start with 5 minutes of breath counting before bed tonight", "Use a guided meditation app for the first 2 weeks to build the habit", "Practice the '4-7-8' breathing technique: inhale 4, hold 7, exhale 8", "Don't judge your practice — wandering attention is normal and part of training"] },
      { min: 8, max: 15, title: "Meditation: Developing", description: "You have a foundation. Now direct your practice toward dream-relevant skills: sustained attention, body awareness, and visualization.", recommendations: ["Add a 5-minute body scan before sleep — this directly supports WILD technique", "Practice visualization: imagine a familiar place in complete detail for 3 minutes", "Try 'noting' practice: silently label thoughts as 'thinking' and return to breath", "Extend your sessions by 2 minutes each week until you reach 15-20 minutes"] },
      { min: 16, max: 22, title: "Meditation: Intermediate", description: "Your meditation practice meaningfully supports your dream work. Deepen the connection between waking awareness and dream awareness.", recommendations: ["Add 'awareness of awareness' practice — observe the observer", "Practice yoga nidra (non-sleep deep rest) as a bridge to WILD", "Experiment with meditation during WBTB windows", "Study the relationship between jhana states and lucid dream entry"] },
      { min: 23, max: 30, title: "Meditation: Advanced", description: "Your meditation practice is a powerful engine for consciousness exploration. The boundary between meditative awareness and dream awareness is thin for you.", recommendations: ["Explore Tibetan dream yoga meditation practices", "Practice maintaining awareness through the hypnagogic transition", "Study the 'clear light' practices of sleep yoga", "Your meditation depth supports the most advanced lucid dreaming practices"] },
    ],
  },
  {
    id: "technique-effectiveness",
    title: "Lucid Dreaming Technique Effectiveness Review",
    description: "If you've been practicing lucid dreaming techniques, this assessment helps identify what's working, what isn't, and what to adjust.",
    questions: [
      { question: "How long have you been actively practicing lucid dreaming?", options: ["Less than a month", "1-3 months", "3-12 months", "Over a year"], scores: [0, 1, 2, 3] },
      { question: "How many techniques have you tried?", options: ["None yet", "One", "Two or three", "Four or more"], scores: [0, 1, 2, 3] },
      { question: "How long do you stick with a technique before switching?", options: ["A few days", "A week", "2-4 weeks", "A month or more"], scores: [0, 1, 2, 3] },
      { question: "Do you combine techniques (e.g., WBTB + MILD)?", options: ["No", "Tried once", "Sometimes", "Regularly and systematically"], scores: [0, 1, 2, 3] },
      { question: "Do you track which techniques produce results?", options: ["No tracking", "Mental notes", "Informal journal", "Detailed technique log"], scores: [0, 1, 2, 3] },
      { question: "How many lucid dreams have you had in the past month?", options: ["Zero", "One", "Two to four", "Five or more"], scores: [0, 1, 2, 3] },
      { question: "When you become lucid, how long does it last?", options: ["Haven't been lucid", "Seconds", "A minute or two", "Several minutes or more"], scores: [0, 1, 2, 3] },
      { question: "Do you practice dream stabilization when lucid?", options: ["Don't know what that is", "Know but don't practice", "Sometimes", "Always"], scores: [0, 1, 2, 3] },
      { question: "Do you set specific intentions before sleep?", options: ["Never", "Occasionally", "Most nights", "Every night with clarity"], scores: [0, 1, 2, 3] },
      { question: "How would you rate your overall progress?", options: ["No progress", "Slow progress", "Steady progress", "Strong progress"], scores: [0, 1, 2, 3] },
    ],
    results: [
      { min: 0, max: 7, title: "Practice: Early Stage", description: "You're in the exploration phase. The most common mistake is technique-hopping — switching methods before giving any one approach enough time to work.", recommendations: ["Choose ONE technique and commit to it for 30 days minimum", "Start with MILD + dream journal — it's the most researched combination", "Set a clear, specific intention every night before sleep", "Track your practice daily: what you did, what happened, how you felt"] },
      { min: 8, max: 15, title: "Practice: Building Momentum", description: "You have experience but may be hitting plateaus. This is normal and usually indicates a need for technique refinement rather than technique change.", recommendations: ["Add WBTB to your primary technique — it dramatically increases success rates", "Review your dream journal for patterns in when lucid dreams occur", "Practice dream stabilization techniques: rubbing hands, spinning, verbal commands", "Increase your daily reality checks to 15+ with genuine questioning"] },
      { min: 16, max: 22, title: "Practice: Effective", description: "Your practice is producing results. Focus on consistency, depth, and expanding what you do once lucid.", recommendations: ["Create a 'lucid dream plan' — know exactly what you want to do when lucid", "Practice dream control in stages: first stabilize, then explore, then create", "Experiment with different WBTB durations (15, 30, 45 minutes awake)", "Add supplements like galantamine on dedicated practice nights"] },
      { min: 23, max: 30, title: "Practice: Advanced", description: "You have a mature, effective practice. You're ready to explore the deeper dimensions of lucid dreaming.", recommendations: ["Explore 'surrendering control' — ask the dream to show you something important", "Practice communicating with dream characters as autonomous entities", "Experiment with dream incubation for specific experiences", "Study Andrew Holecek's work on using lucid dreams for spiritual practice"] },
    ],
  },
  {
    id: "fear-assessment",
    title: "Dream Fear & Nightmare Assessment",
    description: "Fear in dreams can be a barrier to lucidity or a powerful teacher. Understand your relationship with dream fear to transform it.",
    questions: [
      { question: "How often do you have nightmares or disturbing dreams?", options: ["Frequently", "Monthly", "Rarely", "Almost never"], scores: [0, 1, 2, 3] },
      { question: "When you have a nightmare, how do you respond?", options: ["Wake up in panic", "Feel disturbed for hours", "Shake it off fairly quickly", "Examine it with curiosity"], scores: [0, 1, 2, 3] },
      { question: "Does the idea of becoming conscious in a dream feel scary?", options: ["Very scary", "Somewhat anxious", "Slightly nervous", "Exciting"], scores: [0, 1, 2, 3] },
      { question: "Have you ever faced a fear directly in a dream?", options: ["Never", "Once accidentally", "A few times", "Deliberately and regularly"], scores: [0, 1, 2, 3] },
      { question: "How do you relate to sleep paralysis?", options: ["Terrified of it", "Anxious about it", "Understand it intellectually", "See it as a gateway to lucid dreams"], scores: [0, 1, 2, 3] },
      { question: "Can you recognize when dream emotions are disproportionate to the situation?", options: ["No — emotions feel completely real", "Sometimes after waking", "Often while still dreaming", "Yes — emotional awareness triggers lucidity"], scores: [0, 1, 2, 3] },
      { question: "Do recurring nightmares have themes you can identify?", options: ["Too scary to analyze", "Vaguely", "Yes, clear themes", "Yes, and I've worked with them"], scores: [0, 1, 2, 3] },
      { question: "How would you handle meeting a frightening figure in a lucid dream?", options: ["Wake up immediately", "Try to escape", "Observe from a distance", "Approach with compassion and curiosity"], scores: [0, 1, 2, 3] },
      { question: "Do you believe nightmares can be meaningful?", options: ["No — just random brain activity", "Maybe", "Probably", "Yes — they carry important messages"], scores: [0, 1, 2, 3] },
      { question: "Have you ever transformed a nightmare into a positive dream?", options: ["Never", "Once", "A few times", "Multiple times"], scores: [0, 1, 2, 3] },
    ],
    results: [
      { min: 0, max: 7, title: "Fear Relationship: Avoidant", description: "Dream fear currently controls your dream experience. This is common and completely workable. The path forward is gradual exposure and understanding.", recommendations: ["Start with waking visualization: imagine a mild dream fear and practice calm breathing", "Write about your nightmares in your journal — naming fear reduces its power", "Practice the mantra: 'This is a dream. Nothing here can harm me.'", "Consider working with a therapist trained in Image Rehearsal Therapy for nightmares"] },
      { min: 8, max: 15, title: "Fear Relationship: Cautious", description: "You have some awareness of dream fear but haven't yet learned to work with it. Fear in dreams is often a messenger, not an enemy.", recommendations: ["Practice 'rewriting' nightmare endings in your journal while awake", "When you notice fear in a dream, try to pause rather than flee", "Study the concept of 'shadow work' in dream psychology", "Use the affirmation before sleep: 'I welcome all dream experiences as teachers'"] },
      { min: 16, max: 22, title: "Fear Relationship: Engaged", description: "You're developing a healthy relationship with dream fear. You understand it intellectually and are beginning to work with it experientially.", recommendations: ["In your next lucid dream, try asking a frightening figure: 'What do you represent?'", "Practice sending compassion to dream characters, including threatening ones", "Explore Robert Waggoner's techniques for communicating with the dream itself", "Use nightmares as lucidity triggers — the emotion can wake you up inside the dream"] },
      { min: 23, max: 30, title: "Fear Relationship: Transformed", description: "You've developed a mature relationship with dream fear. You see it as information rather than threat, and can work with it consciously.", recommendations: ["Explore using lucid dreams for deep shadow integration work", "Practice 'dream healing' — deliberately entering difficult scenarios with compassion", "Study Tibetan practices of transforming wrathful deities through recognition", "Share your experience with others — your relationship with dream fear is a teaching in itself"] },
    ],
  },
  {
    id: "wbtb-optimization",
    title: "WBTB (Wake Back to Bed) Optimization Assessment",
    description: "WBTB is the most effective lucid dreaming technique enhancer. Optimize your approach for maximum results.",
    questions: [
      { question: "Have you tried WBTB?", options: ["Never", "Once or twice", "Several times", "Regular practice"], scores: [0, 1, 2, 3] },
      { question: "What alarm do you use for WBTB?", options: ["Phone alarm (loud)", "Gentle alarm", "Vibrating wristband", "Wake naturally"], scores: [0, 1, 2, 3] },
      { question: "How long after falling asleep do you set your WBTB alarm?", options: ["Don't know optimal time", "4 hours", "5 hours", "Adjusted to my sleep cycles"], scores: [0, 1, 2, 3] },
      { question: "How long do you stay awake during WBTB?", options: ["Just a few minutes", "10-15 minutes", "20-30 minutes", "Adjusted based on what works"], scores: [0, 1, 2, 3] },
      { question: "What do you do during the wake period?", options: ["Check phone/social media", "Just lie there", "Read about lucid dreaming", "Meditation + intention setting"], scores: [0, 1, 2, 3] },
      { question: "Can you fall back asleep after WBTB?", options: ["Very difficult", "Takes a long time", "Usually within 15 minutes", "Easily"], scores: [0, 1, 2, 3] },
      { question: "Do you combine WBTB with another technique?", options: ["No", "Sometimes MILD", "Usually MILD or WILD", "Systematic combination"], scores: [0, 1, 2, 3] },
      { question: "How often do you practice WBTB?", options: ["Never/stopped", "Once a month", "Weekly", "2-3 times per week"], scores: [0, 1, 2, 3] },
      { question: "Has WBTB produced lucid dreams for you?", options: ["Never tried", "Not yet", "Once or twice", "Multiple times"], scores: [0, 1, 2, 3] },
      { question: "Does WBTB affect your next-day energy?", options: ["Exhausted next day", "Somewhat tired", "Slightly affected", "No impact"], scores: [0, 1, 2, 3] },
    ],
    results: [
      { min: 0, max: 7, title: "WBTB: Not Yet Optimized", description: "WBTB is the single most effective technique enhancer, but it needs to be done correctly. Your current approach needs adjustment.", recommendations: ["Set alarm for 5 hours after sleep — this targets the longest REM periods", "Stay awake 20-30 minutes — read about lucid dreaming or meditate", "Use a gentle alarm or vibrating wristband to avoid full arousal", "Combine with MILD: repeat your intention as you fall back asleep"] },
      { min: 8, max: 15, title: "WBTB: Basic Practice", description: "You have the structure but need refinement. Small adjustments to timing and wake activities can dramatically improve results.", recommendations: ["Experiment with wake duration: try 15, 20, 30, and 45 minutes", "During wake time: journal, meditate, or read — never use screens", "Practice MILD affirmations for the last 5 minutes before returning to sleep", "Track which nights produce results and look for patterns"] },
      { min: 16, max: 22, title: "WBTB: Effective Practice", description: "Your WBTB practice is producing results. Fine-tune by personalizing timing and combining with advanced techniques.", recommendations: ["Map your personal sleep cycles using a sleep tracker for optimal alarm timing", "Try WILD during WBTB — maintain awareness as you fall back asleep", "Experiment with WBTB during afternoon naps for additional practice", "Add galantamine (4-8mg) during WBTB on dedicated practice nights"] },
      { min: 23, max: 30, title: "WBTB: Mastery", description: "Your WBTB practice is highly optimized. You've found your personal sweet spots for timing, duration, and technique combination.", recommendations: ["Explore using WBTB for dream yoga practices", "Try extended WBTB (45-60 minutes) for WILD attempts", "Experiment with different body positions when returning to sleep", "Consider teaching your optimized WBTB protocol to other practitioners"] },
    ],
  },
  {
    id: "progress-tracker",
    title: "30-Day Lucid Dreaming Progress Assessment",
    description: "Take this assessment monthly to track your development across all dimensions of lucid dreaming practice.",
    questions: [
      { question: "How many dreams did you recall this month?", options: ["0-5", "6-15", "16-25", "26+"], scores: [0, 1, 2, 3] },
      { question: "How many lucid dreams did you have this month?", options: ["Zero", "One", "Two to four", "Five or more"], scores: [0, 1, 2, 3] },
      { question: "How consistent was your dream journal practice?", options: ["Missed most days", "About half the days", "Most days", "Every day"], scores: [0, 1, 2, 3] },
      { question: "How consistent were your reality checks?", options: ["Rarely", "Some days", "Most days", "Every day, multiple times"], scores: [0, 1, 2, 3] },
      { question: "Did you practice WBTB this month?", options: ["Never", "Once or twice", "Weekly", "Multiple times per week"], scores: [0, 1, 2, 3] },
      { question: "How was your meditation practice?", options: ["Didn't meditate", "A few sessions", "Regular but inconsistent", "Daily practice"], scores: [0, 1, 2, 3] },
      { question: "Did you identify new dream signs?", options: ["No", "Maybe one", "A few", "Several new patterns"], scores: [0, 1, 2, 3] },
      { question: "How vivid were your dreams compared to last month?", options: ["Less vivid", "About the same", "Somewhat more vivid", "Noticeably more vivid"], scores: [0, 1, 2, 3] },
      { question: "Did you experience any dream control when lucid?", options: ["Not lucid", "No control", "Some control", "Good control"], scores: [0, 1, 2, 3] },
      { question: "How motivated do you feel about your practice?", options: ["Discouraged", "Neutral", "Motivated", "Deeply committed"], scores: [0, 1, 2, 3] },
    ],
    results: [
      { min: 0, max: 7, title: "Month Rating: Foundation Building", description: "This month was about laying groundwork. Progress in lucid dreaming is rarely linear — plateaus and slow periods are normal and necessary.", recommendations: ["Recommit to the basics: journal every morning, reality check 10+ times daily", "Review what worked and what didn't — adjust your approach, don't abandon it", "Set one specific, achievable goal for next month", "Remember: every night of practice builds neural pathways, even without lucid dreams"] },
      { min: 8, max: 15, title: "Month Rating: Steady Progress", description: "You're building momentum. Your consistency is creating the conditions for breakthrough experiences.", recommendations: ["Increase WBTB frequency to 2-3 times per week", "Deepen your reality check practice — quality over quantity", "Review your dream sign catalog and create targeted triggers", "Set a specific lucid dream goal: 'Next month I will have X lucid dreams'"] },
      { min: 16, max: 22, title: "Month Rating: Strong Month", description: "Excellent progress. Your practice is producing tangible results and your skills are developing across multiple dimensions.", recommendations: ["Document what's working — your successful technique combinations", "Start working on dream stabilization and extending lucid dream duration", "Explore new territory: ask dream characters questions, change dream scenes", "Consider adding a new technique to your rotation"] },
      { min: 23, max: 30, title: "Month Rating: Exceptional", description: "Outstanding month. Your practice is mature and producing consistent results. You're operating at an advanced level.", recommendations: ["Set advanced goals: specific dream experiences, consciousness exploration", "Explore the intersection of lucid dreaming and meditation", "Consider studying dream yoga or other advanced frameworks", "Share your progress and methods — teaching deepens understanding"] },
    ],
  },
];

function generateAssessmentPDF(assessment: Assessment, score: number, result: typeof assessments[0]["results"][0], answers: number[]) {
  const lines = [
    `${SITE_NAME} — Assessment Results`,
    ``,
    `Assessment: ${assessment.title}`,
    `Date: ${new Date().toLocaleDateString()}`,
    `Score: ${score} / ${assessment.questions.length * 3}`,
    ``,
    `Result: ${result.title}`,
    ``,
    result.description,
    ``,
    `--- Recommendations ---`,
    ``,
  ];
  
  result.recommendations.forEach((rec, i) => {
    lines.push(`${i + 1}. ${rec}`);
  });
  
  lines.push(``, `--- Your Answers ---`, ``);
  
  assessment.questions.forEach((q, i) => {
    lines.push(`Q${i + 1}: ${q.question}`);
    lines.push(`A: ${q.options[answers[i]]}`);
    lines.push(``);
  });
  
  lines.push(``, `Generated by ${SITE_NAME} — lucidpath.love`);
  
  const content = lines.join('\n');
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${assessment.id}-results.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function AssessmentComponent({ assessment }: { assessment: Assessment }) {
  const [currentQ, setCurrentQ] = useState(-1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const score = answers.reduce((sum, a, i) => sum + (assessment.questions[i]?.scores[a] || 0), 0);
  const result = assessment.results.find(r => score >= r.min && score <= r.max) || assessment.results[assessment.results.length - 1];

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    
    if (currentQ < assessment.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const reset = () => {
    setCurrentQ(-1);
    setAnswers([]);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div ref={resultRef} className="p-6 rounded-xl border border-border bg-card">
        <div className="text-center mb-6">
          <ClipboardCheck className="w-12 h-12 text-[var(--aurora)] mx-auto mb-3" />
          <h3 className="font-heading text-xl font-700 mb-1" style={{ color: "var(--twilight)" }}>
            {result.title}
          </h3>
          <p className="text-sm text-muted-foreground">Score: {score} / {assessment.questions.length * 3}</p>
        </div>
        <p className="text-sm leading-relaxed mb-4">{result.description}</p>
        
        <div className="mb-6">
          <h4 className="font-heading text-sm font-600 mb-2">Recommendations:</h4>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-[var(--aurora)] font-bold shrink-0">{i + 1}.</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => generateAssessmentPDF(assessment, score, result, answers)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Results
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  if (currentQ === -1) {
    return (
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-heading text-lg font-700 mb-2" style={{ color: "var(--twilight)" }}>
          {assessment.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{assessment.description}</p>
        <p className="text-xs text-muted-foreground mb-4">{assessment.questions.length} questions · Takes about 3 minutes · Includes personalized recommendations</p>
        <button
          onClick={() => setCurrentQ(0)}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[var(--twilight)] text-[var(--starlight)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Start Assessment
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const q = assessment.questions[currentQ];

  return (
    <div className="p-6 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground">
          Question {currentQ + 1} of {assessment.questions.length}
        </span>
        <div className="flex gap-1">
          {assessment.questions.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i < currentQ ? 'bg-[var(--aurora)]' : i === currentQ ? 'bg-[var(--twilight)]' : 'bg-muted'}`}
            />
          ))}
        </div>
      </div>
      <h4 className="font-heading text-base font-600 mb-4">{q.question}</h4>
      <div className="space-y-2">
        {q.options.map((option, oi) => (
          <button
            key={oi}
            onClick={() => handleAnswer(oi)}
            className="w-full text-left p-3 rounded-lg border border-border hover:border-[var(--aurora)] hover:bg-[var(--aurora)]/5 transition-colors text-sm"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AssessmentsPage() {
  useEffect(() => {
    document.title = `Dream Practice Assessments — ${SITE_NAME}`;
  }, []);

  return (
    <section className="container py-10 max-w-3xl">
      <h1 className="font-heading text-3xl md:text-4xl font-800 mb-4" style={{ color: "var(--twilight)" }}>
        Dream Practice Assessments
      </h1>
      <p className="text-lg leading-relaxed text-muted-foreground mb-4">
        Deep-dive assessments with 10 questions each, personalized recommendations, and downloadable results. Use these to audit and optimize every dimension of your lucid dreaming practice.
      </p>
      <p className="text-sm text-muted-foreground mb-10">
        Unlike our quizzes, assessments provide detailed action plans. Take them monthly to track your progress over time.
      </p>

      <div className="space-y-6">
        {assessments.map((assessment) => (
          <AssessmentComponent key={assessment.id} assessment={assessment} />
        ))}
      </div>
    </section>
  );
}
