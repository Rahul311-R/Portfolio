/**
 * Real contact channels — single source of truth.
 * Every social link on the site renders from here; no placeholders.
 */
export const SOCIAL = {
  name: 'Rahul R',
  email: 'rahul5341r@gmail.com',
  github: 'https://github.com/Rahul311-R',
  githubLabel: 'github.com/Rahul311-R',
  linkedin: 'https://www.linkedin.com/in/rahul-r531/',
  linkedinLabel: 'linkedin.com/in/rahul-r531',
  location: 'Coimbatore, Tamil Nadu, India',
} as const;

export const SOCIAL_LINKS = [
  { id: 'github', href: SOCIAL.github, label: 'GitHub profile', text: SOCIAL.githubLabel },
  { id: 'linkedin', href: SOCIAL.linkedin, label: 'LinkedIn profile', text: SOCIAL.linkedinLabel },
  { id: 'email', href: `mailto:${SOCIAL.email}`, label: 'Email Rahul', text: SOCIAL.email },
] as const;
