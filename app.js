function App() {
      const [messages, setMessages] = React.useState([]);
      const [inputPosition, setInputPosition] = React.useState(
        localStorage.getItem('inputPosition') || 'top'
      );

      const toggleInputPosition = () => {
        if (inputPosition === 'top') {
          setInputPosition('bottom');
          localStorage.setItem('inputPosition', 'bottom');
        } else {
          setInputPosition('top');
          localStorage.setItem('inputPosition', 'top');
        }
      };

      return (
        <div className={
          `chatbot-container
          ${inputPosition === 'top'
            ? 'chatbot-container-top'
            : 'chatbot-container-bottom'
          }`
        }>
          <div className="position-switcher-container">
            <a className="position-switcher" onClick={toggleInputPosition}>
              Move textbox to {inputPosition === 'top' ? 'bottom' : 'top'}
            </a>
          </div>

          {inputPosition === 'top' ? (
            <>
              <ChatInput setMessages={setMessages} />
              <ChatMessages messages={messages} inputPosition={inputPosition} />
            </>
          ): (
            <>
              <ChatMessages messages={messages} inputPosition={inputPosition} />
              <ChatInput setMessages={setMessages} />
            </>
          )}
        </div>
      );
    }

    function ChatInput({ setMessages }) {
      const [inputValue, setInputValue] = React.useState('');
      const [isDisabled, setIsDisabled] = React.useState(false);

      const handleChange = (event) => {
        setInputValue(event.target.value);
      };

      const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          sendMessage();
        }
      };

      const sendMessage = async () => {
        if (isDisabled || inputValue === '') return;

        const newMessage = inputValue;
        setMessages((messages) => {
          return [
            ...messages,
            {
              id: crypto.randomUUID(),
              message: newMessage,
              user: 'user'
            }
          ];
        });

        setIsDisabled(true);
        setInputValue('');

        // Set a loading message for the chatbot.
        setMessages((messages) => {
          return [
            ...messages,
            {
              id: crypto.randomUUID(),
              message: <img src="loading-spinner.gif" className="loading-spinner" />,
              user: 'robot'
            }
          ];
        });

        const response = await Chatbot.getResponseAsync(newMessage);

        setMessages((messages) => {
          return [
            ...messages.slice(0, messages.length - 1),
            {
              id: crypto.randomUUID(),
              message: response,
              user: 'robot'
            }
          ];
        });

        setIsDisabled(false);
      };

      return (
        <div className="chat-input-container">
          <input
            className="chat-input"
            placeholder="Send a message to Chatbot"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button className="send-button" onClick={sendMessage}>
            Send
          </button>
        </div>
      );
    }

    function ChatMessages({ messages, inputPosition }) {
      const containerRef = React.useRef(null);

      React.useEffect(() => {
        const containerElem = containerRef.current;
        if (containerElem) {
          containerElem.scrollTop = containerElem.scrollHeight;
        }
      }, [messages, inputPosition]);

      return (
        <div
          className="chat-messages-container js-chat-message-container"
          ref={containerRef}
        >
          {messages.length === 0 ? (
            <p className="welcome-message">
              Welcome to the chatbot project! Send a message using the textbox {
                inputPosition === 'top' ? 'above' : 'below'
              }.
            </p>
          ) : (
            messages.map((message) => {
              return (
                <ChatMessage
                  key={message.id}
                  message={message.message}
                  user={message.user}
                />
              );
            })
          )}
        </div>
      );
    }

    function ChatMessage({ message, user }) {
      return (
        <div className={`chat-message-container-${user}`}>
          {user === 'user' && (
            <>
              <p className="chat-message-contents">
                {message}
              </p>
              <img src="user.png" className="chat-message-profile" />
            </>
          )}
          {user === 'robot' && (
            <>
              <img src="robot.png" className="chat-message-profile" />
              <p className="chat-message-contents">
                {message}
              </p>
            </>
          )}
        </div>
      );
    }

    const container = document.querySelector('.js-container');
    ReactDOM.createRoot(container).render(<App></App>);