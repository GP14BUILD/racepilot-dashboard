import { useState, useRef, useEffect } from 'react';
import { askRaceCoach, ChatMessage, ChatResponse } from '../api';

interface RaceCoachChatProps {
  sessionId: number;
}

export default function RaceCoachChat({ sessionId }: RaceCoachChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<ChatResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await askRaceCoach({
        session_id: sessionId,
        question: input,
        conversation_history: messages,
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentResponse(response);
    } catch (error: any) {
      console.error('Failed to get response:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content:
          'Sorry, I encountered an error. Please try again or rephrase your question.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    'Why was I slow on the upwind legs?',
    'How can I improve my tacking?',
    'What were the key moments in this session?',
    'How did I handle the wind shifts?',
    'What should I focus on improving?',
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="glass-dark p-6 rounded-xl flex flex-col h-[600px]">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">🤖 Ask Your Race Coach</h2>
        <p className="text-sm text-slate-400">
          Ask me anything about your session - I'll analyze your GPS data, maneuvers,
          and performance to give you specific coaching advice.
        </p>

        {currentResponse && (
          <div className="mt-3 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Confidence:</span>
              <span
                className={`px-2 py-1 rounded ${
                  currentResponse.confidence === 'High'
                    ? 'bg-green-900/30 text-green-400'
                    : currentResponse.confidence === 'Medium'
                    ? 'bg-yellow-900/30 text-yellow-400'
                    : 'bg-slate-800/30 text-slate-400'
                }`}
              >
                {currentResponse.confidence}
              </span>
            </div>
            <div className="text-slate-500">
              Data: {currentResponse.data_sources_used.join(', ')}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-4">No messages yet. Try asking:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestedQuestion(q)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-ocean-600 text-white'
                    : 'bg-slate-800 text-slate-100 border border-slate-700'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
                    <span>🤖</span>
                    <span>Race Coach</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
                <span>🤖</span>
                <span>Race Coach</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-ocean-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-ocean-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-ocean-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your session..."
          className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 text-white placeholder-slate-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-ocean-600 hover:bg-ocean-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-semibold transition"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>
    </div>
  );
}
