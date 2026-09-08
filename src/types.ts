// El vocabulario de la app, en inglés. Cuando construyamos nuestro propio
// backend (con Postgres en Docker), lo vamos a hacer hablar el mismo idioma
// que la app — sin necesidad de una capa que traduzca español <-> inglés —
// así que estos tipos describen también la forma en que va a responder la API.

export interface User {
  id: string;
  name: string;
  email: string;
}
