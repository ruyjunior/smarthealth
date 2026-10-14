import { describe, expect, it } from 'vitest';
import { isProtectedPath } from '@/app/lib/access';
import { findHelpTopic } from '@/app/lib/help-topics';
import { CURRENT_RELEASE, releaseStorageKey } from './release';

describe('release content', () => {
  it('identifies the version', () => {
    expect(CURRENT_RELEASE.version).toMatch(/^\d+\.\d+$/);
    expect(CURRENT_RELEASE.title.length).toBeGreaterThan(0);
    expect(CURRENT_RELEASE.summary.length).toBeGreaterThan(0);
  });

  it('dates the release as a calendar day', () => {
    expect(CURRENT_RELEASE.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(new Date(CURRENT_RELEASE.date).getTime())).toBe(false);
  });

  it('announces a few highlights, each with a title and a description', () => {
    // O aviso é um banner: uma lista longa deixaria de ser aviso.
    expect(CURRENT_RELEASE.highlights.length).toBeGreaterThan(0);
    expect(CURRENT_RELEASE.highlights.length).toBeLessThanOrEqual(4);

    for (const highlight of CURRENT_RELEASE.highlights) {
      expect(highlight.title.length).toBeGreaterThan(0);
      expect(highlight.description.length).toBeGreaterThan(0);
    }
  });

  it('only links to a screen the app actually protects', () => {
    if (CURRENT_RELEASE.path) {
      expect(isProtectedPath(CURRENT_RELEASE.path)).toBe(true);
    }
  });

  it('only points to a help guide that exists', () => {
    // Um guia renomeado deixaria o aviso com um link quebrado.
    if (CURRENT_RELEASE.helpSlug) {
      expect(findHelpTopic(CURRENT_RELEASE.helpSlug, true)).toBeDefined();
      expect(CURRENT_RELEASE.helpLabel?.length).toBeGreaterThan(0);
    }
  });

  it('labels every action that has a destination', () => {
    expect(Boolean(CURRENT_RELEASE.path) === Boolean(CURRENT_RELEASE.pathLabel)).toBe(true);
    expect(Boolean(CURRENT_RELEASE.helpSlug) === Boolean(CURRENT_RELEASE.helpLabel)).toBe(true);
  });
});

describe('releaseStorageKey', () => {
  it('namespaces the key by version', () => {
    expect(releaseStorageKey({ version: '1.1' })).toBe('sh-release-1.1');
  });

  it('lets a new version be announced again', () => {
    // Quem fechou o aviso da 1.1 precisa ver o da 1.2.
    expect(releaseStorageKey({ version: '1.1' })).not.toBe(releaseStorageKey({ version: '1.2' }));
  });
});
