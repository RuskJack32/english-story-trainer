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
  const [message, setMessage] = useState("");
  const [generatedStory, setGeneratedStory] = useState("");
  const [storyTitle, setStoryTitle] = useState("");
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
  "AI: Hello Jack! How was your day today?"
]);
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (selectedStory === "chat") {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#0f172a",
        color: "white",
      }}
    >
      <h1>💬 AI Conversation</h1>

      <p>Hello Jack! How was your day today?</p>
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
    content:
      "You are an English conversation partner. Reply in simple English and keep the conversation going."
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
  onClick={async () => {

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

1. One minute English story
2. Five important phrases
3. Japanese meanings

based on the conversation.
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

setStoryTitle(
  titleData.choices[0].message.content.trim()
);
  }}
>
  Generate Story
</button>
{generatedStory && (
  <div
    style={{
      marginTop: "30px",
      textAlign: "left",
      whiteSpace: "pre-wrap",
      background: "#1e293b",
      padding: "20px",
      borderRadius: "10px"
    }}
  >
    {generatedStory}
    <button
  onClick={() => {
    setSavedStories([
      ...savedStories,
      {
        title: storyTitle,
        content: generatedStory,
        words: wordExplanation,
      },
    ]);
  }}
>
  Save Story
</button>
  </div>
)}

{generatedStory && (
  <button
  onClick={async () => {
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
              content:
                "Explain difficult English words from this text in Japanese:\n\n" +
                generatedStory,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    setWordExplanation(
      data.choices[0].message.content
    );
  }}
>
  Explain Words
</button>
)}
{wordExplanation && (
  <div
    style={{
      marginTop: "20px",
      background: "#222",
      padding: "15px",
      borderRadius: "10px",
      whiteSpace: "pre-wrap",
    }}
  >
    {wordExplanation}
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
        background: "#0f172a",
        color: "white",
      }}
    >
      <h2>{storyTitle}</h2>

      <div
        style={{
          background: "#222",
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

      <div
        style={{
          background: "#222",
          padding: "20px",
          borderRadius: "10px",
          whiteSpace: "pre-wrap",
        }}
      >
        {openedStory?.content}
        {openedStory?.words && (
  <div
    style={{
      marginTop: "30px",
      whiteSpace: "pre-wrap",
      textAlign: "left",
      background: "#222",
      padding: "20px",
      borderRadius: "10px",
    }}
  >
    <h3>📚 Vocabulary</h3>

    {openedStory?.words}
  </div>
)}
        <hr />

<h3>Words</h3>

<div
  style={{
    whiteSpace: "pre-wrap",
    marginTop: "20px",
  }}
>
  {" "}
</div>
      </div>

      <br />

      <button onClick={() => setOpenedStory(null)}>
        ← Back
      </button>
    </div>
  );
}
console.log("openedStory", openedStory);
  if (selectedStory === "kumamoto") {
   const speakText = `
   const playAudio = () => {
  if (isPlaying) {
    speechSynthesis.cancel();
    setIsPlaying(false);
    return;
  }

  const utterance =
    new SpeechSynthesisUtterance(speakText);

  utterance.lang = "en-US";

  utterance.onend = () => {
    setIsPlaying(false);
  };

  speechSynthesis.speak(utterance);

  setIsPlaying(true);
};
If I had to recommend one place in Japan, I'd say Kumamoto.
To be honest, I didn't know much about it before I went there, but it ended up being one of my favorite places in Japan.
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
          background: "#0f172a",
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
      background: "#1e293b",
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
        background: "#0f172a",
        color: "white",
      }}
    >
      <h1>📚 My English Stories</h1>

      <h2>Saved Stories</h2>

{savedStories.map((story, index) => (
  <div
    key={index}
    style={{
      background: "#222",
      padding: "15px",
      marginTop: "10px",
      borderRadius: "10px",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <span
      style={{ cursor: "pointer" }}
      onClick={() => setOpenedStory(story)}
    >
      📖 <div
  onClick={() => setOpenedStory(story)}
  style={{ cursor: "pointer" }}
>
  {story.title}
</div>
    </span>

    <button
      onClick={() => {
        const updated = savedStories.filter(
          (_, i) => i !== index
        );
        setSavedStories(updated);
      }}
    >
      🗑️
    </button>
  </div>
))}

      <button
        onClick={() => setSelectedStory("kumamoto")}
      >
        🏯 Kumamoto
      </button>
      <button
  onClick={() => setSelectedStory("chat")}
>
  💬 New Story
</button>
    </div>
  );
}

export default App;