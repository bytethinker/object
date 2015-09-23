//
Array.prototype.remove = function (aItem) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == aItem) {
            this.splice(i, 1);
        }
    }
}
Array.prototype.pushone = function (aItem) {
    var contained = false;
    for (var i = 0; i < this.length; i++) {
        if (this[i] == aItem) {
            this.splice(i, 1);
            contained = true;
        }
    }
    if (!contained) {
        this.push(aItem);
    }
}
String.prototype.TrimStr = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
function checkDateFormat(aDateStr) {
    var a = /^(\d{1,4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/igm;
    if (a.exec(aDateStr.TrimStr())) {
        return true
    }
    else
        return false
}
//
var userAgent = navigator.userAgent.toLowerCase();
var is_opera = userAgent.indexOf('opera') != -1 && opera.version();
var is_moz = (navigator.product == 'Gecko') && userAgent.substr(userAgent.indexOf('firefox') + 8, 3);
var is_ie = (userAgent.indexOf('msie') != -1 && !is_opera) && userAgent.substr(userAgent.indexOf('msie') + 5, 3);
var is_kon = userAgent.indexOf('konqueror') != -1;
var is_saf = userAgent.indexOf('applewebkit') != -1 || navigator.vendor == 'Apple Computer, Inc.';
var is_mac = userAgent.indexOf('mac') != -1;

//代替document.getElementById() 
function HT$(objID) {
    return document.getElementById(objID);
}
/**********************************************************************************/
/****************************导航条************************************************/
/**********************************************************************************/

var currentid = 0;

$(function () {
    onhtpage_load();
    $(".titleblockmouseout").not($("[id*='titleblock-']")).mouseover(function () {
        var id = $(this).attr("id");

        if (currentid != id) {
            $("#" + id).removeClass("titleblockmouseout").addClass("titleblockmouseon");
            $("#" + id + ">a").css("color", "Black");
            $("#" + id + "_content").removeClass("contentblockinvisible").addClass("contentblockvisible");
            $("#titleblockdefault_content").css("display", "none");
            currentid = id;
        }
    }).mouseout(function () {
        var id = $(this).attr("id");

        $("#" + id).removeClass("titleblockmouseon").addClass("titleblockmouseout");
        $("#" + id + ">a").css("color", "White");
        $("#" + id + "_content").removeClass("contentblockvisible").addClass("contentblockinvisible");
        $("#titleblockdefault_content").css("display", "block");
        currentid = 0;
    });

    $(".contentblockinvisible").mouseover(function () {
        $("#" + $(this).attr("id").substring(0, 11)).attr("className", "titleblockmouseon");
        $("#" + $(this).attr("id").substring(0, 11) + ">a").css("color", "Black");
        $(this).attr("className", "contentblockvisible");
        $("#titleblockdefault_content").css("display", "none");

    }).mouseout(function () {
        $("#" + $(this).attr("id").substring(0, 11)).attr("className", "titleblockmouseout");
        $("#" + $(this).attr("id").substring(0, 11) + ">a").css("color", "White");
        $(this).attr("className", "contentblockinvisible");
        $("#titleblockdefault_content").css("display", "block");

    });
    checkSearchSource();
    //
    if (document.getElementById("shareId")) {//如果存在分享按钮
        //if (typeof (shareId) != "undefined")
        //var div = "<div id='ckepop'> 分享 <a class='jiathis_button_qzone'></a><a class='jiathis_button_tsina'></a><a class='jiathis_button_tqq'></a><a class='jiathis_button_renren'></a><a class='jiathis_button_kaixin001'></a><a class='jiathis_button_douban'></a><a href='http://www.jiathis.com/share' class='jiathis jiathis_txt jtico jtico_jiathis' target='_blank'></a><a class='jiathis_counter_style'></a></div>";
        var div = "<div id='ckepop'> <span class='jiathis_txt' style='font-size:14px;font-weight:bold'>分享&nbsp;</span><a class='jiathis_button_tsina'></a><a class='jiathis_button_tqq'></a><a class='jiathis_button_renren'></a><a class='jiathis_button_qzone'></a><a class='jiathis_button_kaixin001'></a><a class='jiathis_button_douban'></a><a href='http://www.jiathis.com/share' class='jiathis jiathis_txt jtico jtico_jiathis' target='_blank'></a></div>";
        document.getElementById("shareId").innerHTML = div;

        var shareTitle = $("#ckepop").parent().attr("sharetitle");
        var sharelink = $("#ckepop").parent().attr("sharelink");
        var sharepic = $("#ckepop").parent().attr("sharepic");
        var sconfig = document.createElement('script');
        sconfig.type = 'text/javascript';
        sconfig.async = true;
        // pic:"自定义分享的图片连接地址",
        sconfig.text = "var jiathis_config = {url: '" + sharelink + "',title: '" + shareTitle + "',pic:'" + sharepic + "'}";
        var firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(sconfig, firstScript);

        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'http://v2.jiathis.com/code/jia.js';
        var firstScript1 = document.getElementsByTagName('script')[0];
        firstScript1.parentNode.insertBefore(s, firstScript1);

    }

});
/********************* 导航条结束********************************************/


//仿造treeview插件的写法
(function ($) {
    var isfoucs = 0;

    var Template;

    var defaults = {
        position: "right",
        css: {
            backgroundColor: "#FFFFE5",
            border: "solid 1px #F79502",
            padding: "2px 5px 2px 5px",
            fontSize: "12px",
            margin: "2px"
        },
        msg: "your input is error!",
        offset: { left: 0, top: 0 }
    };

    $.extend($.fn, {

        showHtip: function (p, css, msg, Offset, nofocus) {
            var hasmsgdiv = $(this).attr("alt");
            if (hasmsgdiv != 1) {

                var p = p || defaults.position;
                var css = css || defaults.css;
                var msg = msg || defaults.msg;
                var offset = Offset || defaults.offset;
                var OffsetL = offset.left;
                var OffsetT = offset.top;

                var divTemp = document.createElement("DIV");
                //继承默认css
                $(divTemp).css(defaults.css);
                $(divTemp).css(css)
                    .attr("id", this.attr("id") + "_HToolTip")
                    .html(msg)
                    .css("position", "absolute")
                    .css("zIndex", "2999");

                var offset = this.offset();
                if (this.parent().css("position") == "relative") {
                    offset = { left: 0, top: 0 };
                }
                if (p == "bottom") {
                    $(divTemp).css("left", OffsetL + offset.left + "px");
                    $(divTemp).css("top", OffsetT + offset.top + this.height() + "px");
                }

                if (p == "right") {
                    $(divTemp).css("left", OffsetL + offset.left + this.width() + "px");
                    $(divTemp).css("top", OffsetT + offset.top + "px");
                }

                this.before(divTemp);
                $(this).attr("alt", 1);
                //drag(divTemp);
            }
            if (!nofocus && isfoucs == 0) {
                this.focus();
                isfoucs = 1;
            }

            return divTemp;
        },

        removeHtip: function () {
            if ($(this).attr("alt") == 1) {
                $("#" + this.attr("id") + "_HToolTip").remove();
                $(this).attr("alt", 0);
                if (isfoucs == 1) {
                    isfoucs = 0;
                }
            }
        },

        showHtipEx: function (p, msg, Offset) {

            var divhtml = Template;
            divhtml = divhtml.replace("$msg", msg);
            $(this).showHtip(p, {}, divhtml, Offset);
        }
    });

    $.extend($, {
        //加载模板
        loadHtipExTemplate: function (template) {
            Template = template;
        }
    });

})(jQuery);

//div拖拽
function drag(o) {
    o.onmousedown = function (a) {

        var d = document; if (!a) a = window.event;
        var x = a.layerX ? a.layerX : a.offsetX, y = a.layerY ? a.layerY : a.offsetY;

        if (o.setCapture)
            o.setCapture();
        else if (window.captureEvents)
            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);

        d.onmousemove = function (a) {
            if (!a) a = window.event;
            if (!a.pageX) a.pageX = a.clientX;
            if (!a.pageY) a.pageY = a.clientY;
            var tx = a.pageX - x, ty = a.pageY - y;
            o.style.left = tx;
            o.style.top = ty;
        };

        d.onmouseup = function () {
            if (o.releaseCapture)
                o.releaseCapture();
            else if (window.captureEvents)
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            d.onmousemove = null;
            d.onmouseup = null;
        };

    };

}

// -- Functions --
function GetFlash(id, playerfile, flashvers, width, height, NotTransparent) {
    if (playerfile.toLowerCase().indexOf("HjPlayer.swf") != -1) {
        NotTransparent = true;
    }
    if (NotTransparent == true) {
        NotTransparent = "window";
    } else {
        NotTransparent = "transparent";
    }
    var str = "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0'";
    str += "width='" + width + "' height='" + height + "' id='" + id + "' align='middle' >";
    str += "<param name='allowScriptAccess' value='always' />";
    str += "<param name='movie' value='" + playerfile + "' />";
    str += "<param name='quality' value='high' />";
    str += "<param name='scale' value='noScale' />";
    str += "<param name='align' value='tl' />";
    str += "<param name='allowFullScreen' value='true' />";
    str += "<param name='wmode' value='" + NotTransparent + "' />";
    str += "<param name='flashvars' value='" + flashvers + "' />";
    str += "<embed src='" + playerfile + "' quality='high' wmode='" + NotTransparent + "' scale='noScale' bgcolor='#ffffff' width='" + width + "' height='" + height + "' flashvars='" + flashvers + "' name='" + id + "' align='middle' allowScriptAccess='always' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer'/>";
    str += "</object>";
    document.write(str);
}
function GetFlashCode(id, playerfile, flashvers, width, height, NotTransparent) {
    if (playerfile.toLowerCase().indexOf("HjPlayer.swf") != -1) {
        NotTransparent = true;
    }
    if (NotTransparent == true) {
        NotTransparent = "window";
    } else {
        NotTransparent = "transparent";
    }
    var str = "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0'";
    str += "width='" + width + "' height='" + height + "' id='" + id + "' align='middle' >";
    str += "<param name='allowScriptAccess' value='always' />";
    str += "<param name='movie' value='" + playerfile + "' />";
    str += "<param name='quality' value='high' />";
    str += "<param name='scale' value='noScale' />";
    str += "<param name='align' value='tl' />";
    str += "<param name='allowFullScreen' value='true' />";
    str += "<param name='wmode' value='" + NotTransparent + "' />";
    str += "<param name='flashvars' value='" + flashvers + "' />";
    str += "<embed src='" + playerfile + "' quality='high' wmode='" + NotTransparent + "' scale='noScale' bgcolor='#ffffff' width='" + width + "' height='" + height + "' flashvars='" + flashvers + "' name='" + id + "' align='middle' allowScriptAccess='always' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer'/>";
    str += "</object>";
    return str;
}
//切换指定Dom对象的可见性
function ShiftVisible(aObjName) {
    var targetElement = HT$(aObjName);
    if (targetElement.style.display == "none" || targetElement.style.display == "") {
        targetElement.style.display = "block";
    } else {
        targetElement.style.display = "none";
    }
    return false;
}

//Cookie操作
function getcookie(name) {
    var cookie_start = document.cookie.indexOf(name);
    var cookie_end = document.cookie.indexOf(";", cookie_start);
    return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
}
function setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
    var expires = new Date();
    expires.setTime(expires.getTime() + 1000 * seconds);
    document.cookie = escape(cookieName) + '=' + escape(cookieValue)
		+ (expires ? '; expires=' + expires.toGMTString() : '')
		+ (path ? '; path=' + path : '/')
		+ (domain ? '; domain=' + domain : '')
		+ (secure ? '; secure' : '');
}

//在指定Dom元素中显示html
function show(aobjID, ahtml) {
    $("#" + aobjID).html(ahtml);
    $("#" + aobjID).css("display", "block");
}
function showloading(aobjID) {
    $("#" + aobjID).html("<img src='" + window.HTSEO_Img + "/images/loading.gif' align='absmiddle'/>");
    $("#" + aobjID).css("display", "block");
}

function DelConfirm() {
    return confirm("确定删除这条记录?");
}

function hide(aobjID) {
    $("#" + aobjID).css("display", "none");
}

function back2homepage() {
    document.location = "/default.aspx";
}
function closeTopMessage() {
    $("#panel_topmessage").css("display", "none");
}
function closeDivMessage() {
    $.unblockUI();
}

function mobilevalid(strValue) {
    /*
    var reg0 = /^13\d{9}$/;   //130--139。
    var reg1 = /^15\d{9}$/;   //150--159。
    var reg2 = /^18\d{9}$/;   //180--189。
    var reg3 = /^852\d{8}$/;   //180--189。
    var my = false;
    if (reg0.test(strValue)) my = true;
    if (reg1.test(strValue)) my = true;
    if (reg2.test(strValue)) my = true;
    if (reg3.test(strValue)) my = true;
    */
    var reg = /^1\d{10}$/; //1开头+10位数字。
    var my = false;
    if (reg.test(strValue)) my = true;
    if (!my) {
        return false;
    }
    else
        return true;
}

function emailvalid(strValue) {
    //    var patrn = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    //   
    //    if(strVralue!="" && !patrn.exec(strValue))
    //    {
    //        return false;
    //    }
    //    return true;
    //alert(strValue);
    var patrn = /^[\w\.\-]+@([\w\-]+\.)+[a-z]{2,4}$/ig;

    if (strValue.toString().match(patrn)) {
        return true;
    }
    return false;
}

function zipcodevalid(strValue) {
    var patrn = /^[0-9]\d{5}$/;
    if (strValue != "" && !patrn.exec(strValue)) {
        return false;
    }
    return true;
}

//身份证

function checkIdcard(idcard) {
    var Errors = new Array("0", "身份证号码位数不对!", "身份证号码出生日期超出范围或含有非法字符!", "身份证号码校验错误!", "身份证地区非法!");
    //var msg=new Array("生日","","","");
    var area = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
    var idcard, Y, JYM;
    var S, M;
    var idcard_array = new Array();
    idcard_array = idcard.split("");
    if (area[parseInt(idcard.substr(0, 2))] == null) return Errors[4];
    switch (idcard.length) {
        case 15:
            if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
                ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性

            }
            else {
                ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性

            }
            if (ereg.test(idcard))
                return Errors[0];
            else
                return Errors[2];
            break;
        case 18:
            if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
            }
            else {
                ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
            }
            if (ereg.test(idcard)) {
                S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
                Y = S % 11;
                M = "F";
                JYM = "10X98765432";
                M = JYM.substr(Y, 1);
                if (M == idcard_array[17])
                    return Errors[0];
                else
                    return Errors[3];
            }
            else
                return Errors[2];
            break;
        default:
            return Errors[1];
            break;
    }
}

//--身份证号码验证-支持新的带x身份证
function isIdCardNo(num) {

    var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
    var error;
    var varArray = new Array();
    var intValue;
    var lngProduct = 0;
    var intCheckDigit;
    var intStrLen = num.length;
    var idNumber = num;
    // initialize
    if ((intStrLen != 15) && (intStrLen != 18)) {
        //error = "输入身份证号码长度不对！";
        //alert(error);
        //frmAddUser.txtIDCard.focus();
        return false;
    }
    // check and set value
    for (i = 0; i < intStrLen; i++) {
        varArray[i] = idNumber.charAt(i);
        if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
            //error = "错误的身份证号码！.";
            //alert(error);
            //frmAddUser.txtIDCard.focus();
            return false;
        } else if (i < 17) {
            varArray[i] = varArray[i] * factorArr[i];
        }
    }
    if (intStrLen == 18) {
        //check date
        var date8 = idNumber.substring(6, 14);
        if (checkDate(date8) == false) {
            //error = "身份证中日期信息不正确！.";
            //alert(error);
            return false;
        }
        // calculate the sum of the products
        for (i = 0; i < 17; i++) {
            lngProduct = lngProduct + varArray[i];
        }
        // calculate the check digit
        intCheckDigit = 12 - lngProduct % 11
        switch (intCheckDigit) {
            case 10:
                intCheckDigit = 'X';
                break;
            case 11:
                intCheckDigit = 0;
                break;
            case 12:
                intCheckDigit = 1;
                break;
        }
        // check last digit
        if (varArray[17].toUpperCase() != intCheckDigit) {
            //error = "身份证效验位错误!正确为： " + intCheckDigit + ".";
            //alert(error);
            return false;
        }
    }
    else {        //length is 15
        //check date
        var date6 = idNumber.substring(6, 12);
        if (checkDate(date6) == false) {
            //alert("身份证日期信息有误！.");
            return false;
        }
    }
    //alert ("Correct.");
    return true;
}
//判断输入的日期是否正确
function checkDate(INDate) {
    if (INDate == "")
    { return true; }
    subYY = INDate.substr(0, 4)
    if (isNaN(subYY) || subYY <= 0) {
        return true;
    }
    //转换月份
    if (INDate.indexOf('-', 0) != -1) { separate = "-" }
    else {
        if (INDate.indexOf('/', 0) != -1) { separate = "/" }
        else { return true; }
    }
    area = INDate.indexOf(separate, 0)
    subMM = INDate.substr(area + 1, INDate.indexOf(separate, area + 1) - (area + 1))
    if (isNaN(subMM) || subMM <= 0) {
        return true;
    }
    if (subMM.length < 2) { subMM = "0" + subMM }
    //转换日
    area = INDate.lastIndexOf(separate)
    subDD = INDate.substr(area + 1, INDate.length - area - 1)
    if (isNaN(subDD) || subDD <= 0) {
        return true;
    }
    if (eval(subDD) < 10) { subDD = "0" + eval(subDD) }
    NewDate = subYY + "-" + subMM + "-" + subDD
    if (NewDate.length != 10) { return true; }
    if (NewDate.substr(4, 1) != "-") { return true; }
    if (NewDate.substr(7, 1) != "-") { return true; }
    var MM = NewDate.substr(5, 2);
    var DD = NewDate.substr(8, 2);
    if ((subYY % 4 == 0 && subYY % 100 != 0) || subYY % 400 == 0) { //判断是否为闰年
        if (parseInt(MM) == 2) {
            if (DD > 29) { return true; }
        }
    } else {
        if (parseInt(MM) == 2) {
            if (DD > 28) { return true; }
        }
    }
    var mm = new Array(1, 3, 5, 7, 8, 10, 12); //判断每月中的最大天数
    for (i = 0; i < mm.length; i++) {
        if (parseInt(MM) == mm[i]) {
            if (parseInt(DD) > 31) { return true; }
        } else {
            if (parseInt(DD) > 30) { return true; }
        }
    }
    if (parseInt(MM) > 12) { return true; }
    return false;
}
//输入框提示文字色彩设定
var input_shiftcolor_hint = "#CCCCCC";
var input_shiftcolor_text = "#494949";

//页面初始化的公共调用
function onhtpage_load() {
    if ($.blockUI) {
        if (window.message_div == 1) {
            $.blockUI({ message: $("#panel_divmessage") });
        }
    }
    $(".shiftcolor").focus(
        function () {
            var self = $(this);
            if (self.val() == self.attr("default")) {
                self.val("");
                self.focus();
            }
            self.css("color", self.attr("color"));
            var tdefault = self.attr("default");
            if (typeof tdefault != "undefined" && tdefault.length > 0 && self.attr("hint") != "0") {
                self.showHtip("bottom", { width: (self.width() - 6) + "px" }, tdefault, { left: -2, top: -42 }, true);
            }
            return true;
        }
    ).blur(
        function () {
            var self = $(this);
            if (self.val() == "") {
                self.val(self.attr("default"));
                self.css("color", self.attr("hintcolor"));
            }
            if (self.val() != self.attr("default")) {
                self.css("color", self.attr("color"));
            }
            self.removeHtip();
            return true;
        }
    );
    $(".shiftcolor").each(
        function () {
            var self = $(this);
            if (!self.attr("hintcolor")) { self.attr("hintcolor", input_shiftcolor_hint); }
            if (!self.attr("color")) { self.attr("color", input_shiftcolor_text) };
            self.blur();
        }
    );
    //告知性提示
    $(".alertonce").each(
        function () {
            var self = $(this);
            var objID = self.attr("id");
            if (typeof objID != "undefined" && objID != "") {
                self.css("display", getcookie(objID) == "1" ? "none" : "block");
            }
        }
    );
}

function closeAlertOnce(aobjID) {
    HT$(aobjID).style.display = "none";
    setcookie("alert_" + aobjID, "1", 99999, "/");
}


if ($.blockUI) {
    $.blockUI.defaults.css.padding = 0;
    $.blockUI.defaults.css.margin = 0;
    $.blockUI.defaults.css.width = '355px';
    $.blockUI.defaults.css.textAlign = 'left';
    $.blockUI.defaults.fadeOut = 0;
    $.blockUI.defaults.fadeIn = 0;
    $.blockUI.defaults.css.color = '#000';
    $.blockUI.defaults.css.border = '0px solid #aaa';
    $.blockUI.defaults.css.backgroundColor = '#fff';
    $.blockUI.defaults.css.cursor = 'default';
    $.blockUI.defaults.overlayCSS.backgroundColor = '#000';
    $.blockUI.defaults.overlayCSS.opacity = '0.2';
    $.blockUI.defaults.overlayCSS.cursor = 'default';

}

//城市联动（根据选择的省市，动态显示城市）------------------------------
function cityResult(flag) {
    var city = document.getElementById("dpProvince");
    if (flag == 0) {
        MainInfo.GetCityList(city.value, get_allcity_Result_CallBack);
    }
    else if (flag == 1) {
        MainInfo.GetCityList(city.value, get_hotelcity_Result_CallBack);

    }
    else {
        MainInfo.GetCityList(city.value, get_city_Result_CallBack);
    }
}

function get_city_Result_CallBack(response) {
    if (response.value != null) {
        var ds = response.value;
        //var ds = MainInfo.GetCityList(city.value).value;
        HT$("dpDistinctArea").options.length = 0;
        if (ds != null && typeof (ds) == "object" && ds.Rows != null) {
            for (var i = 0; i < ds.Rows.length; i++) {
                var name = ds.Rows[i].descript;
                var id = ds.Rows[i].code;
                HT$("dpDistinctArea").options[HT$("dpDistinctArea").options.length] = new Option(name, id);
            }
        }
        SetCityName();
    }
    return;
}

function get_allcity_Result_CallBack(response) {
    if (response.value != null) {
        var ds = response.value;
        //var ds = MainInfo.GetCityList(city.value).value;
        HT$("dpDistinctArea").options.length = 0;
        var name = "全部";
        var id = "0";
        HT$("dpDistinctArea").options[HT$("dpDistinctArea").options.length] = new Option(name, id);
        if (ds != null && typeof (ds) == "object" && ds.Rows != null) {
            for (var i = 0; i < ds.Rows.length; i++) {
                name = ds.Rows[i].cityName;
                id = ds.Rows[i].cityCode;
                HT$("dpDistinctArea").options[HT$("dpDistinctArea").options.length] = new Option(name, id);
            }
        }
        SetCityName();
    }
    return;
}

function get_hotelcity_Result_CallBack(response) {
    if (response.value != null) {
        var ds = response.value;
        //var ds = MainInfo.GetCityList(city.value).value;
        HT$("dpDistinctArea").options.length = 0;
        var name;
        var id;
        if (ds != null && typeof (ds) == "object" && ds.Rows != null) {
            for (var i = 0; i < ds.Rows.length; i++) {
                name = ds.Rows[i].cityName;
                id = ds.Rows[i].cityCode;
                HT$("dpDistinctArea").options[HT$("dpDistinctArea").options.length] = new Option(name, id);
            }
        }
        xzResult();
        SetCityName();
    }
    return;
}

function SetCityName() {
    var hd = HT$("hdCityText");
    for (var i = 0; i < HT$("dpDistinctArea").options.length; i++) {
        if (HT$("dpDistinctArea").options[i].selected) {
            hd.value = HT$("dpDistinctArea").options[i].text;
            break;
        }
    }
}

function GetUrlResponse(url) {
    var xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xhttp.open("POST", url, false);
    xhttp.send();
    if (xhttp.status.toString() == "200") {
        var doc = xhttp.responseText;
        return doc.toString();
    }
    else {
        return null;
    }
}
function openTipsWindow(aurl, aheight) {
    window.open(aurl, '', 'status=no,menubar=no,top=20,left=20,width=630,height=' + ((aheight) ? aheight : 295) + ',resizable=yes,scrollbars=yes')
}
//input控件的Reset行为：
//      给input控件添加两个属性：class="canReset", resetValue="控件的初始内容"
//调用方式：
// resetAllInput();
function resetAllInput() {
    $(".canReset").each(
                function () {
                    var self = $(this);
                    self.val(self.attr("resetValue"));
                });
    return false;
}
//
function showBlockUI(elementID, awidth, aheight) {
    if (awidth && aheight) {
        $.blockUI({ message: $("#" + elementID), css: { top: ($(window).height() - aheight) / 2 + 'px', left: ($(window).width() - awidth) / 2 + 'px', width: (awidth + 'px'), height: (aheight + 'px')} });
    } else {
        $.blockUI({ message: $("#" + elementID) });
    }
    return false;
}

function showBlockUIImg(url, awidth, aheight) {
    var div = '<img src="' + url + '"></img>';
    if (awidth && aheight) {
        $.blockUI({ message: div, css: { top: ($(window).height() - aheight) / 2 + 'px', left: ($(window).width() - awidth) / 2 + 'px', width: (awidth + 'px'), height: (aheight + 'px')} });
    } else {
        $.blockUI({ message: div });
    }
    return false;
}
//
function onEmbedFrameLoaded(iframePanelID) {
    HT$(iframePanelID + "_loading").style.display = "none";
    HT$(iframePanelID + "_cont").style.display = "block";
}
function showEmbedIframe(iframePanelID, aurl, awidth, aheight) {
    HT$(iframePanelID + "_loading").style.display = "block";
    HT$(iframePanelID + "_cont").style.display = "none";
    HT$(iframePanelID + "_cont").src = aurl;
    if (awidth && aheight) {
        $.blockUI({ message: $("#" + iframePanelID), css: { top: ($(window).height() - aheight) / 2 + 'px', left: ($(window).width() - awidth) / 2 + 'px', width: (awidth + 'px'), height: (aheight + 'px')} });
    } else {
        $.blockUI({ message: $("#" + iframePanelID) });
    }
    return false;
}
function hideEmbedIframe(iframePanelID) {
    $.unblockUI();
    HT$(iframePanelID + "_loading").style.display = "block";
    HT$(iframePanelID + "_cont").style.display = "none";
    HT$(iframePanelID + "_cont").src = "about:_blank";
    return false;
}

//API：弹出快速登陆窗口
function showQuickLoginWindow(NavgateUrl) {
    //如果未定义，则原页面刷新
    if (!NavgateUrl)
        NavgateUrl = document.location.href;

    if (document.location.href.toLowerCase().indexOf('htinns.com') >= 0) {
        document.domain = 'htinns.com';
    }
    awidth = 480;
    aheight = 305;
    var div = '<iframe frameborder="0" width="100%" scrolling="no" height="' + aheight + '" src="/GuestRegister.aspx?backurl=' + NavgateUrl + '"></iframe>';
    if (awidth && aheight) {
        $.blockUI({ message: div, css: { top: ($(window).height() - aheight) / 2 + 'px', left: ($(window).width() - awidth) / 2 + 'px', width: (awidth + 'px'), height: (aheight + 'px')} });
    } else {
        $.blockUI({ message: div });
    }
    return false;
}
window.showIframe = showQuickLoginWindow;

//弹出新窗口带关闭按钮
function showIframeByWindows(title, aurl, awidth, aheight) {
    var div = ' <div class="windowe_4"><div class="windowe_3"><div class="windowe_2"><div class="windowe_1" style="background-color: White;"> <div class="wde__title"> <span class="floatLeft">' + title + '</span> <img name="close" src="' + window.HTSEO_Img + '/images/window_close.gif" class="floatRight" style="cursor: pointer" onclick="CloseFrame()"/></div><iframe frameborder="0" id="iframe_UIBlock01" width="100%"  height="' + aheight + '" src="' + aurl + '"></iframe>  </div> </div> </div> </div>';
    if (awidth && aheight) {
        $.blockUI({ message: div, css: { top: ($(window).height() - aheight) / 2 + 'px', left: ($(window).width() - awidth) / 2 + 'px', width: (awidth + 'px'), height: (aheight + 'px')} });
    } else {
        $.blockUI({ message: div });
    }
    return false;
}

//关闭当前窗口
function CloseFrame() {
    var ifm = $("#iframe_UIBlock01");
    if (ifm) {
        ifm.attr("src", "about:_blank");
    }
    $.unblockUI();
}
//关闭当前窗口并且跳转到目标页面
var CloseFrameURL = function (url) {
    $.unblockUI();
    if (url.indexOf('http://') > -1) {
        window.location.href = url;
    }
    else {
        window.location.href = "http://" + window.location.host + url;
    }
}
//关闭当前窗口并且刷新当前页
var CloseFrameRefresh = function () {
    $.unblockUI();
    window.location.reload();
}
//日期输入校验
function CheckDate(id1, id2) {
    var ipt1 = document.getElementById(id1);
    var ipt2 = document.getElementById(id2);
    if (ipt1 != undefined && ipt2 != undefined) {
        var valindateresult = CheckDataInput($(ipt1).val(), false);
        var valoutdateresult = CheckDataInput($(ipt2).val(), false);
        if (valindateresult == "" && valoutdateresult == "") {
            var date1 = new Date($(ipt1).val().split('-')[0], $(ipt1).val().split('-')[1] - 1, $(ipt1).val().split('-')[2]);
            var date2 = new Date($(ipt2).val().split('-')[0], $(ipt2).val().split('-')[1] - 1, $(ipt2).val().split('-')[2]);
            if (date1 < date2) {
                if ((date2 - date1) > 2419200000)
                    return "入住时段不能超过28天";
                else {
                    var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                    if ((date2 - today) > 7776000000) {
                        return "离店日期须在三个月以内";
                    } else
                        return "";
                }
            }
            else
                return "入住日期应小于离店日期";
        }
        else {
            if (valindateresult != "")
                return "入住日期输入有误：" + valindateresult;
            if (valoutdateresult != "")
                return "离店日期输入有误：" + valoutdateresult;
        }
    }
    else
        return "日期输入有误";
}
function CheckDataInput(input, isoutdate) {
    var reg = /20[\d][\d]-[\d]{1,2}-[\d]{1,2}/im;
    if (reg.test(input)) {
        var y = input.split('-')[0];
        var m = input.split('-')[1];
        var d = input.split('-')[2];
        if (isoutdate) {
            var iptdate = new Date(y, m, d);
            var today = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
            if ((iptdate - today) > 7776000000) {
                //这个返回值会被用来判断世博日期，请勿变动
                return "离店日期须在三个月以内";
            }
        }
        if (y < new Date().getFullYear() || y > parseInt(new Date().getFullYear() + 1))
            return "年份输入错误";
        if (y > new Date().getFullYear()) {
            if (m > 12)
                return "月份输入错误";
        }
        else {
            if (m < parseInt(new Date().getMonth() + 1) || m > 12)
                return "月份输入错误";
            else {
                if (m > parseInt(new Date().getMonth() + 1))
                    if (d > 0 && d <= 31)
                        return "";
                    else {
                        if (d < new Date().getDate() || d > 31)
                            return "日期输入错误，不能小于当天日期";
                        else
                            return "";
                    }
            }
        }
        if (y > new Date().getFullYear()) {
            if (d > 31)
                return "日期输入错误，不能小于当天日期";
        }
        else {
            if (d < new Date().getDate() || d > 31)
                return "日期输入错误，不能小于当天日期";
        }
        return "";
    }
    return "您输入的日期格式不正确";
}
function isDataString(input) {
    var reg = /^20[\d][\d]-[\d]{1,2}-[\d]{1,2}$/im;
    if (reg.test(input)) {
        var y = Number(input.split('-')[0]);
        var m = Number(input.split('-')[1]);
        var d = Number(input.split('-')[2]);
        if (y < 2009)
            return false;
        if (m < 0 || m > 12)
            return false;
        if (d < 0 || d > 31)
            return false;
        return true;
    } else {
        return false;
    }
}
//
function open_kf() {
    window.open("http://webcs1.htinns.com:3080/company.php?arg=test&style=1", "_blank", "height=470, width=700, top=80, left=120, status=yes, toolbar=no, menubar=no, resizable=no, scrollbars=no, location=no, titlebar=no");
    return false;
}
//
//通用的复制代码
var Clipboard = 0;
function GetClipboard() {
    alert("copyit");
    return Clipboard;
}
function copyit(textit) {
    Clipboard = textit;
    if (window.clipboardData) {
        window.clipboardData.setData("Text", textit);
    } else {
        var flashcopier = 'flashcopier';
        if (!HT$(flashcopier)) {
            var divholder = document.createElement('div');
            divholder.id = flashcopier;
            document.body.appendChild(divholder);
        }
        HT$(flashcopier).innerHTML = '';
        var divinfo = '<embed src="/common/_clipboard.swf" width="0" height="0" type="application/x-shockwave-flash" id="flashforcopy" name="flashforcopy"></embed>';
        HT$(flashcopier).innerHTML = divinfo;
    }
}

//世博预定临时处理
function expo_check(citycode, checkin, checkout) {
    // if (isExpo(citycode, checkin, checkout))
    // alert("世博会活动期间，上海的酒店仅供价格查询，如需咨询、预订请拨打4008-121-121");
}

function isExpo(citycode, checkin, checkout) {
    if (citycode != "3101")
        return false;
    var checkinStrs = checkin.split("-");
    var checkoutStrs = checkout.split("-");
    var d1 = new Date(checkinStrs[0], checkinStrs[1] - 1, checkinStrs[2]);
    var d2 = new Date(checkoutStrs[0], checkoutStrs[1] - 1, checkoutStrs[2]);
    return !(d2 < new Date(2010, 4, 1) || d1 > new Date(2010, 9, 31))

}

//记录一次网页统计，支持虚拟PV
//function TrackPageView(pvlink, Param1) { 
//    if (window.GridsumWebDissector) {
//        var _gsTracker = GridsumWebDissector.getTracker('GWD-000272');
//        _gsTracker.setCustomProperty('grouponCode', 'gaopeng_'+document.getElementById('txtCode').value);
//        _gsTracker.track("/targetpage/GrouponReg_gaopeng");
//    }
//}

function checkSearchSource() {
    //    if (document.location.href.indexOf("utm_source=baidu")) {
    //        if (getcookie("logined") == "1")
    //            CreateWebVisit("/user_old.aspx?from=baidu");
    //        else
    //            CreateWebVisit("/user_new.aspx?from=baidu");
    //    }
}

function CreateWebVisit(url) {
    return;
    var element = document.createElement('div');
    element.setAttribute('id', "ht_analy_frame_js");
    element.setAttribute('style', "width:1px;height:1px;");
    element.innerHTML = "<iframe src='" + url + "' width='1' height='1'></iframe>";
    document.body.appendChild(element);
}

//社交网站 分享Share API
function Share(webId, url, title) {

    //查询参数webid --http://www.jiathis.com/help/html/share-with-jiathis-api 
    var urlAddress = "http://www.jiathis.com/send/?webid=" + webId + "&url=" + url + "&title=" + title + ";";
    self.location = urlAddress;
}
//日期类 格式转换 new Date().format("yyyy-MM-dd hh:mm:ss"); new Date().format("yyyy-MM-dd");
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function isOSmini() {
    //...
    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf('ipod') > -1 || agent.indexOf('iphone') > -1 || agent.indexOf('ipad') > -1) {
        return true;
    }
    else
        return false;
}

function Navigate360(aLinkObj) {
    if (isOSmini()) {
        aLinkObj.href = window.HTSEO_Img + "/360/2000406/index.html";
        return true;
    }
    showIframeByWindows('360全景展示', '/index360.aspx', '600', '480');
    return false;
}
