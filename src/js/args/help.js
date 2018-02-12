export default function () {
  const { name } = this.config;
  const firstBig = word => word.charAt(0).toUpperCase() + word.substr(1);

  const parts = [];

  const groups = {
    options: true,
    examples: true,
  };

  for (const group in groups) {
    if (this.details[group].length > 0) {
      continue; // eslint-disable-line
    }

    groups[group] = false;
  }

  const optionHandle = groups.options ? '[options] ' : '';
  const value = typeof this.config.value === 'string'
    ? ` ${this.config.value}`
    : '';

  parts.push([
    '',
    `Usage: ${this.printMainColor(name)} ${this.printSubColor(optionHandle + value)}`,
    '',
  ]);

  for (const group in groups) {
    if (!groups[group]) {
      continue; // eslint-disable-line
    }

    parts.push(['', `${firstBig(group)}:`, '', '']);

    if (group === 'examples') {
      parts.push(this.generateExamples());
    } else {
      parts.push(this.generateDetails(group));
    }

    parts.push(['', '']);
  }

  let output = '';

  // And finally, merge and output them
  for (const part of parts) {
    output += part.join('\n  ');
  }

  if (!groups.options) {
    output = 'No options available';
  }

  const { usageFilter } = this.config;

  // If filter is available, pass usage information through
  if (typeof usageFilter === 'function') {
    output = usageFilter(output) || output;
  }

  console.log(output); // eslint-disable-line
}
