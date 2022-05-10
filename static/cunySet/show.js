let fileInfo;
let tab_content_obj;
let fileList = [];
// 页面渲染完毕以后，弹出提示框，开始请求数据
$(document).ready(function () {
    // console.log(document.getElementById("navTabs").childElementCount)
    tab_content_obj = document.getElementById("navTabs-content");
    findFile("文件加载成功");
});

function findFile(note){
    $.ajax({
        url:"/cunyTransfer/findFile",
        type: 'GET',
        timeout : 3000,  // 设置超时时间为3秒
        success: function (retData) {
            fileInfo = retData;  // 获得fileInfo的数据
            // console.log(fileInfo)
            fileList = [];
            for (let i=0; i<fileInfo.length; i++){
                fileList.push(fileInfo[i]);
            }
            if (note !== undefined){
                success_note(note);
            }
        },
        error : function(){
            error_note("尺寸加载失败，请检查网络连接.")
        },
        complete:function(){
            // 开始画前端的展示ui
            RenderAllFiles();
        }
    })
}

// 根据当前的fileList，绘制ui
function RenderAllFiles() {
    let tbody = document.getElementById("tableBody");
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    for (let i = 0; i < fileList.length; i++) {
        DrawFile(fileList[i]);
    }
}

// 添加数据
function DrawFile(file_info){
    let NewOrderHTML=`
            <tr>
                <td class="text-center">${file_info.file_id}</td>
                <td class="text-center">${file_info.file_name}</td>
                <td class="text-center">${file_info.file_format}</td>
                <td class="text-center">${file_info.file_size}</td>
                <td class="text-center">
                    <div class="text-center">
                        <a type="button" data-bs-toggle="modal" data-bs-target="#deleteSizeCheck1" class="ms-sm-2" style="width: 22px;height: 22px" onclick="deleteFile('${file_info.file_name}')">
                            <i class='bx bxs-trash text-dark' style="font-size:18px"></i>
                        </a>
                        <a type="button" class="ms-sm-2" onclick="downloadFile('${file_info.file_name}')">
                            <i class='bx bx-target-lock text-dark' style="font-size:18px"></i>
                        </a>
                    </div>
                </td>
            </tr>
        `;
    let dummy = document.createElement("tr");
    dummy.innerHTML = NewOrderHTML;
    document.getElementById("tableBody").appendChild(dummy);
}

//获取文件
function downloadFile(file_name){
    let input_ = $('<input>');
    input_.attr('type', 'hidden');
    input_.attr('name', 'file_name');
    input_.attr('value', file_name);
    $.ajax({
        url: "/cunyTransfer/downloadFile",
        type: "post",
        data: {"file_name":file_name},
        success: function(response, status, request) {
                let disp = request.getResponseHeader('Content-Disposition');
                if (disp && disp.search('attachment') !== -1) { //判断是否为文件
                    let form = $('<form action="/cunyTransfer/downloadFile" method="post"></form>');
                    $('body').append(form);
                    form.append(input_)
                    form.submit(); //自动提交
                }
            }
    })
}

// 删除文件，告诉后端把文件删了，删除完毕以后再次运行findFile函数
function deleteFile(file_name){
    $.ajax({
        url:"/cunyTransfer/deleteFile",
        type: 'GET',
        data: {"file_name":file_name},
        timeout : 3000,  // 设置超时时间为3秒
        success: function () {
            success_note("删除成功");
        },
        error : function(){
            error_note("文件删除失败，请检查网络连接.")
        },
        complete:function(){
            // 开始画前端的展示ui
            findFile()
        }
    })
}

// 上传文件到后端
function uploadFile(){
    // const _this=this;
    const input=document.createElement("input");
    input.setAttribute("id","upFile");
    input.setAttribute("type","file");
    input.setAttribute("accept", "*");
    input.setAttribute("name","file");
    input.click();
    input.onchange=function (){
    	let formData=new FormData();
        // let fileData = this.files;
        var fileData = input.files[0];
        formData.append("file", fileData);
        $.ajax({
            url: '/cunyTransfer/getFile',
            type: 'POST',
            async: false,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function () {
                success_note("文件上传成功")
                findFile()
            }
        });
    };
    input.remove();
}

// 错误弹窗
function error_note(note) {
    Lobibox.notify('error', {
        pauseDelayOnHover: true,
        size: 'mini',
        rounded: true,
        delayIndicator: false,
        icon: 'bx bx-x-circle',
        continueDelayOnInactiveTab: false,
        position: 'top right',
        msg: note,
        sound:false
    });
}

// 通知弹窗
function info_note(note) {
	Lobibox.notify('info', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        size: 'mini',
        delayToRemove:1,
        delay:2000,
        rounded: true,
        position: 'top right',
		icon: 'bx bx-info-circle',
		msg: note,
        sound: false
	});
}

// 处理成功弹窗
function success_note(note) {
    Lobibox.notify('success', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        size: 'mini',
        rounded: true,
        delay:4000,
        position: 'top right',
        icon: 'bx bx-check-circle',
        msg: note,
        // soundPath:"/",
        sound:false
    });
}

// 警告弹窗
function warning_note(note) {
	Lobibox.notify('warning', {
        pauseDelayOnHover: true,
        continueDelayOnInactiveTab: false,
        size: 'mini',
        rounded: true,
        position: 'top right',
		icon: 'bx bx-error',
		msg: note,
        sound: false
	});
}