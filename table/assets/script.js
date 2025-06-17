let selectedColumn = null;
let history = [];

// Seleção da coluna
document.getElementById('table').addEventListener('click', function(event) {
  if (event.target.tagName === 'TD') {
    const columnIndex = event.target.cellIndex;
    clearColumnSelection();
    const rows = document.querySelectorAll('tr');
    rows.forEach(row => {
      if (row.cells[columnIndex]) {
        row.cells[columnIndex].classList.add('selected');
      }
    });
    selectedColumn = columnIndex;
  }
});

// Remover seleção ao clicar fora
document.addEventListener('click', function(event) {
  if (!event.target.closest('table')) {
    clearColumnSelection();
    selectedColumn = null;
  }
});

function clearColumnSelection() {
  document.querySelectorAll('td, th').forEach(cell => {
    cell.classList.remove('selected');
  });
}

// Copiar coluna
function copySelectedColumn() {
  if (selectedColumn !== null) {
    const rows = document.querySelectorAll('tbody tr');
    const data = Array.from(rows).map(row => row.cells[selectedColumn]?.textContent || '');
    const text = data.join('\n');
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    alert('Coluna copiada para a área de transferência!');
  } else {
    alert('Selecione uma coluna para copiar!');
  }
}

// Limpar coluna
function clearSelectedColumn() {
  if (selectedColumn !== null) {
    saveHistory();
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
      if (row.cells[selectedColumn]) {
        row.cells[selectedColumn].textContent = '';
      }
    });
    saveTableToStorage();
  } else {
    alert('Selecione uma coluna para limpar!');
  }
}

// Limpar toda a tabela
function clearTable() {
  saveHistory();
  const cells = document.querySelectorAll('tbody td');
  cells.forEach(cell => cell.textContent = '');
  saveTableToStorage();
}

// Desfazer
document.getElementById('undoBtn').addEventListener('click', function() {
  if (history.length > 0) {
    const lastState = history.pop();
    const rows = document.querySelectorAll('tbody tr');
    lastState.forEach((rowData, i) => {
      if (!rows[i]) {
        const newRow = document.createElement('tr');
        for (let j = 0; j < 8; j++) {
          const td = document.createElement('td');
          newRow.appendChild(td);
        }
        document.querySelector('tbody').appendChild(newRow);
      }
      for (let j = 0; j < 8; j++) {
        rows[i].cells[j].textContent = rowData[j] || '';
      }
    });
    saveTableToStorage();
  }
});

function saveHistory() {
  const rows = document.querySelectorAll('tbody tr');
  const snapshot = Array.from(rows).map(row =>
    Array.from(row.cells).map(cell => cell.textContent)
  );
  history.push(snapshot);
}

// Colar dados
document.getElementById('table').addEventListener('paste', function(event) {
  event.preventDefault();
  const clipboard = event.clipboardData.getData('text/plain');
  const rowsData = clipboard.trim().split('\n').map(row => row.split('\t'));
  if (selectedColumn === null) {
    alert('Selecione uma coluna antes de colar os dados!');
    return;
  }

  saveHistory();
  const tableBody = document.querySelector('tbody');
  const existingRows = tableBody.rows;

  rowsData.forEach((row, i) => {
    if (!existingRows[i]) {
      const newRow = document.createElement('tr');
      for (let j = 0; j < 8; j++) {
        const td = document.createElement('td');
        newRow.appendChild(td);
      }
      tableBody.appendChild(newRow);
    }
    row.forEach((value, j) => {
      const colIndex = selectedColumn + j;
      if (colIndex < 8) {
        existingRows[i].cells[colIndex].textContent = value;
      }
    });
  });
  saveTableToStorage();
});

// Salvar no localStorage
function saveTableToStorage() {
  const rows = document.querySelectorAll('tbody tr');
  const data = Array.from(rows).map(row =>
    Array.from(row.cells).map(cell => cell.textContent)
  );
  localStorage.setItem('tabelaDados', JSON.stringify(data));
}

// Carregar do localStorage
function loadTableFromStorage() {
  const data = JSON.parse(localStorage.getItem('tabelaDados'));
  if (data && Array.isArray(data)) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // limpa antes de recriar
    data.forEach(rowData => {
      const row = document.createElement('tr');
      for (let i = 0; i < 8; i++) {
        const td = document.createElement('td');
        td.textContent = rowData[i] || '';
        row.appendChild(td);
      }
      tbody.appendChild(row);
    });
  }
}

// Salvar alterações ao digitar
document.getElementById('table').addEventListener('input', () => {
  saveTableToStorage();
});

// Carrega ao abrir a página
window.addEventListener('load', () => {
  loadTableFromStorage();
});
