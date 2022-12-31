$(document).ready(async function () {
    console.log("init")
    if($("#reportsTable").length > 0){
        console.log("message packet found");
        $("#reportsTable").DataTable().destroy();
        $.fn.dataTable.ext.errMode = 'none';
        var reportsTable = $("#reportsTable").DataTable({
            responsive: !0,
            pageLength: 250,
            dom: "<'row'<'col-sm-6 text-left'><'col-sm-6 text-right'B>>\n\t\t\t<'row'<'col-sm-12'tr>>\n\t\t\t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'p>>",
            ajax: {
                url: "/reports/list",
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
                    data: null, width: "40%", "render": function (data, type, row) {
                        var html = "";
                        if (row.reason !== undefined) {
                            html = row.reason
                        }

                        return html;
                    }
                },
                {
                    data: null, width: "30%", "render": function (data, type, row) {
                        var html = "";
                        if (row.reporterUserName !== undefined) {
                            html = row.reporterUserName;
                        }

                        return html;
                    }
                },
                {
                    data: null, width: "30%", "render": function (data, type, row) {
                        var html = "";
                        if (row.reportedUserName !== undefined) {
                            html = row.reportedUserName;
                        }

                        return html;
                    }
                }
            ],
        });
    }
})