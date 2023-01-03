$(document).ready(async function () {
    console.log("init")
    if($("#botMessageListTable").length > 0){
        console.log("message packet found");
        $("#botMessageListTable").DataTable().destroy();
        $.fn.dataTable.ext.errMode = 'none';
        var botMessageListTable = $("#botMessageListTable").DataTable({
            responsive: !0,
            pageLength: 250,
            dom: "<'row'<'col-sm-6 text-left'><'col-sm-6 text-right'B>>\n\t\t\t<'row'<'col-sm-12'tr>>\n\t\t\t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'p>>",
            ajax: {
                url: "/messages/list",
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
                    } else {

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
                    data: null, width: "80%", "render": function (data, type, row) {
                        var html = "";
                        if (row.message !== undefined) {
                            html = row.message
                        }

                        return html;
                    }
                },
                {
                    data: null, width: "20%", "render": function (data, type, row) {
                        var html = "";
                        html = "<button class='btn btn-danger btn-icon deleteMessage' data-tooltip=\"tooltip\" title=\"Mesajı Sil\"><i class='fa fa-times'></i></button> "
                        +"<button class='btn btn-warning btn-icon updateMessage' data-tooltip=\"tooltip\" title=\"Mesajı Güncelle\"><i class='fa fa-edit'></i></button> "

                        return html;
                    }
                }
            ],
        });
        botMessageListTable.on("click",".deleteMessage",function(){
            var selected_row = $(this).parents('tr');
            var rowData = botMessageListTable.row(selected_row).data();

            if(rowData === undefined) {
                if (selected_row.hasClass('child')) {
                    selected_row = selected_row.prev();
                }
                rowData = botMessageListTable.row(selected_row).data();
            }

            Swal.fire({
                title:"Silmek istediğinize emin misiniz",
                text:"Mesajınız: "+rowData.message,
                icon:"question",
                confirmButtonText: 'Evet, eminim',
                cancelButtonText:"Hayır, değilim",
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    addWaitProcess();
                    $.post("/messages/delete",{
                        docId:rowData.docId
                    },function(data,status){
                        if(data.error === "0"){
                            botMessageListTable.ajax.reload();
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
        botMessageListTable.on("click",".updateMessage",async function(){
            var selected_row = $(this).parents('tr');
            var rowData = botMessageListTable.row(selected_row).data();

            if(rowData === undefined) {
                if (selected_row.hasClass('child')) {
                    selected_row = selected_row.prev();
                }
                rowData = botMessageListTable.row(selected_row).data();
            }

            const { value: message } = await Swal.fire({
                title: 'Mesajınızı giriniz',
                input: 'text',
                inputValue:rowData.message,
                inputLabel: 'Mesajınız',
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Boş bırakamazsınız!'
                    }
                }
            })

            if(message){
                $.post("/messages/update",{
                    message:message,
                    docId:rowData.docId
                },function(data,status){
                    if(data.error === "0"){
                        botMessageListTable.ajax.reload();
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
        $("#addMessageBtn").on("click",async function (){
            const { value: message } = await Swal.fire({
                title: 'Mesajınızı giriniz',
                input: 'text',
                inputLabel: 'Mesajınız',
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Boş bırakamazsınız!'
                    }
                }
            })
            if(message){
                $.post("/messages/add",{
                    message:message
                },function(data,status){
                    if(data.error === "0"){
                        botMessageListTable.ajax.reload();
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
    }


    // input: 'text',
    //     inputAttributes: {
    //     autocapitalize: 'off'
    // },
})