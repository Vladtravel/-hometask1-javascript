import cart from './images/cart.png';
import head from './images/head.png';
import lamp from './images/lamp.png';
import quotes from './images/quotes.png';
import pencil from './images/pencil.png';
import archive from './images/archive.png';
import bin from './images/bin.png';

export function categoryNotesMarkupEl(
  data,
  editNoteId,
  taskActiveEl,
  taskArchiivedEl,
  randomeActiveEl,
  randomeArchiivedEl,
  ideaActiveEl,
  ideaArchiivedEl,
  quoteActiveEl,
  quoteArchiivedEl,
) {
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

export function notesMarkupEl(data) {
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

export function archivedNotesMarkupEl(data) {
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
