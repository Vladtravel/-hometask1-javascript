import './sass/main.scss';
import { categoryNotesMarkupEl, notesMarkupEl, archivedNotesMarkupEl } from './render';
import notes from './notes.json';

const shortid = require('shortid');
const activeNotes = [];
const archivedNotes = [];

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

const notesMarkup = notesMarkupEl(activeNotes);

renderActiveNotes(notesMarkup);

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

  const notesMarkup = categoryNotesMarkupEl(
    uniq,
    editNoteId,
    taskActiveEl,
    taskArchiivedEl,
    randomeActiveEl,
    randomeArchiivedEl,
    ideaActiveEl,
    ideaArchiivedEl,
    quoteActiveEl,
    quoteArchiivedEl,
  );

  renderCategories(notesMarkup);
}

function onFormSubmit(e) {
  e.preventDefault();

  makeEmptyAllArr();

  if (!editNoteId) {
    activeNotes.push({
      id: shortid.generate(),
      name: e.target[0].value,
      category: e.target[1].value,
      created: new Date().toLocaleDateString(),
      сontent: e.target[2].value,
      dates: e.target[2].value.match(/\b\d+.|\/|-\d+.|\/|-\d+\b/g)
        ? [e.target[2].value.match(/\b\d+.|\/|-\d+.|\/|-\d+\b/g).join('')]
        : [],
      isActive: 'true',
    });
  }

  activeNotes.forEach(el => {
    if (el.id === editNoteId) {
      el.name = document.getElementById('fname').value;
      el.category = document.getElementById('category').value;
      el.сontent = document.getElementById('сontent').value;
      const categDateValue = document
        .getElementById('сontent')
        .value.match(/\b\d+.|\/|-\d+.|\/|-\d+\b/g);

      if (categDateValue) {
        el.dates.push(categDateValue.join(''));
      }
    }
  });

  const newNotesMarkup = notesMarkupEl(activeNotes);

  renderActiveNotes(newNotesMarkup);

  sortByCategories(activeNotes, archivedNotes);
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
  makeEmptyAllArr();

  if (e.className === 'active') {
    activeNotes.forEach((el, index) => {
      if (el.id === e.id) {
        if (el.isActive === 'true') {
          el.isActive = 'false';
          archivedNotes.push(el);
          activeNotes.splice(index, 1);

          const notesMarkup = notesMarkupEl(activeNotes);
          renderActiveNotes(notesMarkup);
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

          const notesMarkup = archivedNotesMarkupEl(archivedNotes);
          renderActiveNotes(notesMarkup);
        }
      }
    });
  }
  sortByCategories(activeNotes, archivedNotes);
}

function onRemoveNote({ id }) {
  makeEmptyAllArr();

  const index = activeNotes.findIndex(el => el.id === id);
  if (index !== -1) {
    activeNotes.splice(index, 1);
  }
  const delNotes = notesMarkupEl(activeNotes);
  renderActiveNotes(delNotes);

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

function renderCategories(notesMarkup) {
  refs.categoryEl.innerHTML = '';
  refs.categoryEl.insertAdjacentHTML('beforeend', notesMarkup);
}

function onArchiveRender(e) {
  on = 'false';
  const btnSub = document.getElementById('sbtBtn');
  btnSub.classList.add('isHidden');

  const notesMarkup = archivedNotesMarkupEl(archivedNotes);
  renderActiveNotes(notesMarkup);
}

function onActiveRender(e) {
  on = 'true';

  const notesMarkup = notesMarkupEl(activeNotes);
  renderActiveNotes(notesMarkup);
}

function renderActiveNotes(newNotesMarkup) {
  refs.tbodyEl.innerHTML = '';
  refs.tbodyEl.insertAdjacentHTML('beforeend', newNotesMarkup);
  refs.modal.classList.remove('isOpen');
}

function makeEmptyAllArr() {
  taskActiveEl = [];
  taskArchiivedEl = [];
  randomeActiveEl = [];
  randomeArchiivedEl = [];
  ideaActiveEl = [];
  ideaArchiivedEl = [];
  quoteActiveEl = [];
  quoteArchiivedEl = [];
}
