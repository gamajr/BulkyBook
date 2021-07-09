
var dataTable;

$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {
    //Nunca esquecer a caralha do #
    dataTable = $('#tblData').dataTable({  
        "ajax": {
            "url": "/Admin/Company/GetAll",
            "datatype": "JSON"

        },
        "columns": [
            { "data": "name", "width": "15%" },                  
            { "data": "streetAddress", "width": "14%" },
            { "data": "city", "width": "10%" },            
            { "data": "state", "width": "10%" },
            { "data": "postalCode", "width": "13%" },
            { "data": "phoneNumber", "width": "13%" },
            { "data": "isAuthorizedCompany", 
                "render": function (data) {
                    if (data) {
                        return `<input type="checkbox" disabled checked />`
                    }
                    else {
                        return `<input type="checkbox" disabled />`
                    }
                },
                "width": "10%"
            },
            {
                "data": "id",
                "render": function (data) {
                    return `
                        <div class="text-center">
                            <a href="/Admin/Company/Upsert/${data}" class="btn btn-success text-white" style="cursor:pointer">
                                <i class="far fa-edit"></i>
                            </a>
                            <a onclick=Delete("/Admin/Company/Delete/${data}") class="btn btn-danger text-white" style="cursor:pointer">
                                <i class="far fa-trash-alt"></i>
                            </a>
                        </div>
                        `;
                }, "width": "25%"
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