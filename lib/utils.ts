export function downloadOutput(lines: string[]) {
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = 'change-output.txt';
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}
