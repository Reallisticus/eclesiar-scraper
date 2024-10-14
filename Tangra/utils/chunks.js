function chunkText(text, maxLength = 1024) {
  const chunks = [];
  let chunk = '';

  for (const line of text.split('\n')) {
    if (chunk.length + line.length + 1 > maxLength) {
      chunks.push(chunk);
      chunk = '';
    }
    chunk += line + '\n';
  }

  if (chunk.length > 0) {
    chunks.push(chunk);
  }

  return chunks;
}

module.exports = chunkText;
