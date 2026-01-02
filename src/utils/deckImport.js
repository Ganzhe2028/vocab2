const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const DOC_MIME = "application/msword";

const readUint16LE = (data, offset) =>
  data[offset] | (data[offset + 1] << 8);

const readUint32LE = (data, offset) =>
  (data[offset] |
    (data[offset + 1] << 8) |
    (data[offset + 2] << 16) |
    (data[offset + 3] << 24)) >>>
  0;

const findEocdIndex = (data) => {
  const minOffset = Math.max(0, data.length - 65557);
  for (let i = data.length - 22; i >= minOffset; i -= 1) {
    if (
      data[i] === 0x50 &&
      data[i + 1] === 0x4b &&
      data[i + 2] === 0x05 &&
      data[i + 3] === 0x06
    ) {
      return i;
    }
  }
  return -1;
};

const inflateZipData = async (compressed) => {
  if (typeof DecompressionStream === "undefined") {
    throw new Error("浏览器不支持解析 .docx，请改为粘贴文本。");
  }
  const blob = new Blob([compressed]);
  try {
    const stream = new DecompressionStream("deflate-raw");
    const buffer = await new Response(blob.stream().pipeThrough(stream))
      .arrayBuffer();
    return new Uint8Array(buffer);
  } catch (error) {
    const stream = new DecompressionStream("deflate");
    const buffer = await new Response(blob.stream().pipeThrough(stream))
      .arrayBuffer();
    return new Uint8Array(buffer);
  }
};

const extractDocxXml = async (file) => {
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  const eocdIndex = findEocdIndex(data);
  if (eocdIndex < 0) {
    throw new Error("无法读取 .docx 文件结构。");
  }
  const centralDirOffset = readUint32LE(data, eocdIndex + 16);
  const centralDirSize = readUint32LE(data, eocdIndex + 12);
  const decoder = new TextDecoder("utf-8");
  let offset = centralDirOffset;
  while (offset < centralDirOffset + centralDirSize) {
    if (readUint32LE(data, offset) !== 0x02014b50) {
      break;
    }
    const compressionMethod = readUint16LE(data, offset + 10);
    const compressedSize = readUint32LE(data, offset + 20);
    const fileNameLength = readUint16LE(data, offset + 28);
    const extraLength = readUint16LE(data, offset + 30);
    const commentLength = readUint16LE(data, offset + 32);
    const localHeaderOffset = readUint32LE(data, offset + 42);
    const nameStart = offset + 46;
    const fileName = decoder.decode(
      data.slice(nameStart, nameStart + fileNameLength)
    );
    if (fileName === "word/document.xml") {
      if (readUint32LE(data, localHeaderOffset) !== 0x04034b50) {
        throw new Error("docx 内容已损坏。");
      }
      const localNameLength = readUint16LE(data, localHeaderOffset + 26);
      const localExtraLength = readUint16LE(data, localHeaderOffset + 28);
      const dataStart =
        localHeaderOffset + 30 + localNameLength + localExtraLength;
      const compressed = data.slice(dataStart, dataStart + compressedSize);
      if (compressionMethod === 0) {
        return decoder.decode(compressed);
      }
      if (compressionMethod === 8) {
        const inflated = await inflateZipData(compressed);
        return decoder.decode(inflated);
      }
      throw new Error("docx 压缩方式不支持。");
    }
    offset = nameStart + fileNameLength + extraLength + commentLength;
  }
  throw new Error("docx 中未找到正文内容。");
};

const extractDocxText = async (file) => {
  const xmlText = await extractDocxXml(file);
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "application/xml");
  if (xml.getElementsByTagName("parsererror").length) {
    return xmlText.replace(/<[^>]+>/g, " ");
  }
  const paragraphs = Array.from(xml.getElementsByTagName("w:p"));
  const lines = paragraphs
    .map((paragraph) => {
      const textNodes = Array.from(paragraph.getElementsByTagName("w:t"));
      return textNodes.map((node) => node.textContent ?? "").join("");
    })
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.join("\n");
};

const extractJsonCandidates = (text) => {
  const candidates = [];
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)```/gi;
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const block = match[1].trim();
    if (block) {
      candidates.push(block);
    }
  }
  const firstArray = text.indexOf("[");
  const lastArray = text.lastIndexOf("]");
  if (firstArray >= 0 && lastArray > firstArray) {
    candidates.push(text.slice(firstArray, lastArray + 1).trim());
  }
  const firstObj = text.indexOf("{");
  const lastObj = text.lastIndexOf("}");
  if (firstObj >= 0 && lastObj > firstObj) {
    candidates.push(text.slice(firstObj, lastObj + 1).trim());
  }
  const trimmed = text.trim();
  if (trimmed) {
    candidates.push(trimmed);
  }
  return [...new Set(candidates)];
};

const extractDeckFromParsed = (parsed) => {
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed?.deck)) return parsed.deck;
  if (Array.isArray(parsed?.cards)) return parsed.cards;
  if (Array.isArray(parsed?.items)) return parsed.items;
  if (Array.isArray(parsed?.data)) return parsed.data;
  return null;
};

const parseVocabMarkdown = (text) => {
  const lines = text.split(/\r?\n/);
  const entries = [];
  let current = null;
  const flush = () => {
    if (current?.term) {
      entries.push(current);
    }
    current = null;
  };
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;
    const termMatch = line.match(/^\[(.+?)\]$/);
    if (termMatch) {
      flush();
      current = { term: termMatch[1].trim() };
      continue;
    }
    if (!current) continue;
    if (line.startsWith("- Meaning")) {
      const meaning = line.split(":").slice(1).join(":").trim();
      if (meaning) {
        current.meaning = meaning;
      }
      continue;
    }
    if (line.startsWith("- Sentence")) {
      const sentence = line.split(":").slice(1).join(":").trim();
      if (sentence) {
        current.sentence = sentence;
      }
    }
  }
  flush();
  return entries;
};

const parseCsvLine = (line) => {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values.map((value) => value.trim());
};

const parseCsvDeck = (text) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];
  const headerMap = {
    word: "term",
    name: "term",
    term: "term",
    meaning: "meaning",
    definition: "meaning",
    meaningzh: "meaningZh",
    meaning_zh: "meaningZh",
    meaningzh_cn: "meaningZh",
    pos: "pos",
    partofspeech: "pos",
    part_of_speech: "pos",
    syllables: "syllables",
    respell: "respell",
    phrases: "phrases",
    collocations: "phrases",
    sentence: "sentence",
    example: "sentence",
  };
  const headers = parseCsvLine(lines[0]).map((header) => {
    const normalized = header.toLowerCase().replace(/\s+/g, "");
    return headerMap[normalized] ?? normalized;
  });
  if (!headers.includes("term")) {
    return [];
  }
  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    const entry = {};
    headers.forEach((header, index) => {
      entry[header] = cells[index];
    });
    return entry;
  });
};

export const parseDeckFromText = (rawText) => {
  const text = rawText.replace(/^\uFEFF/, "");
  const mdDeck = parseVocabMarkdown(text);
  if (mdDeck.length) {
    return mdDeck;
  }
  const csvDeck = parseCsvDeck(text);
  if (csvDeck.length) {
    return csvDeck;
  }
  const candidates = extractJsonCandidates(text);
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const parsed = JSON.parse(candidate);
      const deck = extractDeckFromParsed(parsed);
      if (deck && deck.length) {
        return deck;
      }
    } catch (error) {
      continue;
    }
  }
  throw new Error("无法识别内容，请确保包含 JSON 数组或 deck 字段。");
};

const normalizeEntry = (entry) => {
  const toText = (value) => (value == null ? "" : String(value)).trim();
  const rawPhrases = entry?.phrases ?? entry?.collocations ?? [];
  const phrases = Array.isArray(rawPhrases)
    ? rawPhrases.map(toText).filter(Boolean)
    : typeof rawPhrases === "string"
    ? rawPhrases
        .split(/[,;\n]/)
        .map((phrase) => phrase.trim())
        .filter(Boolean)
    : [];
  return {
    term: toText(entry?.term ?? entry?.word ?? entry?.name),
    syllables: toText(entry?.syllables),
    respell: toText(entry?.respell),
    pos: toText(entry?.pos),
    meaning: toText(entry?.meaning ?? entry?.definition),
    meaningZh: toText(
      entry?.meaningZh ??
        entry?.meaning_zh ??
        entry?.meaningZH ??
        entry?.meaningzh
    ),
    phrases,
    sentence: toText(entry?.sentence),
  };
};

export const normalizeDeck = (importedDeck) =>
  importedDeck.map(normalizeEntry).filter((entry) => entry.term);

export const readImportFile = async (file) => {
  const name = file.name.toLowerCase();
  const type = file.type;
  if (name.endsWith(".docx") || type === DOCX_MIME) {
    return extractDocxText(file);
  }
  if (name.endsWith(".doc") || type === DOC_MIME) {
    throw new Error("暂不支持 .doc，请另存为 .docx 或直接粘贴。");
  }
  return file.text();
};

export const buildMarkdownExport = (items) =>
  items
    .map((entry) => {
      const sentenceText = entry.sentence || "";
      return `[${entry.term}]\n\n- Meaning (EN): ${
        entry.meaning || ""
      }\n- Sentence: ${sentenceText}`.trimEnd();
    })
    .join("\n\n");
