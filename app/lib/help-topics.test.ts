import { describe, expect, it } from 'vitest';
import { isProtectedPath } from '@/app/lib/access';
import {
  APP_PUBLIC_URL,
  HELP_TOPICS,
  findHelpTopic,
  helpTopicNeighbours,
  listHelpTopics,
  listSiteGuides,
  type HelpTopic,
} from './help-topics';

const managerOnlyTopics = HELP_TOPICS.filter((topic) => topic.audience === 'manager');
const sharedTopics = HELP_TOPICS.filter((topic) => topic.audience === 'all');

describe('help topic content', () => {
  it('exposes at least one shared topic and the manager-only guides', () => {
    expect(sharedTopics.length).toBeGreaterThan(0);
    expect(managerOnlyTopics.length).toBeGreaterThan(0);
  });

  it('keeps slugs unique and url-safe', () => {
    const slugs = HELP_TOPICS.map((topic) => topic.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('fills the title and the card summary of every topic', () => {
    for (const topic of HELP_TOPICS) {
      expect(topic.title.trim()).not.toBe('');
      expect(topic.summary.trim()).not.toBe('');
    }
  });

  it('gives every topic at least one section with heading and body', () => {
    for (const topic of HELP_TOPICS) {
      expect(topic.sections.length).toBeGreaterThan(0);

      for (const section of topic.sections) {
        expect(section.heading.trim()).not.toBe('');
        expect(section.body.trim()).not.toBe('');
      }
    }
  });

  it('never stores empty steps or tips', () => {
    for (const topic of HELP_TOPICS) {
      for (const section of topic.sections) {
        for (const list of [section.steps, section.tips]) {
          if (list) {
            expect(list.length).toBeGreaterThan(0);
            for (const item of list) {
              expect(item.trim()).not.toBe('');
            }
          }
        }
      }
    }
  });

  it('gives every topic at least one actionable step or tip', () => {
    for (const topic of HELP_TOPICS) {
      const hasGuidance = topic.sections.some((section) => section.steps || section.tips);

      expect(hasGuidance).toBe(true);
    }
  });

  it('only links to screens that the app actually protects', () => {
    for (const topic of HELP_TOPICS) {
      if (topic.path) {
        expect(isProtectedPath(topic.path)).toBe(true);
      }
    }
  });

  it('gives device instructions the full public address', () => {
    // Quem pareia está em outra máquina: "abra /tv" não é acionável na TV.
    const pairing = HELP_TOPICS.find((topic) => topic.slug === 'totem-e-telao');

    expect(pairing).toBeDefined();

    const instructions = pairing!.sections
      .flatMap((section) => [...(section.steps ?? []), ...(section.tips ?? [])])
      .join(' ');
    // A URL vem no meio da frase, então a pontuação final não faz parte dela.
    const listedUrls = (instructions.match(new RegExp(`${APP_PUBLIC_URL}\\S*`, 'g')) ?? []).map(
      (url) => url.replace(/[.;,)]+$/, ''),
    );

    expect(listedUrls).toContain(`${APP_PUBLIC_URL}/totem`);
    expect(listedUrls).toContain(`${APP_PUBLIC_URL}/tv`);
  });
});

describe('listHelpTopics', () => {
  it('hides the manager-only guides from regular users', () => {
    const visible = listHelpTopics(false);

    expect(visible.every((topic) => topic.audience === 'all')).toBe(true);
    expect(visible).toHaveLength(sharedTopics.length);
  });

  it('shows every guide to managers', () => {
    expect(listHelpTopics(true)).toHaveLength(HELP_TOPICS.length);
  });

  it('preserves the reading order of the content file', () => {
    expect(listHelpTopics(true).map((topic) => topic.slug)).toEqual(
      HELP_TOPICS.map((topic) => topic.slug),
    );
  });
});

describe('findHelpTopic', () => {
  it('finds a shared topic by slug', () => {
    const [first] = sharedTopics;

    expect(findHelpTopic(first.slug, false)).toEqual(first);
  });

  it('returns nothing for an unknown slug', () => {
    expect(findHelpTopic('guia-que-nao-existe', true)).toBeUndefined();
  });

  it('gates the manager-only topics by role', () => {
    const topic = managerOnlyTopics[0];

    expect(findHelpTopic(topic.slug, false)).toBeUndefined();
    expect(findHelpTopic(topic.slug, true)).toEqual(topic);
  });
});

describe('listSiteGuides', () => {
  it('highlights the daily workflows on the public home page', () => {
    const guides = listSiteGuides();
    const slugs = guides.map((topic) => topic.slug);

    expect(guides.length).toBeGreaterThan(0);
    expect(slugs).toContain('primeiros-passos');
    expect(slugs).toContain('agenda');
    expect(slugs).toContain('orcamento');
    expect(slugs).toContain('fila-de-espera');
  });

  it('never exposes a manager-only topic before login', () => {
    for (const topic of listSiteGuides()) {
      expect(topic.audience).toBe('all');
    }
  });

  it('keeps every guide unique', () => {
    const slugs = listSiteGuides().map((topic) => topic.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('helpTopicNeighbours', () => {
  it('walks the visible list in both directions', () => {
    const visible = listHelpTopics(true);
    const middle = visible[1];

    expect(helpTopicNeighbours(middle.slug, true).previous?.slug).toBe(visible[0].slug);
    expect(helpTopicNeighbours(middle.slug, true).next?.slug).toBe(visible[2].slug);
  });

  it('leaves the ends of the list open', () => {
    const visible = listHelpTopics(true);

    expect(helpTopicNeighbours(visible[0].slug, true).previous).toBeUndefined();
    expect(helpTopicNeighbours(visible[visible.length - 1].slug, true).next).toBeUndefined();
  });

  it('returns no neighbours for an unknown slug', () => {
    const neighbours = helpTopicNeighbours('guia-que-nao-existe', true);

    expect(neighbours.previous).toBeUndefined();
    expect(neighbours.next).toBeUndefined();
  });

  it('never leaks a manager-only guide into the regular user walk', () => {
    const visible = listHelpTopics(false);
    const slugs = visible.map((topic: HelpTopic) => topic.slug);

    for (const topic of visible) {
      const { previous, next } = helpTopicNeighbours(topic.slug, false);

      if (previous) expect(slugs).toContain(previous.slug);
      if (next) expect(slugs).toContain(next.slug);
    }

    for (const topic of managerOnlyTopics) {
      const { previous, next } = helpTopicNeighbours(topic.slug, false);

      expect(previous).toBeUndefined();
      expect(next).toBeUndefined();
    }
  });
});
