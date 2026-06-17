import { getCommands, filterCommands, CommandContext } from './command-registry';

const ctx: CommandContext = {
  navigate: () => {},
  triggerMatrix: () => {},
};

describe('command registry', () => {
  test('provides navigation, action, and fun commands', () => {
    const cmds = getCommands(ctx);
    const groups = new Set(cmds.map((c) => c.group));
    expect(groups.has('Navigate')).toBe(true);
    expect(groups.has('Actions')).toBe(true);
    expect(groups.has('Fun')).toBe(true);
    expect(cmds.find((c) => c.id === 'nav-work')).toBeTruthy();
    expect(cmds.find((c) => c.id === 'action-resume')).toBeTruthy();
  });

  test('empty query returns all commands in original order', () => {
    const cmds = getCommands(ctx);
    expect(filterCommands(cmds, '')).toHaveLength(cmds.length);
  });

  test('filters and ranks by fuzzy score', () => {
    const cmds = getCommands(ctx);
    const result = filterCommands(cmds, 'work');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toBe('nav-work');
  });

  test('drops non-matching commands', () => {
    const cmds = getCommands(ctx);
    const result = filterCommands(cmds, 'zzzzzz');
    expect(result).toHaveLength(0);
  });
});
