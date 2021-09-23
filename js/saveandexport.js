const saveTemplateAsFile = (filename, dataObjToWrite) => {
    const blob = new Blob([JSON.stringify(dataObjToWrite)], {
        type: "text/json"
    });
    const link = document.createElement("a");

    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    link.dispatchEvent(evt);
    link.remove();

};

const items = {
    ...localStorage
};

var input = document.createElement('input');
input.type = 'file';
input.accept = 'application/json';

input.onchange = function(e) {
    var ext = this.value.match(/\.([^.]+)$/)[1];
    switch (ext) {
        case 'json':
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = readerEvent => {
                var content = readerEvent.target.result;
                try {
                    JSON.parse(content);
                    } catch (e) {
                        $('#importFailedModal').modal('show');
                    }
                var data = JSON.parse(content);
                    Object.keys(data).forEach(function(k) {
                    localStorage.setItem(k, data[k]);
                });
                $('#importModal').modal('show');
            }
            break;
        default:
            $('#importFailedModal').modal('show');
            this.value = '';
    }
}