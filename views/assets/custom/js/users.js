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
                icon:"question",
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
        $(document).on("submit",'form[name="createBotAccount"]',function(){
            $("#createBotAccountModal").hide();
            $(".modal-backdrop").remove();
            var $data = new FormData(this);
            addWaitProcess();
            $.ajax({
                url: "/users/createBot",
                data: $data,
                contentType: false,
                processData: false,
                type: "POST",
                success: function (data) {
                    removeWaitProcess();
                    if(data.error === "0"){
                        usersTable.ajax.reload();
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
                }
            });
        })
    }
    if($("#messageListTable").length > 0){
        $("#messageListTable").DataTable().destroy();
        $.fn.dataTable.ext.errMode = 'none';
        var messageListTable = $("#messageListTable").DataTable({
            responsive: !0,
            pageLength: 250,
            dom: "<'row'<'col-sm-6 text-left'><'col-sm-6 text-right'B>>\n\t\t\t<'row'<'col-sm-12'tr>>\n\t\t\t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'p>>",

            ajax: {
                url: "/users/messageList",
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
                        if (row.sender !== undefined) {
                            html = row.sender;
                        }

                        return html;
                    }
                },
                {
                    data: null, width: "20%", "render": function (data, type, row) {
                        var html = "";
                        if (row.receiver !== undefined) {
                            html = row.receiver;
                        }

                        return html;
                    }
                },
                {
                    data: null, width: "20%", "render": function (data, type, row) {
                        var html = "";
                        if (row["last-message"] !== undefined) {
                            html = row["last-message"];
                        }

                        return html;
                    }
                },
                {
                    data: null, width: "20%", "render": function (data, type, row) {
                        var html = "";
                        if(row["last-time"] !== undefined){
                            let date = toDateTime(row["last-time"]._seconds);
                            date = date.toISOString();
                            html = moment(isoDateToHuman(date)).format('DD/MM/YYYY HH:mm');
                        }

                        return html;
                    }
                },
                {
                    data: null, width: "20%", "render": function (data, type, row) {
                        var html = "";
                        if(row.bot === true){
                            html += "<a href='/users/messages/"+row.docId+"/"+row.user[0]+"/"+row.receiver+"' class='btn btn-info btn-icon' data-tooltip=\"tooltip\" title=\"Kullanıcı Mesajlarını Görüntüle\"><i class='fa fa-eye'></i></a> "
                        }
                        return html;
                    }
                },
            ],
        });
    }

    if($("#myUserId").length  > 0){
        showMessageList($("#docId").val(),$("#receiverName").val());
    }
});


function showMessageList(docId,username){
    var myUserId = $("#myUserId").val();
    $("#docId").val(docId);
    addWaitProcess();
    $.post("/users/messages/"+docId,{
        docId:docId
    },
        function(data,status){
        if(data.error === "0"){
            removeWaitProcess();
            var chat = "";
            for(let i=0;i<data.response.length;i++){
                let myClass="align-items-start";
                let bg = "bg-light";
                let showedName = username;
                let message = "";
                if(data.response[i].text !== undefined){
                    message = data.response[i].text;
                }
                if(data.response[i].id === myUserId){
                    myClass="align-items-end";
                    bg = "bg-light-success";
                    showedName = "";
                }
                let date = "";
                if(data.response[i].time !== undefined){
                    date = toDateTime(data.response[i].time._seconds);
                    date = date.toISOString();
                    date = moment(isoDateToHuman(date)).format('DD/MM/YYYY HH:mm');
                }

                chat += "<div class=\"d-flex flex-column mb-5 "+myClass+"\">\n" +
                    "<div class=\"d-flex align-items-center\">\n" +
                    "<div>\n" +
                    "<a href=\"#\" class=\"text-dark-75 text-hover-primary font-weight-bold font-size-h6\">" + showedName + "</a>\n" +
                    "<span class=\"text-muted font-size-sm\">" + date + "</span>" +
                    "</div>\n" +
                    "</div>\n";
                chat += "<div class=\"mt-2 rounded p-5 "+bg+" text-dark-50 font-weight-bold font-size-lg text-left max-w-400px\">" + message + "</div>\n";
                chat += "</div>";
            }
            $(".messages").html(chat);
            $("#userNameArea").html(username)
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

function sendMessage(){
    let message = $("#messageInput").val();
    let docId = $("#docId").val();
    let myUserId = $("#myUserId").val();
    let controller = 0;
    if(docId === undefined || docId === "" || docId === null){
        swal.fire({
            text: "Mesaj yollamak istediğiniz kişiyi seçmelisiniz",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Tamam",
            customClass: {
                confirmButton: "btn font-weight-bold btn-light-primary"
            }
        });
        controller++;
    }
    if(message === undefined || message === "" || message === null){
        swal.fire({
            text: "Boş mesaj gönderemezsiniz!",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Tamam",
            customClass: {
                confirmButton: "btn font-weight-bold btn-light-primary"
            }
        });
        controller++;
    }
    if(controller === 0){
        addWaitProcess();
        $.post("/users/sendMessage",{
                docId:docId,
                message:message,
                myUserId:myUserId
            },
            function(data,status){
                if(data.error === "0"){
                    removeWaitProcess();
                    $("#messageInput").val("");
                    showMessageList(docId,"-");
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

}

function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}