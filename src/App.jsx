import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const baseDeck = [
  {
    term: "Vacant",
    syllables: "Va·cant",
    respell: "[VAY-kunt]",
    pos: "adj.",
    meaning: "empty; not occupied",
    meaningZh: "空的；未被占用",
    phrases: ["vacant seat", "vacant position"],
  },
  {
    term: "Proximity",
    syllables: "Prox·im·i·ty",
    respell: "[prok-SIM-ih-tee]",
    pos: "n.",
    meaning: "the state of being near; closeness",
    meaningZh: "接近；邻近",
    phrases: ["close proximity", "in proximity to"],
  },
  {
    term: "Devise",
    syllables: "De·vise",
    respell: "[dih-VYZE]",
    pos: "v.",
    meaning: "to plan or invent something carefully",
    meaningZh: "设计；制定；想出",
    phrases: ["devise a plan", "devise a strategy"],
  },
  {
    term: "Mundane",
    syllables: "Mun·dane",
    respell: "[mun-DAYN]",
    pos: "adj.",
    meaning: "ordinary and not interesting",
    meaningZh: "平凡的；乏味的",
    phrases: ["mundane tasks", "mundane routine"],
  },
  {
    term: "Translucent",
    syllables: "Trans·lu·cent",
    respell: "[trans-LOO-sent]",
    pos: "adj.",
    meaning: "allowing some light to pass through; semi-transparent",
    meaningZh: "半透明的",
    phrases: ["translucent glass", "translucent curtain"],
  },
  {
    term: "Probe",
    syllables: "Probe",
    respell: "[PROHB]",
    pos: "v.",
    meaning: "to investigate or examine closely",
    meaningZh: "调查；探查",
    phrases: ["probe the issue", "probe deeper"],
  },
  {
    term: "Revive",
    syllables: "Re·vive",
    respell: "[rih-VYV]",
    pos: "v.",
    meaning: "to bring back to life or make active again",
    meaningZh: "复苏；恢复；使复活",
    phrases: ["revive interest", "revive the economy"],
  },
  {
    term: "Inhabit",
    syllables: "In·hab·it",
    respell: "[in-HAB-it]",
    pos: "v.",
    meaning: "to live in a place",
    meaningZh: "居住于；栖息于",
    phrases: ["inhabit the island", "inhabit the region"],
  },
  {
    term: "Credibility",
    syllables: "Cred·i·bil·i·ty",
    respell: "[kred-uh-BIL-ih-tee]",
    pos: "n.",
    meaning: "the quality of being believable or trustworthy",
    meaningZh: "可信度；可信性",
    phrases: ["lose credibility", "credibility gap"],
  },
  {
    term: "Lucid",
    syllables: "Lu·cid",
    respell: "[LOO-sid]",
    pos: "adj.",
    meaning: "clear and easy to understand",
    meaningZh: "清晰的；易懂的",
    phrases: ["lucid explanation", "lucid moment"],
  },
  {
    term: "Fatigue",
    syllables: "Fa·tigue",
    respell: "[fuh-TEEG]",
    pos: "n.",
    meaning: "extreme tiredness after long effort",
    meaningZh: "疲劳；疲惫",
    phrases: ["mental fatigue", "fatigue sets in"],
  },
  {
    term: "Impulse",
    syllables: "Im·pulse",
    respell: "[IM-puls]",
    pos: "n.",
    meaning: "a sudden urge to do something without thinking",
    meaningZh: "冲动",
    phrases: ["on impulse", "impulse purchase"],
  },
  {
    term: "Recede",
    syllables: "Re·cede",
    respell: "[rih-SEED]",
    pos: "v.",
    meaning: "to move back; to gradually become smaller or weaker",
    meaningZh: "后退；逐渐减弱",
    phrases: ["recede into the distance", "pain recedes"],
  },
  {
    term: "Distorted",
    syllables: "Dis·tort·ed",
    respell: "[dis-TOR-tid]",
    pos: "adj.",
    meaning: "changed in shape or meaning; twisted or unclear",
    meaningZh: "扭曲的；失真的",
    phrases: ["distorted view", "distorted sound"],
  },
  {
    term: "Deception",
    syllables: "De·cep·tion",
    respell: "[dih-SEP-shun]",
    pos: "n.",
    meaning: "the act of tricking someone by lying or hiding the truth",
    meaningZh: "欺骗；欺诈",
    phrases: ["act of deception", "deception tactics"],
  },
  {
    term: "Prosperous",
    syllables: "Pros·per·ous",
    respell: "[PROS-per-us]",
    pos: "adj.",
    meaning: "successful, wealthy, or doing well",
    meaningZh: "繁荣的；富裕的",
    phrases: ["prosperous economy", "prosperous times"],
  },
  {
    term: "Elusive",
    syllables: "E·lu·sive",
    respell: "[ih-LOO-siv]",
    pos: "adj.",
    meaning: "difficult to find, catch, or understand",
    meaningZh: "难以捉摸的；难以找到的",
    phrases: ["elusive target", "elusive answer"],
  },
  {
    term: "Bloated",
    syllables: "Blo·at·ed",
    respell: "[BLOH-tid]",
    pos: "adj.",
    meaning: "swollen; or made too big with unnecessary parts",
    meaningZh: "肿胀的；膨胀的",
    phrases: ["bloated budget", "bloated stomach"],
  },
  {
    term: "Contempt",
    syllables: "Con·tempt",
    respell: "[kun-TEMPT]",
    pos: "n.",
    meaning: "strong disrespect; the feeling that someone is beneath you",
    meaningZh: "轻蔑；蔑视",
    phrases: ["feel contempt", "open contempt"],
  },
  {
    term: "Centennial",
    syllables: "Cen·ten·ni·al",
    respell: "[sen-TEN-ee-uhl]",
    pos: "adj.",
    meaning: "relating to the 100th anniversary of something",
    meaningZh: "百年纪念的",
    phrases: ["centennial celebration", "centennial anniversary"],
  },
  {
    term: "Atrocity",
    syllables: "A·troc·i·ty",
    respell: "[uh-TROS-ih-tee]",
    pos: "n.",
    meaning: "an extremely cruel or brutal act",
    meaningZh: "暴行；残暴行为",
    phrases: ["commit an atrocity", "war atrocity"],
  },
  {
    term: "Phantoms",
    syllables: "Phan·toms",
    respell: "[FAN-tumz]",
    pos: "n. pl.",
    meaning: "ghosts; shadowy figures (real or imagined)",
    meaningZh: "幻影；幽灵",
    phrases: ["phantom pains", "phantom sounds"],
  },
  {
    term: "Negligence",
    syllables: "Neg·li·gence",
    respell: "[NEG-lih-jens]",
    pos: "n.",
    meaning: "failure to take proper care; carelessness",
    meaningZh: "疏忽；过失",
    phrases: ["gross negligence", "negligence claim"],
  },
  {
    term: "Complicity",
    syllables: "Com·plic·i·ty",
    respell: "[kum-PLIS-ih-tee]",
    pos: "n.",
    meaning:
      "involvement in a wrongful act, especially by helping or allowing it",
    meaningZh: "共谋；同谋",
    phrases: ["complicity in a crime", "silent complicity"],
  },
];

const cloneDeck = () => baseDeck.map((item) => ({ ...item }));

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

const parseDeckFromText = (rawText) => {
  const text = rawText.replace(/^\uFEFF/, "");
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
    meaningZh: toText(entry?.meaningZh ?? entry?.meaning_zh ?? entry?.meaningZH),
    phrases,
  };
};

const normalizeDeck = (importedDeck) =>
  importedDeck.map(normalizeEntry).filter((entry) => entry.term);

const readImportFile = async (file) => {
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

export default function App() {
  const [deck, setDeck] = useState(() => cloneDeck());
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [lastRemoved, setLastRemoved] = useState(null);
  const [noAnim, setNoAnim] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [pasteText, setPasteText] = useState("");
  const fileInputRef = useRef(null);
  const guidePanelRef = useRef(null);

  const promptText = `你是英语词汇整理助手。请把用户提供的单词逐个补全为以下字段，并输出为可导入的 JSON 数组：

字段要求（严格遵守）：
- term: 单词，首字母大写
- syllables: 分节写法（用中点分隔）
- respell: 发音重拼（用方括号包裹）
- pos: 词性缩写（如 "n.", "v.", "adj.", "adv."）
- meaning: 英文简明释义
- meaningZh: 中文释义
- phrases: 常用搭配短语数组（2-3 个）

输出格式示例（仅 JSON，不要多余文字）：
[
  {
    "term": "Example",
    "syllables": "Ex·am·ple",
    "respell": "[ig-ZAM-puhl]",
    "pos": "n.",
    "meaning": "a thing that illustrates a rule",
    "meaningZh": "例子；示例",
    "phrases": ["for example", "example sentence"]
  }
]

一定记得需要以代码块的方式输出 JSON 文件以便用户导入。`;

  const runInstantly = useCallback((action) => {
    setNoAnim(true);
    action();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setNoAnim(false);
      });
    });
  }, []);

  const toggleReveal = useCallback(() => {
    if (!deck.length) return;
    setRevealed((prev) => !prev);
  }, [deck.length]);

  const nextCard = useCallback(() => {
    if (!deck.length) return;
    runInstantly(() => {
      setIndex((prev) => (prev + 1) % deck.length);
      setRevealed(false);
    });
  }, [deck.length, runInstantly]);

  const prevCard = useCallback(() => {
    if (!deck.length) return;
    runInstantly(() => {
      setIndex((prev) => (prev - 1 + deck.length) % deck.length);
      setRevealed(false);
    });
  }, [deck.length, runInstantly]);

  const removeCard = useCallback(() => {
    if (!deck.length) return;
    runInstantly(() => {
      setDeck((prev) => {
        if (!prev.length) return prev;
        const next = [...prev];
        const removedIndex = index;
        const [removed] = next.splice(removedIndex, 1);
        setLastRemoved({ item: removed, index: removedIndex });
        let nextIndex = removedIndex;
        if (nextIndex >= next.length) {
          nextIndex = 0;
        }
        setIndex(nextIndex);
        return next;
      });
      setRevealed(false);
    });
  }, [deck.length, index, runInstantly]);

  const undoRemove = useCallback(() => {
    if (!lastRemoved) return;
    runInstantly(() => {
      setDeck((prev) => {
        const next = [...prev];
        const insertIndex = Math.min(lastRemoved.index, next.length);
        next.splice(insertIndex, 0, lastRemoved.item);
        setIndex(insertIndex);
        return next;
      });
      setLastRemoved(null);
      setRevealed(false);
    });
  }, [lastRemoved, runInstantly]);

  const resetDeck = useCallback(() => {
    runInstantly(() => {
      setDeck(cloneDeck());
      setIndex(0);
      setRevealed(false);
      setLastRemoved(null);
    });
  }, [runInstantly]);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportFile = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const rawText = await readImportFile(file);
        const importedDeck = parseDeckFromText(rawText);
        const normalized = normalizeDeck(importedDeck);
        if (!normalized.length) {
          throw new Error("内容中没有有效的单词。");
        }
        runInstantly(() => {
          setDeck(normalized);
          setIndex(0);
          setRevealed(false);
          setLastRemoved(null);
        });
        setImportMessage(`已导入 ${normalized.length} 个单词。`);
      } catch (error) {
        setImportMessage(
          `导入失败：${error?.message || "无法解析文件内容。"}`
        );
      } finally {
        event.target.value = "";
      }
    },
    [runInstantly]
  );

  const handlePasteImport = useCallback(() => {
    const trimmed = pasteText.trim();
    if (!trimmed) {
      setImportMessage("请先粘贴需要导入的内容。");
      return;
    }
    try {
      const importedDeck = parseDeckFromText(trimmed);
      const normalized = normalizeDeck(importedDeck);
      if (!normalized.length) {
        throw new Error("内容中没有有效的单词。");
      }
      runInstantly(() => {
        setDeck(normalized);
        setIndex(0);
        setRevealed(false);
        setLastRemoved(null);
      });
      setImportMessage(`已导入 ${normalized.length} 个单词。`);
    } catch (error) {
      setImportMessage(
        `导入失败：${error?.message || "无法识别粘贴内容。"}`
      );
    }
  }, [pasteText, runInstantly]);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setImportMessage("提示词已复制到剪贴板。");
    } catch (error) {
      setImportMessage("复制失败，请手动复制提示词。");
    }
  };

  useEffect(() => {
    const handleKeydown = (event) => {
      if (guideOpen) {
        return;
      }
      if (guidePanelRef.current?.contains(document.activeElement)) {
        return;
      }
      if (event.code === "Space") {
        event.preventDefault();
        toggleReveal();
      } else if (event.code === "Tab") {
        event.preventDefault();
        prevCard();
      } else if (event.code === "Enter") {
        event.preventDefault();
        if (revealed) {
          nextCard();
        } else {
          toggleReveal();
        }
      } else if (event.code === "ArrowLeft") {
        event.preventDefault();
        prevCard();
      } else if (event.code === "Delete" || event.code === "Backspace") {
        event.preventDefault();
        removeCard();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [guideOpen, nextCard, prevCard, removeCard, revealed, toggleReveal]);

  useEffect(() => {
    if (!guideOpen) return;
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setGuideOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [guideOpen]);

  const hasDeck = deck.length > 0;
  const item = hasDeck ? deck[index] : null;
  const term = hasDeck
    ? revealed
      ? item?.syllables || item?.term
      : item?.term
    : "No words loaded";
  const posTag = item?.pos || "";
  const meaningText = item ? `${item.meaning} / ${item.meaningZh}` : "";
  const phrases = item?.phrases ?? [];
  const respell = item?.respell || "";
  const showDetails = revealed && hasDeck;
  const hint = hasDeck
    ? revealed
      ? "Enter for next, Space hides, Tab/<- for previous, Delete removes"
      : "Enter or Space reveals meaning + phrases"
    : "Deck empty. Press Reset to reload.";
  const progress = hasDeck ? (index + 1) / deck.length : 0;

  const cardClassName = useMemo(() => {
    return `card${noAnim ? " no-anim" : ""}`;
  }, [noAnim]);

  return (
    <main className="shell">
      <header>
        <div className="title-row">
          <h1>Vocabulary Loop</h1>
          <div className="header-actions">
            <button type="button" onClick={handleImportClick}>
              Import
            </button>
            <button type="button" onClick={() => setGuideOpen(true)}>
              Guidebook
            </button>
          </div>
        </div>
        <div className="subhead">
          Flashcard flow: Enter reveals, Enter again goes next. Space hides or
          reveals. Tab or &lt;- goes previous. Delete removes. Tap the card if
          you are on mobile.
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.md,.txt,.doc,.docx,application/json,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          onChange={handleImportFile}
          className="file-input"
        />
        {importMessage ? (
          <div className="import-message">{importMessage}</div>
        ) : null}
      </header>

      {guideOpen ? (
        <div className="guide-overlay" onClick={() => setGuideOpen(false)}>
          <section
            className="guide-panel"
            role="dialog"
            aria-modal="true"
            ref={guidePanelRef}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="guide-header">
              <h2>导入指南</h2>
              <button type="button" onClick={() => setGuideOpen(false)}>
                关闭
              </button>
            </div>
            <p>
              你可以上传 .json/.md/.txt/.docx 文件，或直接粘贴 AI 输出内容。系统会
              自动识别 JSON 数组或 deck 字段。
            </p>
            {/* <div className="prompt-box">
              <pre>{promptText}</pre>
            </div> */}
            <div className="guide-actions">
              <button
                className="primary"
                type="button"
                onClick={handleCopyPrompt}
              >
                复制提示词
              </button>
              <button type="button" onClick={handleImportClick}>
                上传文件
              </button>
            </div>
            <div className="paste-block">
              <label htmlFor="paste-input">直接粘贴 AI 输出</label>
              <textarea
                id="paste-input"
                className="paste-textarea"
                placeholder="粘贴 JSON 数组，或 ```json ...``` 代码块内容。"
                value={pasteText}
                onChange={(event) => setPasteText(event.target.value)}
              />
              <div className="paste-actions">
                <button
                  className="primary"
                  type="button"
                  onClick={handlePasteImport}
                  disabled={!pasteText.trim()}
                >
                  识别并导入
                </button>
                <button type="button" onClick={() => setPasteText("")}>
                  清空
                </button>
              </div>
              <p className="paste-hint">
                支持 JSON 数组、包含 deck 的对象，或代码块包裹的 JSON。
              </p>
            </div>
          </section>
        </div>
      ) : null}

      <section
        className={cardClassName}
        aria-live="polite"
        onClick={toggleReveal}
      >
        <div className="hint">{hint}</div>
        <div className="term-row">
          <h2 className="term">{term}</h2>
          <div className={`pronounce${showDetails ? "" : " is-hidden"}`}>
            <div className="pronounce-value">{respell}</div>
          </div>
        </div>
        <p className={`meaning${showDetails ? "" : " is-hidden"}`}>
          {posTag ? <span className="pos-tag">{posTag}</span> : null}
          <span>{meaningText}</span>
        </p>
        <ul
          className={`phrases${showDetails ? "" : " is-hidden"}`}
          aria-label="Common phrases"
        >
          {phrases.map((phrase) => (
            <li key={phrase}>{phrase}</li>
          ))}
        </ul>
      </section>

      <section className="meta">
        <div className="progress">
          <div className="progress-bar">
            <span style={{ transform: `scaleX(${progress})` }}></span>
          </div>
          <div className="count">
            {hasDeck ? `${index + 1} / ${deck.length}` : "0 / 0"}
          </div>
        </div>
        <div className="controls">
          <button className="primary" type="button" onClick={toggleReveal}>
            {revealed ? "Hide (Space)" : "Reveal (Space)"}
          </button>
          <button type="button" onClick={prevCard}>
            Prev (Tab / &lt;-)
          </button>
          <button type="button" onClick={nextCard}>
            Next (Enter)
          </button>
          <button type="button" onClick={removeCard}>
            Remove (Delete)
          </button>
          <button type="button" onClick={undoRemove} disabled={!lastRemoved}>
            Undo Remove
          </button>
          <button type="button" onClick={resetDeck}>
            Reset Deck
          </button>
        </div>
        <div className="loop">Looping deck: on</div>
      </section>

      <div className="footer-note">
        No limits — keep cycling as long as you want.
      </div>
    </main>
  );
}
