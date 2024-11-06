let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let scale = 1.5;
let pdfCanvas = document.getElementById('pdf-canvas');
let ctx = pdfCanvas.getContext('2d');

// Elementos de control
const fileUpload = document.getElementById('file-upload');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const clearBtn = document.getElementById('clearBtn');

// Manejar la carga de archivo PDF
fileUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
            const loadingTask = pdfjsLib.getDocument({ data: e.target.result });
            loadingTask.promise.then((pdf) => {
                pdfDoc = pdf;
                totalPages = pdf.numPages;
                currentPage = 1;
                renderPage(currentPage);
            }).catch((err) => {
                alert('Error al cargar el PDF: ' + err.message);
            });
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert('Por favor, cargue un archivo PDF.');
    }
});

// Función para renderizar una página del PDF en el canvas
function renderPage(pageNum) {
    pdfDoc.getPage(pageNum).then((page) => {
        const viewport = page.getViewport({ scale: scale });
        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        page.render(renderContext);
    });
}

// Navegar entre las páginas del PDF
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
    }
});

// Limpiar el canvas y el archivo cargado
clearBtn.addEventListener('click', () => {
    // Limpiar el canvas
    ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
    // Limpiar el input de archivo
    fileUpload.value = '';
    // Resetear variables
    pdfDoc = null;
    currentPage = 1;
    totalPages = 0;
});
