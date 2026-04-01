import { useEffect, useState, useRef } from "react";
import { SITE_NAME } from "@/lib/articles";
import { ChevronRight, Download, RotateCcw, CheckCircle2 } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  scores: number[];
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  results: { min: number; max: number; title: string; description: string }[];
}

const quizzes: Quiz[] = [
  {
    id: "lucid-readiness",
    title: "Lucid Dreaming Readiness Assessment",
    description: "Discover how prepared you are to begin a lucid dreaming practice based on your current sleep habits, awareness levels, and mindfulness experience.",
    questions: [
      { question: "How often do you remember your dreams upon waking?", options: ["Almost never", "Once or twice a week", "Most mornings", "Every morning, often in detail"], scores: [0, 1, 2, 3] },
      { question: "Do you currently keep a dream journal?", options: ["No, never tried", "I tried but stopped", "Occasionally", "Yes, consistently"], scores: [0, 1, 2, 3] },
      { question: "How would you describe your meditation or mindfulness practice?", options: ["No experience", "Tried a few times", "Occasional practice", "Regular daily practice"], scores: [0, 1, 2, 3] },
      { question: "How consistent is your sleep schedule?", options: ["Very irregular", "Somewhat irregular", "Fairly consistent", "Same time every night"], scores: [0, 1, 2, 3] },
      { question: "Have you ever questioned whether you were dreaming while in a dream?", options: ["Never", "Maybe once", "A few times", "Regularly"], scores: [0, 1, 2, 3] },
      { question: "How would you rate your ability to focus on a single thought for 60 seconds?", options: ["Very difficult", "Challenging", "Manageable", "Easy"], scores: [0, 1, 2, 3] },
      { question: "Do you perform reality checks during the day?", options: ["What are those?", "I've heard of them", "Sometimes", "Multiple times daily"], scores: [0, 1, 2, 3] },
      { question: "How do you feel about the idea of becoming conscious inside a dream?", options: ["Skeptical", "Curious but unsure", "Excited to try", "Already experienced it"], scores: [0, 1, 2, 3] },
    ],
    results: [
      { min: 0, max: 6, title: "Dreaming Newcomer", description: "You're at the very beginning of the journey. Start with dream recall practice — keep a journal by your bed and write down anything you remember each morning. Within a few weeks, your dream memory will sharpen dramatically. Read our Start Here guide for a structured path." },
      { min: 7, max: 12, title: "Emerging Dreamer", description: "You have some natural awareness and dream recall. The foundation is forming. Focus on building consistency — a regular sleep schedule, daily reality checks, and a meditation practice of even 5 minutes will accelerate your progress significantly." },
      { min: 13, max: 18, title: "Ready Practitioner", description: "You have strong foundations for lucid dreaming. Your awareness and recall are solid. Now it's time to choose a specific induction technique — MILD, WILD, or WBTB — and commit to it for at least 30 days. Your first lucid dream is likely closer than you think." },
      { min: 19, max: 24, title: "Advanced Explorer", description: "You're already well-equipped for lucid dreaming, and may have already experienced it. Focus on deepening your practice — extending lucid dream duration, setting intentions before sleep, and exploring the more advanced territories of dream yoga and consciousness exploration." },
    ],
  },
  {
    id: "dream-type",
    title: "What Type of Dreamer Are You?",
    description: "Understand your natural dreaming style to choose the lucid dreaming techniques that will work best for your unique mind.",
    questions: [
      { question: "When you dream, what's most vivid?", options: ["Visual imagery", "Emotions and feelings", "Conversations and sounds", "Physical sensations"], scores: [0, 1, 2, 3] },
      { question: "How do you typically fall asleep?", options: ["Quickly, within minutes", "Gradually, with wandering thoughts", "Slowly, often restless", "Through deliberate relaxation"], scores: [0, 1, 2, 3] },
      { question: "What happens when you wake from a vivid dream?", options: ["I forget it quickly", "I feel the emotions linger", "I can replay the narrative", "I feel physically affected"], scores: [0, 1, 2, 3] },
      { question: "During the day, how present are you to your surroundings?", options: ["Often on autopilot", "Mostly in my head", "Fairly observant", "Highly aware of details"], scores: [0, 1, 2, 3] },
      { question: "What draws you most to lucid dreaming?", options: ["Adventure and exploration", "Emotional healing", "Creative inspiration", "Spiritual growth"], scores: [0, 1, 2, 3] },
      { question: "How do you process new information best?", options: ["Seeing it", "Feeling it", "Hearing it", "Doing it"], scores: [0, 1, 2, 3] },
      { question: "In waking life, what's your strongest sense?", options: ["Sight", "Intuition/emotion", "Hearing", "Touch/body awareness"], scores: [0, 1, 2, 3] },
      { question: "When you imagine a beach, what comes first?", options: ["The visual scene", "The feeling of peace", "The sound of waves", "The warmth of sand"], scores: [0, 1, 2, 3] },
    ],
    results: [
      { min: 0, max: 6, title: "The Visual Dreamer", description: "Your dreams are rich in imagery and visual detail. You'll likely excel with visualization-based techniques like MILD (Mnemonic Induction of Lucid Dreams) and VILD (Visual Induction). Practice visualizing dream scenes before sleep and use visual reality checks like reading text or checking clocks." },
      { min: 7, max: 12, title: "The Emotional Dreamer", description: "Your dreams are driven by feelings and emotional landscapes. You'll benefit most from intention-setting practices and dream incubation. Before sleep, focus on the feeling of becoming lucid rather than visualizing it. Journaling your dream emotions will help you recognize dream signs." },
      { min: 13, max: 18, title: "The Narrative Dreamer", description: "Your dreams unfold like stories with dialogue and plot. MILD affirmations and mantra-based techniques will resonate with you. Practice telling yourself 'I will recognize I'm dreaming' as you fall asleep. Your strong narrative awareness makes DILD (Dream-Initiated Lucid Dreams) your natural path." },
      { min: 19, max: 24, title: "The Somatic Dreamer", description: "Your dreams are grounded in physical sensation and body awareness. WILD (Wake-Initiated Lucid Dreams) and body-scan meditation before sleep are your strongest tools. You'll notice the hypnagogic transition through physical sensations — tingling, floating, heaviness — that become your gateway to lucidity." },
    ],
  },
  {
    id: "technique-match",
    title: "Which Technique Should You Try First?",
    description: "Based on your personality, schedule, and experience level, find the lucid dreaming induction method most likely to work for you.",
    questions: [
      { question: "Are you a morning person or night person?", options: ["Strong morning person", "Slight morning preference", "Slight night preference", "Strong night owl"], scores: [0, 1, 2, 3] },
      { question: "How do you feel about waking up in the middle of the night?", options: ["Absolutely not", "Would try if necessary", "Don't mind occasionally", "Already wake naturally"], scores: [0, 1, 2, 3] },
      { question: "How patient are you with new skills?", options: ["I want results fast", "Willing to try for a week", "Can commit for a month", "Happy to practice indefinitely"], scores: [0, 1, 2, 3] },
      { question: "How comfortable are you with meditation?", options: ["Never tried it", "Tried but struggle", "Comfortable with guided", "Regular unguided practice"], scores: [0, 1, 2, 3] },
      { question: "How vivid is your imagination?", options: ["Not very", "Average", "Above average", "Extremely vivid"], scores: [0, 1, 2, 3] },
      { question: "How well do you handle the hypnagogic state (falling asleep)?", options: ["I fall asleep instantly", "I notice it briefly", "I can observe it sometimes", "I can stay aware through it"], scores: [0, 1, 2, 3] },
      { question: "What's your experience with lucid dreaming so far?", options: ["Complete beginner", "Read about it", "Tried a few times", "Had some success"], scores: [0, 1, 2, 3] },
      { question: "How much time can you dedicate to practice daily?", options: ["5 minutes", "15 minutes", "30 minutes", "An hour or more"], scores: [0, 1, 2, 3] },
    ],
    results: [
      { min: 0, max: 6, title: "Start with Reality Testing + Dream Journal", description: "The simplest and most accessible starting point. Perform 10-15 reality checks daily (look at your hands, try to push a finger through your palm, read text twice) and write in your dream journal every morning. This builds the awareness foundation everything else depends on. Give it 2-4 weeks before adding other techniques." },
      { min: 7, max: 12, title: "MILD (Mnemonic Induction) Is Your Match", description: "MILD is the most researched and beginner-friendly active technique. As you fall asleep, repeat 'Next time I'm dreaming, I will realize I'm dreaming' while visualizing yourself becoming lucid in a recent dream. Combine with WBTB (wake after 5 hours, stay up 20 minutes, then return to sleep with the intention) for best results." },
      { min: 13, max: 18, title: "WBTB + MILD Combination", description: "You have the discipline and awareness for the most effective beginner-to-intermediate combination. Set an alarm for 5 hours after sleep, stay awake for 20-30 minutes (journal, meditate, read about lucid dreaming), then return to sleep using MILD affirmations. This targets the REM-rich later sleep cycles." },
      { min: 19, max: 24, title: "WILD (Wake-Initiated Lucid Dreams)", description: "You have the meditation experience and body awareness for the most direct technique. WILD involves maintaining consciousness through the sleep transition. Practice during WBTB windows or afternoon naps. Focus on the hypnagogic imagery without engaging it. When the dream forms around you, you'll enter it fully lucid." },
    ],
  },
  {
    id: "sleep-quality",
    title: "How's Your Sleep Hygiene?",
    description: "Good sleep is the foundation of dream practice. Assess your current sleep habits and discover what to improve for better dreaming.",
    questions: [
      { question: "What time do you typically go to bed?", options: ["After midnight", "11pm-midnight", "10-11pm", "Before 10pm, consistently"], scores: [0, 1, 2, 3] },
      { question: "How much screen time do you have in the hour before bed?", options: ["Heavy — phone/TV until sleep", "Some — 30+ minutes", "Light — 15 minutes or less", "None — screens off 1+ hour before"], scores: [0, 1, 2, 3] },
      { question: "How dark is your bedroom?", options: ["Lots of light sources", "Some light leaks", "Fairly dark", "Complete blackout"], scores: [0, 1, 2, 3] },
      { question: "Do you consume caffeine after noon?", options: ["Yes, regularly", "Sometimes", "Rarely", "Never after noon"], scores: [0, 1, 2, 3] },
      { question: "How often do you exercise?", options: ["Rarely", "1-2 times per week", "3-4 times per week", "Daily"], scores: [0, 1, 2, 3] },
      { question: "What's your bedroom temperature?", options: ["Too warm", "Variable", "Comfortable", "Cool (65-68°F / 18-20°C)"], scores: [0, 1, 2, 3] },
      { question: "Do you have a pre-sleep routine?", options: ["No routine", "Inconsistent", "Basic routine", "Detailed wind-down ritual"], scores: [0, 1, 2, 3] },
      { question: "How do you feel upon waking most mornings?", options: ["Exhausted", "Groggy", "Okay", "Refreshed and alert"], scores: [0, 1, 2, 3] },
    ],
    results: [
      { min: 0, max: 6, title: "Sleep Needs Attention", description: "Your sleep hygiene needs significant improvement before lucid dreaming practice will be effective. Start with the basics: consistent bedtime, no screens 1 hour before bed, cool dark room, no caffeine after noon. These changes alone will dramatically improve your dream recall and overall sleep quality." },
      { min: 7, max: 12, title: "Room for Improvement", description: "You have some good habits but inconsistency is holding you back. Focus on the weakest areas first — usually screen time and sleep schedule consistency. Even small improvements here will create noticeably more vivid dreams within 1-2 weeks." },
      { min: 13, max: 18, title: "Solid Foundation", description: "Your sleep hygiene is good. Fine-tune by optimizing your pre-sleep routine specifically for dreaming: add 5 minutes of meditation, review your dream journal, and set a clear intention for the night. Your sleep quality supports active lucid dreaming practice." },
      { min: 19, max: 24, title: "Excellent Sleep Hygiene", description: "Your sleep environment and habits are optimized. You're ready to focus entirely on lucid dreaming techniques without sleep quality being a limiting factor. Consider adding dream-specific supplements (like galantamine on WBTB nights) or advanced practices like dream yoga." },
    ],
  },
  {
    id: "dream-recall",
    title: "Dream Recall Strength Test",
    description: "Dream recall is the single most important skill for lucid dreaming. Find out where you stand and how to improve.",
    questions: [
      { question: "How many dreams do you remember per week?", options: ["Zero", "1-2 fragments", "3-5 dreams", "One or more per night"], scores: [0, 1, 2, 3] },
      { question: "How detailed are the dreams you remember?", options: ["Vague feelings only", "Basic scenes", "Clear narratives", "Rich sensory detail"], scores: [0, 1, 2, 3] },
      { question: "Do you remember dreams from earlier sleep cycles or only the last one?", options: ["Only the last dream", "Usually just one", "Sometimes two", "Often multiple dreams"], scores: [0, 1, 2, 3] },
      { question: "How quickly do dreams fade after waking?", options: ["Gone immediately", "Fade within minutes", "Linger for an hour", "I can recall them all day"], scores: [0, 1, 2, 3] },
      { question: "Can you identify recurring dream themes or locations?", options: ["No patterns noticed", "Maybe one or two", "Several recurring elements", "Detailed dream sign catalog"], scores: [0, 1, 2, 3] },
      { question: "Do you write down your dreams?", options: ["Never", "Tried briefly", "Sometimes", "Every morning without fail"], scores: [0, 1, 2, 3] },
      { question: "Can you re-enter a dream after briefly waking?", options: ["Never", "Happened once", "Occasionally", "Frequently"], scores: [0, 1, 2, 3] },
      { question: "Do you ever realize mid-day that you had a dream you forgot?", options: ["Never", "Rarely", "Sometimes", "Often — triggers bring them back"], scores: [0, 1, 2, 3] },
    ],
    results: [
      { min: 0, max: 6, title: "Recall Needs Building", description: "Don't worry — dream recall is a skill, not a talent. Place a journal and pen within arm's reach of your bed. The moment you wake, before moving or opening your eyes, ask yourself 'What was I just dreaming?' Write down anything — even a single word or feeling. Within 2-3 weeks of consistent practice, your recall will transform." },
      { min: 7, max: 12, title: "Developing Recall", description: "You have the raw material. Now build consistency. Journal every single morning, even if you write 'no recall today.' Before sleep, tell yourself 'I will remember my dreams.' Review your journal weekly to identify dream signs — recurring people, places, or situations that can trigger lucidity." },
      { min: 13, max: 18, title: "Strong Recall", description: "Your dream memory is well-developed. You're ready to use your recall as a lucid dreaming tool. Start cataloging your dream signs and performing targeted reality checks when you encounter them in waking life. Your recall strength means MILD technique will be particularly effective for you." },
      { min: 19, max: 24, title: "Exceptional Recall", description: "Your dream recall is remarkable. You likely remember multiple dreams per night with rich detail. This is the foundation advanced practitioners build on. Focus on recognizing dream signs in real-time, practicing dream stabilization techniques, and exploring intention-setting for specific dream experiences." },
    ],
  },
  {
    id: "mindfulness-level",
    title: "Waking Awareness Assessment",
    description: "Lucid dreaming is an extension of waking mindfulness. Measure your current awareness levels to understand your lucid dreaming potential.",
    questions: [
      { question: "How often do you notice your breathing without trying?", options: ["Almost never", "Occasionally", "Several times daily", "Frequently throughout the day"], scores: [0, 1, 2, 3] },
      { question: "When walking, how aware are you of your feet touching the ground?", options: ["Never notice", "Only if I think about it", "Sometimes naturally", "Often aware of it"], scores: [0, 1, 2, 3] },
      { question: "How often do you eat a meal on autopilot?", options: ["Almost every meal", "Most meals", "Sometimes", "Rarely — I eat mindfully"], scores: [3, 2, 1, 0] },
      { question: "Do you notice when your mind wanders during conversation?", options: ["Usually don't notice", "Sometimes after the fact", "Often catch myself", "Almost always aware"], scores: [0, 1, 2, 3] },
      { question: "How aware are you of your emotional state right now?", options: ["Not sure", "Vaguely", "Fairly clear", "Very precisely"], scores: [0, 1, 2, 3] },
      { question: "When you enter a new room, how much do you notice?", options: ["Very little", "General impression", "Key details", "Rich sensory awareness"], scores: [0, 1, 2, 3] },
      { question: "How often do you question the nature of your experience?", options: ["Never", "Rarely", "Sometimes", "It's a natural habit"], scores: [0, 1, 2, 3] },
      { question: "Can you hold awareness of awareness itself?", options: ["Not sure what that means", "Briefly, with effort", "For short periods", "Sustained meta-awareness"], scores: [0, 1, 2, 3] },
    ],
    results: [
      { min: 0, max: 6, title: "Autopilot Mode", description: "Most of your day runs on automatic — which is normal but limits lucid dreaming potential. Start with one simple practice: three times today, stop and notice five things you can see, four you can hear, three you can touch, two you can smell, and one you can taste. This sensory grounding exercise builds the awareness muscle lucid dreaming requires." },
      { min: 7, max: 12, title: "Growing Awareness", description: "You have moments of presence but they're not yet consistent. Set 5-7 random reminders on your phone throughout the day. When they go off, pause and ask: 'Am I dreaming right now?' Really look at your surroundings. Really question. This habit will eventually carry into your dreams." },
      { min: 13, max: 18, title: "Mindful Presence", description: "Your waking awareness is strong. You naturally notice things most people miss. This translates directly to dream awareness. Focus on deepening your reality checks — don't just go through the motions, genuinely question your reality each time. Your mindfulness practice is your greatest lucid dreaming asset." },
      { min: 19, max: 24, title: "Sustained Meta-Awareness", description: "You have the awareness levels of an experienced meditator. Lucid dreaming is a natural extension of what you already practice while awake. You may find that lucid dreams arise spontaneously as your meta-awareness carries into sleep. Explore dream yoga and the deeper dimensions of consciousness that lucid dreaming opens." },
    ],
  },
  {
    id: "dream-sign",
    title: "Dream Sign Recognition Quiz",
    description: "Dream signs are recurring elements in your dreams that can trigger lucidity. Discover which types of dream signs are most common for you.",
    questions: [
      { question: "Do your dreams often feature impossible physics (flying, breathing underwater)?", options: ["Never", "Rarely", "Sometimes", "Frequently"], scores: [0, 1, 2, 3] },
      { question: "Do familiar places look different in your dreams?", options: ["Don't notice", "Occasionally", "Often", "Almost always"], scores: [0, 1, 2, 3] },
      { question: "Do people in your dreams behave strangely or out of character?", options: ["Not that I notice", "Sometimes", "Often", "Very frequently"], scores: [0, 1, 2, 3] },
      { question: "Do you experience strong emotions in dreams that seem disproportionate?", options: ["Rarely", "Sometimes", "Often", "Almost every dream"], scores: [0, 1, 2, 3] },
      { question: "Do you find yourself in situations from your past in dreams?", options: ["Rarely", "Occasionally", "Frequently", "Most dreams involve the past"], scores: [0, 1, 2, 3] },
      { question: "Do technology and text behave normally in your dreams?", options: ["Yes, seems normal", "Usually", "Often glitchy", "Always broken or shifting"], scores: [0, 1, 2, 3] },
      { question: "Do you notice lighting or time-of-day inconsistencies in dreams?", options: ["Never", "Rarely", "Sometimes", "Often"], scores: [0, 1, 2, 3] },
      { question: "Do you encounter the same dream characters or scenarios repeatedly?", options: ["No patterns", "Maybe one", "Several recurring elements", "Strong recurring patterns"], scores: [0, 1, 2, 3] },
    ],
    results: [
      { min: 0, max: 6, title: "Dream Signs Hidden", description: "Your dream signs are there but you haven't learned to see them yet. This is completely normal. Start journaling every dream and after two weeks, review your entries looking for patterns — recurring people, places, emotions, or impossible events. These patterns are your personal dream signs, and recognizing them is the key to spontaneous lucidity." },
      { min: 7, max: 12, title: "Emerging Patterns", description: "You're beginning to notice dream patterns. Focus on your top 2-3 most common dream signs and create specific reality checks for them. If you often dream about your childhood home, do a reality check every time you think about that place while awake. The bridge between waking recognition and dream recognition is shorter than you think." },
      { min: 13, max: 18, title: "Clear Dream Signs", description: "You have strong awareness of your dream patterns. Now use them actively: before sleep, review your known dream signs and set the intention 'When I see [dream sign], I will realize I'm dreaming.' This prospective memory technique is the heart of the MILD method and your clear dream signs give you a significant advantage." },
      { min: 19, max: 24, title: "Rich Dream Sign Awareness", description: "Your dream landscape is full of recognizable patterns. You're primed for frequent lucid dreams. Practice 'dream sign meditation' — spend 5 minutes before sleep visualizing yourself encountering your top dream signs and becoming lucid. With your level of pattern recognition, spontaneous lucidity should become increasingly common." },
    ],
  },
  {
    id: "advanced-readiness",
    title: "Are You Ready for Advanced Dream Work?",
    description: "Beyond basic lucid dreaming lies dream yoga, shared dreaming, and consciousness exploration. Find out if you're ready for the deeper work.",
    questions: [
      { question: "How many lucid dreams have you had?", options: ["None yet", "1-5", "6-20", "More than 20"], scores: [0, 1, 2, 3] },
      { question: "Can you maintain lucidity without the dream collapsing?", options: ["Haven't been lucid", "Lucidity lasts seconds", "Can maintain for minutes", "Sustained lucidity"], scores: [0, 1, 2, 3] },
      { question: "Can you control dream elements (flying, changing scenes)?", options: ["No experience", "Tried but failed", "Some control", "Reliable control"], scores: [0, 1, 2, 3] },
      { question: "Have you communicated with dream characters as conscious entities?", options: ["No", "Tried once", "A few times", "Regularly"], scores: [0, 1, 2, 3] },
      { question: "How deep is your meditation practice?", options: ["Beginner", "Intermediate", "Advanced", "Long-term practitioner"], scores: [0, 1, 2, 3] },
      { question: "Have you experienced awareness during dreamless sleep?", options: ["No", "Not sure", "Possibly once", "Yes, clearly"], scores: [0, 1, 2, 3] },
      { question: "Are you familiar with Tibetan dream yoga concepts?", options: ["Never heard of it", "Read about it", "Studied it", "Practice it"], scores: [0, 1, 2, 3] },
      { question: "What's your relationship with fear in dreams?", options: ["Dreams can be scary", "Some anxiety", "Generally calm", "Fear is a teacher"], scores: [0, 1, 2, 3] },
    ],
    results: [
      { min: 0, max: 6, title: "Foundation Phase", description: "Focus on building your basic lucid dreaming practice first. Master dream recall, reality testing, and basic induction techniques. The advanced work requires a stable foundation — rushing ahead often leads to frustration. Enjoy the journey of learning to wake up inside your dreams." },
      { min: 7, max: 12, title: "Intermediate Explorer", description: "You have lucid dreaming experience and are ready to deepen. Start exploring dream stabilization techniques, practice surrendering control to see what the dream reveals, and begin studying dream yoga concepts. The shift from controlling dreams to listening to them is where the real depth begins." },
      { min: 13, max: 18, title: "Advanced Practitioner", description: "You're ready for the deeper work. Explore Andrew Holecek's dream yoga teachings, practice maintaining awareness through sleep transitions, and begin working with the dream state as a consciousness laboratory. Consider studying Tibetan sleep yoga and the practice of recognizing awareness in dreamless sleep." },
      { min: 19, max: 24, title: "Consciousness Explorer", description: "You're operating at an advanced level. The distinction between dreaming and waking consciousness is becoming fluid for you. Explore the sleep of clear light, shared dreaming experiments, and the use of lucid dreams for deep psychological and spiritual work. You may find that the dream state becomes a primary vehicle for consciousness exploration." },
    ],
  },
];

function generatePDF(quiz: Quiz, score: number, result: typeof quizzes[0]["results"][0], answers: number[]) {
  // Create a simple text-based PDF content
  const lines = [
    `${SITE_NAME} — Quiz Results`,
    ``,
    `Quiz: ${quiz.title}`,
    `Date: ${new Date().toLocaleDateString()}`,
    `Score: ${score} / ${quiz.questions.length * 3}`,
    ``,
    `Result: ${result.title}`,
    ``,
    result.description,
    ``,
    `--- Your Answers ---`,
    ``,
  ];
  
  quiz.questions.forEach((q, i) => {
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
  a.download = `${quiz.id}-results.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function QuizComponent({ quiz }: { quiz: Quiz }) {
  const [currentQ, setCurrentQ] = useState(-1); // -1 = intro
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const score = answers.reduce((sum, a, i) => sum + (quiz.questions[i]?.scores[a] || 0), 0);
  const result = quiz.results.find(r => score >= r.min && score <= r.max) || quiz.results[quiz.results.length - 1];

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    
    if (currentQ < quiz.questions.length - 1) {
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
          <CheckCircle2 className="w-12 h-12 text-[var(--aurora)] mx-auto mb-3" />
          <h3 className="font-heading text-xl font-700 mb-1" style={{ color: "var(--twilight)" }}>
            {result.title}
          </h3>
          <p className="text-sm text-muted-foreground">Score: {score} / {quiz.questions.length * 3}</p>
        </div>
        <p className="text-sm leading-relaxed mb-6">{result.description}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => generatePDF(quiz, score, result, answers)}
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
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  if (currentQ === -1) {
    return (
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-heading text-lg font-700 mb-2" style={{ color: "var(--twilight)" }}>
          {quiz.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{quiz.description}</p>
        <p className="text-xs text-muted-foreground mb-4">{quiz.questions.length} questions · Takes about 2 minutes</p>
        <button
          onClick={() => setCurrentQ(0)}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[var(--twilight)] text-[var(--starlight)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Start Quiz
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const q = quiz.questions[currentQ];

  return (
    <div className="p-6 rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground">
          Question {currentQ + 1} of {quiz.questions.length}
        </span>
        <div className="flex gap-1">
          {quiz.questions.map((_, i) => (
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

export default function QuizzesPage() {
  useEffect(() => {
    document.title = `Lucid Dreaming Quizzes — ${SITE_NAME}`;
  }, []);

  return (
    <section className="container py-10 max-w-3xl">
      <h1 className="font-heading text-3xl md:text-4xl font-800 mb-4" style={{ color: "var(--twilight)" }}>
        Lucid Dreaming Quizzes
      </h1>
      <p className="text-lg leading-relaxed text-muted-foreground mb-10">
        Discover your dreaming style, find the right technique, and assess your readiness for lucid dreaming. Each quiz takes about 2 minutes and provides personalized results you can download.
      </p>

      <div className="space-y-6">
        {quizzes.map((quiz) => (
          <QuizComponent key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </section>
  );
}
