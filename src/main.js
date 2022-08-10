import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./assets/css/base.scss";

let app = createApp(App);

app.use(store).use(router).mount("#app");
