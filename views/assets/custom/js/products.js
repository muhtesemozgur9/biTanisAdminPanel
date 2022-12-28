$(document).ready(async function () {
    console.log("init")
    if($("#productsTable").length > 0){
        console.log("message packet found");
        $("#productsTable").DataTable().destroy();
        $.fn.dataTable.ext.errMode = 'none';
        var productsTable = $("#productsTable").DataTable({
            responsive: !0,
            pageLength: 250,
            dom: "<'row'<'col-sm-6 text-left'><'col-sm-6 text-right'B>>\n\t\t\t<'row'<'col-sm-12'tr>>\n\t\t\t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager'p>>",
            ajax: {
                url: "/products/list",
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
                    data: null, width: "30%", "render": function (data, type, row) {
                        var html = "";
                        if (row.foreign !== undefined) {
                            html = (row.foreign == true ? "Yabancılara Göster" : "Türklere Göster");
                        }

                        return html;
                    }
                },
                {
                    data: null, width: "50%", "render": function (data, type, row) {
                        var html = "";
                        if (row.productID !== undefined) {
                            html = row.productID;
                        }

                        return html;
                    }
                },
                {
                    data: null, width: "20%", "render": function (data, type, row) {
                        var html = "";
                        html = "<button class='btn btn-warning btn-icon updateProduct' data-toggle=\"modal\" data-target=\"#updateProduct\" data-tooltip=\"tooltip\" title=\"Paketi Düzenle\"><i class='fa fa-edit'></i></button> "

                        return html;
                    }
                }
            ],
        });
        productsTable.on("click",".updateProduct",function(){
            var selected_row = $(this).parents('tr');
            var rowData = productsTable.row(selected_row).data();

            if(rowData === undefined) {
                if (selected_row.hasClass('child')) {
                    selected_row = selected_row.prev();
                }
                rowData = productsTable.row(selected_row).data();
            }
            //console.log("rowData =>",rowData);
            $("#updateProductID").val(rowData.productID);
            $("#docId").val(rowData.docId);
            $("#updateForeign").val((rowData.foreign === true ? 'foreign':'turks'));
        })
        //updateProductForm
        $(document).on("submit",'form[name="updateProductForm"]',function(){
            $("#updateProduct").hide();
            $(".modal-backdrop").remove();
            var $data = new FormData(this);
            addWaitProcess();
            $.ajax({
                url: "/products/update",
                data: $data,
                contentType: false,
                processData: false,
                type: "POST",
                success: function (data) {
                    removeWaitProcess();
                    if(data.error === "0"){
                        productsTable.ajax.reload();
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
        $(document).on("submit",'form[name="addProductForm"]',function(){
            $("#addProduct").hide();
            $(".modal-backdrop").remove();
            var $data = new FormData(this);
            addWaitProcess();
            $.ajax({
                url: "/products/add",
                data: $data,
                contentType: false,
                processData: false,
                type: "POST",
                success: function (data) {
                    removeWaitProcess();
                    if(data.error === "0"){
                        productsTable.ajax.reload();
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
})