import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { YMaps, Map } from 'react-yandex-maps';

import ScrollWrapper from './ScrollWrapper';

const mapState = {
  center: [55.76, 37.64],
  zoom: 10,
};

const style = {
  width: '80%',
  height: 1000,
  position: 'relative',
};

const Global = createGlobalStyle`
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;

const AppContainer = styled.div`
  text-align: center;
`;

const Header = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const isMobile =
  /Mobi/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent);

const textScroll =
  'Чтобы изменить масштаб, прокручивайте карту, удерживая клавишу Ctrl';
const textTouch = 'Чтобы переместить карту проведите по ней двумя пальцами';

function App() {
  const [ymaps, setYmaps] = useState(null);
  const [map, setMap] = useState(null);
  const [showWrapper, setShowWrapper] = useState(false);

  useEffect(() => {
    return () => {
      document.removeEventListener('keydown');
      document.removeEventListener('keyup');
    };
  }, []);

  useEffect(() => {
    if (map && ymaps) {
      const mapEl = map.container.getElement();

      const blockToggle = (show = true) => {
        setShowWrapper(show);
      };

      const dragToggle = (on = true) => {
        on ? map.behaviors.enable('drag') : map.behaviors.disable('drag');
      };

      if (ymaps) {
        if (!isMobile) {
          let isCtrlPress = false;
          let isScrollOn = true;

          document.addEventListener('keydown', e => {
            isCtrlPress = e.keyCode === 17;
            if (isCtrlPress) blockToggle(false);
          });

          document.addEventListener('keyup', e => {
            if (e.keyCode === 17) isCtrlPress = false;
          });

          const scrollToggle = (on = true) => {
            if ((on && isScrollOn) || (!on && !isScrollOn)) return;
            isScrollOn = on;
            on
              ? map.behaviors.enable('scrollZoom')
              : map.behaviors.disable('scrollZoom');
          };

          scrollToggle(false);

          map.events.add('wheel', () => {
            scrollToggle(isCtrlPress);
            dragToggle(isCtrlPress);
            blockToggle(!isCtrlPress);
          });

          map.events.add('mouseleave', () => {
            dragToggle(true);
          });

          map.events.add('mousedown', () => {
            blockToggle(false);
            dragToggle(true);
          });
        }

        if (isMobile) {
          dragToggle(false);

          ymaps.domEvent.manager.add(mapEl, 'touchmove', e => {
            const twoFingers = e.get('touches').length === 2;
            blockToggle(!twoFingers);
            dragToggle(twoFingers);
          });

          ymaps.domEvent.manager.add(mapEl, 'touchend', () => {
            blockToggle(false);
          });
        }
      }
    }
  }, [map, ymaps]);

  return (
    <AppContainer>
      <Global />
      <Header>
        <h1>React Yandex Maps Scroll</h1>
        <YMaps>
          <Map
            onLoad={ymaps => {
              setYmaps(ymaps);
            }}
            defaultState={mapState}
            style={style}
            modules={['domEvent.manager']}
            instanceRef={ref => {
              if (ref) {
                setMap(ref);
              }
            }}
          >
            <ScrollWrapper
              show={showWrapper}
              text={isMobile ? textTouch : textScroll}
              setShowWrapper={setShowWrapper}
            />
          </Map>
        </YMaps>
      </Header>
    </AppContainer>
  );
}

export default App;
