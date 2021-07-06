
var dataTable;

$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {
    //Nunca esquecer a caralha do #
    dataTable = $('#tblData').dataTable({  
        "ajax": {
            "url": "/Admin/Product/GetAll"

        },
        "columns": [
            { "data": "title", "width": "15%" },
            { "data": "isbn", "width": "15%" },
            { "data": "price", "width": "15%" },
            { "data": "author", "width": "15%" },
            { "data": "category.name", "width": "15%" },
            {
                "data": "id",
                "render": function (data) {
                    return `
                        <div class="text-center">
                            <a href="/Admin/Product/Upsert/${data}" class="btn btn-success text-white" style="cursor:pointer">
                                <i class="far fa-edit"></i>
                            </a>
                            <a onclick=Delete("/Admin/Product/Delete/${data}") class="btn btn-danger text-white" style="cursor:pointer">
                                <i class="far fa-trash-alt"></i>
                            </a>
                        </div>
                        `;
                }, "width": "40%"
            }
        ]

    });
}

function Delete(url) {
    swal({
        title: "Are you sure you want to delete?",
        text: "You will not able to restore the data!",
        icon: "warning",
        buttons: true,
        dangerMode: true
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({
                type: "DELETE",
                url: url,
                success: function (data) {
                    if (data.success) {
                        $('#tblData').DataTable().ajax.reload();
                        //No curso consta como table.ajax.reload() mas não funciona.
                        toastr.success(data.message);
                    }
                    else {
                        toastr.error(data.message);
                    }
                }
            })
        }
    });
}