# EASYPAY ONLINE
Easypay-Online è una sezione extra del progetto di EasyPay. Il suo scopo è la realizzazione di una interfaccia di pagamento online che un commerciante affiliato a Easypay può inserire sul suo sito per permettere al cliente di pagare.

**ATTENZIONE: Il progetto è un lavoro universitario e non ha alcuna finalità commerciale. Il progetto è un semplice prototipo dell'idea**

## @angular-cli

Questo progetto è generato con [Angular CLI](https://github.com/angular/angular-cli) ed è attualmente alla versione 9.1.13.

```
     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/
    

Angular CLI: 9.1.13
Node: 10.16.3
OS: linux x64

Angular: 9.1.13
... animations, cli, common, compiler, compiler-cli, core, forms
... language-service, platform-browser, platform-browser-dynamic
... router
Ivy Workspace: Yes

Package                           Version
-----------------------------------------------------------
@angular-devkit/architect         0.901.13
@angular-devkit/build-angular     0.901.13
@angular-devkit/build-optimizer   0.901.13
@angular-devkit/build-webpack     0.901.13
@angular-devkit/core              9.1.13
@angular-devkit/schematics        9.1.13
@angular/cdk                      9.2.4
@angular/material                 9.2.4
@ngtools/webpack                  9.1.13
@schematics/angular               9.1.13
@schematics/update                0.901.13
rxjs                              6.6.3
typescript                        3.8.3
webpack                           4.42.0
```


## Server di Sviluppo

Per testare il contenuto in locale è sufficiente lanciare il comando `npm start`.
per poter funzionare in locale al meglio è necessario anche avviare il mock del server tramite `npm run backend`.

*Nota: a causa di un problema di compatibilità con il nome dei file di `saray` e windows, alla fine il mock del back end è stato cambiato in itinere con uno custom creato con node express. Pertanto alcune delle chiamate rest non sono state completamente riprodotte nel nuovo backend*

## Server di Application / Produzione

Il progetto è rilasciato su [Heroku](https://www.heroku.com/). 
*Essendo un progetto universitario con finalità il conseguimento di un esame lo sviluppo sarà interrotto una volta entrato in produzione e presentato.*

L'ambiente di Application verrà sostituito dall'ambiente di Production in data 14/02/2021 ed è raggiungibile su [https:///easypay-unito.herokuapp.com/online](https:///easypay-unito.herokuapp.com/online).

### Build

La fase di build è consigliata solo scaricando l'intero progetto principale:
[https://github.com/Seniorsimo/EasyPay](https://github.com/Seniorsimo/EasyPay)

- build ambiente application (sviluppo): `npm run build` 
- build ambiente production: `npm run build:prod`

Il risultato dell'operazione è reindirizzato al di fuori del progetto, nel path `../webapp/atm`. Una volta buildato è possibile fare il commit della cartella modificata e pusharlo sul branch `master`.
Heroku aggiornerà automaticamente il server.

Il progetto è un submodulo di [https://easypay-unito.herokuapp.com/online](https://easypay-unito.herokuapp.com/atm)


## Info utili su Angular

In sintesi angular è un framework js (con supporto nativo per typescript) che permette una realizzazione strutturata di SPA (Single page application). Maggiori informazioni possono essere trovate sulla guida ufficiale ([Angular.io](https://angular.io/))

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Componenti Fondamentali

- **module**
- **component** 
- **directive** 
- **pipe**
- **service**

#### module
Sono delle librerie che suddividono sia logicamente che strutturalmente le varie funzioni dell'applicazione che verrà creata.
li si può riconoscere dalla nomenclatura `*.module.ts`
#### component
I componenti sono la principale componente grafica del progetto. La parte più essenziale è il file `*.component.ts` che contiene al suo interno la logica del componente e il relativo html e style.
In realtà per comodità (e di default tramite comando ng)  è preferibile scorporare le 3 parti in 3 file ottenendo quindi 3 file con lo stesso nome.
Se ad esempio si sta creando un componente home, il risultato sarà la creazione di 3 file:
- `home.component.ts`
- `home.component.html`
- `home.component.scss`

#### directive
Le Direttive sono dei metodi avanzati per suddividere le funzioni logiche dei componenti. Per suddividere le funzioni logiche di un componente (o eventualmente riutilizzare del codice già scritto su più componenti) è possibile creare una direttiva che andrà di fatto ad allacciarsi ad un componente ed eseguirà delle operazioni su di esso.
Ad esempio si potrebbe creare una direttiva filter con lo scopo di colorare dei componenti che rispettano una determinata logica.
`filter.directive.ts`  

```html
<div #example filter >Hello Example</div>
```


#### pipe
Le Pipe invece sono delle funzioni che possono essere eseguite per manipolare la resa grafica delle variabili nella parte html.
Esistono diverse pipe già messe a disposizione da angular (come ad esempio la pipe `Date` che permette di formattare le date o la utilissima Pipe `Async` che permette di fare una subscribed di un observable (o di una promise) e visualizzare il suo contenuto nell' html)

```html
<div>{{observable$ | async }}</div>
```

#### service 
I service sono una ulteriore suddivisione tra le funzioni del componente e un livello più astratto della logica.
La peculiarità dei service è di essere dei ***Singleton*** *(N.B. Su angular i service sono inseriti nei moduli tramite una dependency injection. Se un service viene importato su più moduli quest'ultimo è singleton all'interno del modulo.)*

I service sono spesso usati per comunicare con il backend o altri servizi e manipolare i dati prima di utilizzarli effettivamente.

### store
Gli store non sono uno standard  di angular ma sono dei service specializzati per immagazzinare i dati e poterli riutilizzare nell'applicazione.

*Nota: angular è in grado di mantenere in store i dati finché è in esecuzione la SPA (quindi è possibile muoversi al suo interno tramite il router interno senza perdere i dati ma se si esce o si ricarica i dati andranno persi. Una buona soluzione può essere salvarli in localstorage)*

### Ciclo di vita del Componenti

Dal momento della sua creazione il componente ha un cosiddetto 'lifecycle' nei quali è possibile allacciarsi tramite hook ed effettuare le operazioni desiderate.

```
- constructor
- onChanges
- onInit
- doCheck
    - AfterContentInit    <-
    - AfterContentChecked   |
    - AfterViewInit         |
    - AfterViewChecked    __|
- onDestroy
```

### Rxjs

[Rxjs](https://rxjs-dev.firebaseapp.com/api) è una libreria avanzata per gestire gli Observable usata di default da [Angular.io](https://angular.io/).
Il suo funzionamento è essenziale sia per gestire le chiamate  http asincrone, sia per aggiornare la vista dei componenti.




### Struttura di EasyPay-Online


Come ogni progetto angular è suddiviso in moduli.
EasyPay-Online ha un solo modulo features (home).
Visto la dimensione ridotta si è preferito non usare il lazy loading (caricamento asincrono dei moduli solo nel momento in cui viene effettivamente usato) ma caricare tutti i moduli all'avvio.

Altri moduli essenziali sono il modulo `coreModule` e il modulo `sharedModule`.
Entrambi sono degli standard consigliati di angular e in particolare *coreModule* serve per raggruppare tutti i service singleton, mentre *sharedModule* raccoglie tutti i componenti e i pipe riutilizzabili.



## Come implementare EasyPay-Online

Un esempio di implementazione è rappresentato nella [demo](https://easypay-unito.herokuapp.com/demo)

Il primo passo è creare un account commerciante tramite (Easypay-ATM)(https://easypay-unito.herokuapp.com/atm) (codice reperibile su [github](https://github.com/gmammolo/Easypay-atm)) e prendere nota del proprio idConto.

EasyPay-Online va aperto tramite *windows.open passando* passando tramite queryParams i seguenti parametri:
- **idConto** {string} id del conto del commerciante
- **prezzo** {number} il prezzo da pagare.
- **token** {string} token di autenticazione del login del commerciante.    

**WARNING SICUREZZA: il token inserito in questa fase è semplicemente un placeholder ed una potenziale falla in sicurezza. In un contesto reale è necessario un terzo server oAuth che possa garantire la comunicazione sicura tra commerciante e cliente, ma ai fini di questo progetto verrà effettuata una login del commerciante e il token sarà passato ad EasyPay-online. Per semplificare ancora di più la demo il login del commerciante verrà svolto lato frontend ma potrebbe essere eseguito dal backend e restituito alla vista solo il token**

```js

  /* esempio di getToken per ottenere il token da utilizzare*/
  function getToken(email, password, callback) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if(this.responseText) {
              const res = JSON.parse(this.responseText);
              if(res.token) {
                      // la callback prosegue con l'apertura di EasyPayOnline
                      callback(res.token);
              }
          }
      }
      xhttp.open("POST", baseUrl+"/api/login", false);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify({email: email, password: password}));
  }

  getToken('commerciante1@gmail.com','Qwerty1234');
```


```js
// apertura di easypay-online passando i parametri
const easyPayOrigin = 'https://easypay-unito.herokuapp.com/online';
const url = easyPayOrigin + '/home/pin?idConto=' + idConto + '&prezzo=' + prezzo + '&token='+ token;
const easyPay = window.open(url, 'myWindow', 'width=500, height=900'); // Opens a new window
```



per la ricezione del risultato invece si utilizza postMessage
(see [postMessage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) )

```js
window.addEventListener('message', receiveMessage, false);

function receiveMessage(event) {
  const response = JSON.parse(event.data);
  
}
```

La risposta ottenuta da easypay è un JSON stringifato.
il suo contenuto è: 
```typescript
interface Response {
  /** true in caso di successo durante il pagamento, false con esito negativo */
  success: boolean;
  /** codice dell' errore in caso di fallimento  */
  errorCode?: string;
  /** messaggio dell' errore ottenuto durante il pagamento*/
  errorMessage?: string;
  /** data di avvenuto pagamento */
  timestamp: number;
}
```

*Nota: `errorCode` ed `errorMessage` sono presenti solo in caso di errore*


#### Utilizzo di EasyPay

Se la richiesta di apertura di una istanza di pagamento è andata a buon fine, si aprirà un tab del browser che chiederà
al cliente di effettuare il login.
Come per i commercianti, in basso sono presenti i dati mock di un paio di acquirenti.

*NOTA - Attualmente sono in grado di essere effettuate due azioni principali: la fase di login e quella di pagamento. In entrambe le casistiche, è possibile procedere tramite "pin"
(con l'inserimento di una password) oppure per mezzo di qrcode (cui si evidenzia che l'NFC non è stato implementato nella seguente demo, nè si è deciso di considerare un futuro sviluppo).*
