import {injectGlobal} from 'styled-components';
import Terminal from './components/Terminal';
import PluginBase from './components/Plugin';

injectGlobal`
  /* vietnamese */
@font-face {
  font-family: 'Inconsolata';
  font-style: normal;
  font-weight: 400;
  src: local('Inconsolata Regular'), local('Inconsolata-Regular'), url(https://fonts.gstatic.com/s/inconsolata/v15/BjAYBlHtW3CJxDcjzrnZCNDiNsR5a-9Oe_Ivpu8XWlY.woff2) format('woff2');
  unicode-range: U+0102-0103, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Inconsolata';
  font-style: normal;
  font-weight: 400;
  src: local('Inconsolata Regular'), local('Inconsolata-Regular'), url(https://fonts.gstatic.com/s/inconsolata/v15/BjAYBlHtW3CJxDcjzrnZCKE8kM4xWR1_1bYURRojRGc.woff2) format('woff2');
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Inconsolata';
  font-style: normal;
  font-weight: 400;
  src: local('Inconsolata Regular'), local('Inconsolata-Regular'), url(https://fonts.gstatic.com/s/inconsolata/v15/BjAYBlHtW3CJxDcjzrnZCIgp9Q8gbYrhqGlRav_IXfk.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
}
`;

export default Terminal;

export {
  PluginBase,
};
