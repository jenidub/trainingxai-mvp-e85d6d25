export interface ValidationRule {
  type: 'mustContain' | 'mustNotContain' | 'requireSections' | 'requireLimits' | 'requireStyle' | 'capLength';
  value: any;
  hint: string;
}

export interface PracticeTask {
  id: number;
  title: string;
  description: string;
  instructions: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  validationRules: ValidationRule[];
  examplePrompt?: string;
  expectedElements: string[];
}

export const practiceTasks: PracticeTask[] = [
  {
    id: 1,
    title: "Fractions for 5th Graders",
    description: "Create a prompt that explains fractions to 5th-grade students",
    instructions: "Write a prompt that asks AI to explain fractions in a way that 5th graders can understand. Include the target audience and goal clearly.",
    category: "Math Education",
    difficulty: "Easy",
    validationRules: [
      { type: 'mustContain', value: ['5th grade', 'fractions'], hint: "Include '5th grade' and 'fractions' in your prompt" },
      { type: 'requireStyle', value: { audience: '5th grade' }, hint: "Specify the target audience (5th grade students)" },
      { type: 'capLength', value: 300, hint: "Keep your prompt under 300 characters for clarity" }
    ],
    expectedElements: ["Target audience specified", "Clear explanation request", "Age-appropriate language"],
    examplePrompt: "Explain fractions to 5th grade students using simple examples like pizza slices."
  },
  {
    id: 2,
    title: "Friendly Math Tutor",
    description: "Create a persona-based prompt for teaching long division",
    instructions: "Write a prompt that establishes a friendly math tutor persona to teach long division step-by-step.",
    category: "Math Education",
    difficulty: "Easy",
    validationRules: [
      { type: 'mustContain', value: ['tutor', 'long division'], hint: "Include 'tutor' and 'long division'" },
      { type: 'requireStyle', value: { tone: 'friendly' }, hint: "Specify a friendly, encouraging tone" },
      { type: 'mustContain', value: ['step'], hint: "Request step-by-step explanation" }
    ],
    expectedElements: ["Persona definition", "Subject specification", "Teaching approach"],
    examplePrompt: "You are a friendly math tutor. Explain long division step-by-step to a struggling student."
  },
  {
    id: 3,
    title: "Revolution Summary",
    description: "Request a concise summary with specific constraints",
    instructions: "Create a prompt asking for a summary of the American Revolution in bullet points, under 100 words.",
    category: "History",
    difficulty: "Easy",
    validationRules: [
      { type: 'mustContain', value: ['American Revolution', 'bullet'], hint: "Include 'American Revolution' and specify bullet points" },
      { type: 'requireLimits', value: { words: 100 }, hint: "Set a word limit of 100 words or less" },
      { type: 'mustContain', value: ['summary'], hint: "Request a summary format" }
    ],
    expectedElements: ["Topic specified", "Format requested", "Word limit set"],
    examplePrompt: "Summarize the American Revolution in bullet points, maximum 100 words."
  },
  {
    id: 4,
    title: "Photosynthesis for 4th Grade",
    description: "Explain a complex science concept at grade level",
    instructions: "Write a prompt asking AI to explain photosynthesis at a 4th-grade reading level.",
    category: "Science Education",
    difficulty: "Medium",
    validationRules: [
      { type: 'mustContain', value: ['photosynthesis', '4th grade'], hint: "Include 'photosynthesis' and '4th grade'" },
      { type: 'requireStyle', value: { audience: '4th grade' }, hint: "Specify 4th grade level explicitly" },
      { type: 'mustContain', value: ['explain'], hint: "Use action words like 'explain'" }
    ],
    expectedElements: ["Science concept", "Grade level specified", "Explanation request"],
    examplePrompt: "Explain photosynthesis to 4th grade students using simple words and examples."
  },
  {
    id: 5,
    title: "Science Quiz Study Guide",
    description: "Create a structured study guide with multiple sections",
    instructions: "Write a prompt for a study guide about the solar system with sections: Summary, Vocabulary, and Practice Questions.",
    category: "Science Education",
    difficulty: "Medium",
    validationRules: [
      { type: 'requireSections', value: ['Summary', 'Vocabulary', 'Practice Questions'], hint: "Include sections: Summary, Vocabulary, and Practice Questions" },
      { type: 'mustContain', value: ['solar system', 'study guide'], hint: "Include 'solar system' and 'study guide'" }
    ],
    expectedElements: ["Topic specified", "Three required sections", "Study format"],
    examplePrompt: "Create a solar system study guide with three sections: Summary, Vocabulary, and Practice Questions."
  },
  {
    id: 6,
    title: "Word Problem Solution (Few-shot)",
    description: "Use one example to guide problem-solving format",
    instructions: "Create a prompt that shows one example word problem and solution, then asks AI to solve a new problem in the same format.",
    category: "Math Education",
    difficulty: "Medium",
    validationRules: [
      { type: 'mustContain', value: ['example', 'word problem'], hint: "Include 'example' and 'word problem'" },
      { type: 'mustContain', value: ['solve', 'format'], hint: "Request solving in a specific format" },
      { type: 'requireSections', value: ['Example', 'Problem'], hint: "Include an example section and new problem" }
    ],
    expectedElements: ["Example provided", "Format specified", "New problem request"],
    examplePrompt: "Example: Tom has 12 apples, gives away 4. Solution: 12 - 4 = 8 apples. Now solve: Sarah has 15 books, reads 6."
  },
  {
    id: 7,
    title: "Spelling Sentences (Few-shot)",
    description: "Generate more examples following a pattern",
    instructions: "Provide 2+ spelling sentence examples, then ask AI to generate 5 more following the same pattern.",
    category: "Language Arts",
    difficulty: "Medium",
    validationRules: [
      { type: 'mustContain', value: ['spelling', 'examples'], hint: "Include 'spelling' and 'examples'" },
      { type: 'mustContain', value: ['generate', '5'], hint: "Request generating 5 new examples" },
      { type: 'mustContain', value: ['pattern'], hint: "Reference following the same pattern" }
    ],
    expectedElements: ["Multiple examples", "Pattern specification", "Generation request"],
    examplePrompt: "Examples: 'The cat sat on the mat.' 'I like to eat apples.' Generate 5 more simple spelling sentences following this pattern."
  },
  {
    id: 8,
    title: "Declaration as Storybook",
    description: "Creative rewriting with style transformation",
    instructions: "Ask AI to rewrite the opening of the Declaration of Independence as a children's storybook.",
    category: "History",
    difficulty: "Medium",
    validationRules: [
      { type: 'mustContain', value: ['Declaration of Independence', 'children'], hint: "Include 'Declaration of Independence' and 'children'" },
      { type: 'mustContain', value: ['rewrite', 'storybook'], hint: "Request rewriting as a storybook" },
      { type: 'requireStyle', value: { tone: 'child-friendly' }, hint: "Specify child-friendly style" }
    ],
    expectedElements: ["Source text specified", "Target format", "Audience consideration"],
    examplePrompt: "Rewrite the opening of the Declaration of Independence as a children's storybook for ages 6-8."
  },
  {
    id: 9,
    title: "Social Studies Analysis",
    description: "Extract specific information categories",
    instructions: "Create a prompt to analyze a social studies passage and extract: Main Idea, Important People, and Key Dates.",
    category: "History",
    difficulty: "Medium",
    validationRules: [
      { type: 'requireSections', value: ['Main Idea', 'Important People', 'Key Dates'], hint: "Include sections: Main Idea, Important People, and Key Dates" },
      { type: 'mustContain', value: ['social studies', 'analyze'], hint: "Include 'social studies' and 'analyze'" }
    ],
    expectedElements: ["Analysis request", "Three specific categories", "Structured output"],
    examplePrompt: "Analyze this social studies passage and extract: Main Idea, Important People, and Key Dates."
  },
  {
    id: 10,
    title: "Geometry Problem Steps",
    description: "Request step-by-step mathematical reasoning",
    instructions: "Write a prompt asking AI to solve a geometry problem with exactly 3 reasoning steps.",
    category: "Math Education",
    difficulty: "Hard",
    validationRules: [
      { type: 'mustContain', value: ['geometry', '3 steps'], hint: "Include 'geometry' and '3 steps'" },
      { type: 'mustContain', value: ['reasoning', 'solve'], hint: "Request reasoning and solving" },
      { type: 'requireLimits', value: { steps: 3 }, hint: "Specify exactly 3 reasoning steps" }
    ],
    expectedElements: ["Subject specified", "Step requirement", "Reasoning emphasis"],
    examplePrompt: "Solve this geometry problem showing exactly 3 reasoning steps: Find the area of a triangle with base 8cm and height 6cm."
  },
  {
    id: 11,
    title: "Teacher Role with Questions",
    description: "Combine persona with structured output",
    instructions: "Create a prompt where AI acts as a teacher, summarizes the water cycle, and creates 2 multiple choice questions.",
    category: "Science Education",
    difficulty: "Hard",
    validationRules: [
      { type: 'mustContain', value: ['teacher', 'water cycle'], hint: "Include 'teacher' role and 'water cycle' topic" },
      { type: 'requireSections', value: ['Summary', 'Questions'], hint: "Include both summary and questions sections" },
      { type: 'mustContain', value: ['2', 'multiple choice'], hint: "Specify 2 multiple choice questions" }
    ],
    expectedElements: ["Teacher persona", "Content summary", "Question creation"],
    examplePrompt: "You are a science teacher. Summarize the water cycle, then create 2 multiple choice questions about it."
  },
  {
    id: 12,
    title: "Incomplete Problem Check",
    description: "Handle ambiguous or incomplete requests",
    instructions: "Write a prompt that asks AI to identify if a math problem is incomplete and ask clarifying questions if needed.",
    category: "Math Education",
    difficulty: "Hard",
    validationRules: [
      { type: 'mustContain', value: ['incomplete', 'clarifying'], hint: "Include 'incomplete' and 'clarifying'" },
      { type: 'mustContain', value: ['identify', 'questions'], hint: "Request identification and questions" },
      { type: 'mustContain', value: ['math problem'], hint: "Specify it's about math problems" }
    ],
    expectedElements: ["Problem assessment", "Conditional logic", "Question generation"],
    examplePrompt: "Check if this math problem is incomplete: 'John bought apples.' Ask clarifying questions if information is missing."
  },
  {
    id: 13,
    title: "Safety Guardrails",
    description: "Handle inappropriate requests properly",
    instructions: "Create a prompt instructing AI to politely refuse unsafe, inappropriate, or off-topic requests in an educational context.",
    category: "AI Safety",
    difficulty: "Hard",
    validationRules: [
      { type: 'mustContain', value: ['refuse', 'inappropriate'], hint: "Include 'refuse' and 'inappropriate'" },
      { type: 'mustContain', value: ['educational', 'politely'], hint: "Include 'educational' context and 'politely'" },
      { type: 'requireStyle', value: { tone: 'professional' }, hint: "Maintain professional tone" }
    ],
    expectedElements: ["Safety instruction", "Refusal protocol", "Professional tone"],
    examplePrompt: "If asked inappropriate or off-topic questions in this educational setting, politely refuse and redirect to learning objectives."
  },
  {
    id: 14,
    title: "Constraint-First Writing",
    description: "Lead with limitations and requirements",
    instructions: "Write a prompt that starts with constraints (word limit, style, audience) before giving the main task.",
    category: "Language Arts",
    difficulty: "Medium",
    validationRules: [
      { type: 'mustContain', value: ['word limit', 'audience'], hint: "Start with constraints like word limit and audience" },
      { type: 'mustContain', value: ['Write', 'exactly'], hint: "Use precise instruction words" },
      { type: 'capLength', value: 200, hint: "Keep the entire prompt under 200 characters" }
    ],
    expectedElements: ["Constraints first", "Clear requirements", "Main task follows"],
    examplePrompt: "Word limit: 50 words. Audience: 3rd graders. Style: Simple sentences. Write a paragraph about friendship."
  },
  {
    id: 15,
    title: "Novice vs Expert Explanation",
    description: "Demonstrate audience adaptation",
    instructions: "Create a prompt asking AI to explain fractions twice: once for a complete novice, once for someone with math experience.",
    category: "Math Education",
    difficulty: "Hard",
    validationRules: [
      { type: 'mustContain', value: ['novice', 'expert'], hint: "Include both 'novice' and 'expert' audiences" },
      { type: 'mustContain', value: ['fractions', 'twice'], hint: "Specify fractions topic and two explanations" },
      { type: 'requireSections', value: ['Novice', 'Expert'], hint: "Structure with clear sections for each audience" }
    ],
    expectedElements: ["Dual audience", "Same topic", "Contrast demonstration"],
    examplePrompt: "Explain fractions in two ways: 1) For a complete novice 2) For someone with math experience. Show the difference in approach."
  },
  {
    id: 16,
    title: "API Decision Making",
    description: "Simulate tool usage decisions",
    instructions: "Create a prompt where AI pretends it has access to a 'Math Helper API' and decides when to use it vs. answer directly.",
    category: "AI Reasoning",
    difficulty: "Hard",
    validationRules: [
      { type: 'mustContain', value: ['Math Helper API', 'decide'], hint: "Include 'Math Helper API' and decision making" },
      { type: 'mustContain', value: ['when to use', 'directly'], hint: "Specify decision criteria for tool use" },
      { type: 'requireSections', value: ['Decision', 'Action'], hint: "Include decision process and action" }
    ],
    expectedElements: ["Tool simulation", "Decision criteria", "Action choice"],
    examplePrompt: "You have access to a Math Helper API. For each question, decide: use the API for complex calculations or answer directly for simple ones."
  },
  {
    id: 17,
    title: "Essay Grading Rubric",
    description: "Create detailed assessment criteria",
    instructions: "Write a prompt asking for a grading rubric for 5-paragraph essays with specific criteria and point values.",
    category: "Language Arts",
    difficulty: "Hard",
    validationRules: [
      { type: 'mustContain', value: ['grading rubric', '5-paragraph'], hint: "Include 'grading rubric' and '5-paragraph'" },
      { type: 'mustContain', value: ['criteria', 'points'], hint: "Request criteria and point values" },
      { type: 'requireSections', value: ['Criteria', 'Points'], hint: "Structure with criteria and scoring" }
    ],
    expectedElements: ["Assessment focus", "Specific format", "Scoring system"],
    examplePrompt: "Create a grading rubric for 5-paragraph essays including criteria for introduction, body paragraphs, conclusion, and grammar with point values."
  },
  {
    id: 18,
    title: "Prompt Critique & Improvement",
    description: "Meta-analysis of prompting techniques",
    instructions: "Ask AI to critique this poor prompt: 'Explain gravity' and then provide an improved version with reasoning.",
    category: "AI Literacy",
    difficulty: "Hard",
    validationRules: [
      { type: 'mustContain', value: ['critique', 'improve'], hint: "Include both 'critique' and 'improve'" },
      { type: 'mustContain', value: ['Explain gravity', 'reasoning'], hint: "Include the example prompt and request reasoning" },
      { type: 'requireSections', value: ['Critique', 'Improved Version'], hint: "Structure with critique and improvement sections" }
    ],
    expectedElements: ["Original prompt analysis", "Improvement suggestions", "Reasoning provided"],
    examplePrompt: "Critique this prompt: 'Explain gravity' then provide an improved version explaining why your changes make it better."
  },
  {
    id: 19,
    title: "Charlotte's Web Analysis",
    description: "Structured text analysis with multiple outputs",
    instructions: "Create a prompt to analyze a Charlotte's Web passage and output: Context Summary + Key Facts in separate sections.",
    category: "Language Arts",
    difficulty: "Hard",
    validationRules: [
      { type: 'mustContain', value: ["Charlotte's Web", 'analyze'], hint: "Include 'Charlotte's Web' and 'analyze'" },
      { type: 'requireSections', value: ['Context Summary', 'Key Facts'], hint: "Include sections: Context Summary and Key Facts" },
      { type: 'mustContain', value: ['passage', 'separate'], hint: "Specify passage analysis with separate sections" }
    ],
    expectedElements: ["Literary work specified", "Analysis request", "Structured output"],
    examplePrompt: "Analyze this Charlotte's Web passage and provide: 1) Context Summary 2) Key Facts in separate clearly labeled sections."
  },
  {
    id: 20,
    title: "Production-Ready Classroom Prompt",
    description: "Comprehensive prompt synthesis",
    instructions: "Create a production-ready prompt that a teacher could use daily: combines persona, constraints, output format, and error handling.",
    category: "Synthesis",
    difficulty: "Hard",
    validationRules: [
      { type: 'mustContain', value: ['teacher', 'production'], hint: "Include 'teacher' and 'production-ready'" },
      { type: 'requireSections', value: ['Persona', 'Constraints', 'Format'], hint: "Include persona, constraints, and format sections" },
      { type: 'mustContain', value: ['error handling', 'daily'], hint: "Include error handling and daily use context" }
    ],
    expectedElements: ["Complete prompt structure", "Real-world application", "Error prevention"],
    examplePrompt: "You are a 4th grade teacher. Create daily reading comprehension questions: 3 questions max, grade-appropriate vocabulary, include answer key. If passage is too complex, simplify first."
  }
];