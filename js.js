document.getElementById('chooseImageButton').addEventListener('click', function() {
    document.getElementById('imageInput').click();
});

document.getElementById('imageInput').addEventListener('change', function(event) {
    const files = event.target.files;
    if (files.length > 0) {
        compressAndOpenInNewTab(files);
    }
});

function compressAndOpenInNewTab(files) {
    const promises = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        promises.push(compressAndOpenImageInNewTab(file));
    }
    Promise.all(promises);
}

function compressAndOpenImageInNewTab(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Устанавливаем максимальные размеры изображения
                const maxWidth = 800;
                const maxHeight = 600;

                let width = img.width;
                let height = img.height;

                // Проверяем, нужно ли изменять размер изображения
                if (width > maxWidth || height > maxHeight) {
                    // Уменьшаем размер изображения, сохраняя пропорции
                    const aspectRatio = width / height;
                    if (width > height) {
                        width = maxWidth;
                        height = width / aspectRatio;
                    } else {
                        height = maxHeight;
                        width = height * aspectRatio;
                    }
                }

                // Устанавливаем размеры холста для нового измененного размера изображения
                canvas.width = width;
                canvas.height = height;

                // Очищаем холст
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Рисуем изображение на холсте с новыми размерами
                ctx.drawImage(img, 0, 0, width, height);

                // Получаем Blob изображения
                canvas.toBlob(function(blob) {
                    const url = URL.createObjectURL(blob);
                    const newTab = window.open(url, '_blank');
                    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
                        alert('Пожалуйста, разрешите всплывающие окна для этого сайта');
                    }
                    resolve();
                }, file.type);
            }
        };
        reader.readAsDataURL(file);
    });
}
