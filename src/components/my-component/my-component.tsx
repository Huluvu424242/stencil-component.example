import {Component, Prop, h, Host} from '@stencil/core';
import {Endpunkt} from "../../shared/endpunkt";
import {networkService} from "../../shared/network";

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {

  @Prop() weatherApiUrl: string;


  /**
   * The first name
   */
  @Prop() first: string;

  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;

  private async getText(): Promise<string> {

    const apiEndpoint:Endpunkt = new Endpunkt(undefined,undefined,undefined,undefined, this.weatherApiUrl);
    const response :Response = await networkService.getData(apiEndpoint);
    return response.text();
  }

  render() {
    return (
      <Host>
        <h1>Test Komponente in Stencil</h1>
        <h2>Live Test Abschnitt</h2>
        <div>Hello, World! I'm {this.getText()}</div>
        {/*Das ist mein Wetter API URL: {process.env.WEATHER_API_URL}*/}

        <h1>Typische Herausforderungen in Webkomponenten</h1>
        <h2>Entkopplung genutzter Webkomponenten</h2>
        <p>Generell 2 Lösungswege</p>
        <h3>Node Modul</h3>
        <p>
          Anziehen als Node Modul und direktes integrieren beim Build als Abhängigkeit im Scope compiler. In diesem
          Fall wird die Komponente von der man abhängig ist mit in der eigenen Anwendung ausgeliefert.
          <h4>Nachteile</h4>
          <ul>
            <li>Bei Änderungen an den Abhängigkeiten muss die eigene Komponente neu gebaut und ausgeliefert werden</li>
          </ul>
          <h4>Vorteile</h4>
          <ul>
            <li>Änderungen an den Abhängigkeiten wirken sich erst auf die eigene Komponente aus wenn diese neu gebaut
              und ausgeliefert wurde.
            </li>
            <li>Zeitliche Entkopplung beim Versionsupgrade möglich</li>
          </ul>
        </p>
        <h3>Einbindung per URL</h3>
        <p>
          Die Komponenten von denen die eigene Komponente abhängt werden auf einem Webserver bereitgestellt
          z.B. https://unpkg.com und von der Webseite welche die eigene Komponente nutzt per script Tag importiert.
          <h4>Vorteile</h4>
          <ul>
            <li>Lose Kopplung: Die eigene Komponente muss bei Änderungen an den Abhängigkeiten nicht neu gebaut werden.
              Falls sich der URL beim Upgrade ändert, muss nur die umgebende Webseite angepasst werden.
            </li>
            <li>Zeitliche Entkopplung beim Versionsupgrade möglich, wenn jede neue Version unter einem neuen URL
              bereitgestellt wird.
            </li>
          </ul>
          <h4>Nachteile</h4>
          <ul>
            <li>Wenn sich bei Änderungen der Abhängigkeiten deren URL nicht ändert, kann dies plötzliche unerwünschte
              Auswirkungen haben, die nicht gleich vom Hersteller bemerkt werden.
            </li>
          </ul>
          Empfehlung wäre also bei einer Entkopplung über den URL: Bei jeder Änderung ein einer Komponente, die neue
          Version unter einer neuen URL bereitzustellen. Die abhängigen Komponenten müssen dann in der Regel nichts tun,
          es müssen nur die Links der umgebenden Webseite angepasst werden.
          <br/>
          Ausnahme: Bei Major Änderungen muss evtl. auch die eigene Komponente angepasst werden wenn diese APIs etc.
          nutzt.
        </p>
        <h2>Sicherheitsrelevante Informationen</h2>
        <h3>Herausforderungen</h3>
        <p>
          Secrets oder API Keys lassen sich prinzipiell nicht sicher in einer Webkomponente unterbringen. Diese können
          zum Einen direkt im Compilat gefunden werden, da sie meist nicht verändert werden dürfen.
        </p>
        <p>
          Ein verschlüsseltes Ablegen im Compilat der Webkomponente bringt meist nix, da z.B. ein API Key von jedem
          kopiert und in seiner eigenen Komponente genutzt werden könnte. Dabei spielt es keine Rolle ob er
          verschlüsselt wurde oder nicht.
        </p>
        <h3>Lösungsansätze</h3>
        <p>
          Ein denkbarer Ansatz kann der Einsatz eines Webservers als Backend sein, welches dann die API Aufrufe entgegen
          nimmt und die sicherheitsrelevanten Infos wie API Key kennt und an die aufgerufenen eigentlichen API Server
          weitergibt. Allerdings muss man wieder irgendwie sicherstellen, dass diese Backend nicht einfach jeder
          aufrufen kann. CORS bietet hier Möglichkeiten.
        </p>
        <h2>Umgebungsspezifische Informationen</h2>
        Unsere Webkomponente soll per laufenden Docker Container oder K8s Pod ausgeliefert werden.
        Das Docker Image soll aber umgebungsneutral sein.
        Ein Setzen der Umgebungsspezifischen Information kann also nicht im Build sondern nur zum Deploymentzeitpunkt
        erfolgen. Beispielsweise durch bereitstellen spezieller Dateien wie .env welche pro Umgebung über helm
        für K8s generiert werden.

        Oder aber beim Hochfahren der Anwendung, wenn zu diesem Zeitpunkt noch Env Vars ausgewertet werden können.
        <h3>Env Vars per generiertem .env File und process.env</h3>
        <p>
          Zur Laufzeit der Komponente im Browser ist ein Zugriff auf process.env sinnlos, da jetzt kein nodejs läuft.
          Daher würde hier undefined erscheinen bzw. beim Zugriff auf process.env.WEATHER_API_URL bereits ein
          Compilerfehler.
        </p>
        <p>
          Und doch könnte man hier auf process.env zugreifen und den gewünschten Wert erhalten.
          Doch das werden wir hier nicht tun.
          Wir haben uns entschieden auf process nur beim starten der app zugreifen zu wollen.
        </p><p>
        Wie es aber gehen würde kann man hier nachlesen:
        <a
          href="https://medium.com/learnwithrahul/using-environment-variables-with-stenciljs-d3425592fa18">
          https://medium.com/learnwithrahul/using-environment-variables-with-stenciljs-d3425592fa18
        </a>
        Zu beachten sind dann aber auch die dort erwähnten, folgenden Punkte:
        <cite>
          Things to remember
          @types/node typing must be installed (mentioned earlier) to avoid IDE/compilation error report on
          process.env thing as it is unknown to stencil & typescript syntax!
          Whenever you add/modify some env variable you will need to rebuild or restart your development server
          .env file values take precedence over OS system/user variables. So if some variable is present at both the
          places, one that is contained inside .env file will be used
          plugin first looks for a variable in .env file placed in project root & if not found looks in systems
          environment variables
          Never commit .env file, as it is environment specific thing & should be created as per the requirement. You
          can commit a sample .env.example file to guide anyone who needs to create .env file or system variables
        </cite>
      </p>
        <h3>Env Vars per globaler Konfiguration</h3>
        <p>
          In <a
          href="http://johnborg.es/2020/03/stenciljs-environment-variables.html">http://johnborg.es/2020/03/stenciljs-environment-variables.html</a>
          wird eine weitere Möglichkeit gezeigt.

          Das Problem hierbei ist, dass die umgebungsspezifischen Variablen durch den Build im Compilat fixiert werden.
          Beim Ausliefern über einen Container, lässt sich dies also nicht mehr ändern.
        </p>
        <h3>Ersetzung env Variablen per Skript</h3>
        <p>
          Aus meiner Sicht die schlechteste aber zur Zeit scheinbar die einzigste Möglichkeit auch ein
          umgebungsneutrales Dockerimage zu nutzen ist es, wenn beim Start des Webkomponenten ausliefernden Webserver
          im Docker Container ein Start Skript aufgerufen wird, welches im Compilat der Stencil Dateien die
          Umgebungsvariablen gegen die konkreten Werte austauscht.
        </p>
        <p>
          Schlecht finde ich diese Lösung, weil unter ungünstigen Bedingungen immer die Gefahr besteht, dass das
          gesamte Compilat beschädigt wird oder ungewollte Fehler und Sicherheitslücken eingebracht werden. Wären
          die Compilate mit Prüfsummen vor Veränderung geschützt, wäre dieser Weg verbaut.
        </p>
        <h2>Shared Style</h2>
        <p>
        Dafür gibt es inzwischen eine Lösung. Bei Verwendung von Styling Libs wie Bulma oder PaperCSS welche
        keine Javascript Anteile besitzen, können diese
        einfach per &lt;link rel="stylesheet" href="url zur css lib"/&gt; in den Shadow DOM eingebunden werden.
        </p>
        <p>
          Bei anderen Bibliotheken mit Javascript Anteil, wie beispielsweise boostrap können nur die css Anteile wie
          bei paperCSS in den Shadow DOM eingebunden werden. Die Javascript Anteile müssen über die umgebende Webseite
          bereitgestellt werden. Hierbei müssen die Lib Hersteller aber auch das Vorhandensein von Webkomponenten
          berücksichtigt haben. Bootstrap beispielsweise navigiert zunächst durch den gesamten DOM und disabled dort
          Elemente. Allerdings berücksichtigen die Selektoren keine Webkomponenten und so bleiben deren Elemente
          im Shadow DOM enabled.
        </p>
      </Host>
    );


  }
}
