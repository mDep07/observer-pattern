// Import stylesheets
import './style.css';

interface Observer {
  notify(obj: any): void;
}

interface Subject {
  subcribe(observer: Observer): void;
  unsubcribe(observer: Observer): void;
  notify(obj: any): void;
}

class SubjectElement implements Subject {
  observers: Observer[];

  constructor() {
    this.observers = [];
  }

  subcribe(observer: Observer) {
    this.observers.push(observer);
  }

  unsubcribe(observer: Observer) {
    this.observers = this.observers.filter(obs => obs != observer);
  }

  notify(object: string) {
    this.observers.forEach(obs => obs.notify(object));
  }
}

class ObserverElement implements Observer {
  element: HTMLElement;
  fn: (text: string) => boolean;
  fnTransform: (text: string) => number | string | boolean;

  constructor(
    element: HTMLElement,
    fn: (text: string) => boolean,
    fnTransform?: (text: string) => number | string
  ) {
    this.element = element;
    this.fn = fn;
    this.fnTransform = fnTransform;
  }

  notify(object: any) {
    if (this.fn(object)) {
      this.element.innerHTML += `
        <p>${this.fnTransform ? this.fnTransform(object) : object}</p>
      `;
    }
  }
}

const listElement_1 = document.createElement('div');
const listElement_2 = document.createElement('div');
const listElement_3 = document.createElement('div');

const subject = new SubjectElement();
const observer_1 = new ObserverElement(listElement_1, elem => elem !== '');
const observer_2 = new ObserverElement(
  listElement_2,
  elem => isNaN(parseInt(elem)),
  elem => elem.toUpperCase()
);
const observer_3 = new ObserverElement(
  listElement_3,
  elem => !isNaN(parseInt(elem)),
  elem => parseInt(elem)
);

subject.subcribe(observer_1);
subject.subcribe(observer_2);
subject.subcribe(observer_3);

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>TypeScript Observer Pattern</h1>`;
appDiv.innerHTML += `
  <form>
    <input type="text"/>
    <button type="submit">Enviar</button>
  </form>
  <section></section>
`;
appDiv.querySelector('section').appendChild(listElement_1);
appDiv.querySelector('section').appendChild(listElement_2);
appDiv.querySelector('section').appendChild(listElement_3);
appDiv.querySelector('form').addEventListener('submit', e => {
  e.preventDefault();
  const description = appDiv.querySelector<HTMLInputElement>('input[type=text]')
    .value;
  subject.notify(description);
});
