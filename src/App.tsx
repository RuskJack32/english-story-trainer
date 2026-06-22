import { useState, useEffect } from "react";

const phraseData = {
  "To be honest": {
    meaning: "正直言うと",
    example: "To be honest, I was nervous.",
  },

  "blew me away": {
    meaning: "めちゃくちゃ感動した",
    example: "The view blew me away.",
  },

  earthquake: {
    meaning: "地震",
    example: "The earthquake damaged the castle.",
  },

  resilience: {
    meaning: "回復力・立ち直る力",
    example: "The city showed resilience.",
  },

  breathtaking: {
    meaning: "息をのむほど美しい",
    example: "The scenery was breathtaking.",
  },
};

function App() {
  const [selectedStory, setSelectedStory] = useState("");
  const [selectedPhrase, setSelectedPhrase] = useState("");
  const [savedPhrases, setSavedPhrases] =
  useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStory, setShowStory] = useState(true);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [savedWords, setSavedWords] = useState<string[]>([]);
  const [memory, setMemory] =
  useState<string[]>([]);
  const [jackProfile, setJackProfile] =
  useState("");
  useEffect(() => {
  const savedWordsData =
    localStorage.getItem("savedWords");

  if (savedWordsData) {
    setSavedWords(
      JSON.parse(savedWordsData)
    );
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    "savedWords",
    JSON.stringify(savedWords)
  );
}, [savedWords]);
useEffect(() => {
  const savedMemory =
    localStorage.getItem("jackMemory");

  if (savedMemory) {
    setMemory(
      JSON.parse(savedMemory)
    );
  }
}, []);
useEffect(() => {
  const savedProfile =
    localStorage.getItem("jackProfile");

  if (savedProfile) {
    setJackProfile(savedProfile);
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    "jackMemory",
    JSON.stringify(memory)
  );
}, [memory]);
useEffect(() => {
  localStorage.setItem(
    "jackProfile",
    jackProfile
  );
}, [jackProfile]);
  const [showWords, setShowWords] = useState(false);
 
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");
  const [storyTitle, setStoryTitle] = useState("");
  const [generatedTitle, setGeneratedTitle] =
  useState("");
  const [editMode, setEditMode] = useState(false);
  const [openedStory, setOpenedStory] = useState<{
  title: string;
  content: string;
  words?: string;
} | null>(null);
  const [wordExplanation, setWordExplanation] = useState("");
  const [savedStories, setSavedStories] = useState<
  
  {
  title: string;
  content: string;
  words?: string;
}[]
>([]);
const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    
  const saved = localStorage.getItem("savedStories");

  console.log("loaded", saved);

  if (saved) {
    setSavedStories(JSON.parse(saved));
  }
  
  setLoaded(true);
}, []);
useEffect(() => {
  
  if (!loaded) return;

  localStorage.setItem(
    "savedStories",
    JSON.stringify(savedStories)
  );
}, [savedStories, loaded]);

  const [chatHistory, setChatHistory] = useState([
  "🏔 Welcome back, Pachi!",
  "",
  "What happened at Kitahotaka Hut today?",
  "",
  "You can tell me:",
  "• A conversation with a foreign hiker",
  "• Something funny that happened",
  "• English you couldn't say",
  "• A situation you want to practice",
]);
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (selectedStory === "chat") {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#f8fafc",
        color: "#0f172a",
      }}
    >
      <h1>💬 Chat with Jack</h1>

      <div style={{ marginBottom: "20px" }}>
  {chatHistory.map((msg, index) => (
    <p key={index}>{msg}</p>
  ))}
</div>

      <textarea
      value={message}
onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your answer here..."
        rows={5}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "10px",
        }}
      />

      <br />

      <button
  style={{ marginTop: "20px" }}
  onClick={async () => {
  const userMessage = message;

setChatHistory([
  ...chatHistory,
  "You: " + userMessage,
]);

if (userMessage.length > 30) {
  setMemory(prev => [
    ...prev,
    userMessage
  ]);
}

  setMessage("");

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
  {
  role: "system",
  content: `
You are Jack.

You are Pachi's English learning partner.

Important memories about Pachi:

${jackProfile}

Recent conversations:

${memory.slice(-30).join("\n")}

Rules:
- Remember previous conversations.
- Refer to past events naturally.
- Act like a real friend.
- Ask follow-up questions about previous events.
- Help Pachi improve natural English.
- Keep your English simple and conversational.
`
},

  ...chatHistory.map(msg => ({
    role: msg.startsWith("You:")
      ? "user"
      : "assistant",

    content: msg.replace(/^You: |^AI: /, "")
  })),

  {
    role: "user",
    content: userMessage
  }
]
      })
    }
  );

  const data = await response.json();

  setChatHistory(prev => [
    ...prev,
    "AI: " + data.choices[0].message.content
  ]);
}}
>
  Send
</button>
  <button
  style={{ marginLeft: "10px" }}
  
  disabled={isGenerating}
  onClick={async () => {
    setIsGenerating(true);

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content: `
Create:

You are Jack.

You remember previous conversations.

Always correct English naturally.

When Pachi makes a mistake:

1. Show Natural English
2. Explain why
3. Continue conversation

Use real spoken English used by native speakers.

Avoid textbook English.

Act like a close foreign friend.

The user's name is Pachi.

About Pachi:
- Works at Kitahotaka Hut in the Japanese Alps.
- Frequently talks with foreign hikers.
- Loves hiking and mountain life.
- Enjoys skiing.
- Wants to improve natural spoken English.
- Prefers real-world English instead of textbook English.
- Wants corrections when English sounds unnatural.
- Enjoys learning through stories and conversations.

Your teaching style:
- Friendly and encouraging.
- Use natural English spoken by native speakers.
- Explain expressions clearly.
- Focus on practical conversations hikers and travelers would have.
- Point out unnatural English and provide better alternatives.
- Keep explanations easy to understand for a Japanese learner.

Always address the user as "Pachi".

Create:

1. A natural 2-minute English story based on the conversation.

2. Useful phrases and expressions.

Include ALL useful phrases, natural expressions, idioms, and conversation patterns.

For each phrase provide:
- Japanese meaning
- Example sentence
- Japanese translation

3. Useful vocabulary.

Include ALL important vocabulary that an English learner may not know.

For each vocabulary word provide:
- Japanese meaning
- Example sentence
- Japanese translation

Make the English sound natural and conversational.

The goal is to improve real-life English conversation skills.

Based on the conversation.
`
            },
            {
              role: "user",
              content: chatHistory.join("\n")
            }
          ]
        })
      }
    );

    const data = await response.json();

    const story = data.choices[0].message.content;

setGeneratedStory(story);

const titleResponse = await fetch(
  "https://api.openai.com/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      messages: [
        {
          role: "user",
          content:
            "Give a short English title (max 5 words) for this story:\n\n" +
            story,
        },
      ],
    }),
  }
);

const titleData = await titleResponse.json();

const title =
  titleData.choices[0].message.content.trim();

setStoryTitle(title);
const wordsResponse = await fetch(
  "https://api.openai.com/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      messages: [
        {
          role: "user",
          content: `
From this story, choose useful vocabulary.

Use EXACTLY this format.

WORD: word
MEANING: Japanese meaning
EXAMPLE: example sentence
TRANSLATION: Japanese translation

Story:
${story}
`,
        },
      ],
    }),
  }
);

const wordsData = await wordsResponse.json();

const wordsText =
  wordsData.choices[0].message.content;
  
  setWordExplanation(wordsText);

const newStory = {
  title,
  content: story,
  words: wordsText ,
};

setSavedStories(prev => [
  ...prev,
  newStory,
]);

setIsGenerating(false);
  }}
  
>
 {isGenerating ? "⏳ Generating..." : "Generate Story"}
</button>
{generatedStory && (
  <div
    style={{
      marginTop: "30px",
      textAlign: "left",
      whiteSpace: "pre-wrap",
      background: "#ffffff",
      padding: "20px",
      borderRadius: "10px"
    }}
  >
    {generatedStory}
    
  </div>
)}

{generatedStory && (
 <button
  disabled={isGenerating}
  onClick={async () => {
    setIsGenerating(true);

await new Promise(resolve =>
  setTimeout(resolve, 3000)
);

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-5-mini",
          messages: [
            {
              role: "user",
              content: `
From this story, choose useful vocabulary.

Use EXACTLY this format.

Choose 10-20 useful vocabulary items.

Use EXACTLY this format.

WORD: word
MEANING: Japanese meaning
EXAMPLE: example sentence
TRANSLATION: Japanese translation

Do not include any explanations outside this format.
Story:
${generatedStory}
`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

const wordsData =
  data.choices[0].message.content;

setWordExplanation(wordsData);

if (
  savedStories.some(
    s => s.content === generatedStory
  )
) {
  setIsGenerating(false);
  return;
}
setSavedStories(prev => [
  ...prev,
  {
    title: generatedTitle,
    content: generatedStory,
    words: wordsData,
  },
]);

setIsGenerating(false);
  }}
>
  {isGenerating ? "⏳ Explaining..." : "Explain Words"}
</button>
)}
{wordExplanation && (
  <div>

    <button
      onClick={() => {
        const utterance =
          new SpeechSynthesisUtterance(wordExplanation);

        utterance.lang = "en-US";
        speechSynthesis.speak(utterance);
      }}
    >
      🔊 Read Aloud
    </button>

    <div
      style={{
        marginTop: "20px",
        background: "#da5050",
        padding: "15px",
        borderRadius: "10px",
        whiteSpace: "pre-wrap",
      }}
    >
      {wordExplanation
  .split("WORD:")
  .filter(Boolean)
  .map((word, index) => (
    <div
      key={index}
      style={{
        background: "#ffffff",
        color: "#000",
        padding: "15px",
        borderRadius: "12px",
        marginBottom: "15px",
        textAlign: "left",
      }}
    >
      <div
  style={{
    whiteSpace: "pre-wrap",
    lineHeight: "1.8",
  }}
>
  {word}
</div>

      <button
  onClick={() => {
    const wordOnly =
      word.split("\n")[0].trim();

    speechSynthesis.speak(
      new SpeechSynthesisUtterance(
        wordOnly
      )
    );
  }}
  style={{
    marginRight: "10px",
  }}
>
  🔊 Pronounce
</button>
<button
      disabled={savedWords.includes(word)}
  onClick={() => {
    const updated = [
      ...new Set([
        ...savedWords,
        word,
      ]),
    ];

    setSavedWords(updated);
  }}
  style={{
    marginTop: "10px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: savedWords.includes(word)
      ? "#22c55e"
      : "#e5e7eb",
    color: savedWords.includes(word)
      ? "white"
      : "black",
  }}
>
  {savedWords.includes(word)
    ? "✅ Saved"
    : "⭐ Save"}
</button>
    </div>
  ))}
    </div>

  </div>
)}

      <br />
      <br />

      <button
        onClick={() => setSelectedStory("")}
      >
        ← Back
      </button>
    </div>
  );
}
if (selectedStory === "saved") {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#f8fafc",
        color: "#0f172a",
      }}
    >
      <h2>{storyTitle}</h2>

      <div
        style={{
          background: "#008d0e",
          padding: "20px",
          borderRadius: "10px",
          whiteSpace: "pre-wrap",
        }}
      >
        {generatedStory}
      </div>

      <br />

      <button onClick={() => setSelectedStory("")}>
        ← Back
      </button>
    </div>
  );
}
if (openedStory) {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#0f172a",
        color: "white",
      }}
    >
      <h1>{openedStory?.title}</h1>

      <button
  onClick={() => {
    const utterance =
      new SpeechSynthesisUtterance(
        openedStory.content
      );

    utterance.lang = "en-US";

    speechSynthesis.speak(utterance);
  }}
  style={{
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "20px",
  }}
>
  🔊 Play Audio
</button>

      <button
  onClick={() => setShowStory(!showStory)}
  style={{
    width: "100%",
    padding: "14px",
    marginBottom: "12px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "700",
    cursor: "pointer",
  }}
>
  📖 Story {showStory ? "▲" : "▼"}
</button>

{showStory && (
  <div
    style={{
      background: "#e03737",
      padding: "20px",
      borderRadius: "10px",
      whiteSpace: "pre-wrap",
      marginBottom: "15px",
    }}
  >
    {openedStory?.content}
  </div>
)}

{openedStory?.words && (
  <>
    <button
      onClick={() =>
        setShowVocabulary(!showVocabulary)
      }
      style={{
        width: "100%",
        padding: "14px",
        marginBottom: "12px",
        borderRadius: "12px",
        border: "none",
        fontWeight: "700",
        cursor: "pointer",
      }}
    >
      📚 Vocabulary {showVocabulary ? "▲" : "▼"}
    </button>

    {showVocabulary && (
      <div
        style={{
          background: "#47c7ba",
          padding: "20px",
          borderRadius: "10px",
          whiteSpace: "pre-wrap",
        }}
      >
        {openedStory?.words
  .split("WORD:")
  .filter(Boolean)
  .map((word, index) => (
    <div
      key={index}
      style={{
        background: "#fff",
        color: "#000",
        padding: "15px",
        borderRadius: "12px",
        marginBottom: "15px",
        textAlign: "left",
      }}
    >
      <div
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: "1.8",
        }}
      >
        {word}
      </div>

      <button
        disabled={savedWords.includes(word)}
        onClick={() => {
          const updated = [
            ...new Set([
              ...savedWords,
              word,
            ]),
          ];

          setSavedWords(updated);
        }}
      >
        {savedWords.includes(word)
          ? "✅ Saved"
          : "⭐ Save"}
      </button>
    </div>
))}
       
      </div>
    )}
  </>
)}

      <br />

      <button onClick={() => setOpenedStory(null)}>
        ← Back
      </button>
    </div>
  );
}
console.log("openedStory", openedStory);
  if (selectedStory === "vocabulary") {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#b0c5f6",
        color: "white",
      }}
    >
      <h1>📚 My Vocabulary</h1>

      {savedWords.map((word, index) => (
  <div
  style={{
    background: "#ffffff",
    color: "#000",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "15px",
    position: "relative",
    textAlign: "left",
    lineHeight: "1.8",
  }}
><button
  onClick={() => {
    const updated =
      savedWords.filter(
        (_, i) => i !== index
      );

    setSavedWords(updated);
  }}
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  🗑️
</button>
<div
  style={{
    whiteSpace: "pre-wrap",
  }}
>
  {word}
  <button
  onClick={() => {
    const englishWord =
      word
        .split("\n")[0]
        .replace("WORD:", "")
        .trim();

    speechSynthesis.speak(
      new SpeechSynthesisUtterance(
        englishWord
      )
    );
  }}
  style={{
    marginTop: "10px",
    marginRight: "10px",
  }}
>
  🔊 Word
</button>
<button
  onClick={() => {
    const lines = word.split("\n");

    const exampleLine =
      lines.find(line =>
        line.startsWith("EXAMPLE:")
      );

    if (!exampleLine) return;

    const example =
      exampleLine.replace(
        "EXAMPLE:",
        ""
      ).trim();

    speechSynthesis.speak(
      new SpeechSynthesisUtterance(
        example
      )
    );
  }}
  style={{
    marginTop: "10px",
    marginLeft: "10px",
  }}
>
  🔊 Example
</button>
</div></div>
))}
  

      <button
        onClick={() =>
          setSelectedStory("")
        }
      >
        ← Back
      </button>
    </div>
  );
}
if (selectedStory === "kumamoto") {
   const speakText = `
If I had to recommend one place in Japan, I'd say Kumamoto.
To be honest, I didn't know much about it before I went there.
A lot of people visit Kumamoto for the food.
I tried Akaushi beef there, and it was incredible.
But what really blew me away was Kumamoto Castle.
Learning about how it has been restored after the 2016 earthquake made it even more impressive.
It felt like a symbol of the city's strength and resilience.
Kumamoto is also home to Mount Aso, which has some of the most breathtaking scenery I've ever seen in Japan.
So if you're looking for great food, amazing nature, and a place with a powerful story, I'd definitely recommend Kumamoto.
`;

    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "24px",
          background: "#456cc8",
          color: "white",
        }}
      >
        <h1>🏯 Kumamoto</h1>

        <button
  onClick={() => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      speechSynthesis.speak(
        new SpeechSynthesisUtterance(speakText)
      );
      setIsPlaying(true);
    }
  }}
>
  {isPlaying
    ? "⏹ Stop Audio"
    : "🔊 Play Audio"}
</button>
        <pre
          style={{
            marginTop: "20px",
            whiteSpace: "pre-wrap",
            lineHeight: "2",
          }}
        >
          <>
  <p>
    If I had to recommend one place in Japan,
    I'd say Kumamoto.
  </p>

  <p>
    <span
      style={{ color: "#60a5fa", cursor: "pointer" }}
      onClick={() => {
  setSelectedPhrase("To be honest");

  speechSynthesis.speak(
    new SpeechSynthesisUtterance("To be honest")
  );
}}
    >
      To be honest
    </span>
    , I didn't know much about it before I
    went there.
  </p>

  <p>
    But what really{" "}
    <span
      style={{ color: "#4ade80", cursor: "pointer" }}
      onClick={() => {
  setSelectedPhrase("blew me away");

  speechSynthesis.speak(
    new SpeechSynthesisUtterance("blew me away")
  );
}}
    >
      blew me away
    </span>
    {" "}was Kumamoto Castle.
  </p>

  <p>
    Learning about how it has been restored
    after the 2016{" "}
    <span
      style={{ color: "#f87171", cursor: "pointer" }}
      onClick={() => {
  setSelectedPhrase("earthquake");

  speechSynthesis.speak(
    new SpeechSynthesisUtterance("earthquake")
  );
}}
    >
      earthquake
    </span>
    .
  </p>

  <p>
    It felt like a symbol of the city's{" "}
    <span
      style={{ color: "#facc15", cursor: "pointer" }}
      onClick={() => {
  setSelectedPhrase("resilience");

  speechSynthesis.speak(
    new SpeechSynthesisUtterance("resilience")
  );
}}
    >
      resilience
    </span>
    .
  </p>

  <p>
    Mount Aso has some of the most{" "}
    <span
      style={{ color: "#c084fc", cursor: "pointer" }}
      onClick={() => {
  setSelectedPhrase("breathtaking");

  speechSynthesis.speak(
    new SpeechSynthesisUtterance("breathtaking")
  );
}}
    >
      breathtaking
    </span>{" "}scenery I've ever seen.
  </p>
</>
        </pre>

        <h2>Important Phrases</h2>

<div>
  {Object.keys(phraseData).map((phrase) => (
    <button
      key={phrase}
      onClick={() => setSelectedPhrase(phrase)}
    >
      {phrase}
    </button>
  ))}
</div>
{selectedPhrase && (
  <div
    style={{
      marginTop: "20px",
      padding: "16px",
      background: "#20511c",
      borderRadius: "12px",
    }}
  >
    <h3>{selectedPhrase}</h3>
    <button
  onClick={() => {
    const utterance = new SpeechSynthesisUtterance(
      selectedPhrase
    );
    const voices = speechSynthesis.getVoices();

utterance.voice =
  voices.find(
    (v) => v.name === "Google UK English Female"
  ) || null;
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }}
>
  🔊 発音
</button>

    <p>
      <strong>意味:</strong>{" "}
      {phraseData[selectedPhrase as keyof typeof phraseData].meaning}
    </p>
    <button
  onClick={() =>
    speechSynthesis.speak(
      new SpeechSynthesisUtterance(
        phraseData[
          selectedPhrase as keyof typeof phraseData
        ].example
      )
    )
  }
>
  🔊 Example
  <button
  onClick={() => {
    if (
      !savedPhrases.includes(
        selectedPhrase
      )
    ) {
      setSavedPhrases([
        ...savedPhrases,
        selectedPhrase,
      ]);
    }
  }}
>
  ⭐ Save Phrase
</button>
</button>

    <p>
      <strong>例文:</strong>{" "}
      {phraseData[selectedPhrase as keyof typeof phraseData].example}
    </p>
  </div>
)}

        <button
          onClick={() => setSelectedStory("")}
        ><h2>📚 Saved Phrases</h2>

<ul>
  {savedPhrases.map((phrase) => (
    <li key={phrase}>
      {phrase}
    </li>
  ))}
</ul>

          ← Back
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#f8fafc",
        color: "white",
      }}
    >
      <h1
  style={{
    color: "#02fc55"
  }}
>
  📚 My English Stories
</h1>

<p
  style={{
    color: "#58f126",
    marginBottom: "30px",
  }}
>
  Practice English every day
</p>
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  }}
>
      
      <h2
  style={{
    color: "#365498"
  }}
>
  Saved Stories
</h2>
 <button
    onClick={() => setEditMode(!editMode)}
  >
    {editMode ? "✔ Done" : "✏️ Edit"}
  </button>
</div>

{savedStories.map((story, index) => (
  <div
    key={index}
    style={{
  background: "white",
padding: "20px",
marginTop: "16px",
borderRadius: "20px",

color: "#0b3fb8",
boxShadow: "0 8px 24px rgba(255, 44, 44, 0.95)",
border: "1px solid #e2e8f0",
position: "relative"
}}
  >
     {editMode && (<button
  onClick={() => {
    if (
      window.confirm(
        `Delete "${story.title}" ?`
      )
    ) {
      const updated = savedStories.filter(
        (_, i) => i !== index
      );

      setSavedStories(updated);
    }
  }}
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "22px",
    cursor: "pointer",
  }}
>
  🗑️
</button>)}
    <span
      style={{ cursor: "pointer" }}
      onClick={() => setOpenedStory(story)}
    >
    <div
  onClick={() => setOpenedStory(story)}
  style={{ cursor: "pointer" }}
>
  <div
    style={{
      fontSize: "28px",
      marginBottom: "8px",
    }}
  >
    📖
  </div>

  <div
    style={{
      fontSize: "20px",
      fontWeight: "700",
    }}
  >
    {story.title}
  </div>

  <div
    style={{
      background: "#ef4444",
color: "white",
border: "none",
borderRadius: "12px",
padding: "10px 14px",
position: "relative"

    }}
  >
    Tap to read
  </div>
</div>
    </span>

   
  </div>
))}


      <button
  onClick={() => setSelectedStory("kumamoto")}
  style={{
    width: "100%",
    padding: "18px",
    marginTop: "20px",
    borderRadius: "18px",
    
    border: "none",
    
    background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
    color: "white",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(59,130,246,0.25)",
  }}
>
  🏯 Explore Kumamoto
</button>
      <button
  onClick={() => setSelectedStory("chat")}
  style={{
    width: "100%",
    padding: "18px",
    marginTop: "12px",
    borderRadius: "18px",
    border: "none",
    background: "linear-gradient(135deg,#f59e0b,#ef4444)",
    color: "red",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(201, 162, 94, 0.56)",
  }}
>
  ✨ Create New Story
</button>
<button
  onClick={() => {
    setJackProfile(`
Pachi works at Kitahotaka Hut.
Pachi loves hiking.
Pachi loves skiing.
Pachi often talks with foreign hikers.
`);
  }}
>
  💻 Create Jack Profile
</button>

<button
  onClick={() => setSelectedStory("vocabulary")}
  style={{
    width: "100%",
    padding: "18px",
    marginTop: "12px",
    borderRadius: "18px",
    border: "none",
    background: "#28f5b0",
    color: "white",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
  }}
>
  📚 My Vocabulary
</button>
    </div>
  );
}

export default App;