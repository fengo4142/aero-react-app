const parseRRule = (
  predefinedRules,
  frequencies,
  rrule
) => {
  if (!rrule) return {};

  const result = {};
  
  
  const params = rrule.params.split(';');
  params.forEach((p) => {
    const parts = p.split(':');
    switch (parts[0]) {
      case 'BYWEEKDAY': {
        const days = parts[1].split(',');
        result.days = {
          SU: days.find(d => d === 'SU') !== undefined,
          MO: days.find(d => d === 'MO') !== undefined,
          TU: days.find(d => d === 'TU') !== undefined,
          WE: days.find(d => d === 'WE') !== undefined,
          TH: days.find(d => d === 'TH') !== undefined,
          FR: days.find(d => d === 'FR') !== undefined,
          SA: days.find(d => d === 'SA') !== undefined
        };
        break;
      }
      case 'INTERVAL':
        [, result.interval] = parts;
        break;
      case 'BYMONTHDAY':
        [, result.monthDay] = parts;
        break;
      case 'BYSETPOS':
        [, result.setpos] = parts;
        break;
      case 'BYMONTH':
        [, result.month] = parts;
        break;
      default:
        break;
    }
  });

  result.frequency = frequencies.find(r => r.key === rrule.frequency);
  const rule = predefinedRules.find(r => r.name === rrule.name);
  result.rule = rule ? rule : result.interval > 1 ? {key:'custom', name: 'custom'} 
      : {name:result.frequency.name, frequency:rrule.frequency}
  return result;
};
export default parseRRule;
