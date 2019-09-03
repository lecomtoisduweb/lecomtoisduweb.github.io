import "./src/sass/main.scss";
import "prismjs/themes/prism-tomorrow.css";

export const onServiceWorkerUpdateReady = () => {
  window.location.reload();
};
