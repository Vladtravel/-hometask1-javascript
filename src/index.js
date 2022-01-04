import './sass/main.scss';
import cart from './images/cart.png';
import head from './images/head.png';
import lamp from './images/lamp.png';
import quotes from './images/quotes.png';
import pencil from './images/pencil.png';
import archive from './images/archive.png';
import bin from './images/bin.png';

import notes from './notes.json';
const shortid = require('shortid');

let editNoteId;
let taskActiveEl = [];
let taskArchiivedEl = [];
let randomeActiveEl = [];
let randomeArchiivedEl = [];
let ideaActiveEl = [];
let ideaArchiivedEl = [];
let quoteActiveEl = [];
let quoteArchiivedEl = [];
let on = 'true';

const activeNotes = [];
const archivedNotes = [];

sortNotesByStatus(notes);

function sortNotesByStatus(notes) {
  notes.map(el => {
    if (el.isActive === 'true') {
      activeNotes.push(el);
    } else {
      archivedNotes.push(el);
    }
  });
}

const refs = {
  tbodyEl: document.querySelector('tbody'),
  form: document.querySelector('form'),
  createBtn: document.querySelector('.createBtn'),
  modal: document.querySelector('.backdrop'),
  categoryEl: document.querySelector('.categoryEl'),
};

refs.form.addEventListener('submit', onFormSubmit);
refs.createBtn.addEventListener('click', onCreateClick);
refs.tbodyEl.addEventListener('click', onFormClick);
window.addEventListener('click', onClick);

const notesMarkup = notesMarkupEl(activeNotes);
refs.tbodyEl.insertAdjacentHTML('beforeend', notesMarkup);

sortByCategories(activeNotes, archivedNotes);
function sortByCategories(activeNotes, archivedNotes) {
  const notesArr = [...activeNotes, ...archivedNotes];
  const uniq = notesArr
    .map(el => el.category)
    .filter((item, index, arr) => {
      return arr.indexOf(item) === index;
    });

  activeNotes.forEach(el => {
    switch (el.category) {
      case 'Task':
        taskActiveEl.push(el);
        break;
      case 'Random Thought':
        randomeActiveEl.push(el);
        break;
      case 'Idea':
        ideaActiveEl.push(el);
        break;
      case 'Quote':
        quoteActiveEl.push(el);
        break;
      default:
        break;
    }
  });

  archivedNotes.forEach(el => {
    switch (el.category) {
      case 'Task':
        taskArchiivedEl.push(el);
        break;
      case 'Random Thought':
        randomeArchiivedEl.push(el);
        break;
      case 'Idea':
        ideaArchiivedEl.push(el);
        break;
      case 'Quote':
        quoteArchiivedEl.push(el);
        break;
      default:
        break;
    }
  });

  refs.categoryEl.innerHTML = '';
  const notesMarkup = categoryNotesMarkupEl(uniq);
  refs.categoryEl.insertAdjacentHTML('beforeend', notesMarkup);
}

function onFormSubmit(e) {
  e.preventDefault();

  taskActiveEl = [];
  taskArchiivedEl = [];
  randomeActiveEl = [];
  randomeArchiivedEl = [];
  ideaActiveEl = [];
  ideaArchiivedEl = [];
  quoteActiveEl = [];
  quoteArchiivedEl = [];

  if (!editNoteId) {
    activeNotes.push({
      id: shortid.generate(),
      name: e.target[0].value,
      category: e.target[1].value,
      created: new Date().toLocaleDateString(),
      сontent: e.target[2].value,
      dates: [e.target[3].value.split('-').reverse().join('/')],
      isActive: 'true',
    });
  }

  activeNotes.forEach(el => {
    if (el.id === editNoteId) {
      el.name = document.getElementById('fname').value;
      el.category = document.getElementById('category').value;
      el.сontent = document.getElementById('сontent').value;
      el.dates.push(document.getElementById('dates').value.split('-').reverse().join('/'));
    }
  });
  const newNotesMarkup = notesMarkupEl(activeNotes);
  refs.tbodyEl.innerHTML = '';
  refs.tbodyEl.insertAdjacentHTML('beforeend', newNotesMarkup);
  refs.modal.classList.remove('isOpen');

  sortByCategories(activeNotes, archivedNotes);
}

function notesMarkupEl(data) {
  let noteName = '';

  const btnSub = document.getElementById('sbtBtn');
  btnSub.classList.remove('isHidden');

  return data
    .map(el => {
      switch (el.category) {
        case 'Task':
          noteName = cart;
          break;
        case 'Random Thought':
          noteName = head;
          break;
        case 'Idea':
          noteName = lamp;
          break;
        case 'Quote':
          noteName = quotes;
          break;
        default:
          noteName = cart;
          break;
      }
      return `<tr id="${el.id}" class='active'>
  <td><img class="noteIcon" src='${noteName}' alt='noteName' width='30' height='30' /></td>
  <td>${el.name}</td>
  <td>${el.created}</td>
  <td>${el.category}</td>
  <td>${el.сontent}</td>
  <td>${el.dates}</td>
  <td><img  src='${pencil}' alt='pencil' width='30' height='30' /></td>
  <td><img  src='${archive}' alt='archive' width='30' height='30' /></td>
  <td><img  src="${bin}" alt='bin' width='30' height='30' /></td>
</tr>`;
    })
    .join('');
}

function onCreateClick() {
  editNoteId = '';
  refs.modal.classList.add('isOpen');
}

function onFormClick(e) {
  if (!e.target.alt) {
    return;
  }

  switch (e.target.alt) {
    case 'pencil':
      onEditNote(e);
      break;
    case 'archive':
      onArchiveNote(e.target.parentElement.parentElement);
      break;
    case 'bin':
      onRemoveNote(e.target.parentElement.parentElement);
      break;

    default:
      break;
  }
}

function onEditNote(e) {
  editNoteId = e.target.parentElement.parentElement.id.toString();

  document.getElementById('fname').value =
    e.target.parentElement.parentElement.children[1].textContent;
  document.getElementById('сontent').value =
    e.target.parentElement.parentElement.children[4].textContent;
  refs.modal.classList.add('isOpen');
}

function onArchiveNote(e) {
  taskActiveEl = [];
  taskArchiivedEl = [];
  randomeActiveEl = [];
  randomeArchiivedEl = [];
  ideaActiveEl = [];
  ideaArchiivedEl = [];
  quoteActiveEl = [];
  quoteArchiivedEl = [];

  if (e.className === 'active') {
    activeNotes.forEach((el, index) => {
      if (el.id === e.id) {
        if (el.isActive === 'true') {
          el.isActive = 'false';
          archivedNotes.push(el);
          activeNotes.splice(index, 1);

          refs.tbodyEl.innerHTML = '';
          const notesMarkup = notesMarkupEl(activeNotes);
          refs.tbodyEl.insertAdjacentHTML('beforeend', notesMarkup);
        }
      }
    });
  }

  if (e.className === 'archived') {
    archivedNotes.forEach((el, index) => {
      if (el.id === e.id) {
        if (el.isActive === 'false') {
          el.isActive = 'true';
          activeNotes.push(el);
          archivedNotes.splice(index, 1);

          refs.tbodyEl.innerHTML = '';
          const notesMarkup = archivedNotesMarkupEl(archivedNotes);
          refs.tbodyEl.insertAdjacentHTML('beforeend', notesMarkup);
        }
      }
    });
  }
  sortByCategories(activeNotes, archivedNotes);
}

function onRemoveNote({ id }) {
  taskActiveEl = [];
  taskArchiivedEl = [];
  randomeActiveEl = [];
  randomeArchiivedEl = [];
  ideaActiveEl = [];
  ideaArchiivedEl = [];
  quoteActiveEl = [];
  quoteArchiivedEl = [];

  const index = activeNotes.findIndex(el => el.id === id);
  if (index !== -1) {
    activeNotes.splice(index, 1);
  }
  const delNotes = notesMarkupEl(activeNotes);
  refs.tbodyEl.innerHTML = '';
  refs.tbodyEl.insertAdjacentHTML('beforeend', delNotes);

  sortByCategories(activeNotes, archivedNotes);
}

function onClick(e) {
  if (e.target === refs.modal) {
    onCloseModal(e);
  }

  if (e.target === document.getElementById('archiveId')) {
    on === 'true' ? onArchiveRender(e) : onActiveRender(activeNotes);
  }
}
function onCloseModal(e) {
  refs.modal.classList.remove('isOpen');
}

function onArchiveRender(e) {
  on = 'false';
  const btnSub = document.getElementById('sbtBtn');
  btnSub.classList.add('isHidden');

  refs.tbodyEl.innerHTML = '';
  const notesMarkup = archivedNotesMarkupEl(archivedNotes);
  refs.tbodyEl.insertAdjacentHTML('beforeend', notesMarkup);
}

function onActiveRender(e) {
  on = 'true';
  refs.tbodyEl.innerHTML = '';
  const notesMarkup = notesMarkupEl(activeNotes);
  refs.tbodyEl.insertAdjacentHTML('beforeend', notesMarkup);
}

function archivedNotesMarkupEl(data) {
  let noteName = '';
  return data
    .map(el => {
      switch (el.category) {
        case 'Task':
          noteName = cart;
          break;
        case 'Random Thought':
          noteName = head;
          break;
        case 'Idea':
          noteName = lamp;
          break;
        case 'Quote':
          noteName = quotes;
          break;
        default:
          noteName = cart;
          break;
      }
      return `<tr id="${el.id}" class='archived'>
  <td><img class="noteIcon" src='${noteName}' alt='noteName' width='30' height='30' /></td>
  <td>${el.name}</td>
  <td>${el.created}</td>
  <td>${el.category}</td>
  <td>${el.сontent}</td>
  <td>${el.dates}</td>
  <td><img  src='${pencil}' alt='pencil' width='30' height='30' /></td>
  <td><img  src='${archive}' alt='archive' width='30' height='30' />Archived</td>
  <td><img  src="${bin}" alt='bin' width='30' height='30' /></td>
</tr>`;
    })
    .join('');
}

function categoryNotesMarkupEl(data) {
  let noteName = '';
  let activeEl = '';
  let archivedEl = '';

  return data
    .map(el => {
      switch (el) {
        case 'Task':
          noteName = cart;
          activeEl = taskActiveEl.length;
          archivedEl = taskArchiivedEl.length;
          break;
        case 'Random Thought':
          noteName = head;
          activeEl = randomeActiveEl.length;
          archivedEl = randomeArchiivedEl.length;
          break;
        case 'Idea':
          noteName = lamp;
          activeEl = ideaActiveEl.length;
          archivedEl = ideaArchiivedEl.length;
          break;
        case 'Quote':
          noteName = quotes;
          activeEl = quoteActiveEl.length;
          archivedEl = quoteArchiivedEl.length;
          break;
        default:
          noteName = cart;
          break;
      }
      return `<tr id="${el.id}" class='archived'>
  <td><img class="noteIcon" src='${noteName}' alt='noteName' width='30' height='30' /></td>
  <td>${el}</td>
  <td>${activeEl}</td>
  <td>${archivedEl}</td>
  
  
</tr>`;
    })
    .join('');
}
