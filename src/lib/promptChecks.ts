export interface ValidationResult {
  passed: boolean;
  message: string;
  hint?: string;
}

export const mustContain = (prompt: string, phrases: string[], hint: string): ValidationResult => {
  const lowerPrompt = prompt.toLowerCase();
  const missingPhrases = phrases.filter(phrase => !lowerPrompt.includes(phrase.toLowerCase()));
  
  if (missingPhrases.length > 0) {
    return {
      passed: false,
      message: `Missing required phrases: ${missingPhrases.join(', ')}`,
      hint
    };
  }
  
  return {
    passed: true,
    message: "✅ Contains all required phrases"
  };
};

export const mustNotContain = (prompt: string, patterns: string[], hint: string): ValidationResult => {
  const lowerPrompt = prompt.toLowerCase();
  const foundPatterns = patterns.filter(pattern => lowerPrompt.includes(pattern.toLowerCase()));
  
  if (foundPatterns.length > 0) {
    return {
      passed: false,
      message: `Should not contain: ${foundPatterns.join(', ')}`,
      hint
    };
  }
  
  return {
    passed: true,
    message: "✅ Avoids problematic patterns"
  };
};

export const requireSections = (prompt: string, sectionNames: string[], hint: string): ValidationResult => {
  const lowerPrompt = prompt.toLowerCase();
  const missingSections = sectionNames.filter(section => 
    !lowerPrompt.includes(section.toLowerCase())
  );
  
  if (missingSections.length > 0) {
    return {
      passed: false,
      message: `Missing required sections: ${missingSections.join(', ')}`,
      hint
    };
  }
  
  return {
    passed: true,
    message: "✅ Includes all required sections"
  };
};

export const requireLimits = (prompt: string, limits: { words?: number; tokens?: number; steps?: number }, hint: string): ValidationResult => {
  const lowerPrompt = prompt.toLowerCase();
  
  if (limits.words && !lowerPrompt.includes('word')) {
    return {
      passed: false,
      message: "Missing word limit specification",
      hint
    };
  }
  
  if (limits.tokens && !lowerPrompt.includes('token')) {
    return {
      passed: false,
      message: "Missing token limit specification", 
      hint
    };
  }
  
  if (limits.steps && !lowerPrompt.includes('step')) {
    return {
      passed: false,
      message: "Missing step limit specification",
      hint
    };
  }
  
  return {
    passed: true,
    message: "✅ Includes appropriate limits"
  };
};

export const requireStyle = (prompt: string, style: { tone?: string; audience?: string }, hint: string): ValidationResult => {
  const lowerPrompt = prompt.toLowerCase();
  const missing: string[] = [];
  
  if (style.tone && !lowerPrompt.includes(style.tone.toLowerCase())) {
    missing.push(`tone (${style.tone})`);
  }
  
  if (style.audience && !lowerPrompt.includes(style.audience.toLowerCase())) {
    missing.push(`audience (${style.audience})`);
  }
  
  if (missing.length > 0) {
    return {
      passed: false,
      message: `Missing style requirements: ${missing.join(', ')}`,
      hint
    };
  }
  
  return {
    passed: true,
    message: "✅ Includes required style elements"
  };
};

export const capLength = (prompt: string, maxChars: number, hint: string): ValidationResult => {
  if (prompt.length > maxChars) {
    return {
      passed: false,
      message: `Prompt too long: ${prompt.length}/${maxChars} characters`,
      hint
    };
  }
  
  return {
    passed: true,
    message: `✅ Within length limit (${prompt.length}/${maxChars} characters)`
  };
};

export const validatePrompt = (prompt: string, rules: any[]): ValidationResult[] => {
  return rules.map(rule => {
    switch (rule.type) {
      case 'mustContain':
        return mustContain(prompt, rule.value, rule.hint);
      case 'mustNotContain':
        return mustNotContain(prompt, rule.value, rule.hint);
      case 'requireSections':
        return requireSections(prompt, rule.value, rule.hint);
      case 'requireLimits':
        return requireLimits(prompt, rule.value, rule.hint);
      case 'requireStyle':
        return requireStyle(prompt, rule.value, rule.hint);
      case 'capLength':
        return capLength(prompt, rule.value, rule.hint);
      default:
        return {
          passed: false,
          message: `Unknown validation rule: ${rule.type}`,
          hint: "Check the validation rule configuration"
        };
    }
  });
};