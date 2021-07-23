﻿var dataTable;

$(document).ready(function () {
    var url = window.location.search;
    if (url.includes("inprocess")) {
        loadDataTable("GetOrderList?status=inprocess");
    }
    else {
        if (url.includes("pending")) {
            loadDataTable("GetOrderList?status=pending");
        }
        else {
            if (url.includes("completed")) {
                loadDataTable("GetOrderList?status=completed");
            }
            else {
                if (url.includes("rejected")) {
                    loadDataTable("GetOrderList?status=rejected");
                }
                else {
                    if (url.includes("approved")) {
                        loadDataTable("GetOrderList?status=approved");
                    }
                    else {
                        loadDataTable("GetOrderList?status=all");
                    }                                        
                }
            }
        }
    }
    
});

function loadDataTable(url) {
    //Nunca esquecer a caralha do #
    dataTable = $('#tblData').dataTable({  
        "ajax": {
            "url": "/Admin/order/" + url

        },
        "columns": [
            { "data": "id", "width": "10%" },
            { "data": "name", "width": "15%" },
            { "data": "phoneNumber", "width": "15%" },
            { "data": "applicationUser.email", "width": "15%" },
            { "data": "orderStatus", "width": "15%" },
            { "data": "orderTotal", "width": "15%" },
            {
                "data": "id",
                "render": function (data) {
                    return `
                        <div class="text-center">
                            <a href="/Admin/Order/Details/${data}" class="btn btn-success text-white" style="cursor:pointer">
                                <i class="fas fa-edit"></i>
                            </a>                            
                        </div>
                        `;
                }, "width": "5%"
            }
        ]

    });
}

