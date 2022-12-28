//var langs = JSON.parse($('meta[name="langs"]').attr("content"));
//var csrf = $('meta[name="csrfToken"]').attr("content");

$(document).ready(async function () {
    if($("#usersTable").length > 0){
        $("#usersTable").DataTable().destroy();
        $.fn.dataTable.ext.errMode = 'none';
        var usersTable = $("#usersTable").DataTable({
            responsive: !0,
            pageLength: 250,
            dom: "<'row'<'col-sm-6 text-left'><'col-sm-6 text-right'B>>\n\t\t\t<'row'<'col-sm-12'tr>>\n\t\t\t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'p>>",

            ajax: {
                url: "/users/list",
                type: "POST",
                data: function (d) {
                    //d._csrf = csrf;
                },
                dataType: 'json',
                error: function (jqXHR, textStatus, errorThrown) {
                    // $('#errorText').show().find(".m-alert__text span").html(errorThrown);
                    swal.fire({
                        text: errorThrown,
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok",
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light-primary"
                        }
                    }).then(function () {
                    });
                    removeWaitProcess();
                },
                beforeSend: function () {
                    addWaitProcess();
                },
                complete: function () {
                    removeWaitProcess();
                },
                dataSrc: function (json) {
                    console.log("JSON : ", json);

                    if (typeof json.error != 'undefined' && json.error != "1") {

                        if (typeof json.response != 'undefined') {
                            return json.response;
                        } else {
                            return false;
                        }
                    }
                    else {

                        var errText = "unknown_error";

                        (typeof json.errorText != 'undefined') ? errText = json.errorText : null;

                        swal.fire({
                            text: errText,
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light-primary"
                            }
                        }).then(function () {
                        });
                        return false;
                    }
                }
            },
            initComplete: function (settings, json) {

            },
            buttons: [],
            paging: false,
            info: false,
            ordering: false,
            processing: false,
            columns: [
                {
                    data: null, width: "30%", "render": function (data, type, row) {
                        var html = "";
                        if (row.userName !== undefined) {
                            html = row.userName;
                        }

                        return html;
                    }
                },
                {
                    data: null, width: "20%", "render": function (data, type, row) {
                        var html = "";
                        if (row.email !== undefined) {
                            html = row.email;
                        }

                        return html;
                    }
                },
                {
                    data: null, width: "20%", "render": function (data, type, row) {
                        var html = "";
                        if (row.kredi !== undefined) {
                            html = row.kredi;
                        }

                        return html;
                    }
                },
                {
                    data: null, width: "20%", "render": function (data, type, row) {
                        var html = "";
                        html = "<button class='btn btn-danger btn-icon deleteUser' data-tooltip=\"tooltip\" title=\"Kullanıcıyı Sil\"><i class='fa fa-times'></i></button> "

                        return html;
                    }
                },
            ],
        });
        usersTable.on("click",".deleteUser",function(){
            var selected_row = $(this).parents('tr');
            var rowData = usersTable.row(selected_row).data();

            if(rowData === undefined) {
                if (selected_row.hasClass('child')) {
                    selected_row = selected_row.prev();
                }
                rowData = usersTable.row(selected_row).data();
            }

            Swal.fire({
                title:"Dikkat",
                text:rowData.userName+" adlı kullanıcıyı silmek istediğinize emin misiniz?",
                icon:"warning",
                confirmButtonText: 'Evet, eminim',
                cancelButtonText:"Hayır, değilim",
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    addWaitProcess();
                    $.post("/users/delete",{
                        id:rowData.id
                    },function(data,status){
                        if(data.error === "0"){
                            usersTable.ajax.reload();
                            removeWaitProcess();
                            swal.fire({
                                text: "İşlem başarıyla tamamlandı.",
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "Tamam",
                                customClass: {
                                    confirmButton: "btn font-weight-bold btn-light-primary"
                                }
                            });
                        }
                        else{
                            removeWaitProcess();
                            swal.fire({
                                text: data.errorText,
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Tamam",
                                customClass: {
                                    confirmButton: "btn font-weight-bold btn-light-primary"
                                }
                            });
                        }
                    })
                }
            })

        })
    }
});
