const prefixes = {
  messenger: '/messenger',
  settings: '/settings',
  ops: '/ops',
};

export const uiRouts = {
  root: '/',
  todo: '/todo',
  settings: prefixes.settings,
  settingsOrganization: `${prefixes.settings}/organization`,
  profile: '/profile',
  ops: prefixes.ops,
  opsInspections: `${prefixes.ops}/inspections`,
  opsWorkorders: `${prefixes.ops}/workorders`,
  opsAssets: `${prefixes.ops}/assets`,
  opsLogs: `${prefixes.ops}/logs`,
  opsSettings: `${prefixes.ops}/settings`,
  messenger: prefixes.messenger,
  channels: `${prefixes.messenger}/channels`,
  directMassages: `${prefixes.messenger}/direct-massages`,
  documents: `${prefixes.messenger}/documents`,
  irrops: `${prefixes.messenger}/irrops`,
  createNewChannel: `${prefixes.messenger}/create-new-channel`,
};
