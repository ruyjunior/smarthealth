import { describe, expect, it } from 'vitest';
import { isManagerPath, isProtectedPath, isPublicPath } from './access';

describe('path classification', () => {
  it('matches public paths and their sub-paths', () => {
    expect(isPublicPath('/login')).toBe(true);
    expect(isPublicPath('/login/recover')).toBe(true);
    expect(isPublicPath('/')).toBe(true);
  });

  it('matches protected paths and their sub-paths', () => {
    expect(isProtectedPath('/dashboard')).toBe(true);
    expect(isProtectedPath('/manager/users/42/edit')).toBe(true);
    expect(isProtectedPath('/notes')).toBe(true);
  });

  it('does not mistake a similarly named path for a real prefix', () => {
    // '/managers' must not be treated as '/manager'
    expect(isManagerPath('/managers')).toBe(false);
    expect(isProtectedPath('/managers')).toBe(false);
    expect(isPublicPath('/loginx')).toBe(false);
  });

  it('treats /manager and its children as manager paths', () => {
    expect(isManagerPath('/manager')).toBe(true);
    expect(isManagerPath('/manager/payments')).toBe(true);
    expect(isManagerPath('/dashboard')).toBe(false);
  });

  it('does not classify the landing page as protected', () => {
    expect(isPublicPath('/')).toBe(true);
    expect(isProtectedPath('/')).toBe(false);
  });

  it('keeps the legal pages public and never protected', () => {
    // /privacidade e /termos precisam continuar acessíveis publicamente
    expect(isPublicPath('/privacidade')).toBe(true);
    expect(isPublicPath('/termos')).toBe(true);
    expect(isProtectedPath('/privacidade')).toBe(false);
    expect(isProtectedPath('/termos')).toBe(false);
    expect(isManagerPath('/privacidade')).toBe(false);
    expect(isManagerPath('/termos')).toBe(false);
  });
});
