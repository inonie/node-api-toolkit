/**
 * Bot Integration Registry
 * Central registry for all CI/CD, security, and automation bot integrations.
 */

export interface BotIntegration {
  name: string;
  category: 'ci' | 'security' | 'quality' | 'deployment' | 'automation' | 'ai';
  enabled: boolean;
}

export const BOT_REGISTRY: BotIntegration[] = [
  { name: 'github-actions', category: 'ci', enabled: true },
  { name: 'dependabot', category: 'security', enabled: true },
  { name: 'renovate', category: 'security', enabled: true },
  { name: 'codecov', category: 'quality', enabled: true },
  { name: 'coderabbitai', category: 'ai', enabled: true },
  { name: 'copilot', category: 'ai', enabled: true },
  { name: 'vercel', category: 'deployment', enabled: true },
  { name: 'netlify', category: 'deployment', enabled: true },
  { name: 'snyk', category: 'security', enabled: true },
  { name: 'sonarcloud', category: 'quality', enabled: true },
];

export function getEnabledBots(): BotIntegration[] {
  return BOT_REGISTRY.filter(bot => bot.enabled);
}

export function getBotsByCategory(category: BotIntegration['category']): BotIntegration[] {
  return BOT_REGISTRY.filter(bot => bot.category === category);
}
