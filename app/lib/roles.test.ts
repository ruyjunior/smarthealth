import { describe, expect, it } from 'vitest';
import { MANAGER_ROLE, USER_ROLES, isManager } from './roles';

describe('isManager', () => {
  it('recognises the manager role', () => {
    expect(isManager('Gerente')).toBe(true);
    expect(isManager(MANAGER_ROLE)).toBe(true);
  });

  it('rejects every other role', () => {
    expect(isManager('Funcionário')).toBe(false);
    expect(isManager('funcionário')).toBe(false);
    expect(isManager('Administrador')).toBe(false);
  });

  it('rejects a missing role instead of throwing', () => {
    expect(isManager(null)).toBe(false);
    expect(isManager(undefined)).toBe(false);
    expect(isManager('')).toBe(false);
  });

  it('keeps MANAGER_ROLE inside the declared role list', () => {
    expect(USER_ROLES).toContain(MANAGER_ROLE);
  });
});
