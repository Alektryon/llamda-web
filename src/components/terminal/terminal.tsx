import ReactTerminal, { ReactThemes} from 'react-terminal-component';

const Terminal = () => {
    return (
        <div 
          style={{
            position: 'fixed',
            right: 0,
            width: '50vw',
            height: '80vh',
            top: '10vh',
            bottom: '10vh',
            zIndex: 1000,
            '@media (max-width: 768px)': {
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }
          }}
        >
              <ReactTerminal theme={{
                ...ReactThemes.Hackers,
                backgroundColor: '#000',
              }} />
        </div>
    )
}

export default Terminal;