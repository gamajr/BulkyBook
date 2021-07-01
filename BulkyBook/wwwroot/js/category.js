var dataTable;

$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {
    //Nunca esquecer a caralha do #
    dataTable = $('#tblData').dataTable({  
        "ajax": {
            "url": "/Admin/Category/GetAll"

        },
        "columns": [
            { "data": "name", "width": "60%" },
            {
                "data": "id",
                "render": function (data) {
                    return `
                        <div class="text-center">
                            <a href="/Admin/Category/Upsert/${data}" class="btn btn-success text-white" style="cursor:pointer">
                                <i class="far fa-edit"></i>
                            </a>
                            <a class="btn btn-danger text-white" style="cursor:pointer">
                                <i class="far fa-trash-alt"></i>
                            </a>
                        </div>
                        `;
                }, "width": "40%"
            }
        ]

    });
}